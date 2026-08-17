"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { fetchRemoteHighlightedText, pushLocalHighlightsToRemote } from "@/lib/highlight-remote";
import {
  ensureHighlightsMetaForLocalContent,
  highlightedTextToHighlightsMap,
  notifyHighlightsUpdated,
  readHighlightsMeta,
  shouldSyncHighlightsNow,
  writeLocalHighlights,
} from "@/lib/lesson-highlights";

export function HighlightSync() {
  const { status } = useSession();
  const syncingRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;

    async function hydrateOrSync(opts?: { keepalive?: boolean }) {
      if (cancelled || syncingRef.current) return;
      ensureHighlightsMetaForLocalContent();
      const meta = readHighlightsMeta();

      if (shouldSyncHighlightsNow(meta)) {
        syncingRef.current = true;
        try {
          const ok = await pushLocalHighlightsToRemote(opts?.keepalive === true);
          if (ok && !cancelled) {
            notifyHighlightsUpdated();
          }
        } finally {
          syncingRef.current = false;
        }
        return;
      }

      if (meta.dirty) return;
      if (opts?.keepalive) return;

      syncingRef.current = true;
      try {
        const remote = await fetchRemoteHighlightedText();
        if (cancelled || remote === null) return;
        if (readHighlightsMeta().dirty) return;
        writeLocalHighlights(highlightedTextToHighlightsMap(remote));
        notifyHighlightsUpdated();
      } finally {
        syncingRef.current = false;
      }
    }

    void hydrateOrSync();
    const interval = window.setInterval(() => {
      void hydrateOrSync();
    }, 60_000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") void hydrateOrSync();
      else void hydrateOrSync({ keepalive: true });
    };
    const onPageHide = () => {
      void hydrateOrSync({ keepalive: true });
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onVisibility);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onVisibility);
    };
  }, [status]);

  return null;
}
