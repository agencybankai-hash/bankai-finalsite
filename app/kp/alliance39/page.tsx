"use client";

import { useEffect } from "react";

const TARGET = "https://claude.ai/artifact/T2nYgDzfzwZmYoqBxm1GN2";

export default function KpAlliance39Page() {
  useEffect(() => {
    window.location.replace(TARGET);
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
      <meta httpEquiv="refresh" content={`0;url=${TARGET}`} />
      <p style={{ fontSize: 16, lineHeight: 1.5 }}>
        Открываем коммерческое предложение…
        <br />
        <a href={TARGET} style={{ color: "#E8432D" }}>
          Перейти к документу
        </a>
      </p>
    </main>
  );
}
