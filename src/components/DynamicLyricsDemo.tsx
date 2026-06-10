"use client";

import dynamic from "next/dynamic";

const LyricsDemo = dynamic(() => import("@/components/LyricsDemo"), {
  ssr: false,
});

export default function DynamicLyricsDemo() {
  return <LyricsDemo />;
}
