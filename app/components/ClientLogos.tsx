// app/components/ClientLogos.tsx
'use client';

import { motion } from 'framer-motion';

interface ClientItem {
  name: string;
  file: string;
  customClass?: string;
}

const clientListRow1: ClientItem[] = [
  { name: 'NIKE', file: 'logo-nike.svg', customClass: 'max-h-10' },
  { name: 'Converse', file: 'logo-converse.svg', customClass: 'max-h-9' },
  { name: 'Herschel', file: 'logo-herschel.svg', customClass: 'max-h-16 scale-110' },
  { name: 'Adidas', file: 'logo-adidas.svg', customClass: 'max-h-11' },
  { name: 'Airbnb', file: 'logo-airbnb.svg', customClass: 'max-h-11' },
  { name: 'Jaguar', file: 'logo-jaguar.svg', customClass: 'max-h-11' },
  { name: 'Benz', file: 'logo-benz.svg', customClass: 'max-h-16 scale-110' },
];

const clientListRow2: ClientItem[] = [
  { name: 'Tokyo Disney Resort', file: 'logo-tdr.svg', customClass: 'max-h-10' },
  { name: 'Danone', file: 'logo-danone.svg', customClass: 'max-h-14 scale-110' },
  { name: 'Quaker', file: 'logo-quaker.svg', customClass: 'max-h-16 scale-115' },
  { name: 'Gillette', file: 'logo-gillette.svg', customClass: 'max-h-10' },
  { name: 'Mini', file: 'logo-mini.svg', customClass: 'max-h-11' },
  { name: 'Budweiser', file: 'logo-budweiser.svg', customClass: 'max-h-11' },
  { name: 'Arda', file: 'logo-arda.svg', customClass: 'max-h-8' },
];

function LogoCard({ client }: { client: ClientItem }) {
  return (
    <div className="flex-none px-6 py-4 mx-3 bg-transparent dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/60 backdrop-blur-md rounded-2xl flex items-center justify-center w-[320px] h-[180px] shadow-none transition-all duration-300 hover:border-[#FFE100] dark:hover:border-[#FFE100]">
      <div className="w-full h-full flex items-center justify-center p-2 overflow-hidden">
        <img
          src={`/logos/${client.file}`}
          alt={client.name}
          className={`w-auto object-contain dark:invert transition-all duration-500 ${client.customClass || 'max-h-10'}`}
        />
      </div>
    </div>
  );
}

export default function ClientLogos() {
  const row1 = [...clientListRow1, ...clientListRow1, ...clientListRow1];
  const row2 = [...clientListRow2, ...clientListRow2, ...clientListRow2];

  return (
    <section className="relative z-10 py-32 md:py-44 overflow-hidden bg-transparent">
      {/* セクションタイトル: 12px (text-xs) & UPPERCASE */}
      <div className="px-8 md:px-16 mb-16 text-left lg:text-center max-w-7xl mx-auto w-full">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          // BRANDS WE&apos;VE WORKED WITH
        </span>
      </div>

      <div className="space-y-6 relative">
        <div className="flex overflow-hidden">
          <motion.div className="flex" animate={{ x: ['0%', '-33.333%'] }} transition={{ ease: 'linear', duration: 50, repeat: Infinity }}>
            {row1.map((client, i) => <LogoCard key={`row1-${i}`} client={client} />)}
          </motion.div>
        </div>

        <div className="flex overflow-hidden">
          <motion.div className="flex" animate={{ x: ['-33.333%', '0%'] }} transition={{ ease: 'linear', duration: 50, repeat: Infinity }}>
            {row2.map((client, i) => <LogoCard key={`row2-${i}`} client={client} />)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}