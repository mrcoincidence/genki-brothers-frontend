// app/privacy/PrivacyClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import HeaderLogo from '../components/HeaderLogo';
import { useTheme } from '../components/ThemeProvider';

export default function PrivacyClient() {
  const [showHeader, setShowHeader] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'JP'>('EN');
  const { theme, toggleTheme } = useTheme();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 100) {
      setShowHeader(false);
      setMenuOpen(false);
    } else {
      setShowHeader(true);
    }
  });

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0a0a0c] dark:text-white transition-colors duration-500 relative overflow-x-hidden selection:bg-[#FFE100] selection:text-black">
      
      {/* Header */}
      <motion.header
        animate={{ y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 bg-transparent backdrop-blur-md transition-colors duration-500"
      >
        <a href="/" className="hover:opacity-70 transition block z-50">
          <HeaderLogo />
        </a>

        <nav
          className="hidden lg:flex items-center space-x-10 text-base tracking-wider font-medium text-zinc-600 dark:text-zinc-400 absolute left-1/2 -translate-x-1/2"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          <a href="/works" className="hover:text-[#FFE100] transition-colors">Works</a>
          <a href="/articles" className="hover:text-[#FFE100] transition-colors">Articles</a>
          <a href="/playground" className="hover:text-[#FFE100] transition-colors">Playground</a>
          <a href="/about" className="hover:text-[#FFE100] transition-colors">About</a>
        </nav>

        <div className="hidden lg:flex items-center space-x-6 z-50">
          <div className="flex items-center space-x-1.5 font-semibold text-base tracking-wider" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            <button
              onClick={() => setLang('JP')}
              className={`transition-all duration-300 pb-0.5 ${
                lang === 'JP'
                  ? 'text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              JP
            </button>
            <span className="text-zinc-300 dark:text-zinc-700 select-none">/</span>
            <button
              onClick={() => setLang('EN')}
              className={`transition-all duration-300 pb-0.5 ${
                lang === 'EN'
                  ? 'text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="px-5 py-2 border border-zinc-300 dark:border-zinc-800 rounded-full hover:border-[#FFE100] hover:bg-[#FFE100] hover:text-black transition-all duration-300 font-semibold text-base tracking-wider text-black dark:text-white"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden z-50 relative w-10 h-10 flex flex-col justify-center items-center space-y-1.5 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <span className={`w-6 h-[2px] bg-black dark:bg-white transition-all duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
          <span className={`w-6 h-[2px] bg-black dark:bg-white transition-all duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
        </button>
      </motion.header>

      {/* Mobile Overlay Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 dark:bg-[#0a0a0c]/95 backdrop-blur-2xl transition-all duration-500 ease-in-out lg:hidden flex flex-col justify-between px-8 pt-32 pb-12 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col space-y-6 text-base font-medium tracking-tight" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
          <a href="/works" onClick={() => setMenuOpen(false)} className="hover:text-[#FFE100] transition-colors">Works</a>
          <a href="/articles" onClick={() => setMenuOpen(false)} className="hover:text-[#FFE100] transition-colors">Articles</a>
          <a href="/playground" onClick={() => setMenuOpen(false)} className="hover:text-[#FFE100] transition-colors">Playground</a>
          <a href="/about" onClick={() => setMenuOpen(false)} className="hover:text-[#FFE100] transition-colors">About</a>
        </nav>

        <div className="space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-zinc-400" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Language</span>
            <div className="flex items-center space-x-2 font-semibold text-base tracking-wider" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              <button onClick={() => setLang('JP')} className={`pb-0.5 ${lang === 'JP' ? 'text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] font-bold' : 'text-zinc-400'}`}>JP</button>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <button onClick={() => setLang('EN')} className={`pb-0.5 ${lang === 'EN' ? 'text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] font-bold' : 'text-zinc-400'}`}>EN</button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-zinc-400" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Theme</span>
            <button onClick={toggleTheme} className="px-4 py-1.5 border border-zinc-300 dark:border-zinc-800 rounded-full font-semibold text-base tracking-wider text-black dark:text-white" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          <a href="https://genkibrothers.co" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="block w-full text-center py-4 bg-black text-white dark:bg-white dark:text-black font-semibold tracking-wider text-base rounded-[4px] shadow-lg" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            Book an Intro Call →
          </a>
        </div>
      </div>

      <article className="pt-36 pb-32 space-y-12 max-w-3xl mx-auto px-6 md:px-0 w-full">
        
        {/* Title Section */}
        <header className="space-y-4">
          <div className="text-left lg:text-center w-full">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              // LEGAL & TRANSPARENCY
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-medium tracking-tight text-black dark:text-white text-left lg:text-center"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            Privacy Policy
          </h1>

          <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pt-2 text-left">
            Your privacy is important to us. It is Genki Brothers&lsquo; policy to respect your privacy regarding any information we may collect from you across our website,{' '}
            <a 
              href="https://genkibrothers.co" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-black dark:text-[#FFE100] underline decoration-[#FFE100] decoration-2 underline-offset-4 hover:opacity-70 transition-opacity"
            >
              https://genkibrothers.co
            </a>
            , and other sites we own and operate.
          </p>
        </header>

        {/* Content Body */}
        <div className="space-y-10 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans text-left">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <h2
              className="text-2xl font-medium text-black dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              1. Information we collect
            </h2>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black dark:text-white">Log data</h3>
              <p>
                When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-semibold text-black dark:text-white">Device data</h3>
              <p>
                We may also collect data about the device you’re using to access our website. This data may include the device type, operating system, unique device identifiers, device settings, and geo-location data. What we collect can depend on the individual settings of your device and software. We recommend checking the policies of your device manufacturer or software provider to learn what information they make available to us.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-semibold text-black dark:text-white">Personal information</h3>
              <p>We may ask for personal information, such as your:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name</li>
                <li>Email</li>
                <li>Social media profiles</li>
                <li>Phone/mobile number</li>
                <li>Payment information</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2
              className="text-2xl font-medium text-black dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              2. Legal bases for processing
            </h2>
            <p>
              We will process your personal information lawfully, fairly and in a transparent manner. We collect and process information about you only where we have legal bases for doing so.
            </p>
            <p>
              These legal bases depend on the services you use and how you use them, meaning we collect and use your information only where:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                it’s necessary for the performance of a contract to which you are a party or to take steps at your request before entering into such a contract (for example, when we provide a service you request from us);
              </li>
              <li>
                it satisfies a legitimate interest (which is not overridden by your data protection interests), such as for research and development, to market and promote our services, and to protect our legal rights and interests;
              </li>
              <li>
                you give us consent to do so for a specific purpose (for example, you might consent to us sending you our newsletter); or
              </li>
              <li>we need to process your data to comply with a legal obligation.</li>
            </ul>
            <p className="pt-2">
              Where you consent to our use of information about you for a specific purpose, you have the right to change your mind at any time (but this will not affect any processing that has already taken place).
            </p>
            <p>
              We don’t keep personal information for longer than is necessary. While we retain this information, we will protect it within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification. That said, we advise that no method of electronic transmission or storage is 100% secure and cannot guarantee absolute data security. If necessary, we may retain your personal information for our compliance with a legal obligation or in order to protect your vital interests or the vital interests of another natural person.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2
              className="text-2xl font-medium text-black dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              3. Collection and use of information
            </h2>
            <p>
              We may collect, hold, use and disclose information for the following purposes and personal information will not be further processed in a manner that is incompatible with these purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>to enable you to customize or personalize your experience of our website;</li>
              <li>to enable you to access and use our website, associated applications and associated social media platforms;</li>
              <li>to contact and communicate with you;</li>
              <li>for internal record keeping and administrative purposes; and</li>
              <li>
                for analytics, market research and business development, including to operate and improve our website, associated applications and associated social media platforms.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2
              className="text-2xl font-medium text-black dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              4. Disclosure of personal information to third parties
            </h2>
            <p>We may disclose personal information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                third party service providers for the purpose of enabling them to provide their services, including (without limitation) IT service providers, data storage, hosting and server providers, ad networks, analytics, error loggers, debt collectors, maintenance or problem-solving providers, marketing or advertising providers, professional advisors and payment systems operators; and
              </li>
              <li>third parties to collect and process data.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2
              className="text-2xl font-medium text-black dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              5. International transfers of personal information
            </h2>
            <p>
              The personal information we collect is stored and processed where we or our partners, affiliates and third-party providers maintain facilities. By providing us with your personal information, you consent to the disclosure to these overseas third parties.
            </p>
            <p>
              We will ensure that any transfer of personal information from countries in the European Economic Area (EEA) to countries outside the EEA will be protected by appropriate safeguards, for example by using standard data protection clauses approved by the European Commission, or the use of binding corporate rules or other legally accepted means.
            </p>
            <p>
              Where we transfer personal information from a non-EEA country to another country, you acknowledge that third parties in other jurisdictions may not be subject to similar data protection laws to the ones in our jurisdiction. There are risks if any such third party engages in any act or practice that would contravene the data privacy laws in our jurisdiction and this might mean that you will not be able to seek redress under our jurisdiction’s privacy laws.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2
              className="text-2xl font-medium text-black dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              6. Your rights and controlling your personal information
            </h2>
            
            <div className="space-y-2">
              <p>
                <strong>Choice and consent:</strong> By providing personal information to us, you consent to us collecting, holding, using and disclosing your personal information in accordance with this privacy policy. If you are under 16 years of age, you must have, and warrant to the extent permitted by law to us, that you have your parent or legal guardian’s permission to access and use the website and they (your parents or guardian) have consented to you providing us with your personal information. You do not have to provide personal information to us, however, if you do not, it may affect your use of this website or the products and/or services offered on or through it.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Information from third parties:</strong> If we receive personal information about you from a third party, we will protect it as set out in this privacy policy. If you are a third party providing personal information about somebody else, you represent and warrant that you have such person’s consent to provide the personal information to us.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Restrict:</strong> You may choose to restrict the collection or use of your personal information. If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by contacting us using the details below. If you ask us to restrict or limit how we process your personal information, we will let you know how the restriction affects your use of our website or products and services.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Access and data portability:</strong> You may request details of the personal information that we hold about you. You may request a copy of the personal information we hold about you. Where possible, we will provide this information in CSV format or other easily readable machine formats. You may request that we erase the personal information we hold about you at any time. You may also request that we transfer this personal information to another third party.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Correction:</strong> If you believe that any information we hold about you is inaccurate, out of date, incomplete, irrelevant or misleading, please contact us using the details below. We will take reasonable steps to correct any information found to be inaccurate, incomplete, misleading or out of date.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Notification of data breaches:</strong> We will comply laws applicable to us in respect of any data breach.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Complaints:</strong> If you believe that we have breached a relevant data protection law and wish to make a complaint, please contact us using the details below and provide us with full details of the alleged breach. We will promptly investigate your complaint and respond to you, in writing, setting out the outcome of our investigation and the steps we will take to deal with your complaint. You also have the right to contact a regulatory body or data protection authority in relation to your complaint.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Unsubscribe:</strong> To unsubscribe from our e-mail database or opt-out of communications (including marketing communications), please contact us using the details below or opt-out using the opt-out facilities provided in the communication.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2
              className="text-2xl font-medium text-black dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              7. Cookies
            </h2>
            <p>
              We use “cookies” to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit, so we can understand how you use our site. This helps us serve you content based on preferences you have specified. Please refer to our Cookie Policy for more information.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2
              className="text-2xl font-medium text-black dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              8. Business transfers
            </h2>
            <p>
              If we or our assets are acquired, or in the unlikely event that we go out of business or enter bankruptcy, we would include data among the assets transferred to any parties who acquire us. You acknowledge that such transfers may occur, and that any parties who acquire us may continue to use your personal information according to this policy.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2
              className="text-2xl font-medium text-black dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              9. Limits of our policy
            </h2>
            <p>
              Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and policies of those sites, and cannot accept responsibility or liability for their respective privacy practices.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2
              className="text-2xl font-medium text-black dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              10. Changes to this policy
            </h2>
            <p>
              At our discretion, we may change our privacy policy to reflect current acceptable practices. We will take reasonable steps to let users know about changes via our website. Your continued use of this site after any changes to this policy will be regarded as acceptance of our practices around privacy and personal information.
            </p>
            <p>
              If we make a significant change to this privacy policy, for example changing a lawful basis on which we process your personal information, we will ask you to re-consent to the amended privacy policy.
            </p>
          </section>

          {/* Data Controller Footer Section */}
          <section className="pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <h3
              className="text-lg font-semibold text-black dark:text-white"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              Genki Brothers Data Controller
            </h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">Yoshinori Kawamura</p>
            <p className="text-sm font-mono text-zinc-500">Bornholmerstr 1, 10439, Berlin, Germany</p>
          </section>

        </div>

      </article>

      {/* Footer (Updated with link and LinkedIn) */}
      <footer
        className="px-8 md:px-16 py-12 text-xs text-zinc-500 font-medium flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 text-center"
        style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
      >
        <span>
          © 2026{' '}
          <a
            href="https://genkibrothers.co"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 dark:hover:text-zinc-300 transition-colors"
          >
            Genki Brothers
          </a>
        </span>
        <span className="hidden md:inline text-zinc-700 dark:text-zinc-800">•</span>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-zinc-300 transition-colors capitalize">
            Privacy Policy
          </a>
          <span className="text-zinc-700 dark:text-zinc-800">•</span>
          <a
            href="https://www.linkedin.com/in/yoshinori-kawamura/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors capitalize"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}