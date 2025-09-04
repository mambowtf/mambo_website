"use client";
/* eslint-disable @next/next/no-img-element */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Luckiest_Guy } from "next/font/google";

/* ============================== CONFIG ============================== */

const luckiest = Luckiest_Guy({ weight: "400", subsets: ["latin"] });

const SITE = {
  TOKEN: {
    symbol: "$MAMBO",
    tagline: "ETH",
    contract: "0x404d3295c8b1c61662068db584125a7Ebcc0d651",
    buyUrl: "https://app.uniswap.org/swap?chain=mainnet&inputCurrency=NATIVE&outputCurrency=0x404d3295c8b1c61662068db584125a7ebcc0d651",
    xUrl: "https://x.com/mamboeth",
    tgUrl: "https://t.me/mamboeth",
    tiktokUrl: "https://mamboeth.shop/",
  },
  galleryCtaUrl: "#",
  partnersCtaUrl: "#",
  whitepaperUrl: "#", // <-- change to your whitepaper link
};

// Fixed chart symbol (no searching/editing)
const FIXED_CHART_SYMBOL = "UNISWAP:MAMBOWETH_EEAD66.USD";

// Assets in /public
const HERO_BG_DESKTOP = "/mambo_hero.png";
const HERO_BG_MOBILE = "/mambo_hero.png";
const MEMES_BG = "/memes_section.png";

/**
 * ====== MEME POOL ======
 * Put all meme images you want to rotate through here (served from /public/memes).
 * Add/remove files and they’ll be included automatically in the rotation + lightbox.
 */
const MEME_POOL: { src: string; alt: string }[] = [
  { src: "/memes/chart.jpg", alt: "meme — basketball" },
  { src: "/memes/based.png", alt: "meme — ibiza" },
  { src: "/memes/president.jpg", alt: "meme — keys" },
  { src: "/memes/candles.jpg", alt: "meme — wave" },
  { src: "/memes/bull.jpg", alt: "Meme — motorcycle 'F*** it, we ride'" },
  { src: "/memes/bigfoot.jpg", alt: "Meme — gorilla with green candle plant" },
  { src: "/memes/moon.jpg", alt: "Meme — thinking of the moon" },
  { src: "/memes/pepe.png", alt: "Meme — beach + token shield" },
  { src: "/memes/rocket.jpg", alt: "Meme — beach + token shield" },
  { src: "/memes/binance.jpg", alt: "Meme — beach + token shield" },
  { src: "/memes/zero.jpg", alt: "Meme — beach + token shield" },
  { src: "/memes/paws.jpg", alt: "Meme — beach + token shield" },
];

/* ---------------- hero sign buttons ---------------- */

type Rect = { left: string; top: string; width: string; height: string; rot?: string };
const HERO_HITBOXES: Record<string, Rect> = {
  buy: { left: "6.2%", top: "30.2%", width: "12.5%", height: "7.2%", rot: "-4deg" },
  x:   { left: "6.1%", top: "39.6%", width: "12.2%", height: "7.0%", rot: "-2deg" },
  tg:  { left: "6.2%", top: "48.8%", width: "12.2%", height: "7.0%", rot: "1deg" },
  tt:  { left: "6.2%", top: "57.8%", width: "12.2%", height: "7.0%", rot: "3deg" },
};
const SIGN_LINKS = [
  { key: "buy", label: "Buy $MAMBO", href: SITE.TOKEN.buyUrl, logo: "/uniswap.jpg" },
  { key: "x",   label: "Follow X",   href: SITE.TOKEN.xUrl, logo: "/xlogo.jpg" },
  { key: "tg",  label: "Join TG",    href: SITE.TOKEN.tgUrl, logo: "/tglogo.jpg" },
  { key: "tt",  label: "Shop",       href: SITE.TOKEN.tiktokUrl, logo: "/shopicon.jpg" },
] as const;
const BOARD_STYLE: Record<string, { bg: string; color: string }> = {
  buy: { bg: "#f4d21a", color: "#0f0f0f" },
  x:   { bg: "#0b0b0b", color: "#ffffff" },
  tg:  { bg: "#61c4ff", color: "#ffffff" },
  tt:  { bg: "#ef4444", color: "#ffffff" },
};

/* ---------- UPDATED: each partner now includes a click URL ---------- */
const PARTNER_LOGOS = [
  { src: "/partners/coingecko.png",     alt: "CoinGecko",      href: "https://www.coingecko.com/en/coins/mambo" },
  { src: "/partners/coinmarketcap.png", alt: "CoinMarketCap",  href: "https://coinmarketcap.com/currencies/mambo/" },
  { src: "/partners/avedex.png",        alt: "AveDex",         href: "https://avedex.cc/token/0x404d3295c8b1c61662068db584125a7ebcc0d651-eth?from=Home" },
  { src: "/partners/dextools.png",      alt: "DEXTools",       href: "https://www.dextools.io/app/en/token/mambo?t=1755887099705" },
  { src: "/partners/dexview.png",       alt: "DEXView",        href: "https://www.dexview.com/eth/0x404d3295c8b1c61662068db584125a7Ebcc0d651" },
  { src: "/partners/ethereum.png",      alt: "Ethereum",       href: "https://ethereum.org/" },
];

/* ============================== LIGHTBOX ============================== */

function useLightbox(count: number) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const openAt = useCallback((i: number) => { setIndex(i); setOpen(true); }, []);
  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, next, prev]);

  useEffect(() => {
    if (!open) return;
    let x0 = 0;
    const onStart = (e: TouchEvent) => (x0 = e.touches[0].clientX);
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) (dx < 0 ? next : prev)();
    };
    document.addEventListener("touchstart", onStart);
    document.addEventListener("touchend", onEnd);
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, [open, next, prev]);

  return { open, index, openAt, close, next, prev, setIndex };
}

function Lightbox({
  images, index, onClose, onPrev, onNext,
}: {
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = images[index];
  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center" role="dialog" aria-modal="true">
      <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white text-black font-bold border-4 border-neutral-900 shadow-lg">✕</button>
      <button onClick={onPrev} aria-label="Previous" className="absolute left-4 md:left-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 text-white border-2 border-white/70 grid place-items-center">‹</button>
      <button onClick={onNext} aria-label="Next" className="absolute right-4 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 text-white border-2 border-white/70 grid place-items-center">›</button>
      <div className="max-w-[92vw] max-h-[86vh]">
        <img src={img.src} alt={img.alt} className="w-full h-full object-contain rounded-xl border-4 border-white/30" />
      </div>
    </div>
  );
}

/* ============================== TWEETS (IDs) ============================== */

const TWEET_IDS = [
  "1958553962413740409",
  "1955735779730432469",
  "1955456198192636105", // <-- make sure these are valid Tweet IDs
];

declare global {
  interface Window {
    TradingView?: any;
    twttr?: any;
  }
}

/* ============================== TWITTER WIDGETS ============================== */

function ensureTwitterWidgets(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.twttr && window.twttr.widgets) return Promise.resolve(window.twttr);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://platform.twitter.com/widgets.js"]'
    );
    const onReady = () => resolve(window.twttr);
    if (existing) {
      existing.addEventListener("load", onReady, { once: true });
      if ((window as any).twttr?.widgets) setTimeout(onReady, 0);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    s.onload = onReady;
    document.body.appendChild(s);
  });
}


/* ============================== TRADINGVIEW (fixed symbol) ============================== */

const TV_SCRIPT_SRC = "https://s3.tradingview.com/tv.js";

function useTradingViewScript() {
  const [ready, setReady] = useState<boolean>(
    () => typeof window !== "undefined" && !!window.TradingView
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.TradingView) {
      setReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TV_SCRIPT_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => setReady(true), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = TV_SCRIPT_SRC;
    s.async = true;
    s.onload = () => setReady(true);
    document.body.appendChild(s);
  }, []);
  return ready;
}

function TradingViewChart({ symbol }: { symbol: string }) {
  const ready = useTradingViewScript();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const CONTAINER_ID = "tv_chart_container";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !ready || !window.TradingView || !containerRef.current) return;
    containerRef.current.innerHTML = "";

    new window.TradingView.widget({
      autosize: true,
      symbol,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      withdateranges: true,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      allow_symbol_change: false, // no search / editing
      container_id: CONTAINER_ID,
      studies: ["MASimple@tv-basicstudies", "MAExp@tv-basicstudies"],
    });
  }, [mounted, ready, symbol]);

  return (
    <div
      id={CONTAINER_ID}
      ref={containerRef}
      className="w-full h-[56vh] max-h-[700px] min-h-[420px]"
    />
  );
}

/* ============================== FALLING BANANAS ============================== */

function FallingBanana({ left, delay }: { left: number; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`banana-fall ${isVisible ? 'animate' : ''}`}
      style={{ 
        left: `${left}%`,
        animationDelay: `${delay}s`
      }}
    >
      <img
        src="/banana-28.svg"
        alt="Falling banana"
        width="80"
        height="80"
        style={{
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
        }}
      />
    </div>
  );
}

function useFallingBananas() {
  const [hasTriggered, setHasTriggered] = useState(false);

  const startBananaRain = useCallback(() => {
    if (hasTriggered) return;
    setHasTriggered(true);
  }, [hasTriggered]);

  // Random banana positions and delays - no DOM manipulation
  const bananaData = [
    { left: 10, delay: 0 },
    { left: 65, delay: 0.3 },
    { left: 25, delay: 0.7 },
    { left: 80, delay: 1.1 },
    { left: 45, delay: 1.4 },
    { left: 15, delay: 1.8 },
    { left: 70, delay: 2.2 },
    { left: 35, delay: 2.6 },
    { left: 55, delay: 3.0 },
    { left: 20, delay: 3.4 }
  ];

  return { hasTriggered, startBananaRain, bananaData };
}

/* ============================== SCROLL ANIMATIONS ============================== */

function useScrollAnimation() {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-scroll-id');
            if (id) {
              setVisibleElements(prev => new Set([...prev, id]));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('[data-scroll-id]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return visibleElements;
}

/* ============================== PAGE ============================== */

export default function Page() {
  // Lightbox uses the full MEME_POOL so you can step through *all* images
  const lb = useLightbox(MEME_POOL.length);
  
  // Scroll animations
  const visibleElements = useScrollAnimation();
  
  // Removed scroll-triggered bananas - only button explosion remains

  // ===== Load tweets =====
  useEffect(() => {
    const loadTweets = async () => {
      const tw = await ensureTwitterWidgets();
      if (tw) {
        // Clear and load first tweet
        const tweet1 = document.getElementById('tweet1');
        if (tweet1) {
          tweet1.innerHTML = '';
          tw.widgets.createTweet("1955456198192636105", tweet1, {
            theme: "dark",
            align: "center",
            dnt: true,
            width: 400,
            chrome: "noheader nofooter noborders",
          });
        }
        
        // Clear and load second tweet
        const tweet2 = document.getElementById('tweet2');
        if (tweet2) {
          tweet2.innerHTML = '';
          tw.widgets.createTweet("1958521717371842996", tweet2, {
            theme: "dark",
            align: "center",
            dnt: true,
            width: 400,
            chrome: "noheader nofooter noborders",
          });
        }
      }
    };
    
    loadTweets();
  }, []);

  // ===== Copy CA button =====
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    const txt = SITE.TOKEN.contract;
    try {
      await navigator.clipboard.writeText(txt);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }, []);

  // Small sanity guard from earlier
  useEffect(() => {
    const ok = (["buy", "x", "tg", "tt"] as const).every((k) => {
      const r = HERO_HITBOXES[k];
      const n = (v: string) => +v.replace("%", "");
      return [r.left, r.top, r.width, r.height].every(
        (v) => /%$/.test(v) && n(v) >= 0 && n(v) <= 100
      );
    });
    console.assert(ok, "Sanity checks failed.");
  }, []);

  // ===== Meme rotation logic (4 unique at a time, auto every 30s) =====
  const PER = 4;
  const pages = Math.max(1, Math.ceil(MEME_POOL.length / PER));
  const [page, setPage] = useState(0);

  // advance every 30s
  useEffect(() => {
    const t = setInterval(() => setPage((p) => (p + 1) % pages), 30000);
    return () => clearInterval(t);
  }, [pages]);

  // preload the next page’s images for smoother swapping
  useEffect(() => {
    const next = (page + 1) % pages;
    for (let i = 0; i < PER; i++) {
      const idx = (next * PER + i) % MEME_POOL.length;
      const img = new Image();
      img.src = MEME_POOL[idx].src;
    }
  }, [page, pages]);

  // the 4 indices (always unique while MEME_POOL.length >= 4)
  const visibleIndices = Array.from(
    { length: PER },
    (_, i) => (page * PER + i) % MEME_POOL.length
  );

  return (
    <div className="min-h-screen text-slate-100" style={{ backgroundColor: "#2d2e2c" }}>

      {/* ================= HERO ================= */}
      <section
        className="relative overflow-hidden h-[95vh]"
        style={{
          backgroundImage: `url(${HERO_BG_MOBILE})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Desktop background overlay */}
        <div 
          className="hidden md:block absolute inset-0"
          style={{
            backgroundImage: `url(${HERO_BG_DESKTOP})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Hero buttons - Desktop */}
        <div className="hidden md:block z-20">
          {SIGN_LINKS.map(({ key, label, href, logo }) => {
            const r = HERO_HITBOXES[key];
            const palette = BOARD_STYLE[key] || { bg: "#fff", color: "#111" };
            const style: CSSProperties = {
              position: "absolute",
              left: r.left,
              top: r.top,
              width: r.width,
              height: r.height,
              transform: `rotate(${r.rot || "0deg"}) scale(0.8)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              border: "4px solid #0f0f0f",
              background: palette.bg,
              color: palette.color,
              boxShadow: "0 12px 24px rgba(0,0,0,.28)",
              textDecoration: "none",
              cursor: "pointer",
              userSelect: "none",
              overflow: "hidden",
              paddingInline: "1vw",
              minWidth: "120px",
              minHeight: "50px",
              zIndex: 30,
            };
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                style={style}
                className="select-none hover-jiggle"
              >
                <span
                  className={`${luckiest.className} font-black leading-none`}
                  style={{
                    fontSize: "clamp(10px, 0.9vw + 7px, 16px)",
                    letterSpacing: 0.5,
                    textShadow: "0 2px 0 rgba(0,0,0,.35)",
                    whiteSpace: "nowrap",
                    color: "#ffffff"
                  }}
                >
                  {label}
                </span>
              </a>
            );
          })}
        </div>

        {/* MAMBO Logo Overlay - Mobile (where buttons were) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[0%] text-center md:hidden" style={{ width: "100vw", height: "700px" }}>
          <img
            src="/herotext.jpg"
            alt="$MAMBO THE GORILLA"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: "scale(2.2)",
              filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.5))",
            }}
          />
        </div>

        {/* MAMBO Logo Overlay - Tablet */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[20%] text-center hidden md:block lg:hidden" style={{ width: "100vw", height: "510px" }}>
          <img
            src="/herotext.jpg"
            alt="$MAMBO THE GORILLA"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: "scale(1.1)",
              filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.5))",
            }}
          />
        </div>

        {/* MAMBO Logo Overlay - Desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[15%] text-center hidden lg:block" style={{ width: "100vw", height: "510px" }}>
          <img
            src="/herotext.jpg"
            alt="$MAMBO THE GORILLA"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: "scale(1.265)",
              filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.5))",
            }}
          />
        </div>

        {/* Hero buttons - Mobile (4x1 horizontal at top left) */}
        <div className="absolute left-[5%] top-[5%] text-center md:hidden z-20">
          <div className="grid grid-cols-4 gap-1">
            {SIGN_LINKS.map(({ key, label, href, logo }) => {
              const palette = BOARD_STYLE[key] || { bg: "#fff", color: "#111" };
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="select-none hover-jiggle rounded-lg border-2 border-black text-center"
                  style={{
                    background: palette.bg,
                    color: palette.color,
                    boxShadow: "0 4px 8px rgba(0,0,0,.28)",
                    textDecoration: "none",
                    width: "60px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(10px, 2.5vw, 12px)",
                    fontWeight: "600",
                    WebkitTextStroke: "1px #000000",
                    paintOrder: "stroke fill",
                    zIndex: 30,
                  }}
                >
                  <img 
                    src={logo} 
                    alt={label} 
                    className="w-6 h-6 object-contain mx-auto" 
                    style={{
                      filter: key === 'tt' ? 'none' : 'none'
                    }}
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* Contract banner with tiny copy button */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[5%] w-[min(1200px,90vw)] px-2 md:px-4">
          <div
            className="relative rounded-[28px] flex items-center justify-between px-4 md:px-6 py-3 md:py-5"
            style={{
              background: "#a87450",
              border: "6px solid #0f0f0f",
              boxShadow:
                "0 14px 0 rgba(0,0,0,.45), 0 22px 36px rgba(0,0,0,.35), inset 0 6px 0 rgba(255,255,255,.25), inset 0 -7px 0 rgba(0,0,0,.22)",
            }}
          >
            <span
              className={`${luckiest.className} leading-none flex-1 text-center`}
              style={{
                fontSize: "clamp(10px, 1.2vw + 4px, 32px)",
                color: "#ffffff",
                WebkitTextStroke: "2px #0f0f0f",
                paintOrder: "stroke fill",
                textShadow: "0 4px 0 rgba(0,0,0,.35)",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
                paddingRight: "12px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              CA: {SITE.TOKEN.contract}
            </span>

            {/* tiny copy button */}
            <button
              onClick={onCopy}
              aria-label="Copy CA"
              className="inline-flex items-center justify-center rounded-md border-2 border-black bg-white w-8 h-8 md:w-9 md:h-9 hover:scale-105 active:scale-95 transition flex-shrink-0 hover-jiggle"
              title={copied ? "Copied!" : "Copy CA"}
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="md:w-5 md:h-5">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="black"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="md:w-5 md:h-5">
                  <rect
                    x="9"
                    y="9"
                    width="12"
                    height="12"
                    rx="2"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <rect
                    x="3"
                    y="3"
                    width="12"
                    height="12"
                    rx="2"
                    stroke="black"
                    strokeWidth="2"
                    fill="#fff"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ================= TEXT SLIDER ================= */}
      <section className="py-[0.85rem] overflow-hidden" style={{ backgroundColor: "#085EB2" }}>
        <div className="relative">
          <div className="flex animate-scroll whitespace-nowrap" style={{ width: "200%" }}>
            <div className="flex items-center space-x-8 text-white" style={{ minWidth: "100%" }}>
              {Array.from({ length: 2 }).map((_, i) => (
                <span
                  key={i}
                  className={`${luckiest.className} text-xl md:text-3xl font-bold`}
                  style={{
                    fontSize: "clamp(16px, 3.2vw, 28px)",
                    color: "#ffffff",
                    WebkitTextStroke: "2px #000000",

                    paintOrder: "stroke fill",
                    textShadow: "2px 2px 0 #000",
                    whiteSpace: "nowrap"
                  }}
                >
                  NEW WEBSITE LIVE • $MAMBO THE GORILLA • NEW WEBSITE LIVE • $MAMBO THE GORILLA • NEW WEBSITE LIVE • $MAMBO THE GORILLA • NEW WEBSITE LIVE • $MAMBO THE GORILLA • NEW WEBSITE LIVE • $MAMBO THE GORILLA
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MEMES (2×2 grid, auto-rotating, NO CTA) ================= */}
      <section
        id="memes"
        className="relative pt-16 pb-16"
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${MEMES_BG})`,
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          ["--reserveVH" as any]: "28vh",
        } as CSSProperties}
      >
        <div className="mx-auto w-[92vw] max-w-[1340px] h-full flex flex-col">
                      <div
              className={`rounded-[28px] border-[6px] border-white shadow-[0_18px_40px_rgba(0,0,0,.35)] bg-[#0A84FF] px-5 md:px-8 lg:px-10 py-5 md:py-7 lg:py-8 mt-5 overflow-hidden scroll-animate ${visibleElements.has('memes-title') ? 'animate-flip-down' : ''}`}
            style={{
              boxShadow:
                "0 18px 40px rgba(0,0,0,.35), inset 0 6px 0 rgba(255,255,255,.2), inset 0 -7px 0 rgba(0,0,0,.22)",
            }}
          >
            <h2
              className={`${luckiest.className} text-white leading-none mb-4 scroll-animate ${visibleElements.has('memes-title') ? 'animate-slide-in-up' : ''}`}
              style={{ 
                fontSize: "clamp(44px, 3.6vw + 16px, 72px)",
                WebkitTextStroke: "2px #000000",
                paintOrder: "stroke fill"
              }}
              data-scroll-id="memes-title"
            >
              Memes
            </h2>

            {/* 2×2 big image grid — auto updates every 30s */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {visibleIndices.map((poolIdx) => {
                const img = MEME_POOL[poolIdx];
                return (
                  <button
                    key={`${poolIdx}-${page}`} // forces refresh when page changes
                    onClick={() => lb.openAt(poolIdx)}
                    className="rounded-[16px] overflow-hidden border-4 border-neutral-900 shadow-[0_12px_26px_rgba(0,0,0,.28)] focus:outline-none focus:ring-2 focus:ring-black/40"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover aspect-[16/9]"
                      draggable="false"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {lb.open && (
          <Lightbox
            images={MEME_POOL}
            index={lb.index}
            onClose={lb.close}
            onPrev={lb.prev}
            onNext={lb.next}
          />
        )}
      </section>

      {/* ================= COMMUNITY ================= */}
      <section id="community" className="py-8" style={{ background: "#2d2e2c" }}>
        <div className="mx-auto max-w-[1340px] w-[92vw]">
          <h2
            className={`${luckiest.className} text-white leading-none scroll-animate ${visibleElements.has('community-title') ? 'animate-slide-in-up' : ''}`}
            style={{ 
              fontSize: "clamp(44px, 3.6vw + 16px, 72px)",
              WebkitTextStroke: "2px #000000",

              paintOrder: "stroke fill"
            }}
            data-scroll-id="community-title"
          >
            Our Community is Always Active
          </h2>

          {/* Two tweets side by side */}
          <div className="flex justify-center gap-6 mt-32 mb-32">
            <div 
              id="tweet1" 
              className="w-[400px] h-[500px] flex items-center justify-center"
            />
            <div 
              id="tweet2" 
              className="w-[400px] h-[500px] flex items-center justify-center hidden md:flex"
            />
          </div>

        </div>
      </section>

      {/* ================= WHITEPAPER (between lore and chart) ================= */}
      <section id="whitepaper" className="text-white py-8" style={{ background: "#2d2e2c" }}>
        <div className="mx-auto w-[92vw] max-w-[1340px]">
          <div className={`rounded-xl border-4 border-white bg-[#0A84FF] overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,.65)] p-6 md:p-10 scroll-animate ${visibleElements.has('whitepaper-title') ? 'animate-flip-down' : ''}`}>
            <h2
              className={`${luckiest.className} text-white leading-none mb-6 scroll-animate ${visibleElements.has('whitepaper-title') ? 'animate-slide-in-up' : ''}`}
              style={{ 
                fontSize: "clamp(44px, 3.6vw + 16px, 72px)",
                WebkitTextStroke: "2px #000000",
                paintOrder: "stroke fill"
              }}
              data-scroll-id="whitepaper-title"
            >
              Whitepaper
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] items-center gap-8">
              <div className="relative">
                <img
                  src="/mambo-body-10.png"
                  alt="Gorilla illustration"
                  className={`w-full md:w-[340px] mx-auto scroll-animate ${visibleElements.has('whitepaper-title') ? 'animate-slide-in-up' : ''}`}
                />
              </div>
              <div className="text-white">
                <p
                  className={`${luckiest.className} leading-tight`}
                  style={{ 
                    fontSize: "clamp(28px, 2.6vw + 12px, 44px)"
                  }}
                >
                  Ready to learn more about $MAMBO?
                </p>

                <a
                  className="mt-6 inline-flex items-center gap-3 rounded-full bg-black text-white border-2 border-white px-5 py-3 hover-jiggle"
                  href={SITE.whitepaperUrl}
                >
                  <span>Coming Soon</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3 CARDS ================= */}
      <section id="extra-howbuy" className="text-white py-8" style={{ background: "#2d2e2c" }}>
        <div className="mx-auto max-w-[1340px] w-[92vw]">
          <h2
            className={`${luckiest.className} text-white leading-none scroll-animate ${visibleElements.has('lore-title') ? 'animate-slide-in-up' : ''}`}
            style={{ 
              fontSize: "clamp(44px, 3.6vw + 16px, 72px)",
              WebkitTextStroke: "2px #000000",

              paintOrder: "stroke fill"
            }}
            data-scroll-id="lore-title"
          >
            Mambo Lore
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-7">
            <div className={`rounded-xl border-4 border-white bg-[#0A84FF] overflow-hidden scroll-animate ${visibleElements.has('lore-title') ? 'animate-flip-down' : ''}`}>
              <img
                src="/cards/mambo_waveV2.png"
                alt="Stats art"
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="text-white p-4 text-sm leading-tight">
                <div className="font-extrabold text-[18px]">
                  <span className="text-green-400">1 Trillion</span> Supply
                </div>
                <div className="font-extrabold text-[18px]">
                  <span className="text-green-400">2000+</span> Holders
                </div>
                <div className="font-extrabold text-[18px]">1 Common Goal</div>
              </div>
            </div>
            <div className={`rounded-xl border-4 border-white bg-[#0A84FF] overflow-hidden scroll-animate ${visibleElements.has('lore-title') ? 'animate-flip-down' : ''}`}>
              <img
                src="/cards/japan.jpg"
                alt="Utilities art"
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="text-white p-4 text-sm leading-tight">
                <div className="font-extrabold text-[18px]">
                  Utilities — <span>None</span>
                </div>
                <div className="font-extrabold text-[18px]">
                  Team — <span>Probably Nuts</span>
                </div>
                <div className="font-extrabold text-[18px]">
                  Community — <span>Unhinged</span>
                </div>
              </div>
            </div>
            <div className={`rounded-xl border-4 border-white bg-[#0A84FF] overflow-hidden scroll-animate ${visibleElements.has('lore-title') ? 'animate-flip-down' : ''}`}>
              <img
                src="/cards/mambo_basketball.png"
                alt="No selling art"
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="text-white p-4 text-sm leading-tight">
                <div className="font-extrabold text-[25px]">CHADS ONLY</div>
                <div className="font-extrabold text-[25px]"><span className="text-red-500">NO</span> SELLING</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRICE ACTION (no search; fixed symbol) ================= */}
      <section id="live-chart" className="text-white py-8" style={{ background: "#2d2e2c" }}>
        <div className="mx-auto max-w-[1340px] w-[92vw]">
          <h2
            className={`${luckiest.className} text-white leading-none scroll-animate ${visibleElements.has('chart-title') ? 'animate-slide-in-up' : ''}`}
            style={{ 
              fontSize: "clamp(44px, 3.6vw + 16px, 72px)",
              WebkitTextStroke: "2px #000000",

              paintOrder: "stroke fill"
            }}
            data-scroll-id="chart-title"
          >
            Live Chart
          </h2>
          <div className="rounded-2xl border-4 border-white bg-black p-3 shadow-[0_18px_40px_rgba(0,0,0,.35)] overflow-hidden">
            <TradingViewChart symbol={FIXED_CHART_SYMBOL} />
          </div>
        </div>
      </section>

      {/* ================= HOW TO BUY ================= */}
      <section id="extra-howbuy-2" className="text-white py-8" style={{ background: "#2d2e2c" }}>
        <div className="mx-auto max-w-[1340px] w-[92vw]">
          <h2
            className={`${luckiest.className} text-white leading-none scroll-animate ${visibleElements.has('howbuy-title') ? 'animate-slide-in-up' : ''}`}
            style={{ 
              fontSize: "clamp(44px, 3.6vw + 16px, 72px)",
              WebkitTextStroke: "2px #000000",

              paintOrder: "stroke fill"
            }}
            data-scroll-id="howbuy-title"
          >
            How to Buy
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-7">
            {[
              ["Step 1", "Download Metamask Wallet"],
              ["Step 2", "Load up ETH from an Exchange"],
              ["Step 3", "Copy the CA"],
              ["Step 4", "Head over to Uniswap and buy $MAMBO"],
            ].map(([s, t], index) => (
              <div 
                key={s} 
                className={`rounded-xl border-4 border-white bg-[#0A84FF] p-4 shadow-[0_18px_40px_rgba(0,0,0,.35)] text-center font-extrabold scroll-animate ${visibleElements.has('howbuy-title') ? 'animate-flip-down' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-white text-xl mb-2">{s}</div>
                <div className="text-[13px] leading-tight opacity-90">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GAME PLACEHOLDER ================= */}
      <section id="game" className="text-white py-18" style={{ background: "#2d2e2c" }}>
        <div className="mx-auto max-w-[1340px] w-[92vw]">
          <div className="rounded-2xl border-4 border-white grid place-items-center h-[340px] md:h-[420px] overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-center">
              <h2
                className={`${luckiest.className} text-white leading-none`}
                style={{ 
                  fontSize: "clamp(44px, 3.6vw + 16px, 72px)",
                  WebkitTextStroke: "2px #000000",
                  paintOrder: "stroke fill"
                }}
              >
                GAME
              </h2>
              <div className="text-red-400 font-extrabold mt-2 mb-4">
                Coming soon, in the meantime- press this button:
              </div>
              <button
                onClick={(event) => {
                  // Play gorilla sound
                  const audio = new Audio("/A sound where a person imitates a gorilla with his voice.mp3");
                  audio.volume = 0.7;
                  audio.play().catch(console.error);
                  
                  // Create MASSIVE chaotic banana explosion from button
                  const bananaCount = 16;
                  const bananas: HTMLElement[] = [];
                  const buttonRect = (event.target as HTMLButtonElement).getBoundingClientRect();
                  const centerX = buttonRect.left + buttonRect.width / 2;
                  const centerY = buttonRect.top + buttonRect.height / 2;
                  
                  for (let i = 0; i < bananaCount; i++) {
                    const banana = document.createElement('div');
                    banana.style.position = 'fixed';
                    banana.style.left = `${centerX}px`;
                    banana.style.top = `${centerY}px`;
                    banana.style.width = '80px';
                    banana.style.height = '80px';
                    banana.style.pointerEvents = 'none';
                    banana.style.zIndex = '9998';
                    banana.style.transformOrigin = 'center';
                    
                    // Calculate explosion direction (360 degrees)
                    const angle = (i / bananaCount) * 360 + Math.random() * 45 - 22.5; // More randomness
                    const distance = 200 + Math.random() * 150; // Contained explosion 200-350px
                    const endX = centerX + Math.cos(angle * Math.PI / 180) * distance;
                    const endY = centerY + Math.sin(angle * Math.PI / 180) * distance;
                    
                    // Create MASSIVE explosion animation
                    const animation = banana.animate([
                      { 
                        transform: 'translate(0, 0) rotate(0deg) scale(1.2)',
                        opacity: 1
                      },
                      { 
                        transform: `translate(${endX - centerX}px, ${endY - centerY}px) rotate(1080deg) scale(0.8)`,
                        opacity: 1
                      }
                    ], {
                      duration: 2000 + Math.random() * 1000, // 2-3 seconds for bigger effect
                      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    });
                    
                    const img = document.createElement('img');
                    img.src = '/banana-28.svg';
                    img.alt = 'MASSIVE Exploding banana';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'contain';
                    img.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))';
                    
                    banana.appendChild(img);
                    document.body.appendChild(banana);
                    bananas.push(banana);
                    
                    // Remove banana when animation completes
                    animation.addEventListener('finish', () => {
                      if (banana.parentNode) {
                        banana.parentNode.removeChild(banana);
                      }
                    });
                  }
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg border-2 border-black hover-jiggle transition-colors"
                style={{
                  boxShadow: "0 6px 12px rgba(0,0,0,.28)",
                  WebkitTextStroke: "1px #000000",
                  paintOrder: "stroke fill"
                }}
              >
                🎮 Mambo No. 5
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PARTNERS ================= */}
      <section id="partners" className="pt-18" style={{ background: "#2d2e2c" }}>
        <div className="mx-auto w-[92vw] max-w-[1340px]">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              <div>
                          <h2
            className={`${luckiest.className} text-white leading-none scroll-animate ${visibleElements.has('partners-title') ? 'animate-slide-in-up' : ''}`}
            style={{ 
              fontSize: "clamp(44px, 3.6vw + 16px, 72px)",
              WebkitTextStroke: "2px #000000",

              paintOrder: "stroke fill"
            }}
            data-scroll-id="partners-title"
          >
            PARTNERS
          </h2>
                <div className="flex items-center justify-between mt-6">
                  <p className="text-white/90 text-xl md:text-2xl tracking-[0.2em]">
                    We collaborate with brands worldwide.
                  </p>
                  <div className="flex items-center gap-4 text-white md:hidden">
                    <div className="text-center">
                      <div className="text-2xl font-extrabold">50+</div>
                      <div className="text-white/75 -mt-1 text-sm">Partners</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-10 text-white">
                <div className="h-12 w-px bg-white/30 hidden lg:block" />
                <div className="text-center">
                  <div className="text-4xl font-extrabold">50+</div>
                  <div className="text-white/75 -mt-1">Partners</div>
                </div>
                <div className="h-12 w-px bg-white/30" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="text-white col-span-1 md:col-span-1">
                <div className="text-2xl font-extrabold">
                  Some of our<br />
                  partners…
                </div>
              </div>

              {/* ---------- UPDATED: logo tiles are anchors (clickable) ---------- */}
              {PARTNER_LOGOS.map(({ src, alt, href }) => (
                <a
                  key={alt}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border-4 border-white bg-[#0A84FF] h-16 md:h-20 flex items-center justify-center p-2 hover-jiggle"
                  aria-label={alt}
                  title={alt}
                >
                  <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    draggable="false"
                    className="max-h-10 md:max-h-14 max-w-[80%] w-auto object-contain pointer-events-none select-none"
                  />
                </a>
              ))}

              <a
                href={SITE.partnersCtaUrl}
                className="rounded-xl border-2 border-white text-white px-6 h-16 md:h-20 flex items-center justify-between col-span-1 md:col-span-2 lg:col-span-1 hover-jiggle"
              >
                <span className="text-lg font-semibold">
                  Contact us for collaboration
                </span>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black font-bold">
                  +
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM GIF & QUOTE ================= */}
      <section className="text-white py-8" style={{ background: "#2d2e2c" }}>
        <div className="mx-auto max-w-[1340px] w-[92vw] text-center">
          <div className="mb-4">
            {/* Mobile: Single GIF */}
            <div className="md:hidden">
              <img 
                src="/mambo_running.gif" 
                alt="Mambo running"
                className="mx-auto max-w-[300px] w-full h-auto rounded-lg"
              />
            </div>
            {/* Desktop: 3 GIFs side by side */}
            <div className="hidden md:flex justify-center items-center gap-4">
              <img 
                src="/mambo_running.gif" 
                alt="Mambo running"
                className="max-w-[250px] w-full h-auto rounded-lg"
              />
              <img 
                src="/mambo_running.gif" 
                alt="Mambo running"
                className="max-w-[250px] w-full h-auto rounded-lg"
              />
              <img 
                src="/mambo_running.gif" 
                alt="Mambo running"
                className="max-w-[250px] w-full h-auto rounded-lg"
              />
            </div>
          </div>
          <blockquote className="text-2xl md:text-4xl font-bold italic text-white max-w-4xl mx-auto">
            <p className="mb-4">
              {"\"Power > Price\""}
            </p>
            <footer className="text-lg md:text-xl text-white/80">
              — MAMBO
            </footer>
          </blockquote>
        </div>
      </section>


      {/* Removed scroll-triggered falling bananas */}
    </div>
  );
}
