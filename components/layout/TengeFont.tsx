/**
 * Знак тенге U+20B8 из крошечных сабсетов (public/fonts, ~1 КБ каждый,
 * вырезаны из тех же файлов Inter и TikTok Sans, лицензия OFL). У Google
 * Fonts этот символ лежит в подмножестве latin-ext, и ради него браузер
 * качал бы 83 КБ Inter и 25 КБ TikTok Sans. Правила рендерятся <style>
 * в body, то есть в документе ПОСЛЕ таблиц стилей next/font: для одного
 * кодпоинта побеждает последнее объявление @font-face той же семьи.
 * local() здесь не годится: системный шрифт может не содержать глиф.
 */
const css = `
@font-face{font-family:"Inter";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/inter-tenge.woff2) format("woff2");unicode-range:U+20B8}
@font-face{font-family:"TikTok Sans";font-style:normal;font-weight:300 900;font-display:swap;src:url(/fonts/tiktok-sans-tenge.woff2) format("woff2");unicode-range:U+20B8}
`.trim();

export function TengeFont() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
