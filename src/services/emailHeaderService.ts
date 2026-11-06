/**
 * Offline Email Header & SPF/DKIM/DMARC Security Inspector
 * Parses raw RFC 5322 email headers completely locally.
 * Traces mail hops, detects reply-to mismatches, and verifies authentication tags.
 */

import { EmailHeaderAnalysis, EmailHop, RiskLevel } from '../types/security';

export function parseEmailHeaders(rawHeaders: string): EmailHeaderAnalysis {
  const lines = rawHeaders.split(/\r?\n/);
  const headerMap: Record<string, string[]> = {};

  let currentKey = '';
  for (const line of lines) {
    // RFC 5322 header folding (line starts with space or tab)
    if (/^[ \t]/.test(line) && currentKey) {
      const lastIdx = headerMap[currentKey].length - 1;
      headerMap[currentKey][lastIdx] += ' ' + line.trim();
    } else {
      const match = line.match(/^([a-zA-Z0-9\-_]+):\s*(.*)$/);
      if (match) {
        currentKey = match[1].toLowerCase();
        if (!headerMap[currentKey]) {
          headerMap[currentKey] = [];
        }
        headerMap[currentKey].push(match[2].trim());
      }
    }
  }

  const getHeader = (key: string): string => {
    return headerMap[key.toLowerCase()]?.[0] || '';
  };

  const fromRaw = getHeader('from');
  const replyToRaw = getHeader('reply-to');
  const returnPathRaw = getHeader('return-path');
  const subject = getHeader('subject') || '(No Subject)';
  const date = getHeader('date') || '';
  const messageId = getHeader('message-id') || '';

  // Extract email address & domain from string (e.g. "PayPal Security <service@paypal.com>")
  const extractEmail = (str: string) => {
    const match = str.match(/<([^>]+)>/) || str.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    return match ? match[1].toLowerCase().trim() : str.toLowerCase().trim();
  };

  const fromEmail = extractEmail(fromRaw);
  const fromDomain = fromEmail.includes('@') ? fromEmail.split('@')[1] : '';

  const replyToEmail = replyToRaw ? extractEmail(replyToRaw) : undefined;
  const replyToDomain = replyToEmail && replyToEmail.includes('@') ? replyToEmail.split('@')[1] : undefined;

  const returnPathEmail = returnPathRaw ? extractEmail(returnPathRaw) : undefined;
  const returnPathDomain = returnPathEmail && returnPathEmail.includes('@') ? returnPathEmail.split('@')[1] : undefined;

  // Check Reply-To Spoofing Mismatch
  let isSpoofedReplyTo = false;
  if (replyToDomain && fromDomain && replyToDomain !== fromDomain) {
    isSpoofedReplyTo = true;
  }

  // Parse Authentication-Results or Received-SPF
  const authResults = headerMap['authentication-results'] || [];
  const receivedSpf = headerMap['received-spf'] || [];
  const combinedAuth = [...authResults, ...receivedSpf].join(' ').toLowerCase();

  // 1. SPF Check
  let spfStatus: EmailHeaderAnalysis['spfResult']['status'] = 'none';
  let spfDetails = 'No SPF authentication header found.';

  if (combinedAuth.includes('spf=pass') || combinedAuth.includes('pass (')) {
    spfStatus = 'pass';
    spfDetails = 'SPF validation passed. Originating IP is authorized by the domain SPF record.';
  } else if (combinedAuth.includes('spf=fail') || combinedAuth.includes('fail (')) {
    spfStatus = 'fail';
    spfDetails = 'SPF validation failed! Originating mail server is not authorized to send for this domain.';
  } else if (combinedAuth.includes('spf=softfail')) {
    spfStatus = 'softfail';
    spfDetails = 'SPF softfail (~all). Domain discourages this IP but did not mandate strict reject.';
  } else if (combinedAuth.includes('spf=neutral')) {
    spfStatus = 'neutral';
    spfDetails = 'SPF neutral (?all). The domain did not state whether this IP is authorized.';
  }

  // 2. DKIM Check
  let dkimStatus: EmailHeaderAnalysis['dkimResult']['status'] = 'none';
  let dkimDetails = 'No DKIM cryptographic signature verified in headers.';
  let dkimDomain: string | undefined;

  const dkimSignature = headerMap['dkim-signature'];
  if (dkimSignature && dkimSignature.length > 0) {
    const dMatch = dkimSignature[0].match(/d=([a-zA-Z0-9.-]+)/);
    if (dMatch) dkimDomain = dMatch[1].toLowerCase();
  }

  if (combinedAuth.includes('dkim=pass')) {
    dkimStatus = 'pass';
    dkimDetails = `DKIM cryptographic signature verified and matches signing domain${
      dkimDomain ? ` (${dkimDomain})` : ''
    }.`;
  } else if (combinedAuth.includes('dkim=fail')) {
    dkimStatus = 'fail';
    dkimDetails = 'DKIM signature failed validation. Email body or headers may have been altered in transit.';
  }

  // 3. DMARC Check
  let dmarcStatus: EmailHeaderAnalysis['dmarcResult']['status'] = 'none';
  let dmarcDetails = 'No DMARC policy result found in headers.';
  let dmarcDisposition: string | undefined;

  if (combinedAuth.includes('dmarc=pass')) {
    dmarcStatus = 'pass';
    dmarcDetails = 'DMARC alignment verified. Domain SPF and/or DKIM align with the visible From address.';
  } else if (combinedAuth.includes('dmarc=fail')) {
    dmarcStatus = 'fail';
    if (combinedAuth.includes('action=quarantine') || combinedAuth.includes('disposition=quarantine')) {
      dmarcDisposition = 'quarantine';
    } else if (combinedAuth.includes('action=reject') || combinedAuth.includes('disposition=reject')) {
      dmarcDisposition = 'reject';
    }
    dmarcDetails = `DMARC authentication failed! Policy disposition: ${dmarcDisposition || 'none'}.`;
  }

  // Parse Received: Hops
  const receivedHeaders = headerMap['received'] || [];
  const hops: EmailHop[] = [];

  // Received headers are written top-to-bottom (newest first). Let's order them in chronological order
  const chronological = [...receivedHeaders].reverse();

  let prevTime: number | null = null;
  chronological.forEach((headerVal, idx) => {
    // Extract "from <server>", "by <server>", "with <protocol>", "; <date>"
    const fromMatch = headerVal.match(/from\s+([^\s;]+)/i);
    const byMatch = headerVal.match(/by\s+([^\s;]+)/i);
    const withMatch = headerVal.match(/with\s+([^\s;]+)/i);
    const dateMatch = headerVal.match(/;\s*(.+)$/);

    const hopFrom = fromMatch ? fromMatch[1] : 'Unknown source';
    const hopBy = byMatch ? byMatch[1] : 'Unknown relay';
    const hopWith = withMatch ? withMatch[1] : 'SMTP';
    const hopDateStr = dateMatch ? dateMatch[1].trim() : '';

    let hopTime = 0;
    let delay = 0;
    try {
      if (hopDateStr) {
        hopTime = new Date(hopDateStr).getTime();
        if (prevTime && hopTime >= prevTime) {
          delay = Math.round((hopTime - prevTime) / 1000);
        }
        prevTime = hopTime;
      }
    } catch {
      // Ignore invalid date strings
    }

    hops.push({
      hopIndex: idx + 1,
      from: hopFrom,
      by: hopBy,
      withProtocol: hopWith,
      timestamp: hopDateStr || 'Unspecified',
      delaySeconds: delay,
    });
  });

  // Evaluate Risk & Findings
  const findings: string[] = [];
  const recommendations: string[] = [];

  if (isSpoofedReplyTo) {
    findings.push(
      `Reply-To Mismatch: The visible From address (@${fromDomain}) differs from the Reply-To address (@${replyToDomain}). Attackers use this to spoof executive/bank From headers while routing victim replies to attacker inboxes.`
    );
    recommendations.push(
      'Never respond to emails where the Reply-To address redirects to a different domain without verbal verification.'
    );
  }

  if (spfStatus === 'fail') {
    findings.push('SPF Failed: The sending IP server is NOT permitted to send emails on behalf of this domain.');
    recommendations.push('Treat this email with high suspicion. The sender identity is likely forged.');
  }

  if (dkimStatus === 'fail') {
    findings.push('DKIM Signature Failed: The message cryptographic signature does not match the header hash.');
    recommendations.push('This message may have been altered or forwarded through an unauthorized proxy.');
  }

  if (dmarcStatus === 'fail') {
    findings.push('DMARC Alignment Failed: The email failed domain alignment policies.');
  }

  if (returnPathDomain && fromDomain && returnPathDomain !== fromDomain) {
    findings.push(
      `Return-Path Mismatch: Bounces route to "${returnPathDomain}" while the display sender is "${fromDomain}".`
    );
  }

  let riskLevel: RiskLevel = 'Low';
  if (spfStatus === 'fail' || isSpoofedReplyTo || dmarcStatus === 'fail') {
    riskLevel = 'High';
  } else if (spfStatus === 'softfail' || dkimStatus === 'fail' || spfStatus === 'none') {
    riskLevel = 'Medium';
  }

  if (findings.length === 0) {
    findings.push('All standard authentication headers (SPF, DKIM, DMARC) passed alignment checks.');
    recommendations.push('Standard technical authentication passed. Continue to evaluate message content for social engineering.');
  }

  return {
    fromAddress: fromRaw,
    fromDomain,
    replyToAddress: replyToRaw,
    returnPath: returnPathRaw,
    subject,
    date,
    messageId,
    isSpoofedReplyTo,
    spfResult: { status: spfStatus, details: spfDetails },
    dkimResult: { status: dkimStatus, domain: dkimDomain, details: dkimDetails },
    dmarcResult: { status: dmarcStatus, disposition: dmarcDisposition, details: dmarcDetails },
    hops,
    riskLevel,
    findings,
    recommendations,
  };
}

export const SAMPLE_EMAIL_HEADERS = [
  {
    label: 'Spoofed Banking Phishing (SPF & Reply-To Fail)',
    raw: `From: "Chase Fraud Department" <security-alerts@chase.com>
Reply-To: <investigations-team@secure-chase-update.top>
Return-Path: <bounce@mail-relays-ru.xyz>
To: <target-user@example.com>
Subject: URGENT: Unauthorized Wire Transfer Detected
Date: Thu, 05 Nov 2026 14:22:10 +0000
Message-ID: <20261105.chase9201@mail-relays-ru.xyz>
Authentication-Results: mx.google.com;
       spf=fail (google.com: domain of chase.com does not designate 185.220.101.5 as permitted sender) smtp.mailfrom=security-alerts@chase.com;
       dkim=fail header.i=@chase.com;
       dmarc=fail (p=REJECT sp=REJECT dis=reject) header.from=chase.com
Received: from mail-relays-ru.xyz (185.220.101.5) by mx.google.com with ESMTP id p12si389102gpr.42;
       Thu, 05 Nov 2026 14:22:12 +0000
Received: from internal-spoofer.local (10.0.4.12) by mail-relays-ru.xyz with SMTP;
       Thu, 05 Nov 2026 14:22:08 +0000`,
  },
  {
    label: 'Legitimate Signed Notification (All Auth Passed)',
    raw: `From: GitHub Security <security@github.com>
Reply-To: support@github.com
Return-Path: <noreply@github.com>
To: <developer@example.com>
Subject: [GitHub] A personal access token has expired
Date: Wed, 04 Nov 2026 09:15:00 -0700
Message-ID: <github/audit/20261104.9124@github.com>
Authentication-Results: mx.google.com;
       dkim=pass header.i=@github.com header.s=s20210901;
       spf=pass (google.com: domain of noreply@github.com designates 192.30.252.204 as permitted sender) smtp.mailfrom=noreply@github.com;
       dmarc=pass (p=REJECT sp=REJECT dis=none) header.from=github.com
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=github.com; s=s20210901;
       h=from:to:subject:date:message-id;
       bh=47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=;
       b=k7xL...encryptedSignatureData...==
Received: from out-1.smtp.github.com (192.30.252.204) by mx.google.com with ESMTPS;
       Wed, 04 Nov 2026 09:15:02 -0700`,
  },
];
