import { ImageResponse } from "next/og";
import { siteMeta } from "@/content/site";

export const alt = "Bankai - marketing agency in Almaty, Kazakhstan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Тот же макет, что и у RU-обложки (app/(ru)/opengraph-image.tsx), подписи - EN. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1c1a18",
          color: "#f4f2ee",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", width: 64, height: 5, backgroundColor: "#f14736" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div style={{ fontSize: 132, letterSpacing: -4, lineHeight: 1 }}>Bankai</div>
            <div
              style={{
                display: "flex",
                width: 18,
                height: 18,
                marginLeft: 12,
                marginBottom: 18,
                borderRadius: 9,
                backgroundColor: "#f14736",
              }}
            />
          </div>
          <div style={{ marginTop: 28, fontSize: 40, color: "#b8b3aa", letterSpacing: -1 }}>
            Marketing agency - lead generation, end to end
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#b8b3aa",
          }}
        >
          <div style={{ display: "flex" }}>{siteMeta.url.replace("https://", "")}</div>
          <div style={{ display: "flex" }}>Almaty · US, EU and Kazakhstan</div>
        </div>
      </div>
    ),
    size,
  );
}
