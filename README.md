# QuickBrief

출퇴근 등 짧은 시간에 뉴스·정보를 핵심만 빠르게 파악하는 웹 서비스 (React + Vite).

## 요구 사항

- Node.js 20+ (LTS)

## 실행 방법

```
npm install
npm run dev      # 개발 서버
npm run build    # 정적 산출물(dist/)
npm run preview  # 빌드 미리보기
npm test         # api 계층 테스트(Vitest)
```

## 구조

- `index.html` — Vite 진입점(단일 HTML)
- `src/main.jsx` — 앱 마운트 + HashRouter
- `src/App.jsx` — 라우트(`/` 목록, `/article/:id` 상세)
- `src/data/articles.js` — 더미 기사 데이터
- `src/lib/api.js` — 데이터 공급 격리 계층(후속 RSS/AI 연동 시 이 파일만 교체)
- `src/pages/` — Home, Article 화면
- `src/components/` — Header, CategorySection, ArticleCard, SummaryBox
- `src/styles/global.css` — 전역 변수/리셋

## 후속 단계

- TypeScript 전환
- BrowserRouter 전환 및 정적 배포(GitHub Pages)
- 검색 기능 동작, 다크모드
- `src/lib/api.js`를 실제 RSS/뉴스 API + AI 요약으로 교체
