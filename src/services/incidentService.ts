/**
 * Cybersecurity Incident Response & Breach Simulation Scenarios
 * Interactive branching decision tree based on NIST SP 800-61 and CISA guidelines.
 */

import { IncidentScenario } from '../types/security';

export const INCIDENT_SCENARIOS: IncidentScenario[] = [
  {
    id: 'phishing-credential-leak',
    title: 'Phishing Credential Submission Triage',
    category: 'Phishing',
    difficulty: 'Beginner',
    estimatedMinutes: 3,
    synopsis: 'You just clicked a link in a fake invoice email and entered your primary work password before realizing the address bar domain was fraudulent.',
    initialStepId: 'step_initial',
    steps: {
      step_initial: {
        id: 'step_initial',
        title: 'Immediate Realization',
        situation: 'You typed your corporate email and password into a page called "login-office365-verify.com" and clicked Submit. The page redirected to the legitimate Microsoft homepage. What is your immediate first step?',
        urgentNotice: 'Attackers often deploy automated headless scripts that consume submitted credentials within 60 to 180 seconds.',
        choices: [
          {
            id: 'c1',
            text: 'Immediately navigate to the genuine login portal on a separate tab and change your password and revoke active sessions.',
            isOptimal: true,
            scoreImpact: 35,
            feedback: 'Spot on! Immediate credential reset invalidates the stolen password before automated botnets can initiate session hijacking.',
            nextStepId: 'step_mfa_check',
          },
          {
            id: 'c2',
            text: 'Wait until the end of the workday to notify IT support so you don’t interrupt ongoing meetings.',
            isOptimal: false,
            scoreImpact: -20,
            feedback: 'Dangerous delay! Criminal credentials are sold or exploited within minutes. Every second of delay expands the breach radius.',
            nextStepId: 'step_delay_consequence',
          },
          {
            id: 'c3',
            text: 'Delete your browser history and cache to wipe the entered data from your computer.',
            isOptimal: false,
            scoreImpact: -15,
            feedback: 'Clearing local cache only removes local browser files—it does nothing to revoke the credentials already transmitted to the attacker’s server.',
            nextStepId: 'step_mfa_check',
          },
        ],
      },
      step_mfa_check: {
        id: 'step_mfa_check',
        title: 'Two-Factor Authentication & Audit',
        situation: 'You successfully changed your password. What is the critical second inspection you must conduct on your account settings?',
        choices: [
          {
            id: 'c4',
            text: 'Check account security settings to ensure the attacker did not add an unauthorized secondary MFA phone number or authenticator app.',
            isOptimal: true,
            scoreImpact: 35,
            feedback: 'Critical step! Attackers who gain momentary access often register their own authenticator or phone number for persistent backdoor access.',
            nextStepId: 'step_reporting',
          },
          {
            id: 'c5',
            text: 'Assume you are 100% safe because the password was changed.',
            isOptimal: false,
            scoreImpact: -10,
            feedback: 'Incomplete triage. Attackers frequently register persistence mechanisms (like forwarding rules or OAuth apps) during brief access windows.',
            nextStepId: 'step_reporting',
          },
        ],
      },
      step_delay_consequence: {
        id: 'step_delay_consequence',
        title: 'Breach Expansion Escalation',
        situation: 'Because of the delay, the attacker successfully logged in, set up an auto-forwarding rule for emails containing "invoice" or "wire", and downloaded your address book. How do you contain the damage?',
        choices: [
          {
            id: 'c6',
            text: 'Emergency sign-out on all devices, delete malicious inbox forwarding rules, change password, and immediately report the incident to your security/IT team.',
            isOptimal: true,
            scoreImpact: 20,
            feedback: 'Effective remediation! Checking for mail forwarding rules is a vital step in business email compromise (BEC) recovery.',
            nextStepId: 'step_reporting',
          },
          {
            id: 'c7',
            text: 'Turn off your computer and leave it unplugged overnight.',
            isOptimal: false,
            scoreImpact: -20,
            feedback: 'The compromise is in the cloud mailbox, not your physical hard drive. Powering down your laptop does not stop cloud actions.',
            nextStepId: 'step_reporting',
          },
        ],
      },
      step_reporting: {
        id: 'step_reporting',
        title: 'Incident Documentation & Notification',
        situation: 'The account is secured. What final action completes standard incident response according to NIST guidelines?',
        choices: [
          {
            id: 'c8',
            text: 'Document the exact time, the malicious URL, forward the phishing email headers to your security team, and notify contacts if suspicious messages were sent.',
            isOptimal: true,
            scoreImpact: 30,
            feedback: 'Excellent! Sharing the malicious URL and headers allows security defenders to block the domain company-wide and protect colleagues.',
          },
          {
            id: 'c9',
            text: 'Keep it a secret to avoid embarrassment.',
            isOptimal: false,
            scoreImpact: -30,
            feedback: 'Hiding security incidents prevents defenders from investigating whether other accounts or systems were compromised in the same campaign.',
          },
        ],
      },
    },
    finalResolution: {
      summary: 'Prompt password reset, checking for backdoor MFA enrollments and mail forwarding rules, and notifying security teams constitutes a textbook phishing recovery.',
      keyTakeaway: 'Speed is everything in credential leaks. Always check for newly added MFA methods and forwarding rules after any account compromise.',
      frameworkReference: 'NIST SP 800-61 Rev. 2 (Incident Handling Guide: Containment, Eradication, and Recovery)',
    },
  },
  {
    id: 'ransomware-desktop-alert',
    title: 'Active Ransomware Warning on Workstation',
    category: 'Ransomware',
    difficulty: 'Intermediate',
    estimatedMinutes: 4,
    synopsis: 'A suspicious console window briefly flashed on your desktop. Minutes later, your background wallpaper turned red demanding 2 Bitcoin to unlock your encrypted personal photos and documents.',
    initialStepId: 'step_rw_initial',
    steps: {
      step_rw_initial: {
        id: 'step_rw_initial',
        title: 'Immediate Containment Action',
        situation: 'Your files are beginning to have strange extensions (.locked) appended to them. A timer is counting down on screen. What is your immediate FIRST physical action?',
        urgentNotice: 'Ransomware actively scans and encrypts shared network drives, mapped cloud sync folders, and connected USB backups.',
        choices: [
          {
            id: 'r1',
            text: 'Immediately disconnect network cables and turn off Wi-Fi (isolate the host physically), but keep the computer powered on or in hibernation if memory forensics are needed.',
            isOptimal: true,
            scoreImpact: 40,
            feedback: 'Correct! Severing network connections halts ransomware from reaching mapped file shares, NAS drives, and encrypting other computers on the LAN.',
            nextStepId: 'step_rw_backup',
          },
          {
            id: 'r2',
            text: 'Quickly plug in your external backup hard drive to copy unencrypted files before they get hit.',
            isOptimal: false,
            scoreImpact: -40,
            feedback: 'Catastrophic error! Plugging an unencrypted backup drive into an actively infected computer will cause the ransomware to immediately encrypt your only backup!',
            nextStepId: 'step_rw_backup',
          },
          {
            id: 'r3',
            text: 'Click the ransom link and negotiate with the extortionists.',
            isOptimal: false,
            scoreImpact: -30,
            feedback: 'Never communicate or pay ransoms before assessing offline backup viability. Paying funds future cyber syndicates with zero guarantee of key delivery.',
            nextStepId: 'step_rw_backup',
          },
        ],
      },
      step_rw_backup: {
        id: 'step_rw_backup',
        title: 'Backup Restoration & Eradication Strategy',
        situation: 'The machine is isolated. How do you proceed with recovering your data safely?',
        choices: [
          {
            id: 'r4',
            text: 'Completely wipe the infected drive, perform a clean OS reinstallation from official media, and restore files from verified offline/air-gapped backups.',
            isOptimal: true,
            scoreImpact: 35,
            feedback: 'Gold standard protocol! Reinstalling the OS ensures rootkits or persistent command-and-control backdoors are completely eradicated.',
            nextStepId: 'step_rw_analysis',
          },
          {
            id: 'r5',
            text: 'Run a free antivirus cleaner to delete the virus, then keep using the same operating system.',
            isOptimal: false,
            scoreImpact: -20,
            feedback: 'High risk! Modern ransomware leaves secondary remote-access trojans (RATs) that standard quick scans easily miss.',
            nextStepId: 'step_rw_analysis',
          },
        ],
      },
      step_rw_analysis: {
        id: 'step_rw_analysis',
        title: 'Root Cause Investigation',
        situation: 'Before restoring data, you investigate how the infection breached your device. What is the most important lesson?',
        choices: [
          {
            id: 'r6',
            text: 'Audit recent downloads, verify that software updates were applied, check NoMoreRansom.org for free decryptors, and reinforce offline 3-2-1 backup rotation.',
            isOptimal: true,
            scoreImpact: 25,
            feedback: 'Outstanding! The NoMoreRansom initiative (by Europol and security vendors) provides free decryption keys for hundreds of recognized ransomware strains.',
          },
          {
            id: 'r7',
            text: 'Disable all future automatic updates to prevent software from changing.',
            isOptimal: false,
            scoreImpact: -25,
            feedback: 'Opposite of safe! Unpatched vulnerabilities are the primary entry point for ransomware propagation.',
          },
        ],
      },
    },
    finalResolution: {
      summary: 'Severing network connections immediately preserves network drives. Clean reimaging and restoring from isolated offline backups completely neutralizes extortion leverage.',
      keyTakeaway: 'Never connect backup media to an infected system. Maintain 3-2-1 air-gapped backups disconnected from the network.',
      frameworkReference: 'CISA Ransomware Readiness & StopRansomware Playbook',
    },
  },
  {
    id: 'sim-swap-mobile-hijack',
    title: 'SIM Swap in Progress (Mobile Carrier Hijack)',
    category: 'SIM Swap',
    difficulty: 'Advanced',
    estimatedMinutes: 3,
    synopsis: 'Your mobile phone suddenly displays "No Service" or "SOS Only" while you are sitting at your desk. Seconds later, password reset notification emails begin appearing in your primary inbox.',
    initialStepId: 'step_sim_initial',
    steps: {
      step_sim_initial: {
        id: 'step_sim_initial',
        title: 'Sudden Loss of Cellular Service',
        situation: 'Your smartphone lost cellular connectivity unexpectedly, but your home Wi-Fi is working fine. You see a push notification stating "Your Apple/Google password reset was requested via SMS". What is happening and what do you do first?',
        urgentNotice: 'Attackers who complete a SIM swap gain control of your phone number and intercept SMS verification codes for banking, email, and crypto exchanges.',
        choices: [
          {
            id: 's1',
            text: 'Immediately access your critical email and financial accounts over Wi-Fi, remove your phone number as a 2FA/recovery method, and switch to an Authenticator app (TOTP) or hardware key.',
            isOptimal: true,
            scoreImpact: 40,
            feedback: 'Vital first defense! Removing the hijacked phone number as an authentication factor cuts off the attacker’s ability to reset passwords using SMS OTP.',
            nextStepId: 'step_sim_carrier',
          },
          {
            id: 's2',
            text: 'Restart your phone three times and wait 2 hours to see if the cell tower is experiencing an outage.',
            isOptimal: false,
            scoreImpact: -40,
            feedback: 'Catastrophic delay! In a SIM swap, password reset attempts happen within the first 10 minutes. Waiting allows attackers to drain accounts.',
            nextStepId: 'step_sim_carrier',
          },
        ],
      },
      step_sim_carrier: {
        id: 'step_sim_carrier',
        title: 'Mobile Carrier Fraud Triage',
        situation: 'You are now securing your critical accounts. What is your next immediate action regarding your cellular service?',
        choices: [
          {
            id: 's3',
            text: 'Immediately call your cellular carrier’s fraud department using Wi-Fi calling, a landline, or a friend’s phone, report an unauthorized SIM porting, freeze the line, and demand a Port-Freeze / Transfer-PIN.',
            isOptimal: true,
            scoreImpact: 35,
            feedback: 'Exactly right! Getting the fraud department to freeze the line stops further SMS interception and initiates SIM recovery.',
            nextStepId: 'step_sim_harden',
          },
          {
            id: 's4',
            text: 'Post on social media asking your friends if their cellular signal is also down.',
            isOptimal: false,
            scoreImpact: -20,
            feedback: 'Distraction that burns critical minutes while unauthorized password resets proceed.',
            nextStepId: 'step_sim_harden',
          },
        ],
      },
      step_sim_harden: {
        id: 'step_sim_harden',
        title: 'Long-Term Carrier Hardening',
        situation: 'You regained your cellular line. What long-term configuration prevents a recurrence?',
        choices: [
          {
            id: 's5',
            text: 'Set a verbal account PIN/passphrase with your carrier, enable Port-Freeze protection, and permanently deprecate SMS 2FA in favor of Passkeys and TOTP apps.',
            isOptimal: true,
            scoreImpact: 25,
            feedback: 'Master-level defense! Port-Freeze prevents unauthorized number transfers, and removing SMS 2FA immunizes you against future carrier breaches.',
          },
          {
            id: 's6',
            text: 'Keep SMS as your primary 2FA method because it is convenient.',
            isOptimal: false,
            scoreImpact: -20,
            feedback: 'Leaves the exact same vulnerability open for future social engineering of customer service agents.',
          },
        ],
      },
    },
    finalResolution: {
      summary: 'Promptly stripping phone numbers from recovery methods, alerting carrier fraud desks to freeze the line, and permanently moving to authenticator apps neutralizes SIM swap threats.',
      keyTakeaway: 'SMS is a telecommunications protocol, not a security protocol. Never rely on SMS for critical multi-factor authentication.',
      frameworkReference: 'CISA & FBI Cyber Division Guidance on Telecommunications SIM Swapping',
    },
  },
];
