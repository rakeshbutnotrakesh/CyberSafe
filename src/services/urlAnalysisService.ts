/**
 * Phishing & Suspicious URL Analyzer Service
 * 100% Offline Heuristics Engine
 * NEVER makes outbound network requests or resolves DNS.
 */

import { URLAnalysisResult, URLFinding, RiskLevel } from '../types/security';

const KNOWN_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'ow.ly',
  'rebrand.ly', 'cutt.ly', 'tiny.cc', 'bl.ink', 'shorturl.at', 'soo.gd',
  'qr.net', 'rb.gy', 'v.gd', 'lnkd.in', 'ift.tt'
]);

const FAMOUS_BRANDS = [
  'paypal', 'google', 'apple', 'microsoft', 'amazon', 'netflix', 'facebook',
  'instagram', 'whatsapp', 'chase', 'wellsfargo', 'bankofamerica', 'citibank',
  'binance', 'coinbase', 'metamask', 'steam', 'spotify', 'dropbox', 'github',
  'twitter', 'linkedin', 'outlook', 'yahoo', 'adobe'
];

const SUSPICIOUS_TLDS = new Set([
  'zip', 'mov', 'top', 'xyz', 'work', 'click', 'link', 'gq', 'cf', 'tk',
  'ml', 'ga', 'buzz', 'icu', 'cam', 'rest', 'surf', 'live'
]);

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'update-account', 'secure-banking',
  'billing', 'authenticate', 'recover', 'reactivate', 'suspend', 'security-alert',
  'claim-reward', 'free-gift', 'urgent-action', 'identity-check', 'wallet-connect'
];

export function analyzeURL(inputUrl: string): URLAnalysisResult {
  const trimmed = inputUrl.trim();
  const findings: URLFinding[] = [];
  const checksPassed: string[] = [];

  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    // If protocol missing, treat as http for initial parsing
    normalized = 'http://' + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return {
      url: trimmed,
      normalizedUrl: normalized,
      hostname: 'invalid-url',
      protocol: 'unknown',
      riskLevel: 'High',
      overallScore: 90,
      findings: [
        {
          id: 'malformed_url',
          title: 'Malformed or Invalid URL Structure',
          severity: 'High',
          description: 'The string entered cannot be parsed as a standard RFC-compliant URL. Attackers frequently utilize malformed syntax to confuse browser parsers or bypass filters.',
          recommendation: 'Do not click or open unparseable or mangled link formats.'
        }
      ],
      checksPassed: [],
      isIPAddress: false,
      isShortener: false,
      hasSuspiciousTLD: false,
      hasExcessiveSubdomains: false,
      hasPunycode: false,
      hasAtSymbol: false,
      hasBrandSpoofing: false,
      timestamp: new Date().toISOString(),
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();
  const rawUrl = trimmed;

  // 1. Check Protocol (HTTPS vs HTTP)
  if (protocol === 'http:') {
    findings.push({
      id: 'unencrypted_http',
      title: 'Insecure Protocol (HTTP)',
      severity: 'Medium',
      description: 'The URL uses unencrypted HTTP rather than HTTPS. Any data transmitted (passwords, cookies, payment details) travels in plain text, making it vulnerable to interception or man-in-the-middle manipulation.',
      recommendation: 'Legitimate financial, corporate, and login portals enforce HTTPS. Never input sensitive information into HTTP pages.'
    });
  } else if (protocol === 'https:') {
    checksPassed.push('Uses HTTPS encryption protocol.');
  }

  // 2. Check for @ symbol in raw URL (Userinfo trick)
  const hasAtSymbol = rawUrl.includes('@');
  if (hasAtSymbol) {
    findings.push({
      id: 'at_symbol_obfuscation',
      title: 'User-Info (@ Symbol) Destination Trick',
      severity: 'High',
      description: 'The URL includes an "@" symbol. In URL standards, characters preceding the "@" are treated as credentials/userinfo, and the browser navigates to the host specified AFTER the "@". For example, "https://google.com@evil-site.com" leads to evil-site.com.',
      recommendation: 'Attackers use this classic trick to spoof well-known brand names in the beginning of a link.'
    });
  } else {
    checksPassed.push('No @ credential obfuscation symbol.');
  }

  // 3. Check if Hostname is a Raw IP Address
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const isIPAddress = ipv4Regex.test(hostname) || hostname.startsWith('[') || /^[0-9]+$/.test(hostname);
  if (isIPAddress) {
    findings.push({
      id: 'raw_ip_host',
      title: 'Raw IP Address Hostname',
      severity: 'High',
      description: `The destination uses an IP address (${hostname}) instead of a registered domain name. Legitimate consumer services virtually always operate behind branded domain names.`,
      recommendation: 'Hostnames formatted as raw IP addresses are heavily correlated with phishing kits, malware C2 nodes, or ephemeral hosting.'
    });
  } else {
    checksPassed.push('Uses regular domain name rather than raw IP address.');
  }

  // 4. Check for URL Shorteners
  const isShortener = KNOWN_SHORTENERS.has(hostname) || hostname.startsWith('tiny.');
  if (isShortener) {
    findings.push({
      id: 'url_shortener',
      title: 'Known URL Shortener Service',
      severity: 'Medium',
      description: `The host "${hostname}" is a URL redirection/shortening service. Shorteners conceal the real final destination and any path parameters.`,
      recommendation: 'Never log into a destination reached via an unverified shortened link without using an unshortener tool to inspect the final URL first.'
    });
  } else {
    checksPassed.push('Not a recognized generic URL shortener.');
  }

  // 5. Check Punycode / IDN Homoglyph Attacks
  const hasPunycode = hostname.startsWith('xn--') || hostname.includes('.xn--');
  if (hasPunycode) {
    findings.push({
      id: 'punycode_domain',
      title: 'Punycode / Internationalized Domain (IDN)',
      severity: 'High',
      description: 'The domain uses Punycode ("xn--"). Punycode is frequently exploited in homoglyph attacks, substituting visually identical Cyrillic, Greek, or Latin characters (e.g. Cyrillic "а" replacing Latin "a") to spoof trusted brands.',
      recommendation: 'Examine the raw ASCII punycode representation before trusting any visual character match.'
    });
  } else {
    checksPassed.push('No punycode ("xn--") homoglyphs detected.');
  }

  // 6. Check Excessive Subdomains
  const domainParts = hostname.split('.');
  const hasExcessiveSubdomains = domainParts.length > 3 && !isIPAddress;
  if (hasExcessiveSubdomains) {
    findings.push({
      id: 'excessive_subdomains',
      title: 'High Number of Subdomain Levels',
      severity: domainParts.length >= 5 ? 'High' : 'Medium',
      description: `The hostname contains ${domainParts.length} domain parts. Phishing campaigns frequently stack fake brand names into subdomains (e.g. "paypal.com.account-update.xyz") to mislead users who only read the start of the host.`,
      recommendation: 'Always read domain names from right to left: the true domain is the segment immediately to the left of the TLD extension.'
    });
  } else {
    checksPassed.push('Standard domain hierarchy depth.');
  }

  // 7. Check Suspicious or High-Abuse TLDs
  const tld = domainParts[domainParts.length - 1];
  const hasSuspiciousTLD = SUSPICIOUS_TLDS.has(tld);
  if (hasSuspiciousTLD) {
    findings.push({
      id: 'suspicious_tld',
      title: `High-Risk Top-Level Domain (.${tld})`,
      severity: 'Medium',
      description: `The TLD ".${tld}" has historically high registration rates in spam and automated phishing campaigns due to low acquisition cost or file-extension confusion (like .zip or .mov).`,
      recommendation: 'Exercise heightened caution before submitting credentials or downloading files from this TLD.'
    });
  }

  // 8. Brand Spoofing & Typosquatting Heuristics
  let hasBrandSpoofing = false;
  let spoofedBrandMatch: string | undefined;

  // Extract base domain and subdomains
  const mainDomain = domainParts.length >= 2
    ? domainParts[domainParts.length - 2]
    : hostname;

  for (const brand of FAMOUS_BRANDS) {
    // If hostname contains brand name but isn't the actual brand's official root domain
    const isOfficialBrandDomain = (hostname === `${brand}.com` || hostname === `www.${brand}.com`);
    
    if (!isOfficialBrandDomain && hostname.includes(brand)) {
      hasBrandSpoofing = true;
      spoofedBrandMatch = brand;
      findings.push({
        id: `brand_spoofing_${brand}`,
        title: `Suspected Brand Impersonation (${brand.toUpperCase()})`,
        severity: 'High',
        description: `The hostname contains the keyword "${brand}", but does not appear to be the official root domain of ${brand.toUpperCase()}. Phishing campaigns often combine brand names with hyphens (e.g. "${brand}-login.com" or "${brand}-verify.com").`,
        recommendation: `Navigate directly to the official ${brand}.com website by typing it manually into your browser address bar.`
      });
      break;
    }

    // Levenshtein distance check for subtle typosquatting (e.g. paypa1, g00gle)
    if (!isOfficialBrandDomain && mainDomain.length >= 4 && Math.abs(mainDomain.length - brand.length) <= 2) {
      const distance = levenshteinDistance(mainDomain, brand);
      if (distance === 1 || distance === 2) {
        hasBrandSpoofing = true;
        spoofedBrandMatch = brand;
        findings.push({
          id: `typosquatting_${brand}`,
          title: `Potential Typosquatting of ${brand.toUpperCase()}`,
          severity: 'High',
          description: `The domain name "${mainDomain}" differs by only ${distance} character(s) from the brand "${brand}". Typosquatters register common typos to intercept misdirected traffic and harvest credentials.`,
          recommendation: `Double-check the spelling of the domain. If you were looking for ${brand.toUpperCase()}, visit their official portal.`
        });
        break;
      }
    }
  }

  // 9. Sensitive Phishing Keywords in Path or Subdomain
  const fullPathAndQuery = (parsed.pathname + parsed.search).toLowerCase();
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(kw =>
    hostname.includes(kw) || fullPathAndQuery.includes(kw)
  );

  if (matchedKeywords.length >= 2) {
    findings.push({
      id: 'credential_urgency_keywords',
      title: 'Multiple Urgent Credential Keywords Detected',
      severity: 'Medium',
      description: `Detected keywords commonly associated with urgent social engineering: [${matchedKeywords.join(', ')}]. Phishing pages construct urgent narratives around account suspension, verification, or billing.`,
      recommendation: 'Verify account status by opening the official company app or website independently, not through unsolicited links.'
    });
  }

  // 10. URL Length Analysis
  if (rawUrl.length > 90) {
    findings.push({
      id: 'excessive_url_length',
      title: 'Unusually Long URL Length',
      severity: 'Low',
      description: `The URL length (${rawUrl.length} characters) is unusually high. Long URLs are sometimes used to push the real domain off-screen in mobile browser address bars.`,
      recommendation: 'Inspect the address bar on mobile devices by swiping to confirm the true hostname.'
    });
  } else {
    checksPassed.push('Standard URL character length.');
  }

  // 11. Port Check
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    findings.push({
      id: 'non_standard_port',
      title: `Non-Standard Port Specified (:${parsed.port})`,
      severity: 'Medium',
      description: `The URL requests port ${parsed.port}. Web traffic normally routes via port 80 (HTTP) or 443 (HTTPS). Non-standard ports are often used in malicious hosting to bypass network proxies or firewalls.`,
      recommendation: 'Verify why an unusual port is being targeted before proceeding.'
    });
  }

  // Calculate Overall Risk Level & Score
  let highCount = findings.filter(f => f.severity === 'High').length;
  let medCount = findings.filter(f => f.severity === 'Medium').length;
  let lowCount = findings.filter(f => f.severity === 'Low').length;

  let overallScore = highCount * 35 + medCount * 18 + lowCount * 8;
  overallScore = Math.min(100, overallScore);

  let riskLevel: RiskLevel = 'Low';
  if (highCount >= 1 || overallScore >= 45) {
    riskLevel = 'High';
  } else if (medCount >= 1 || overallScore >= 20) {
    riskLevel = 'Medium';
  }

  if (findings.length === 0) {
    checksPassed.push('No prominent offline heuristic red flags detected.');
  }

  return {
    url: rawUrl,
    normalizedUrl: normalized,
    hostname,
    protocol,
    riskLevel,
    overallScore,
    findings,
    checksPassed,
    isIPAddress,
    isShortener,
    hasSuspiciousTLD,
    hasExcessiveSubdomains,
    hasPunycode,
    hasAtSymbol,
    hasBrandSpoofing,
    spoofedBrandMatch,
    timestamp: new Date().toISOString(),
  };
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
