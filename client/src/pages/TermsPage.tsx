import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MioraLogo } from '../components/common/MioraLogo';
import {
  Shield,
  FileText,
  ChevronLeft,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Sparkles,
  Lock,
  Coins,
  CreditCard,
  UserCheck,
  Scale,
  Mail,
  Search,
  Printer,
  ExternalLink,
  Info
} from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'section-1',
      num: '1',
      title: 'ELIGIBILITY',
      icon: <UserCheck size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            MIORA is intended only for individuals who are at least 18 years of age.
          </p>
          <p style={{ marginBottom: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>
            By creating an account, you represent and warrant that:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>You are at least 18 years old.</li>
            <li>You are legally capable of entering into these Terms.</li>
            <li>You are not prohibited by applicable law from using the Service.</li>
            <li>The information you provide about yourself is substantially accurate and not intentionally misleading.</li>
            <li>You will use MIORA only for lawful purposes.</li>
          </ul>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#991B1B',
              fontSize: '0.88rem',
              fontWeight: 600,
              lineHeight: 1.6
            }}
          >
            ⚠️ <strong>Strict Age Requirement:</strong> Users under 18 are strictly prohibited from creating or using a MIORA account. MIORA may suspend or terminate accounts where we reasonably believe the eligibility requirements have been violated.
          </div>
        </>
      )
    },
    {
      id: 'section-2',
      num: '2',
      title: 'USER ACCOUNTS',
      icon: <Lock size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            Certain MIORA features require an account. You are responsible for:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Providing accurate account information.</li>
            <li>Maintaining the security of your account.</li>
            <li>Protecting your login credentials.</li>
            <li>Activities performed through your account.</li>
            <li>Informing MIORA if you believe your account has been compromised.</li>
          </ul>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            You must not impersonate another individual or create deceptive or fraudulent accounts.
          </p>
        </>
      )
    },
    {
      id: 'section-3',
      num: '3',
      title: 'DATING AND MATCHING SERVICES',
      icon: <Heart size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            MIORA provides tools that allow users to discover profiles, express interest, match and communicate.
          </p>
          <p style={{ marginBottom: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>
            MIORA does not guarantee:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>That you will receive matches.</li>
            <li>That another user will respond.</li>
            <li>That profile information supplied by another user is accurate.</li>
            <li>Compatibility between users.</li>
            <li>The identity, intentions, behaviour or background of another user.</li>
            <li>That an online interaction will result in a successful relationship or offline meeting.</li>
          </ul>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Matching scores, recommendations, compatibility indicators and similar features are intended as discovery tools and should not be treated as guarantees. Users are responsible for exercising appropriate judgment when interacting with other users.
          </p>
        </>
      )
    },
    {
      id: 'section-4',
      num: '4',
      title: 'USER SAFETY',
      icon: <Shield size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            Users should exercise reasonable caution when communicating with or meeting people through MIORA.
          </p>
          <p style={{ marginBottom: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>
            You should not:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Send money to people you do not trust.</li>
            <li>Share passwords, OTPs or financial credentials.</li>
            <li>Share highly sensitive personal information unnecessarily.</li>
            <li>Meet someone in an unsafe or isolated location without appropriate precautions.</li>
          </ul>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            For initial in-person meetings, users are encouraged to choose public locations and inform someone they trust about their plans.
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--text-muted)' }}>
            MIORA provides reporting and blocking tools where available, but these tools cannot eliminate every risk associated with interacting with other people.
          </p>
        </>
      )
    },
    {
      id: 'section-5',
      num: '5',
      title: 'ACCEPTABLE USE',
      icon: <Scale size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>
            You agree not to use MIORA to:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Harass, threaten or intimidate others.</li>
            <li>Stalk another person.</li>
            <li>Engage in hate speech.</li>
            <li>Promote violence.</li>
            <li>Exploit or endanger minors.</li>
            <li>Engage in fraudulent or deceptive activity.</li>
            <li>Impersonate another person.</li>
            <li>Spam users.</li>
            <li>Distribute malware or malicious code.</li>
            <li>Attempt unauthorized access to accounts or systems.</li>
            <li>Scrape or automatically collect user information without authorization.</li>
            <li>Manipulate MIORA’s payment or virtual currency systems.</li>
            <li>Circumvent account restrictions.</li>
            <li>Create accounts for unlawful purposes.</li>
            <li>Promote illegal goods, services or activities.</li>
          </ul>
          <p style={{ lineHeight: 1.7, color: 'var(--berry-primary)', fontWeight: 600 }}>
            Violation of these rules may result in content removal, restrictions, suspension or account termination.
          </p>
        </>
      )
    },
    {
      id: 'section-6',
      num: '6',
      title: 'USER-GENERATED CONTENT',
      icon: <FileText size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            MIORA may allow users to publish or share: Photos, Profile information, Bios, Posts, Stories, Status updates, Comments, Messages, and other content.
          </p>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            You retain ownership of content you create, subject to the rights necessary for MIORA to operate the Service. By uploading content to MIORA, you grant MIORA a non-exclusive, worldwide, royalty-free licence to host, store, reproduce, display, process and distribute that content only as reasonably necessary to operate, provide, secure, moderate and improve the Service, subject to applicable law and our Privacy Policy.
          </p>
          <p style={{ marginBottom: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>
            You represent that you have the necessary rights to content you upload. You must not upload content that:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Violates another person’s intellectual property rights.</li>
            <li>Violates another person’s privacy.</li>
            <li>Contains illegal material.</li>
            <li>Contains non-consensual intimate material.</li>
            <li>Exploits minors.</li>
            <li>Contains malicious software.</li>
            <li>Is fraudulent or deliberately deceptive.</li>
            <li>Otherwise violates these Terms.</li>
          </ul>
        </>
      )
    },
    {
      id: 'section-7',
      num: '7',
      title: 'CONTENT MODERATION',
      icon: <Shield size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            MIORA may investigate reports and take appropriate action where content or behaviour violates these Terms, our policies or applicable law. Actions may include:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Removing content.</li>
            <li>Limiting features.</li>
            <li>Issuing warnings.</li>
            <li>Temporarily suspending accounts.</li>
            <li>Permanently terminating accounts.</li>
            <li>Preserving or disclosing information where legally required.</li>
          </ul>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Moderation decisions may involve automated systems and/or human review where appropriate.
          </p>
        </>
      )
    },
    {
      id: 'section-8',
      num: '8',
      title: 'REPORTING AND BLOCKING',
      icon: <AlertTriangle size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            Users may be able to report Profiles, Posts, Comments, Messages, Stories, and other inappropriate activity. Users may also block other users.
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Knowingly submitting false, abusive or malicious reports may itself violate these Terms.
          </p>
        </>
      )
    },
    {
      id: 'section-9',
      num: '9',
      title: 'PRIVATE COMMUNICATIONS',
      icon: <Lock size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            MIORA may provide direct messaging and other communication features. Users are responsible for the content they send.
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            MIORA does not represent that private communications will be routinely reviewed by administrators. However, MIORA may process or review reported content, investigate abuse, protect users, prevent fraud, comply with legal obligations, or enforce these Terms where permitted by applicable law.
          </p>
        </>
      )
    },
    {
      id: 'section-10',
      num: '10',
      title: 'VIRTUAL COINS AND DIGITAL FEATURES',
      icon: <Coins size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            MIORA may provide virtual coins or other digital items that can be used for eligible features within the Platform.
          </p>
          <p style={{ marginBottom: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>
            MIORA Coins:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Are virtual items for use within MIORA.</li>
            <li>Are not legal tender.</li>
            <li>Are not bank deposits.</li>
            <li>Have no cash value outside MIORA.</li>
            <li>Cannot be transferred between users unless MIORA expressly provides such functionality.</li>
            <li>Cannot ordinarily be exchanged for cash.</li>
          </ul>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            MIORA may modify the availability, pricing or use of virtual features, subject to applicable law and any applicable app-store requirements.
          </p>
        </>
      )
    },
    {
      id: 'section-11',
      num: '11',
      title: 'PAYMENTS',
      icon: <CreditCard size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            Payments may be processed through third-party payment providers or application-store payment systems.
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>For web transactions, MIORA may use payment providers such as Razorpay.</li>
            <li>Android and iOS purchases may use payment mechanisms required or permitted by the applicable application marketplace.</li>
            <li>MIORA does not directly store complete card details where payments are processed by third-party payment providers.</li>
          </ul>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Users are responsible for providing valid payment information and authorizing legitimate transactions.
          </p>
        </>
      )
    },
    {
      id: 'section-12',
      num: '12',
      title: 'REFUNDS',
      icon: <Scale size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            Purchases of virtual items and digital features may be non-refundable once successfully delivered or consumed, except where:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Required by applicable law.</li>
            <li>Required by the applicable app store.</li>
            <li>A duplicate or erroneous transaction occurred.</li>
            <li>MIORA determines that a refund is otherwise appropriate.</li>
          </ul>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            For purchases made through Google Play or Apple’s App Store, applicable store billing and refund rules may also apply. Nothing in this section is intended to remove any mandatory consumer rights.
          </p>
        </>
      )
    },
    {
      id: 'section-13',
      num: '13',
      title: 'ACCOUNT SUSPENSION AND TERMINATION',
      icon: <AlertTriangle size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            MIORA may restrict, suspend or terminate accounts for reasons including:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Violation of these Terms.</li>
            <li>Fraud.</li>
            <li>Harassment.</li>
            <li>Safety concerns.</li>
            <li>Illegal activity.</li>
            <li>Payment abuse.</li>
            <li>Repeated policy violations.</li>
            <li>Attempts to compromise MIORA systems.</li>
          </ul>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Where appropriate and legally required, users may be provided with information or mechanisms concerning enforcement decisions.
          </p>
        </>
      )
    },
    {
      id: 'section-14',
      num: '14',
      title: 'ACCOUNT DELETION',
      icon: <UserCheck size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            Users may request or initiate deletion of their MIORA account through the functionality provided by MIORA in Settings.
          </p>
          <p style={{ marginBottom: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Account deletion may result in deletion or anonymisation of associated information, subject to:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Legal obligations.</li>
            <li>Fraud prevention.</li>
            <li>Security requirements.</li>
            <li>Transaction and accounting requirements.</li>
            <li>Legitimate dispute handling.</li>
            <li>Other retention requirements described in our Privacy Policy.</li>
          </ul>
        </>
      )
    },
    {
      id: 'section-15',
      num: '15',
      title: 'INTELLECTUAL PROPERTY',
      icon: <Sparkles size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            MIORA’s name, branding, logos, interface elements, software, designs and other proprietary materials are owned by MIORA or its applicable licensors.
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            You may not copy, reproduce, distribute, reverse engineer or commercially exploit MIORA proprietary materials except where permitted by law or expressly authorized.
          </p>
        </>
      )
    },
    {
      id: 'section-16',
      num: '16',
      title: 'THIRD-PARTY SERVICES',
      icon: <ExternalLink size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            MIORA may rely on third-party services such as Firebase, Payment processors (e.g. Razorpay), Cloud hosting providers, Google Play, and Apple App Store.
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Those services may be governed by their own terms and privacy policies. MIORA is not responsible for third-party services beyond the extent required by applicable law.
          </p>
        </>
      )
    },
    {
      id: 'section-17',
      num: '17',
      title: 'SERVICE AVAILABILITY',
      icon: <Info size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            We aim to provide a reliable Service but do not guarantee uninterrupted or error-free availability. MIORA may temporarily become unavailable because of: Maintenance, Technical failures, Security incidents, Network problems, Third-party service failures, or Events beyond reasonable control.
          </p>
        </>
      )
    },
    {
      id: 'section-18',
      num: '18',
      title: 'DISCLAIMER',
      icon: <Scale size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            To the extent permitted by applicable law, MIORA is provided on an &quot;as available&quot; basis. MIORA is a platform that facilitates discovery and communication between users.
          </p>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            MIORA does not guarantee the conduct, identity, compatibility, intentions or accuracy of information provided by individual users.
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--text-muted)' }}>
            Nothing in these Terms excludes rights or protections that cannot lawfully be excluded.
          </p>
        </>
      )
    },
    {
      id: 'section-19',
      num: '19',
      title: 'LIMITATION OF LIABILITY',
      icon: <Scale size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            To the extent permitted by applicable law, MIORA and its operators will not be liable for indirect, incidental, special or consequential losses arising solely from use of the Service.
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            This limitation does not apply where liability cannot legally be limited or excluded.
          </p>
        </>
      )
    },
    {
      id: 'section-20',
      num: '20',
      title: 'PRIVACY',
      icon: <Lock size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            Your use of MIORA is also governed by our Privacy Policy. The Privacy Policy explains information collected, reasons for collection, usage, storage, security, sharing, deletion, user rights, data retention, and contact channels.
          </p>
          <div style={{ marginTop: '14px' }}>
            <button
              onClick={() => setCurrentView('privacy')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--surface-white)',
                border: '1.5px solid var(--border-gold)',
                color: 'var(--berry-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.86rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <span>Read Full Privacy Policy →</span>
            </button>
          </div>
        </>
      )
    },
    {
      id: 'section-21',
      num: '21',
      title: 'CHANGES TO THESE TERMS',
      icon: <FileText size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            MIORA may update these Terms from time to time. Where required, users will be notified of material changes.
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            The current version and effective date will remain accessible within the Platform. Continued use after an update will be handled in accordance with applicable law and consent requirements.
          </p>
        </>
      )
    },
    {
      id: 'section-22',
      num: '22',
      title: 'GOVERNING LAW AND DISPUTES',
      icon: <Scale size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
            These Terms are governed by the applicable laws of India, subject to any mandatory consumer or other legal protections.
          </p>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gold-gradient-subtle)',
              border: '1px dashed var(--border-gold)',
              fontSize: '0.82rem',
              color: 'var(--gold-deep)',
              lineHeight: 1.6
            }}
          >
            📌 <em>Notice: Legal entity details, specific dispute resolution forum, and registered address will be finalized upon formal corporate registration.</em>
          </div>
        </>
      )
    },
    {
      id: 'section-23',
      num: '23',
      title: 'CONTACT',
      icon: <Mail size={18} color="var(--berry-primary)" />,
      content: (
        <>
          <p style={{ marginBottom: '14px', lineHeight: 1.7 }}>
            For questions regarding these Terms, users may contact:
          </p>
          <div
            style={{
              padding: '18px 20px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-white)',
              border: '1.5px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              MIORA Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem' }}>
              <div>
                <strong>Email:</strong>{' '}
                <span style={{ color: 'var(--berry-primary)', fontFamily: 'monospace', background: 'var(--bg-soft-blush)', padding: '2px 6px', borderRadius: '4px' }}>
                  [INSERT OFFICIAL SUPPORT EMAIL]
                </span>
              </div>
              <div>
                <strong>Legal Entity:</strong>{' '}
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', background: 'var(--bg-soft-blush)', padding: '2px 6px', borderRadius: '4px' }}>
                  [INSERT LEGAL ENTITY NAME]
                </span>
              </div>
              <div>
                <strong>Address:</strong>{' '}
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', background: 'var(--bg-soft-blush)', padding: '2px 6px', borderRadius: '4px' }}>
                  [INSERT BUSINESS/REGISTERED ADDRESS IF REQUIRED]
                </span>
              </div>
            </div>
          </div>
        </>
      )
    }
  ];

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.num.includes(searchQuery)
      )
    : sections;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        padding: 'clamp(16px, 3vw, 32px) 0 60px 0',
        animation: 'fadeIn 0.3s ease-out forwards',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header Navigation */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <button
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              setCurrentView('discover');
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--surface-white)',
            border: '1.5px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--berry-primary)';
            e.currentTarget.style.color = 'var(--berry-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--surface-white)',
              border: '1.5px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <Printer size={14} />
            <span>Print Document</span>
          </button>

          <button
            onClick={() => setCurrentView('privacy')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--surface-white)',
              border: '1.5px solid var(--border-gold)',
              color: 'var(--berry-primary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <Shield size={14} color="var(--gold-deep)" />
            <span>Privacy Policy →</span>
          </button>
        </div>
      </div>

      {/* Main Document Content Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 24px)',
          boxSizing: 'border-box'
        }}
      >
        {/* Document Header Hero Card */}
        <div
          className="card-luxury"
          style={{
            padding: 'clamp(24px, 4vw, 36px)',
            marginBottom: '28px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 242, 244, 0.85) 100%)',
            border: '1.5px solid var(--border-gold)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <MioraLogo size={42} showTagline={false} showWordmark={true} />
            <div style={{ height: '24px', width: '1px', background: 'var(--border-subtle)', margin: '0 4px' }} />
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--gold-deep)',
                background: 'rgba(212, 175, 55, 0.12)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-gold)'
              }}
            >
              Legal Agreement
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              margin: '0 0 10px 0'
            }}
          >
            Terms & Conditions
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Last Updated:
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.84rem',
                color: 'var(--berry-primary)',
                background: 'var(--bg-soft-blush)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 700
              }}
            >
              [INSERT DATE]
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Version 1.0 (Official Document)
            </span>
          </div>

          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Welcome to MIORA. These Terms & Conditions (&quot;Terms&quot;) govern your access to and use of the MIORA website, mobile applications, services, features and related platforms (&quot;MIORA&quot;, &quot;Platform&quot;, &quot;Service&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;).
          </p>

          <div
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.88rem',
              color: 'var(--text-primary)',
              lineHeight: 1.6
            }}
          >
            <strong>Agreement to Terms:</strong> By creating an account, accessing, or using MIORA, you acknowledge that you have read, understood and agreed to these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use MIORA.
          </div>
        </div>

        {/* Quick Search & Table of Contents Carousel */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--surface-white)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: 'var(--radius-pill)',
              padding: '10px 18px',
              boxShadow: 'var(--shadow-xs)',
              marginBottom: '14px'
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search legal clauses (e.g. Refunds, Safety, Coins, Account Deletion)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '0.88rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Horizontal Quick Jump Pills */}
          <div
            className="scroll-touch-x"
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              padding: '4px 2px 8px 2px',
              whiteSpace: 'nowrap'
            }}
          >
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  textDecoration: 'none',
                  flexShrink: 0,
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--surface-white)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--berry-primary)';
                  e.currentTarget.style.color = 'var(--berry-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {s.num}. {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Section Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredSections.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="card-luxury"
              style={{
                padding: 'clamp(20px, 3.5vw, 28px)',
                scrollMarginTop: '90px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--surface-white)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '14px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--bg-soft-blush)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {section.icon}
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.015em',
                    margin: 0
                  }}
                >
                  {section.num}. {section.title}
                </h2>
              </div>

              <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                {section.content}
              </div>
            </article>
          ))}
        </div>

        {/* Document Footer */}
        <div
          style={{
            marginTop: '36px',
            padding: '24px',
            textAlign: 'center',
            background: 'var(--surface-white)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border-gold)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Heart size={24} color="var(--berry-primary)" fill="var(--rose-petal)" style={{ margin: '0 auto 10px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            MIORA — Meet. Match. Belong.
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
            Built with care for genuine, respectful, and safe human connections.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentView('signup')}
              style={{
                padding: '9px 20px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              Continue to Registration
            </button>
            <button
              onClick={() => setCurrentView('discover')}
              style={{
                padding: '9px 20px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--surface-white)',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--border-subtle)',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              Back to Discover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
