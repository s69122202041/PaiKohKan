// โหมด SPA (ssr: false) เหมาะกับ GitHub Pages เพราะสถานะของทริปส่งผ่าน query string ในลิงก์
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  nitro: { preset: 'github_pages' },
  typescript: { tsConfig: { compilerOptions: { noUncheckedIndexedAccess: false } } },
  app: {
    // ตอน deploy บน GitHub Actions จะตั้งค่าเป็น /ชื่อ-repo/ ให้อัตโนมัติ
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'th' },
      title: 'ไปเกาะกัน — วางแผนทริปเกาะอันดามัน',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@600;700&family=Sarabun:wght@400;600;700&display=swap'
      }]
    }
  }
})
