// app/about/AboutClient.tsx
'use client';

import { useLanguage } from '../components/LanguageContext';

export default function AboutClient() {
  const { lang } = useLanguage();

  const titleFont = lang === 'JP' ? 'var(--font-biz-udpgothic), sans-serif' : 'var(--font-outfit), sans-serif';
  const bodyFont = lang === 'JP' ? 'var(--font-zen-kaku), sans-serif' : 'var(--font-inter), sans-serif';

  const expertise = [
    {
      category: lang === 'JP' ? 'Strategy & Vision' : 'Strategy & Vision',
      items: [
        'Brand Architecture',
        'Digital Strategy',
        'UX/UI Strategy',
        'Product Design',
        'Design Systems',
      ],
    },
    {
      category: lang === 'JP' ? 'Creative & Craft' : 'Creative & Craft',
      items: [
        'Creative Direction',
        'Art Direction',
        'Content Strategy',
        'Sound Design',
        'Music',
      ],
    },
    {
      category: lang === 'JP' ? 'Tech & Engineering' : 'Tech & Engineering',
      items: [
        'Frontend Architecture',
        'Emerging Tech Integration',
        'Interactive Prototypes',
        'Scalable Web Apps',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0a0a0c] dark:text-white transition-colors duration-500 pt-36 pb-32">
      <article className="max-w-5xl mx-auto px-8 md:px-16 space-y-24 md:space-y-36">
        
        {/* 1. Header & Lead */}
        <section className="space-y-6 text-left lg:text-center max-w-4xl mx-auto">
          <div>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              // ABOUT GENKI BROTHERS
            </span>
          </div>

          <h1
            className={`font-medium tracking-tight ${
              lang === 'JP'
                ? 'text-3xl md:text-5xl lg:text-[56px] leading-[1.3]'
                : 'text-4xl md:text-6xl leading-tight'
            }`}
            style={{ fontFamily: titleFont }}
          >
            {lang === 'JP'
              ? '単なるブランドを超えて — 信頼と共創の上に成り立つ歩み。'
              : 'More Than Just a Brand — A Journey Built on Collaboration & Trust.'}
          </h1>

          <p
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed"
            style={{ fontFamily: bodyFont }}
          >
            {lang === 'JP'
              ? '「Brothers」という名には、世界中の優秀なエンジニア、映像監督、ストラテジスト、専門的な才能たちと築いてきた深く揺るぎない絆が込められています。'
              : 'The name "Brothers" reflects the deep, enduring connections formed with brilliant engineers, film directors, strategists, and specialized talents across the world.'}
          </p>
        </section>

        {/* 2. Photo (New B&W Portrait) */}
        <section className="w-full max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <img
              src="https://api.genkibrothers.co/wp-content/uploads/2026/09/DSC05371-bw.jpg"
              alt="Genki Brothers Founder"
              className="w-full h-full object-cover grayscale contrast-105"
            />
          </div>
        </section>

        {/* 3. The Creative Collective */}
        <section className="max-w-4xl mx-auto space-y-6 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-20">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            // THE CREATIVE COLLECTIVE
          </span>

          <h2
            className={`font-medium tracking-tight ${
              lang === 'JP' ? 'text-2xl md:text-4xl leading-[1.38]' : 'text-3xl md:text-4xl'
            }`}
            style={{ fontFamily: titleFont }}
          >
            {lang === 'JP' ? '柔軟な思考と独創性が生み出す、アジリティの高いチーム組織。' : 'Agile Precision & Boundary-Pushing Creativity.'}
          </h2>

          <p
            className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap"
            style={{ fontFamily: bodyFont }}
          >
            {lang === 'JP' ? (
              <>
                Genki Brothersは、創業者 河村 慶典（Yoshinori Kawamura）のクリエイティブな探求の軌跡を具現化したプロダクションです。柔軟なクリエイティブ・コレクティブとして、従来型の代理店組織のオーバーヘッドを排除し、複雑な課題に挑むために最適化された専門スクワッド（チーム）を迅速に編成します。
                <br /><br />
                この機動性と独創的な強みにより、固定概念にとらわれない先進的なアイデアと、組織レベルの厳格なクオリティコントロールを両立。プロジェクトごとのニーズに即座に適応し、インパクトのある最高峰のデジタル体験を実現します。
              </>
            ) : (
              <>
                Genki Brothers is the embodiment of a lifelong creative journey, founded by Yoshinori Kawamura. Operating as a flexible Creative Collective, we assemble dedicated, highly specialized squads tailored to tackle complex challenges, celebrate victories, and bring bold ideas to life with institutional rigor.
                <br /><br />
                By bypassing traditional agency overhead, our hyper-adaptable model combines boundary-pushing originality with precise craftsmanship—empowering us to adapt dynamically to every unique vision and execute high-impact digital products with uncompromised quality.
              </>
            )}
          </p>
        </section>

        {/* 4. Culinary Roots to Digital UX */}
        <section className="max-w-4xl mx-auto space-y-8 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-20">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            // CULINARY ROOTS TO DIGITAL UX
          </span>

          <h2
            className={`font-medium tracking-tight ${
              lang === 'JP' ? 'text-2xl md:text-4xl leading-[1.38]' : 'text-3xl md:text-4xl'
            }`}
            style={{ fontFamily: titleFont }}
          >
            {lang === 'JP' ? '厨房からデジタルUXへ — 体験の本質を追求する美学。' : 'From High-Intensity Kitchens to Digital Ecosystems.'}
          </h2>

          <div className="space-y-6 text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed" style={{ fontFamily: bodyFont }}>
            {lang === 'JP' ? (
              <>
                <p>
                  創業者のデジタルデザインへの歩みは、スクリーンやピクセルの世界とは遠く離れた場所から始まりました。高校卒業直後、彼はイギリスやカナダの非常に緊迫感のあるプロの厨房へと足を踏み入れ、プロシェフとしてのキャリアをスタートさせました。
                </p>
                <p>
                  料理の世界は彼に「人間の体験（UX）」の根本を叩き込みました。ゲストの言葉にされないニーズを先回りし、絶妙なタイミングを捉え、五感のディテールを調和させ、即座に確かな価値を提供すること。デジタルデザインやUX/UI戦略の世界へと転身した際、彼は料理とプロダクトデザインがまったく同じDNA（人々に寄り添い、忘れられない感動の瞬間を創り出すこと）を共有していることに気づきました。
                </p>
                <p>
                  現在、Genki Brothersは同じくレストラン・ホスピタリティのバックグラウンドを持つ兄弟、河村 慶典（Yoshinori Kawamura）と桑原 豪（Go Kuwahara）によって共同運営されています。慶典がリアルなビジョンを最先端のデジタル世界へ昇華させ、豪が枠に囚われないコンテンツ表現で圧倒的な体験を生み出します。
                </p>
              </>
            ) : (
              <>
                <p>
                  The founder's path into digital design began far from pixels and screens. Right after graduating high school, Yoshinori stepped into the high-intensity professional kitchens of the United Kingdom and Canada, working as a professional chef.
                </p>
                <p>
                  Cooking taught him the fundamentals of human experience: anticipating a guest's unspoken needs, orchestrating timing, balancing sensory details, and delivering immediate value. When he transitioned into digital design and UX/UI strategy, he realized that culinary arts and product design share the exact same DNA—both exist solely to serve people and create unforgettable moments of value.
                </p>
                <p>
                  Now, Genki Brothers is formed and run by two brothers, Yoshinori Kawamura and Go Kuwahara, who both bring this rich high-end restaurant background. While Yoshi transforms physical vision into cutting-edge digital ecosystems, Go creates stunning experiences with unlimited content and compelling storytelling.
                </p>
              </>
            )}
          </div>
        </section>

        {/* 5. Areas of Expertise */}
        <section className="max-w-4xl mx-auto space-y-12">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            // AREAS OF EXPERTISE
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {expertise.map((group, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight text-black dark:text-white" style={{ fontFamily: titleFont }}>
                  {group.category}
                </h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 text-sm" style={{ fontFamily: bodyFont }}>
                  {group.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-center space-x-2">
                      <span className="text-[#FFE100] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </article>
    </main>
  );
}