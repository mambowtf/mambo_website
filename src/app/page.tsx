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
    buyUrl: "https://app.uniswap.org/explore/tokens/ethereum/0x404d3295c8b1c61662068db584125a7Ebcc0d651",
    xUrl: "https://twitter.com/mamboETH",
    tgUrl: "https://t.me/mamboeth",
    tiktokUrl: "https://mamboeth.shop",
  },
  galleryCtaUrl: "#",
  partnersCtaUrl: "#",
  whitepaperUrl: "#", // <-- change to your whitepaper link
};

// Fixed chart symbol (no searching/editing)
const FIXED_CHART_SYMBOL = "UNISWAP:MAMBOWETH_EEAD66.USD";

// Assets in /public
const HERO_BG = "/hero-section0.png";
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
  { key: "buy", label: "Buy $MAMBO", href: SITE.TOKEN.buyUrl },
  { key: "x",   label: "Follow X",   href: SITE.TOKEN.xUrl },
  { key: "tg",  label: "Join TG",    href: SITE.TOKEN.tgUrl },
  { key: "tt",  label: "Shop",       href: SITE.TOKEN.tiktokUrl },
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
  "1958521717371842996",
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

/** Visible carousel that creates tweets directly inside holders (no offscreen preload). */
function TweetWall({ ids }: { ids: string[] }) {
  const holdersRef = useRef<Record<string, HTMLElement | null>>({});
  const createdRef = useRef<Set<string>>(new Set());

  const attachHolder = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      holdersRef.current[id] = el;
    },
    []
  );

  // Create tweets once per id, right inside their holders
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const tw = await ensureTwitterWidgets();
      if (!tw || cancelled) return;

      const createAll = () => {
        ids.forEach(async (id) => {
          if (createdRef.current.has(id)) return;
          const el = holdersRef.current[id];
          if (!el) return;
          try {
            el.innerHTML = "";
            await tw.widgets.createTweet(id, el, {
              theme: "light",
              align: "center",
              dnt: true,
            });
            createdRef.current.add(id);
          } catch {
            // ignore single failures, we'll retry below
          }
        });
      };

      createAll();

      // Retry a few times in case some holders weren't mounted yet
      let tries = 0;
      const tick = setInterval(() => {
        if (cancelled || createdRef.current.size >= ids.length || tries++ > 10) {
          clearInterval(tick);
        } else {
          createAll();
        }
      }, 500);
    })();

    return () => {
      cancelled = true;
    };
  }, [ids]);

  // Carousel logic (2 tweets per page)
  const STEP = 2;
  const pages = Math.max(1, Math.ceil(ids.length / STEP));
  const [page, setPage] = useState(0);
  const next = useCallback(() => setPage((p) => (p + 1) % pages), [pages]);
  const prev = useCallback(() => setPage((p) => (p - 1 + pages) % pages), [pages]);

  useEffect(() => {
    const t = setInterval(next, 30000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className="relative mt-6">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {Array.from({ length: pages }).map((_, pi) => {
            const slice = ids.slice(pi * STEP, pi * STEP + STEP);
            return (
              <div key={pi} className="w-full shrink-0 px-0">
                <div className="grid grid-cols-2 gap-6">
                  {slice.map((id) => (
                    <div
                      key={id}
                      className="rounded-2xl border-[3px] md:border-4 border-[#0A84FF] bg-white text-black p-4 shadow-[0_14px_30px_rgba(0,0,0,.25)]"
                    >
                      <div
                        ref={attachHolder(id)}
                        className="[&_.twitter-tweet]:m-0 [&_.twitter-tweet]:mx-auto"
                      />
                    </div>
                  ))}
                  {slice.length === 1 && (
                    <div className="rounded-2xl border-[3px] md:border-4 border-transparent" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        aria-label="Previous tweets"
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white text-black border-4 border-black grid place-items-center shadow-lg"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next tweets"
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white text-black border-4 border-black grid place-items-center shadow-lg"
      >
        ›
      </button>
    </div>
  );
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

/* ============================== PAGE ============================== */

export default function Page() {
  // Lightbox uses the full MEME_POOL so you can step through *all* images
  const lb = useLightbox(MEME_POOL.length);

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
    <div className="min-h-screen text-slate-100">

      {/* ================= HERO ================= */}
      <section
        id="top"
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          minHeight: "100vh",
        }}
      >
        {SIGN_LINKS.map(({ key, label, href }) => {
          const r = HERO_HITBOXES[key];
          const palette = BOARD_STYLE[key] || { bg: "#fff", color: "#111" };
          const style: CSSProperties = {
            position: "absolute",
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
            transform: `rotate(${r.rot || "0deg"})`,
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
            paddingInline: "0.5vw",
          };
          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              style={style}
              className="select-none"
            >
              <span
                className={`${luckiest.className} font-black leading-none`}
                style={{
                  fontSize: "clamp(10px, 0.9vw + 7px, 16px)",
                  letterSpacing: 0.5,
                  textShadow: "0 2px 0 rgba(0,0,0,.35)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </a>
          );
        })}

        {/* Contract banner with tiny copy button */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[9%] w-[min(1600px,96vw)] px-4">
          <div
            className="relative rounded-[28px] text-center overflow-hidden"
            style={{
              background: "#a87450",
              border: "6px solid #0f0f0f",
              boxShadow:
                "0 14px 0 rgba(0,0,0,.45), 0 22px 36px rgba(0,0,0,.35), inset 0 6px 0 rgba(255,255,255,.25), inset 0 -7px 0 rgba(0,0,0,.22)",
            }}
          >
            <span
              className={`${luckiest.className} block leading-none mx-auto py-4 md:py-5 px-10`}
              style={{
                fontSize: "clamp(25px, 2.4vw + 10px, 48px)",
                color: "#ffffff",
                WebkitTextStroke: "4px #0f0f0f",
                paintOrder: "stroke fill",
                textShadow: "0 4px 0 rgba(0,0,0,.35)",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
              }}
            >
              CA: {SITE.TOKEN.contract}
            </span>

            {/* tiny copy button */}
            <button
              onClick={onCopy}
              aria-label="Copy CA"
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md border-2 border-black bg-white w-9 h-9 hover:scale-105 active:scale-95 transition"
              title={copied ? "Copied!" : "Copy CA"}
            >
              {copied ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="black"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

      {/* ================= MEMES (2×2 grid, auto-rotating, NO CTA) ================= */}
      <section
        id="memes"
        className="relative"
        style={{
          height: "100vh",
          backgroundImage: `url(${MEMES_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          ["--reserveVH" as any]: "28vh",
        } as CSSProperties}
      >
        <div className="mx-auto w-[92vw] max-w-[1340px] h-full flex flex-col">
          <div
            className="rounded-[28px] border-[6px] border-neutral-900 shadow-[0_18px_40px_rgba(0,0,0,.35)] bg-[#a87450]/95 px-5 md:px-8 lg:px-10 py-5 md:py-7 lg:py-8 mt-5 overflow-hidden"
            style={{
              boxShadow:
                "0 18px 40px rgba(0,0,0,.35), inset 0 6px 0 rgba(255,255,255,.2), inset 0 -7px 0 rgba(0,0,0,.22)",
            }}
          >
            <h2
              className={`${luckiest.className} text-white leading-none mb-4`}
              style={{ fontSize: "clamp(44px, 3.6vw + 16px, 72px)" }}
            >
              Memes
            </h2>

            {/* 2×2 big image grid — auto updates every 30s */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <section id="community" className="py-16" style={{ background: "black" }}>
        <div className="mx-auto max-w-[1340px] w-[92vw]">
          <h2
            className={`${luckiest.className} text-white leading-none`}
            style={{ fontSize: "clamp(44px, 3.6vw + 16px, 72px)" }}
          >
            Our Community is Always Active
          </h2>

          {/* 2-card carousel (tweets created in-place) */}
          <TweetWall ids={TWEET_IDS} />

        </div>
      </section>

      {/* ================= WHITEPAPER (between lore and chart) ================= */}
      <section id="whitepaper" className="bg-black text-white py-16">
        <div className="mx-auto w-[92vw] max-w-[1340px]">
          <h2
            className={`${luckiest.className} text-white leading-none mb-6`}
            style={{ fontSize: "clamp(44px, 3.6vw + 16px, 72px)" }}
          >
            Whitepaper
          </h2>

          <div className="rounded-xl border-4 border-white bg-[#0A84FF] overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,.65)] p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] items-center gap-8">
              <img
                src="/mambo-body-10-whitepaper.png"
                alt="Gorilla illustration"
                className="w-full md:w-[340px] mx-auto"
              />
              <div className="text-white">
                <p
                  className={`${luckiest.className} leading-tight`}
                  style={{ fontSize: "clamp(28px, 2.6vw + 12px, 44px)" }}
                >
                  Ready to learn more about $MAMBO?
                </p>

                <a
                  className="mt-6 inline-flex items-center gap-3 rounded-full bg-black text-white border-2 border-white px-5 py-3"
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
      <section id="extra-howbuy" className="bg-black text-white py-16">
        <div className="mx-auto max-w-[1340px] w-[92vw]">
          <h2
            className={`${luckiest.className} text-white leading-none`}
            style={{ fontSize: "clamp(44px, 3.6vw + 16px, 72px)" }}
          >
            Mambo Lore
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-7">
            <div className="rounded-xl border-4 border-white bg-[#0A84FF] overflow-hidden">
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
            <div className="rounded-xl border-4 border-white bg-[#0A84FF] overflow-hidden">
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
            <div className="rounded-xl border-4 border-white bg-[#0A84FF] overflow-hidden">
              <img
                src="/cards/mambo_basketball.png"
                alt="No selling art"
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="text-white p-4 text-sm leading-tight">
                <div className="font-extrabold text-[25px]">CHADS ONLY</div>
                <div className="font-extrabold text-[25px]">NO SELLING</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRICE ACTION (no search; fixed symbol) ================= */}
      <section id="live-chart" className="bg-black text-white py-16">
        <div className="mx-auto max-w-[1340px] w-[92vw]">
          <h2
            className={`${luckiest.className} text-white leading-none`}
            style={{ fontSize: "clamp(44px, 3.6vw + 16px, 72px)" }}
          >
            Live Chart
          </h2>
          <div className="rounded-2xl border-4 border-white bg-black p-3 shadow-[0_18px_40px_rgba(0,0,0,.35)] overflow-hidden">
            <TradingViewChart symbol={FIXED_CHART_SYMBOL} />
          </div>
        </div>
      </section>

      {/* ================= HOW TO BUY ================= */}
      <section id="extra-howbuy-2" className="bg-black text-white py-16">
        <div className="mx-auto max-w-[1340px] w-[92vw]">
          <h2
            className={`${luckiest.className} text-white leading-none`}
            style={{ fontSize: "clamp(44px, 3.6vw + 16px, 72px)" }}
          >
            How to Buy
          </h2>

          <div className="rounded-2xl border-4 border-white bg-[#0A84FF] px-4 py-4 shadow-[0_18px_40px_rgba(0,0,0,.35)]">
            <div className="grid grid-cols-1 md:grid-cols-4 text-center font-extrabold divide-y md:divide-y-0 md:divide-x-2 divide-white/70">
              {[
                ["Step 1", "Download Metamask Wallet"],
                ["Step 2", "Load up ETH from an Exchange"],
                ["Step 3", "Copy the CA"],
                ["Step 4", "Head over to Uniswap and buy $MAMBO"],
              ].map(([s, t]) => (
                <div key={s} className="py-2 px-3">
                  <div className="text-white text-xl">{s}</div>
                  <div className="text-[13px] leading-tight opacity-90">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= GAME PLACEHOLDER ================= */}
      <section id="game" className="bg-black text-white py-18">
        <div className="mx-auto max-w-[1340px] w-[92vw]">
          <div className="rounded-2xl border-4 border-white bg-[#555] grid place-items-center h-[340px] md:h-[420px] overflow-hidden">
            <div className="text-center">
              <h2
                className={`${luckiest.className} text-white leading-none`}
                style={{ fontSize: "clamp(44px, 3.6vw + 16px, 72px)" }}
              >
                GAME
              </h2>
              <div className="text-red-400 font-extrabold mt-1">(coming soon)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PARTNERS ================= */}
      <section id="partners" className="py-18 bg-black">
        <div className="mx-auto w-[92vw] max-w-[1340px]">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              <div>
                <h2
                  className={`${luckiest.className} text-white leading-none`}
                  style={{ fontSize: "clamp(44px, 3.6vw + 16px, 72px)" }}
                >
                  PARTNERS
                </h2>
                <p className="text-white/90 text-xl md:text-2xl mt-6 tracking-[0.2em]">
                  We collaborate with brands worldwide.
                </p>
              </div>
              <div className="flex items-center gap-10 text-white">
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
                  className="rounded-xl border-4 border-white bg-[#0A84FF] h-16 md:h-20 flex items-center justify-center p-2"
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
                className="rounded-xl border-2 border-white text-white px-6 h-16 md:h-20 flex items-center justify-between col-span-1 md:col-span-2 lg:col-span-1"
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

      {/* ================= FOOTER ================= */}
      <footer className="bg-black text-slate-400 border-t border-white/10 py-6">
        <div className="mx-auto max-w-[1340px] w-[92vw]">
          © {new Date().getFullYear()} MAMBO LLC · NFA · DYOR · WAGMI
        </div>
      </footer>
    </div>
  );
}
