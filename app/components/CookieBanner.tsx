// app/components/CookieBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ローカルストレージに保存された同意ステータスを確認
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // 未選択の場合のみバナーを表示
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6"
        >
          {/* 背景を85%に指定（15%透過） */}
          <div className="max-w-5xl mx-auto p-6 rounded-2xl bg-white/85 dark:bg-[#121215]/85 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* メッセージ本文 */}
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans text-left">
              We use cookies to ensure that we give you the best experience on our website. If you continue to use this site we will assume that you are happy with it. Read our{' '}
              <a
                href="/privacy"
                className="text-black dark:text-[#FFE100] font-semibold underline hover:opacity-80 transition-opacity"
                style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
              >
                Privacy Policy
              </a>
              .
            </p>

            {/* ボタンエリア */}
            <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto justify-end">
              <button
                onClick={handleDecline}
                className="px-5 py-2.5 rounded-[4px] border border-zinc-300 dark:border-zinc-700 text-xs font-semibold tracking-wider text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-all duration-300"
                style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
              >
                No
              </button>
              
              {/* OKボタン: ホバーアクション追加 (浮き上がり & シャドウ強調 & カラーチェンジ) */}
              <button
                onClick={handleAccept}
                className="px-6 py-2.5 rounded-[4px] bg-black text-white dark:bg-[#FFE100] dark:text-black text-xs font-semibold tracking-wider hover:-translate-y-0.5 hover:bg-[#FFE100] hover:text-black dark:hover:bg-white dark:hover:text-black hover:shadow-[0_8px_20px_rgba(255,225,0,0.35)] transition-all duration-300 shadow-md"
                style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
              >
                OK
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}