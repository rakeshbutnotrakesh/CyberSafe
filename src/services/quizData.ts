/**
 * CyberSafe Comprehensive Security Quiz Dataset
 * 30 High-quality multiple-choice questions covering core cybersecurity disciplines.
 */

import { QuizQuestion } from '../types/security';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Phishing',
    question: 'You receive an email from "PayPal Security Team" warning that your account is suspended. The sender address is "service@paypal-account-verify.net". What is the most telling sign that this is phishing?',
    options: [
      'The email was received on a weekend',
      'The domain after the @ symbol is not the official "paypal.com" domain',
      'The subject line contains standard capitalization',
      'The email contains the PayPal corporate logo'
    ],
    correctIndex: 1,
    explanation: 'Scammers frequently register domains that contain the brand name with hyphens or extra words. The official root domain for PayPal is strictly paypal.com.',
    tip: 'Always inspect the exact root domain in the email sender address and link destinations.'
  },
  {
    id: 2,
    category: 'Passwords',
    question: 'Which of the following passwords has the highest mathematical resistance against modern GPU brute-force attacks?',
    options: [
      'Tr0ub4dor&3 (11 characters, mixed symbols)',
      'correct-horse-battery-staple-92 (31 characters, Diceware passphrase)',
      'Admin2026!# (10 characters, mixed case)',
      'P@$$w0rd2024 (12 characters, common substitution)'
    ],
    correctIndex: 1,
    explanation: 'Password length is the single most powerful factor in cryptographic entropy. A 31-character randomized passphrase creates a search space that takes trillions of years to brute-force.',
    tip: 'Long passphrases composed of multiple random words beat short, complex passwords.'
  },
  {
    id: 3,
    category: 'Authentication',
    question: 'Why is SMS text message two-factor authentication considered less secure than an authenticator app (TOTP)?',
    options: [
      'SMS costs extra phone carrier charges',
      'SMS is susceptible to SIM-swapping attacks and mobile network interception',
      'SMS codes expire too slowly',
      'Smartphones cannot receive SMS while connected to Wi-Fi'
    ],
    correctIndex: 1,
    explanation: 'In a SIM swap, an attacker deceives the mobile carrier into reassigning your phone number to their SIM card, allowing them to intercept your SMS verification codes.',
    tip: 'Use an authenticator app (like Google Authenticator, Aegis, or Bitwarden) instead of SMS.'
  },
  {
    id: 4,
    category: 'Network',
    question: 'What is the primary security danger when connecting to an unsecured public Wi-Fi network at an airport or coffee shop?',
    options: [
      'The computer battery discharges twice as fast',
      'Other parties on the same network or a rogue access point can intercept unencrypted traffic or execute man-in-the-middle attacks',
      'Your display screen brightness is lowered',
      'You will be forced to buy airport coffee'
    ],
    correctIndex: 1,
    explanation: 'On open Wi-Fi networks without client isolation or encryption, any connected user can capture local wireless packets and attempt man-in-the-middle eavesdropping.',
    tip: 'Use a trusted VPN and verify that connections use HTTPS when connecting to public Wi-Fi.'
  },
  {
    id: 5,
    category: 'Social Engineering',
    question: 'An unknown person in corporate uniform carrying heavy boxes asks you to hold the secured badge door open for them. What is this security risk known as?',
    options: [
      'Baiting',
      'Tailgating (or Piggybacking)',
      'Pharming',
      'Watering Hole attack'
    ],
    correctIndex: 1,
    explanation: 'Tailgating exploits common human politeness to bypass physical access controls (keycards, turnstiles) into restricted facilities.',
    tip: 'Politely direct unfamiliar visitors to the reception desk or badging station.'
  },
  {
    id: 6,
    category: 'Malware',
    question: 'What is the primary difference between a Computer Virus and a Computer Worm?',
    options: [
      'Worms only infect Apple computers',
      'A worm can spread autonomously across networks without human intervention, whereas a virus requires a host program or user action to propagate',
      'Viruses are harmless prank programs',
      'Worms can only spread through physical floppy disks'
    ],
    correctIndex: 1,
    explanation: 'Worms are self-replicating programs that exploit network vulnerabilities directly, while traditional viruses attach to host files and need human execution to spread.',
    tip: 'Keep operating system firewalls enabled and patch network services to prevent worm propagation.'
  },
  {
    id: 7,
    category: 'Ransomware',
    question: 'Under the "3-2-1" data backup strategy, what does the "1" stand for?',
    options: [
      '1 backup per year',
      '1 copy kept completely off-site or physically offline (air-gapped)',
      '1 single master password for everything',
      '1 hour of downtime allowed'
    ],
    correctIndex: 1,
    explanation: 'The 3-2-1 rule calls for 3 copies of data, on 2 different media, with at least 1 copy off-site or disconnected from networks to survive ransomware or physical disaster.',
    tip: 'Unplug external backup drives after backups complete so network ransomware cannot reach them.'
  },
  {
    id: 8,
    category: 'Web Security',
    question: 'When a web browser displays the padlock icon (HTTPS) next to a website URL, what does this guarantee?',
    options: [
      'The website is completely trustworthy, honest, and free of malware or scams',
      'The communication channel between your browser and the website server is encrypted',
      'The website owner has been personally vetted by the FBI',
      'The website cannot steal your credit card information'
    ],
    correctIndex: 1,
    explanation: 'HTTPS only guarantees that traffic is encrypted in transit. Phishing sites and criminals can easily obtain valid HTTPS certificates for free.',
    tip: 'HTTPS means the wire is encrypted, not that the recipient is trustworthy.'
  },
  {
    id: 9,
    category: 'Data Privacy',
    question: 'Why should you be cautious about posting unedited photos of your home or vacation on public social media?',
    options: [
      'Camera photos often contain embedded EXIF metadata with exact GPS coordinates and timestamps',
      'Photos will permanently degrade the internet speed of your home',
      'Search engines delete accounts that upload high-resolution photos',
      'Photos can only be viewed in black and white by third parties'
    ],
    correctIndex: 0,
    explanation: 'Original image files often contain EXIF metadata including precise latitude/longitude coordinates revealing your home location or travel schedule.',
    tip: 'Disable camera geotagging or use a tool to scrub EXIF metadata before sharing images online.'
  },
  {
    id: 10,
    category: 'Device Security',
    question: 'What is the purpose of full-disk encryption (such as BitLocker on Windows or FileVault on macOS)?',
    options: [
      'To compress files so the computer has more storage',
      'To prevent unauthorized individuals from reading your data if your physical device is lost or stolen',
      'To speed up boot times when turning on the computer',
      'To prevent the computer from overheating'
    ],
    correctIndex: 1,
    explanation: 'Full-disk encryption ensures that if a laptop or hard drive is stolen, the data cannot be read by removing the drive or booting from an external USB.',
    tip: 'Always ensure device encryption is activated on laptops, phones, and portable drives.'
  },
  {
    id: 11,
    category: 'Phishing',
    question: 'What is "Spear Phishing"?',
    options: [
      'Phishing that targets commercial fishing companies',
      'A highly customized, targeted phishing attack directed at a specific individual using researched background details',
      'Sending the exact same spam email to 10 million random addresses',
      'An attack performed using deep-sea fiber optic cables'
    ],
    correctIndex: 1,
    explanation: 'Unlike generic mass phishing, spear phishing involves researching a specific victim to make the pretext appear uniquely authentic and convincing.',
    tip: 'Be wary of unexpected emails that reference colleagues, recent conferences, or projects.'
  },
  {
    id: 12,
    category: 'Authentication',
    question: 'Which of the following authentication methods provides the strongest resistance against real-time phishing proxy attacks (like Evilginx)?',
    options: [
      'SMS text message one-time codes',
      'Hardware security keys using FIDO2 / WebAuthn protocols (e.g. YubiKey)',
      'Security questions (e.g. mother\'s maiden name)',
      '6-digit TOTP authenticator app codes'
    ],
    correctIndex: 1,
    explanation: 'FIDO2 / WebAuthn tokens cryptographically verify the browser\'s exact domain name, making them fundamentally immune to relay attacks by lookalike phishing domains.',
    tip: 'Adopt FIDO2 passkeys or hardware security keys for your most critical accounts.'
  },
  {
    id: 13,
    category: 'Malware',
    question: 'What is a "Keylogger"?',
    options: [
      'A machine that cuts physical door keys',
      'Malware that secretly records every keystroke pressed on a device to steal passwords and messages',
      'A keyboard cleaning utility',
      'A tool that speeds up typing'
    ],
    correctIndex: 1,
    explanation: 'Keyloggers record keyboard input and transmit keystroke logs to attackers, allowing them to capture plaintext credentials and confidential text.',
    tip: 'Avoid downloading cracked software or unverified utilities which frequently bundle keyloggers.'
  },
  {
    id: 14,
    category: 'Network',
    question: 'Why should you change the default administrator login password on your home Wi-Fi router?',
    options: [
      'To make your Wi-Fi signal reach farther',
      'Manufacturer default credentials (e.g. admin/admin) are publicly documented and targeted by automated botnets',
      'Internet service providers cancel accounts that keep default passwords',
      'Default passwords expire after 30 days automatically'
    ],
    correctIndex: 1,
    explanation: 'Automated malware and attackers routinely scan networks for standard factory default credentials to seize control of routers and redirect DNS.',
    tip: 'Change your router admin password and disable remote management from the WAN port.'
  },
  {
    id: 15,
    category: 'Cryptography',
    question: 'What is a cryptographic hash function (such as SHA-256) primarily used for in software security?',
    options: [
      'To compress large video files for streaming',
      'To verify file integrity and detect whether data has been altered or tampered with',
      'To decrypt stolen passwords',
      'To hide text in audio files'
    ],
    correctIndex: 1,
    explanation: 'A cryptographic hash generates a unique deterministic digital fingerprint. If even a single byte of a file changes, the hash changes completely (avalanche effect).',
    tip: 'Verify downloaded software checksums against official developer hashes before running installers.'
  },
  {
    id: 16,
    category: 'Social Engineering',
    question: 'You receive an urgent phone call claiming to be your bank fraud team asking you to read back a verification code sent to your phone. What should you do?',
    options: [
      'Read the code immediately to prevent your account from being frozen',
      'Hang up immediately, locate the official customer service number on the back of your bank card, and call the bank yourself',
      'Ask the caller for their badge number and then give them the code',
      'Text the code to your friend to check if it looks normal'
    ],
    correctIndex: 1,
    explanation: 'This is voice phishing (vishing). Fraudsters trigger a password reset or transaction and impersonate bank staff to convince the victim to read out the MFA code.',
    tip: 'Legitimate institutions never telephone you demanding one-time verification passcodes.'
  },
  {
    id: 17,
    category: 'Web Security',
    question: 'What is "Punycode" and how do attackers abuse it in phishing campaigns?',
    options: [
      'A video compression codec used for streaming',
      'A method of representing non-ASCII characters in domains (e.g. xn--), which attackers use to create visually identical lookalike letters (homoglyph attack)',
      'A programming language used for building games',
      'A short code sent by SMS'
    ],
    correctIndex: 1,
    explanation: 'Homoglyph attacks use foreign character sets (like Cyrillic "а" instead of Latin "a") which look identical on screen but resolve to an entirely different attacker-controlled server.',
    tip: 'Inspect raw domain strings for the "xn--" prefix which signals internationalized punycode.'
  },
  {
    id: 18,
    category: 'Device Security',
    question: 'Why is it critical to install operating system and application updates as soon as they become available?',
    options: [
      'Updates ensure your computer runs out of battery sooner',
      'Updates frequently patch known security vulnerabilities that are actively being targeted by cybercriminals',
      'Updates are solely for aesthetic redesigns',
      'Updates remove your personal files automatically'
    ],
    correctIndex: 1,
    explanation: 'Once a patch is released, attackers reverse-engineer the vulnerability and quickly launch exploits against users who delay updating.',
    tip: 'Turn on automatic updates for your operating system, web browsers, and core applications.'
  },
  {
    id: 19,
    category: 'Data Privacy',
    question: 'What is a "Data Broker"?',
    options: [
      'A technician who repairs broken computer hardware',
      'A company that aggregates personal information from public records, shopping habits, and online tracking to sell consumer dossiers',
      'A stock exchange trader',
      'A server that stores cloud backups'
    ],
    correctIndex: 1,
    explanation: 'Data brokers aggregate fragmented pieces of your public and commercial activity to build profiles sold to marketers and search platforms.',
    tip: 'Periodically submit opt-out requests to data aggregator directories.'
  },
  {
    id: 20,
    category: 'Incident Response',
    question: 'If you suspect you entered your password on a malicious phishing website, what should be your immediate first action?',
    options: [
      'Turn off your home electricity',
      'Immediately go to the legitimate service and change your password, and invalidate existing active sessions if possible',
      'Wait 24 hours to see if any strange emails arrive',
      'Delete your web browser'
    ],
    correctIndex: 1,
    explanation: 'Every second counts. Attackers often deploy automated bots that consume phished credentials within minutes. Changing your password immediately locks out the attacker.',
    tip: 'Change your password right away, revoke active sessions, and check whether 2FA was modified.'
  },
  {
    id: 21,
    category: 'Passwords',
    question: 'What is "Credential Stuffing"?',
    options: [
      'Putting too many credit cards in a physical wallet',
      'An automated attack where stolen username/password lists from one breach are tested against thousands of other unrelated websites',
      'Creating very long passwords with many characters',
      'Encrypting passwords inside a zip file'
    ],
    correctIndex: 1,
    explanation: 'Because so many users reuse passwords across services, hackers use automated bots to blast leaked credential databases across top web platforms.',
    tip: 'Never reuse passwords; every online service should have a distinct, unique password.'
  },
  {
    id: 22,
    category: 'Mobile Security',
    question: 'What is the primary security risk of "Jailbreaking" (iOS) or "Rooting" (Android) a smartphone?',
    options: [
      'The phone will refuse to charge',
      'It dismantles the built-in operating system sandboxing that prevents malicious apps from accessing other apps\' private data',
      'The screen colors become inverted',
      'You can no longer make regular phone calls'
    ],
    correctIndex: 1,
    explanation: 'Mobile operating systems isolate apps in secure sandboxes. Rooting/jailbreaking removes this protection, allowing a malicious app to steal data from banking and messaging apps.',
    tip: 'Keep production mobile devices unrooted to maintain operating system security boundaries.'
  },
  {
    id: 23,
    category: 'Web Security',
    question: 'What is the security hazard of having dozens of unnecessary, unmaintained third-party browser extensions installed?',
    options: [
      'Browser extensions consume internet bandwidth even when the computer is turned off',
      'Extensions often have broad permissions to read and modify web content, and abandoned extensions can be sold to malicious operators or hijacked',
      'Extensions automatically delete bookmarks every 30 days',
      'Extensions prevent the mouse from clicking on links'
    ],
    correctIndex: 1,
    explanation: 'Browser extensions frequently possess full read/write access to every page you visit. Threat actors regularly purchase popular abandoned extensions to inject adware or credential stealers.',
    tip: 'Audit your browser extensions regularly and prune any you do not actively use.'
  },
  {
    id: 24,
    category: 'Social Engineering',
    question: 'What is "Baiting" in the context of cyber and physical security?',
    options: [
      'Sending an email with a fishing rod graphic',
      'Leaving a malware-infected USB drive in a public area, relying on human curiosity for someone to plug it in',
      'Setting up a computer trap in an office lobby',
      'Banning someone from a gaming server'
    ],
    correctIndex: 1,
    explanation: 'Baiting entices victims with an attractive physical object (like a USB drive labeled "Executive Salaries Q4") hoping they will insert it into their workstation.',
    tip: 'Never plug an unknown or found USB drive into any computer.'
  },
  {
    id: 25,
    category: 'Network',
    question: 'What does a DNS (Domain Name System) spoofing or poisoning attack do?',
    options: [
      'It changes the physical color of an ethernet cable',
      'It corrupts DNS cache tables so legitimate website addresses (like bank.com) secretly route the user to an attacker-controlled fake server',
      'It speeds up your internet download rate',
      'It resets the system clock by one hour'
    ],
    correctIndex: 1,
    explanation: 'DNS translates domain names to IP addresses. If DNS responses are poisoned, entering a real domain can direct you to an attacker\'s server without your knowledge.',
    tip: 'Use secure, encrypted DNS protocols like DNS-over-HTTPS (DoH) or DNS-over-TLS (DoT).'
  },
  {
    id: 26,
    category: 'Authentication',
    question: 'What is a "Passkey"?',
    options: [
      'A physical brass key used to open computer cases',
      'A modern cryptographic standard based on public-key pairs that replaces traditional passwords with biometric or device-based authentication',
      'A master password written on a sticky note',
      'A code used to bypass airport security lines'
    ],
    correctIndex: 1,
    explanation: 'Passkeys utilize asymmetric cryptography; the private key stays securely on your device, and only the public key is stored on the server, eliminating password theft risks.',
    tip: 'Enable passkeys on services like Google, Apple, and Microsoft for faster and safer logins.'
  },
  {
    id: 27,
    category: 'Malware',
    question: 'What is "Ransomware-as-a-Service" (RaaS)?',
    options: [
      'A subscription service that protects users from ransomware',
      'A criminal business model where ransomware developers license their encryption software to affiliates in exchange for a percentage of ransom payments',
      'A backup software service',
      'A legitimate enterprise cybersecurity product'
    ],
    correctIndex: 1,
    explanation: 'RaaS allows low-skilled criminals to launch sophisticated ransomware attacks by renting pre-built malware packages from criminal syndicates in exchange for a cut of the extortion money.',
    tip: 'Prepare for ransomware by implementing air-gapped backups and strict access controls.'
  },
  {
    id: 28,
    category: 'Device Security',
    question: 'What is the purpose of setting a short screen auto-lock timeout (e.g. 2 minutes) on your computer or mobile phone?',
    options: [
      'To prevent screen pixels from wearing out',
      'To minimize the window of opportunity for an unauthorized person to access your device if you step away',
      'To force the computer to install updates faster',
      'To silence incoming notifications'
    ],
    correctIndex: 1,
    explanation: 'Physical access is total access. An unlocked, unattended computer allows anyone nearby to copy session tokens, install tools, or export confidential files in seconds.',
    tip: 'Configure your devices to auto-lock quickly and practice locking your screen whenever stepping away.'
  },
  {
    id: 29,
    category: 'Web Security',
    question: 'Why should you be wary of clicking on links in unsolicited emails that use generic URL shorteners (like bit.ly or tinyurl.com)?',
    options: [
      'Shorteners make web pages load slower',
      'Shorteners completely obscure the true destination hostname and path, hiding malicious links from visual inspection',
      'Shorteners only work on desktop computers',
      'Shorteners automatically trigger file downloads'
    ],
    correctIndex: 1,
    explanation: 'Shortened URLs mask the final domain, preventing you from checking whether the link points to a legitimate portal or an obscure phishing landing page.',
    tip: 'Use URL expansion tools or preview options before clicking shortened links from unknown sources.'
  },
  {
    id: 30,
    category: 'Incident Response',
    question: 'What is the "Principle of Least Privilege" in digital security?',
    options: [
      'Giving every employee full administrator permissions so they are never blocked from work',
      'Granting users and programs only the minimum necessary permissions required to perform their specific tasks',
      'Buying the least expensive computer equipment available',
      'Allowing anyone to access company files without a password'
    ],
    correctIndex: 1,
    explanation: 'By limiting accounts and programs to only what they strictly need, the damage an attacker can inflict if an individual account is compromised is severely restricted.',
    tip: 'Do not use an administrator account for everyday web browsing or reading email.'
  }
];
