/**
 * CyberSafe Learning Center Content
 * 10 Comprehensive beginner-friendly cybersecurity topics.
 */

import { LearningTopic } from '../types/security';

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'intro-cybersecurity',
    title: 'Introduction to Cybersecurity',
    summary: 'Foundations of digital defense, the CIA Triad, and why everyday cyber hygiene matters.',
    readTime: '4 min',
    iconName: 'Shield',
    overview: 'Cybersecurity is the practice of protecting systems, networks, programs, devices, and personal data from digital attacks. These cyberattacks are usually aimed at accessing, altering, or destroying sensitive information, extorting money from users via ransomware, or interrupting normal business processes. Modern cybersecurity focuses on three core pillars known as the CIA Triad: Confidentiality (only authorized parties can read data), Integrity (data cannot be altered in transit or at rest without detection), and Availability (systems remain accessible when needed).',
    realWorldScenario: {
      title: 'The Default Password Fiasco',
      narrative: 'In 2016, the Mirai botnet scanned the entire internet for IoT devices (smart cameras, home routers, DVRs) that were left running factory-default usernames and passwords like "admin/123456". Over 300,000 infected devices were commandeered into a massive distributed denial-of-service (DDoS) attack that temporarily crippled major services including Twitter, Netflix, and GitHub.',
      lesson: 'Never leave internet-facing hardware running standard manufacturer default credentials. Even seemingly harmless gadgets like smart lightbulbs or cameras can become weaponized entry points.'
    },
    preventionRules: [
      'Assume default credentials are publicly documented and known to automated bot scanners.',
      'Apply the principle of least privilege: only grant apps access to the files and hardware they strictly need.',
      'Keep software updated so security patches eliminate known exploits.',
      'Maintain separate email accounts for personal banking versus promotional mailing lists.'
    ],
    keyTerms: [
      { term: 'CIA Triad', definition: 'The standard model for information security: Confidentiality, Integrity, and Availability.' },
      { term: 'Attack Surface', definition: 'The total sum of vulnerabilities and entry points across your digital footprint that an attacker could exploit.' },
      { term: 'Vulnerability', definition: 'A flaw, bug, or misconfiguration in software or hardware that can be leveraged by an adversary.' },
      { term: 'Patch', definition: 'A software update designed to fix security vulnerabilities, performance bugs, or usability problems.' }
    ],
    miniQuiz: [
      {
        question: 'What are the three pillars of the classic CIA Triad in security?',
        options: ['Central, Internet, Access', 'Confidentiality, Integrity, Availability', 'Cyber, Intelligence, Authorization', 'Control, Identity, Authentication'],
        correctIndex: 1,
        explanation: 'The CIA Triad stands for Confidentiality, Integrity, and Availability, the cornerstone of modern information security.'
      },
      {
        question: 'What is an "attack surface"?',
        options: ['The screen area of a computer', 'The total number of entry points an attacker can try to exploit', 'A type of physical malware', 'The speed of an internet connection'],
        correctIndex: 1,
        explanation: 'An attack surface comprises all possible points where an unauthorized user can try to enter or extract data.'
      },
      {
        question: 'Why do security updates and software patches matter?',
        options: ['They change the color theme of applications', 'They close known vulnerabilities before attackers can exploit them', 'They are strictly optional visual enhancements', 'They reduce hard drive space'],
        correctIndex: 1,
        explanation: 'Security patches resolve known vulnerabilities that adversaries frequently scan for and exploit automatically.'
      }
    ]
  },
  {
    id: 'phishing-attacks',
    title: 'Phishing Attacks',
    summary: 'Deceptive messages, fake login pages, urgent pretexts, and how to spot fraudulent communications.',
    readTime: '5 min',
    iconName: 'MailWarning',
    overview: 'Phishing is a form of social engineering where attackers deceive victims into revealing sensitive information (such as passwords, credit card numbers, or social security numbers) or downloading malicious payloads. Phishing messages typically disguise themselves as trustworthy entities: your bank, an IT support team, a courier delivery service, or an employer. They rely on emotional triggers like panic, urgency, fear of financial penalty, or curiosity.',
    realWorldScenario: {
      title: 'The "Urgent Account Suspension" Notice',
      narrative: 'Marcus received a text message purporting to be from his bank: "ALERT: Your debit card has been locked due to suspicious activity. Click https://chase-security-verify.top to unlock within 15 minutes." Panicked, Marcus tapped the link on his mobile phone and submitted his online banking credentials. Within 20 minutes, $2,400 was transferred out of his checking account.',
      lesson: 'Legitimate institutions never demand immediate credential verification via SMS links with 15-minute countdown threats. Always verify independently through official bookmarks or phone numbers printed on the physical card.'
    },
    preventionRules: [
      'Never click links in unsolicited emails or SMS messages asking you to log in or update payment methods.',
      'Check the sender email domain carefully: look out for lookalike domains (e.g. @support-apple-id.com instead of @apple.com).',
      'Be skeptical of artificial urgency, threats of immediate suspension, or demands for gift cards.',
      'Navigate to services directly by typing the known URL into your browser address bar.'
    ],
    keyTerms: [
      { term: 'Spear Phishing', definition: 'A targeted phishing attack tailored to a specific individual or organization using researched personal details.' },
      { term: 'Smishing', definition: 'Phishing conducted via SMS text messages.' },
      { term: 'Vishing', definition: 'Voice phishing conducted over telephone calls, often impersonating bank fraud departments or tech support.' },
      { term: 'Typosquatting', definition: 'Registering misspelled variants of well-known domain names (e.g., netfllix.com) to deceive visitors.' }
    ],
    miniQuiz: [
      {
        question: 'Which of the following is the biggest red flag of a phishing message?',
        options: ['The message includes a clear company logo', 'An urgent demand to verify passwords within minutes to prevent account closure', 'An email asking for a product review with no login link', 'A scheduled calendar invitation from a colleague'],
        correctIndex: 1,
        explanation: 'Artificial urgency and fear tactics are classic psychological mechanisms used to prompt hasty action before logic sets in.'
      },
      {
        question: 'What is "Smishing"?',
        options: ['Small-scale malware', 'Phishing conducted through SMS text messages', 'Stealing cookies through social media', 'Smashing physical hard drives'],
        correctIndex: 1,
        explanation: 'Smishing is the portmanteau for SMS-based phishing attacks.'
      },
      {
        question: 'What is the safest way to respond to an urgent email asking you to verify your banking credentials?',
        options: ['Click the link and inspect if it has HTTPS', 'Reply to the sender asking if they are legitimate', 'Ignore the link, open a new browser tab, and log in directly at your bank’s official website', 'Forward the email to friends to ask their opinion'],
        correctIndex: 2,
        explanation: 'Navigating independently to your bank via a trusted bookmark or known domain guarantees you bypass the phishing landing page.'
      }
    ]
  },
  {
    id: 'password-security',
    title: 'Password Security & Credential Hygiene',
    summary: 'The math behind password entropy, passphrases, brute-force attacks, and password managers.',
    readTime: '5 min',
    iconName: 'Key',
    overview: 'Passwords remain the most common authentication method across the digital world, but human habits often make them the weakest link. Short passwords, reused credentials, and predictable keyboard walks are trivial for automated tools to compromise. Modern password cracking relies on high-speed GPU clusters capable of guessing hundreds of billions of combinations every second against offline database dumps. The key to resilient passwords is high entropy, length (16+ characters), and zero reuse.',
    realWorldScenario: {
      title: 'The Credential Stuffing Cascade',
      narrative: 'A fitness tracker app suffered a database breach in 2021, leaking 10 million email and password combinations. Sarah used the exact same password ("Sunshine2020!") for her fitness app, her primary email, and her online shopping accounts. Automated criminal botnets immediately tested Sarah’s leaked credentials across thousands of other websites, gaining access to her shopping account and purchasing gift cards.',
      lesson: 'Never reuse passwords. When one low-security platform gets compromised, credential stuffing scripts will immediately test that combination everywhere else.'
    },
    preventionRules: [
      'Use a reputable, end-to-end encrypted password manager to generate and store 16+ character unique passwords for every service.',
      'For master passwords, prefer long Diceware passphrases (e.g., "Crystal-Falcon-Breeze-74") over complex short words.',
      'Never write passwords on sticky notes or store them in plain-text notes applications.',
      'Check leak monitoring services periodically to see if your email appears in publicly compromised datasets.'
    ],
    keyTerms: [
      { term: 'Entropy', definition: 'The measure of unpredictability and randomness in a password, usually quantified in bits.' },
      { term: 'Credential Stuffing', definition: 'Automated cyberattacks where lists of breached username/password pairs are tested across hundreds of other sites.' },
      { term: 'Brute-Force Attack', definition: 'An attack that systematically tries all possible character combinations until finding the right one.' },
      { term: 'Passphrase', definition: 'A sequence of random words chained together, offering immense mathematical entropy while remaining humanly memorable.' }
    ],
    miniQuiz: [
      {
        question: 'Why is password length generally more effective than complex character substitutions like "P@ssw0rd"?',
        options: ['Short passwords use less memory', 'Length exponentially increases the total mathematical search space (entropy)', 'Hackers cannot read long sentences', 'Keyboards cannot type long passwords'],
        correctIndex: 1,
        explanation: 'Each added character exponentially expands the number of potential combinations, whereas simple substitutions like @ for a are already mapped by cracking rule engines.'
      },
      {
        question: 'What is "credential stuffing"?',
        options: ['Filling out forms too quickly', 'Using credentials leaked from one breach to automatically break into accounts on other platforms', 'Encrypting passwords in a database', 'A technique to generate random passwords'],
        correctIndex: 1,
        explanation: 'Credential stuffing relies on the human habit of password reuse to compromise multiple accounts from a single leaked breach.'
      },
      {
        question: 'What constitutes a strong passphrase?',
        options: ['Your pet’s name plus your birth year', 'A sequence of 4–5 randomized, unrelated words with numbers or separators', 'A 6-letter common dictionary word', 'The same password you have used for 5 years'],
        correctIndex: 1,
        explanation: 'Chaining multiple random, unrelated words yields high mathematical entropy while remaining easy to type and remember.'
      }
    ]
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering',
    summary: 'Psychological manipulation, authority impersonation, pretexting, and defensive skepticism.',
    readTime: '4 min',
    iconName: 'UserX',
    overview: 'Social engineering bypasses firewalls and encryption by targeting the human element. Rather than looking for a software vulnerability, the attacker exploits human emotions: trust, fear, helpfulness, greed, or curiosity. Common vectors include impersonating internal IT staff, pretending to be a senior corporate executive, or posing as a delivery driver needing door access.',
    realWorldScenario: {
      title: 'The Fake IT Desk Caller',
      narrative: 'An attacker called an employee at a telecommunications provider claiming to be from the internal corporate IT department. The caller stated that the employee’s workstation was generating abnormal network errors and requested their two-factor authentication push code to verify system logs. Wanting to be cooperative, the employee approved the push notification, allowing the attacker direct access to the corporate intranet.',
      lesson: 'Legitimate IT support will never ask you to read back a one-time 2FA code or approve a prompt over the phone. Always verify unexpected callers via official internal directory extensions.'
    },
    preventionRules: [
      'Practice healthy skepticism whenever someone requests sensitive data, access codes, or wire transfers.',
      'Establish out-of-band verification procedures (call back on a verified phone number before taking action).',
      'Never plug found USB drives into your computer ("baiting").',
      'Do not allow unknown people to follow you through secured badge-access doors ("tailgating").'
    ],
    keyTerms: [
      { term: 'Pretexting', definition: 'Inventing a fabricated scenario (the pretext) to manipulate a victim into releasing information or performing an action.' },
      { term: 'Baiting', definition: 'Leaving an infected physical media (like a malware-loaded USB stick) in a public place hoping someone will plug it in.' },
      { term: 'Tailgating', definition: 'Following an authorized person through a secured physical door or turnstile without scanning credentials.' },
      { term: 'Out-of-band Verification', definition: 'Confirming a request using a separate, independent communication channel (e.g., calling someone on their known phone after receiving an email).' }
    ],
    miniQuiz: [
      {
        question: 'If you find a labeled USB drive in a parking lot, what is the safest response?',
        options: ['Plug it into your computer to see who owns it', 'Hand it to your security/facilities department without plugging it into any device', 'Format it so you can keep the free storage', 'Open the files in safe mode'],
        correctIndex: 1,
        explanation: 'USB drops are a classic baiting tactic; infected drives can execute malicious firmware or deliver keyloggers immediately upon insertion.'
      },
      {
        question: 'What is "pretexting"?',
        options: ['Sending text messages before a phone call', 'Creating a plausible fake scenario to trick someone into revealing sensitive information', 'Testing passwords in advance', 'Compressing text before encryption'],
        correctIndex: 1,
        explanation: 'Pretexting involves crafting a believable scenario or persona to gain the victim’s confidence.'
      },
      {
        question: 'Why is social engineering often considered the most dangerous attack vector?',
        options: ['It exploits human psychology rather than software code, bypassing technical security controls', 'It only works against old operating systems', 'It is easily stopped by standard antivirus', 'It cannot be performed over the phone'],
        correctIndex: 0,
        explanation: 'Technical defenses cannot prevent an attacker from succeeding if an authorized user is persuaded to willingly hand over credentials or access.'
      }
    ]
  },
  {
    id: 'malware-basics',
    title: 'Malware Basics',
    summary: 'Viruses, Trojans, Spyware, Rootkits, and how malicious code enters systems.',
    readTime: '5 min',
    iconName: 'Bug',
    overview: 'Malware (short for malicious software) is any code or program created intentionally to cause harm to a computer, server, client, or computer network. Common classifications include Viruses (which attach to clean files and replicate), Worms (which self-spread across networks without human intervention), Trojans (which disguise themselves as legitimate utilities), Spyware (which silently logs keystrokes and data), and Info-Stealers (specialized tools targeting browser saved passwords and crypto wallets).',
    realWorldScenario: {
      title: 'The "Free Video Game Cheat" Trojan',
      narrative: 'A teenager downloaded an unofficial game mod package called "MegaCheat_v2.exe" from a gaming forum. Upon running the installer, nothing seemed to happen. In the background, an info-stealer trojan extracted session cookies, Discord tokens, and saved passwords from Chrome, transmitting them to a remote command-and-control server.',
      lesson: 'Pirated software, cracked license generators, and unofficial cheats are primary distribution vectors for modern info-stealers.'
    },
    preventionRules: [
      'Only download software, drivers, and games from verified, official marketplaces and developer websites.',
      'Maintain an active, reputable antivirus/endpoint detection solution with real-time file scanning enabled.',
      'Do not enable macros in downloaded Microsoft Office documents or run scripts from untrusted attachments.',
      'Regularly review the list of installed applications and startup items on your computer.'
    ],
    keyTerms: [
      { term: 'Trojan', definition: 'Malware disguised as legitimate or useful software that conceals a destructive hidden payload.' },
      { term: 'Spyware', definition: 'Software that covertly monitors user behavior, keystrokes, and personal data and transmits it to unauthorized third parties.' },
      { term: 'Keylogger', definition: 'A surveillance tool that records every keystroke made on a keyboard to capture passwords and messages.' },
      { term: 'Zero-Day', definition: 'A software vulnerability that is actively exploited before the developer has released a patch.' }
    ],
    miniQuiz: [
      {
        question: 'What distinguishes a Trojan from other types of malware?',
        options: ['It is made by Greek developers', 'It disguises itself as legitimate or harmless software to trick users into running it', 'It cannot run on Windows', 'It only deletes images'],
        correctIndex: 1,
        explanation: 'Just like the ancient Trojan Horse, trojan malware hides malicious functionality inside what appears to be a useful program.'
      },
      {
        question: 'What does an info-stealer primarily target on a victim’s computer?',
        options: ['Physical monitor resolution', 'Browser saved passwords, session cookies, and digital wallet data', 'Desktop wallpaper files', 'CPU cooling fan speeds'],
        correctIndex: 1,
        explanation: 'Info-stealers specifically scan browser profile folders to harvest cached session tokens and plaintext credentials.'
      },
      {
        question: 'What is a "zero-day" vulnerability?',
        options: ['A bug discovered 0 days before the computer was manufactured', 'A flaw that is unknown to the vendor or has zero days of protection/patch available', 'A virus that takes 0 days to delete', 'A free software trial'],
        correctIndex: 1,
        explanation: 'A zero-day refers to a vulnerability that attackers can exploit because the vendor has had "zero days" to release an official fix.'
      }
    ]
  },
  {
    id: 'ransomware-awareness',
    title: 'Ransomware Awareness & Backup Strategies',
    summary: 'How extortion malware works, the 3-2-1 backup rule, and incident response.',
    readTime: '5 min',
    iconName: 'Lock',
    overview: 'Ransomware is an extortion-based malware that encrypts files on a device or network, making them inaccessible. The attackers then demand a cryptocurrency ransom in exchange for a decryption key. Modern ransomware groups often employ "double extortion": they exfiltrate sensitive files before encrypting them, threatening to leak the confidential documents publicly if the ransom is not paid.',
    realWorldScenario: {
      title: 'The Hospital Lockdown',
      narrative: 'A regional healthcare system was infected with ransomware through an unpatched VPN appliance. Within hours, the malware encrypted patient electronic medical records, diagnostic lab systems, and scheduling databases. The attackers demanded $5 million. Because the hospital maintained verified offline immutable backups, they restored systems without paying the ransom.',
      lesson: 'Offline and immutable backups are the single most effective defense against ransomware extinction events.'
    },
    preventionRules: [
      'Implement the 3-2-1 Backup Rule: 3 copies of your data, on 2 different media types, with 1 copy stored offline or off-site.',
      'Ensure backup drives are disconnected from the network when not actively performing a backup.',
      'Never pay ransoms without expert guidance; payment does not guarantee decryption and funds future criminal operations.',
      'Restrict administrative privileges on daily-use computer accounts.'
    ],
    keyTerms: [
      { term: '3-2-1 Backup Rule', definition: 'Keep 3 total copies of critical files, on 2 different types of storage, with 1 copy completely isolated or off-site.' },
      { term: 'Double Extortion', definition: 'A ransomware tactic of both encrypting files and threatening to leak stolen proprietary data publicly.' },
      { term: 'Air-Gapped Backup', definition: 'A backup copy completely physically isolated from networks and computers, preventing malware access.' },
      { term: 'Decryption Key', definition: 'A cryptographic key required to unlock and restore files scrambled by symmetric or asymmetric encryption.' }
    ],
    miniQuiz: [
      {
        question: 'What does the "3-2-1" backup rule dictate?',
        options: ['3 backups per day, 2 on weekends, 1 on holidays', '3 total copies, 2 different storage media types, 1 stored off-site or offline', '3 files per folder, 2 folders per drive, 1 drive total', '3 cloud accounts, 2 passwords, 1 pin'],
        correctIndex: 1,
        explanation: 'The 3-2-1 rule is the industry gold standard: 3 copies of data on 2 different media, with at least 1 copy off-site or disconnected.'
      },
      {
        question: 'Why are offline (air-gapped) backups critical against ransomware?',
        options: ['They run faster', 'Ransomware cannot reach or encrypt storage that is physically disconnected from the network', 'They consume less electricity', 'They are exempt from data privacy laws'],
        correctIndex: 1,
        explanation: 'If a backup drive is unplugged in a safe or drawer, network-propagating ransomware cannot corrupt or encrypt it.'
      },
      {
        question: 'What is "double extortion" in modern ransomware operations?',
        options: ['Demanding payment in two different cryptocurrencies', 'Encrypting files and threatening to publish exfiltrated private data if unpaid', 'Demanding twice as much money as the original ransom', 'Attacking two companies at once'],
        correctIndex: 1,
        explanation: 'Double extortion pairs operational lockdown with public blackmail to pressure organizations with sensitive client data.'
      }
    ]
  },
  {
    id: 'network-security',
    title: 'Network Security & Wi-Fi Protection',
    summary: 'Securing home Wi-Fi routers, risks of public hotspots, WPA3, and VPN fundamentals.',
    readTime: '4 min',
    iconName: 'Wifi',
    overview: 'Networks are the pathways through which all digital communication travels. Unsecured Wi-Fi routers, open public networks, and legacy encryption protocols (like WEP or early WPA) leave devices exposed to eavesdropping, packet sniffing, and evil twin attacks. Ensuring your home network is properly configured with modern encryption (WPA3 or WPA2-AES) and separating guest devices significantly reduces your vulnerability footprint.',
    realWorldScenario: {
      title: 'The Coffee Shop "Evil Twin"',
      narrative: 'While waiting at a bustling airport terminal, Elena connected her laptop to an open Wi-Fi network named "Airport_Free_HighSpeed_WiFi". Unbeknownst to Elena, an attacker sitting nearby with a portable Wi-Fi pineapple device was broadcasting that fake hotspot name. The attacker intercepted all unencrypted network requests and DNS queries made by connected travelers.',
      lesson: 'Anyone can configure a rogue Wi-Fi router with any name they choose. Always verify official hotspot credentials and utilize a trusted VPN on untrusted public networks.'
    },
    preventionRules: [
      'Change the default administrative login credentials on your home Wi-Fi router immediately upon installation.',
      'Enable WPA3 encryption (or WPA2-AES) and disable legacy WPS (Wi-Fi Protected Setup).',
      'Disable remote management of your router over the WAN interface.',
      'Place smart home IoT devices (televisions, thermostats, cameras) on a dedicated Guest network isolated from your personal computers.'
    ],
    keyTerms: [
      { term: 'Evil Twin', definition: 'A rogue wireless access point masquerading as a legitimate hotspot to eavesdrop on connected users.' },
      { term: 'WPA3', definition: 'The latest Wi-Fi Protected Access protocol, providing robust encryption and protection against offline dictionary attacks.' },
      { term: 'VPN (Virtual Private Network)', definition: 'An encrypted tunnel between your device and a secure server, shielding your traffic from local network snooping.' },
      { term: 'DNS (Domain Name System)', definition: 'The internet directory service that translates human-readable names (e.g. google.com) into numerical IP addresses.' }
    ],
    miniQuiz: [
      {
        question: 'What is an "Evil Twin" Wi-Fi attack?',
        options: ['A computer virus with two identical copies', 'A rogue Wi-Fi access point set up with the same name as a legitimate hotspot to intercept traffic', 'A password shared between twins', 'Two routers in the same room'],
        correctIndex: 1,
        explanation: 'An Evil Twin mimics a known legitimate Wi-Fi network name to trick devices into connecting through the attacker’s equipment.'
      },
      {
        question: 'Why should you put IoT smart home devices on a separate guest network?',
        options: ['It makes Netflix stream faster', 'If an IoT gadget with weak firmware is hacked, the attacker cannot easily pivot into your personal laptops and phones', 'Smart devices do not support Wi-Fi passwords', 'It saves battery power'],
        correctIndex: 1,
        explanation: 'Network segmentation ensures compromised smart bulbs or cameras cannot freely access your workstations or network storage.'
      },
      {
        question: 'Which Wi-Fi security standard offers the strongest modern wireless protection?',
        options: ['WEP (Wired Equivalent Privacy)', 'WPA (Wi-Fi Protected Access 1)', 'WPA3', 'No password (Open Wi-Fi)'],
        correctIndex: 2,
        explanation: 'WPA3 is the current state-of-the-art wireless security protocol, offering strong cryptographic handshakes resistant to dictionary attacks.'
      }
    ]
  },
  {
    id: 'https-encryption',
    title: 'HTTPS and SSL/TLS',
    summary: 'How cryptographic handshakes protect data in transit, padlocks, and digital certificates.',
    readTime: '4 min',
    iconName: 'Globe',
    overview: 'When you browse the web, your computer communicates with web servers. Under unencrypted HTTP, every piece of information—login passwords, credit card numbers, search queries—is transmitted in plain, readable text. Any router, ISP, or actor along the physical line can read or modify the data. HTTPS (Hypertext Transfer Protocol Secure) solves this by wrapping traffic in Transport Layer Security (TLS) encryption.',
    realWorldScenario: {
      title: 'The Hotel Wi-Fi Form Hijack',
      narrative: 'A business traveler submitted an expense report on an internal company portal that only supported unencrypted HTTP. A malicious entity on the hotel network executed a man-in-the-middle packet capture, recording the traveler’s corporate username, password, and session cookie as plain ASCII text.',
      lesson: 'Never submit sensitive credentials over unencrypted HTTP. Modern browsers explicitly flag HTTP pages as "Not Secure".'
    },
    preventionRules: [
      'Enable "HTTPS-First" or "HTTPS-Only" mode in browser settings to automatically upgrade or warn about insecure connections.',
      'Remember: A green padlock or HTTPS confirms that the connection between you and the server is encrypted, NOT that the website owner is honest! Phishing websites can also have valid SSL certificates.',
      'Inspect certificate details if you see a security warning before ignoring browser warnings.',
      'Avoid entering personal data on pages displaying "Not Secure" warnings.'
    ],
    keyTerms: [
      { term: 'TLS (Transport Layer Security)', definition: 'The modern cryptographic protocol that provides privacy and data integrity between two communicating applications.' },
      { term: 'SSL Certificate', definition: 'A digital document binding a cryptographic public key to an organization or domain name, verified by a Certificate Authority.' },
      { term: 'Man-in-the-Middle (MITM)', definition: 'An attack where an adversary secretly relays and potentially alters communication between two parties who believe they are directly communicating.' },
      { term: 'Certificate Authority (CA)', definition: 'A trusted entity that issues digital certificates validating ownership of domain names.' }
    ],
    miniQuiz: [
      {
        question: 'Does the padlock icon (HTTPS) in your browser mean that a website is 100% trustworthy and safe from fraud?',
        options: ['Yes, only certified honest businesses can get HTTPS', 'No, HTTPS only means your connection is encrypted; phishing sites can also obtain free SSL certificates', 'Yes, it proves the website has no viruses', 'No, HTTPS is only used for government websites'],
        correctIndex: 1,
        explanation: 'HTTPS only encrypts the wire between you and the server. Phishing scammers easily configure free SSL certificates for their fraudulent domains.'
      },
      {
        question: 'What is the main danger of entering data on an unencrypted HTTP website?',
        options: ['The webpage loads too slowly', 'Anyone on the local network or internet route can intercept and read your passwords and data in plain text', 'The computer monitor can burn out', 'You cannot use a mouse on HTTP sites'],
        correctIndex: 1,
        explanation: 'HTTP traffic travels in unencrypted cleartext, enabling packet sniffing by ISPs, compromised routers, or local network eavesdroppers.'
      },
      {
        question: 'What replaced SSL as the modern standard for web encryption?',
        options: ['HTTP/2', 'TLS (Transport Layer Security)', 'FTP', 'DNSSEC'],
        correctIndex: 1,
        explanation: 'TLS succeeded SSL; though people still colloquially say "SSL certificate," the underlying protocol in use today is TLS.'
      }
    ]
  },
  {
    id: 'two-factor-auth',
    title: 'Two-Factor Authentication & Passkeys',
    summary: 'Something you know, something you have, something you are: MFA essentials and hardware keys.',
    readTime: '5 min',
    iconName: 'Fingerprint',
    overview: 'Two-Factor Authentication (2FA) and Multi-Factor Authentication (MFA) require a user to provide two or more verification factors to gain access to a resource. Even if an adversary steals your password through a data breach or phishing email, they cannot access your account without your secondary factor. Authentication factors fall into three categories: Something you know (password/PIN), Something you have (authenticator app, security key, mobile device), and Something you are (biometrics like fingerprints or facial recognition).',
    realWorldScenario: {
      title: 'The SIM Swap Disaster',
      narrative: 'A crypto investor used SMS-based 2FA for his digital exchange account. An attacker contacted the mobile telecom carrier pretending to be the victim, claiming his phone was lost, and tricked the support agent into transferring the phone number to a new SIM card under the attacker’s control. The attacker then requested a password reset on the exchange and intercepted the SMS verification code.',
      lesson: 'SMS-based 2FA is vulnerable to SIM swapping and SS7 interception. Time-based authenticator apps (TOTP) or FIDO2 hardware security keys provide far superior security.'
    },
    preventionRules: [
      'Enable 2FA on every account that supports it, starting with your primary email and financial services.',
      'Prioritize authenticator apps (e.g. Google Authenticator, Aegis, Bitwarden) or hardware keys (YubiKey) over SMS text codes.',
      'Securely save single-use backup recovery codes in an encrypted vault or printed offline safe location.',
      'Adopt FIDO2 Passkeys where available: passkeys are cryptographically bound to domain names and immune to phishing.'
    ],
    keyTerms: [
      { term: 'TOTP (Time-Based One-Time Password)', definition: 'A temporary 6-digit code generated locally on a device using a shared secret and the current timestamp.' },
      { term: 'FIDO2 / WebAuthn', definition: 'An open authentication standard using public-key cryptography to provide phishing-resistant, passwordless authentication.' },
      { term: 'SIM Swapping', definition: 'A fraudulent scheme where attackers trick a mobile carrier into porting a victim’s phone number to a criminal’s SIM card.' },
      { term: 'Passkey', definition: 'A digital credential bound to your device and biometric unlock that replaces passwords with asymmetric cryptographic pairs.' }
    ],
    miniQuiz: [
      {
        question: 'Why is an authenticator app (TOTP) safer than SMS text message verification for 2FA?',
        options: ['SMS is more expensive to send', 'SMS is vulnerable to SIM swapping attacks and cell network interception, whereas TOTP codes are generated locally', 'Authenticator apps do not need an internet connection to install', 'SMS codes only work on desktop computers'],
        correctIndex: 1,
        explanation: 'SIM swaps allow attackers to redirect SMS messages to their own devices, whereas TOTP secrets reside securely inside your local authenticator app.'
      },
      {
        question: 'What are the three fundamental authentication factor categories?',
        options: ['Length, Complexity, Age', 'Something you know, something you have, and something you are', 'Email, Phone number, Address', 'Browser, Operating system, IP address'],
        correctIndex: 1,
        explanation: 'Multi-factor authentication requires combining two or more distinct categories: knowledge, possession, and inherence (biometrics).'
      },
      {
        question: 'What makes modern FIDO2 Passkeys immune to traditional phishing websites?',
        options: ['They use longer passwords', 'The browser cryptographically binds the authentication response to the exact domain name in the address bar', 'They only work on Tuesdays', 'They require approval from a bank manager'],
        correctIndex: 1,
        explanation: 'Passkeys only answer challenges from the genuine domain origin; an attacker’s lookalike phishing domain cannot trigger a valid cryptographic response.'
      }
    ]
  },
  {
    id: 'data-privacy',
    title: 'Data Privacy & Digital Footprint',
    summary: 'Minimizing data exposure, metadata in photos, tracking cookies, and data broker removal.',
    readTime: '4 min',
    iconName: 'EyeOff',
    overview: 'Your digital footprint is the trail of data you create while using the internet: websites visited, emails sent, locations checked into, and information submitted to online forms. Data brokers aggregate this fragmented information into comprehensive dossiers to sell to marketers, advertisers, and sometimes unscrupulous actors. Protecting your privacy reduces your risk profile against identity theft, targeted spear phishing, and stalking.',
    realWorldScenario: {
      title: 'The Geotagged Vacation Photo',
      narrative: 'A homeowner posted a photo of new expensive home electronics on a public forum directly from her smartphone. The image file retained raw EXIF metadata containing exact GPS coordinates (latitude and longitude) pointing directly to her living room. Burglars checked the forum and targeted the home while she was away.',
      lesson: 'Camera photos often contain hidden EXIF metadata including exact geolocation coordinates and device models. Always scrub metadata before publishing files publicly.'
    },
    preventionRules: [
      'Turn off camera location geotagging in your smartphone settings or scrub EXIF metadata before sharing images.',
      'Use privacy-respecting search engines and configure browsers to block third-party cookies and fingerprinting.',
      'Review app permissions on mobile devices: revoke unnecessary access to location, contacts, microphone, and camera.',
      'Periodically submit opt-out and deletion requests to public data broker aggregators.'
    ],
    keyTerms: [
      { term: 'EXIF Data', definition: 'Exchangeable Image File Format metadata embedded in photos (GPS coordinates, timestamp, camera serial number).' },
      { term: 'Data Broker', definition: 'A business that collects personal information about consumers from public and commercial records and sells it to third parties.' },
      { term: 'Browser Fingerprinting', definition: 'A tracking technique that collects configuration details (screen resolution, installed fonts, GPU, plugins) to identify unique devices.' },
      { term: 'Digital Footprint', definition: 'The unique set of traceable digital activities, records, and communications left by a person on the internet.' }
    ],
    miniQuiz: [
      {
        question: 'What sensitive information can unscrubbed smartphone camera photos reveal in their EXIF metadata?',
        options: ['Exact GPS coordinates of where the photo was taken', 'The user’s banking password', 'The internet speed of the home', 'The phone’s battery health'],
        correctIndex: 0,
        explanation: 'Original photo files frequently store exact GPS coordinates, camera hardware identifiers, and exact timestamps in the EXIF header.'
      },
      {
        question: 'What is "browser fingerprinting"?',
        options: ['Using a physical fingerprint reader to unlock Chrome', 'A method of identifying individual web browsers by aggregating configuration quirks like fonts, screen size, and hardware', 'A way to clean dirty laptop screens', 'A browser extension for signing documents'],
        correctIndex: 1,
        explanation: 'Browser fingerprinting measures numerous subtle hardware and software parameters to track users across websites without using traditional cookies.'
      },
      {
        question: 'What is the most effective way to limit your digital footprint?',
        options: ['Never turning on a computer', 'Minimizing data sharing, practicing data hygiene, and revoking unnecessary app permissions', 'Using uppercase letters when typing', 'Changing your desktop background weekly'],
        correctIndex: 1,
        explanation: 'Proactively limiting what you share and revoking permissions across mobile apps and accounts drastically shrinks your exposed footprint.'
      }
    ]
  }
];
