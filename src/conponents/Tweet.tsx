"use client";

import { useEffect, useRef } from "react";

const TW_SRC = "https://platform.twitter.com/widgets.js";

// load the script once
let scriptPromise: Promise<void> | null = null;
function loadTwitterScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).twttr?.widgets) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve) => {
      const s = document.createElement("script");
      s.src = TW_SRC;
      s.async = true;
      s.onload = () => resolve();
      document.body.appendChild(s);
    });
  }
  return scriptPromise;
}

export default function Tweet({ id }: { id: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadTwitterScript().then(() => {
      if (cancelled || !hostRef.current) return;

      // Clear previous render if the id changes
      hostRef.current.innerHTML = "";

      (window as any).twttr?.widgets?.createTweet(id, hostRef.current, {
        theme: "dark",         // dark widget to match your site
        dnt: true,             // “Do Not Track”
        align: "center",
        conversation: "none",  // hide replies
        width: "100%",
      });
    });

    return () => {
      cancelled = true;
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, [id]);

  // Optional: reserve height to reduce layout shift while loading
  return <div ref={hostRef} className="w-full min-h-[160px]" />;
}
