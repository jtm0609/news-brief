# QuickBrief — React + Vite 이전 (설계 문서)

- 작성일: 2026-07-04
- 성격: 순수 1:1 이전 (like-for-like migration, 기능 동결)
- 대상: 기존 Vanilla(HTML/CSS/JS) QuickBrief → React + Vite

## 1. 목적

현재 QuickBrief는 순수 HTML/CSS/Vanilla JS 정적 웹앱이다. 이를 React + Vite 기반으로
이전한다. **화면·기능·디자인은 그대로 유지**하고 내부 구현 기반만 교체한다. 새 기능(검색,
다크모드, TypeScript, BrowserRouter, 배포 등)은 이번 범위에서 제외하고 이전 완료 후
별도 작업으로 진행한다.

## 2. 결정 사항 (확정)

| 항목 | 결정 | 비고 |
|---|---|---|
| 전제 | Node.js LTS 설치 (winget) | 구현 시작 시 |
| 범위 | 순수 1:1 이전, 기능 동결 | |
| 언어 | JavaScript (.jsx) | TS 전환은 추후 별도 작업 |
| 실행 | 로컬 dev + build만 | 배포(GitHub Pages)는 추후 |
| 라우팅 | React Router `HashRouter` | BrowserRouter 전환은 추후 |
| 스타일 | CSS Modules + 전역 CSS | 전역 CSS는 변수/리셋/body |
| 옛 파일 | 대체(제거), git 히스토리로 보존 | |
| 테스트 | Vitest로 api 계층 (9개 어서션) | |

## 3. 범위

### 이번 범위
- Vite + React 프로젝트로 재구성, 기존 UI/UX/디자인 1:1 유지.
- 기존 20개 더미 기사와 데이터 공급 로직(`getArticles`/`getArticleById`/`getCategories`) 이식.
- HashRouter 기반 두 화면(목록 `/`, 상세 `/article/:id`).
- CSS Modules로 컴포넌트 스타일 분리(전역 변수/리셋은 전역 CSS 유지).
- Vitest로 api 계층 자동 테스트.

### 제외 (추후 별도 작업)
- 새 기능: 검색 동작, 다크모드 등.
- TypeScript 전환.
- BrowserRouter 전환 및 서버 라우팅 설정.
- 배포(GitHub Pages 등).
- 컴포넌트 렌더 테스트(React Testing Library) — 이번엔 api 계층만.

## 4. 프로젝트 구조

```
news-brief/
├── index.html              # Vite 진입점 (단일 HTML, <div id="root">)
├── package.json            # react, react-dom, react-router-dom, vite, vitest
├── vite.config.js          # base: './', @vitejs/plugin-react, vitest 설정
├── .gitignore              # node_modules, dist 등 추가
├── src/
│   ├── main.jsx            # ReactDOM 루트 + <HashRouter> + global.css import
│   ├── App.jsx             # <Header/> + <Routes>
│   ├── data/
│   │   └── articles.js     # export const ARTICLES (기존 20개 이식)
│   ├── lib/
│   │   ├── api.js          # getArticles/getArticleById/getCategories (ES export)
│   │   └── api.test.js     # Vitest 9개 어서션
│   ├── pages/
│   │   ├── Home.jsx        # 카테고리 섹션 + 카드 그리드
│   │   └── Article.jsx     # 핵심 요약 → 자세히 보기, not-found
│   ├── components/
│   │   ├── Header.jsx       + Header.module.css
│   │   ├── CategorySection.jsx + CategorySection.module.css
│   │   ├── ArticleCard.jsx     + ArticleCard.module.css
│   │   └── SummaryBox.jsx      + SummaryBox.module.css
│   └── styles/
│       └── global.css      # :root 변수, 리셋, body (기존 style.css 전역 부분)
```

제거 대상(기존 Vanilla): `article.html`, `js/data.js`, `js/api.js`, `js/home.js`,
`js/article.js`, `css/style.css`, `tests/run-tests.html`, `tests/api.test.js`,
그리고 루트의 기존 `index.html`(Vite용으로 새로 작성). README는 React 기준으로 갱신.

## 5. 핵심 구현 변화

- **`window` 전역 → ES 모듈 import/export**: Vite가 번들링하므로 `window.ARTICLES` 대신
  `import { ARTICLES } from '../data/articles'`, `import { getArticles } from '../lib/api'`.
  (기존 file:// 제약이 사라지므로 모듈 시스템을 정상 사용)
- **DOM 생성 → JSX**: `document.createElement` + `textContent` 로직을 JSX로 표현.
  React가 텍스트를 자동 이스케이프하므로 XSS 안전성 유지.
- **두 HTML 페이지 → 단일 index.html + 라우트**.
- **카드 `<a href>` → `<Link to>`**, **쿼리 `?id` → 라우트 파라미터 `:id`(useParams)**.
- **토글 addEventListener → useState**, **문서 타이틀 → useEffect**.
- **데이터 공급 격리 유지**: `lib/api.js`가 데이터 경계. 추후 RSS/AI 연동 시 이 파일만 교체.

## 6. 데이터 계층 (`src/data/articles.js`, `src/lib/api.js`)

`articles.js`:
```js
export const ARTICLES = [ /* 기존 20개 기사 객체 그대로 */ ];
```

`api.js` (ES 모듈):
```
getArticles()        → ARTICLES의 복사본 배열 반환
getArticleById(id)   → 매칭 기사 또는 null
getCategories()      → 등장 카테고리를 첫 등장 순서대로 중복 없이 반환
```
글 객체 필드는 기존과 동일: `id, category, title, thumbnail, source, publishedAt,
summaryPoints, fullBody, sourceUrl`.

## 7. 컴포넌트 (1:1 매핑)

- **Header**: 브랜드(`<Link to="/">`), 검색 버튼(비활성, 자리만), 메뉴 버튼. (기존 헤더 마크업)
- **Home (page)**: `getCategories()` 순회 → 각 카테고리에 대해 `getArticles()`에서 해당
  카테고리 글을 최대 6개 뽑아 `<CategorySection>` 렌더. 글 0개인 카테고리는 렌더 안 함.
- **CategorySection**: `cat-section__title` 상당의 제목 + `card-grid` 상당의 반응형 그리드
  (1열 → 640px 2열 → 960px 3열) + `<ArticleCard>` 목록.
- **ArticleCard**: `<Link to={`/article/${id}`}>`. 썸네일(`thumbnail` truthy일 때만) +
  제목 + 첫 `summaryPoints[0]`("• " 접두) + "자세히 →".
- **Article (page)**: `useParams()`로 id → `getArticleById`.
  - 없으면(빈 id 또는 매칭 없음): "글을 찾을 수 없습니다." + 홈 링크.
  - 있으면: 상단 바(`<Link to="/">← 뒤로` + 카테고리 뱃지), 제목, 메타(`source · publishedAt`,
    "T"→공백), `<SummaryBox>`(요약 먼저 노출), "자세히 보기 ▾" 토글 버튼, 접힘 본문
    (`fullBody`를 "\n\n"으로 분리한 문단들 + `sourceUrl` 있을 때만 "원문 보기 →").
    토글 클릭 시 본문 표시/숨김 + 버튼 텍스트 "자세히 보기 ▾" ↔ "접기 ▴".
    `useEffect`로 `document.title = article.title + " — QuickBrief"`.
- **SummaryBox**: "핵심 요약" 제목 + `summaryPoints`의 `<ul>`.

## 8. 라우팅 & 상호작용

- `main.jsx`: `<HashRouter><App/></HashRouter>`, `global.css` import.
- `App.jsx`: `<Header/>` 상시 렌더 + `<Routes>`:
  - `/` → `<Home/>`
  - `/article/:id` → `<Article/>`
  - `*` → `<Navigate to="/" replace/>` (알 수 없는 경로는 홈으로)
- URL: 목록 `#/`, 상세 `#/article/econ-001`. 새로고침·공유 시에도 동일 화면 복원(HashRouter).

## 9. 스타일 (CSS Modules)

- 전역 `src/styles/global.css`: 기존 `style.css`의 `:root` 변수, `* box-sizing`,
  `html/body`, 링크 리셋 등 전역 규칙만.
- 컴포넌트별 `*.module.css`: 기존 클래스 규칙을 해당 컴포넌트 모듈로 이관. 클래스명은
  모듈 로컬名으로 바뀌되(예: `styles.card`), **시각적 결과(레이아웃/색/반응형)는 동일**.
- 반응형 그리드(1/2/3열, 640/960px 분기)는 CategorySection 모듈에 유지.

## 10. 테스트 (Vitest)

`src/lib/api.test.js` — 기존 9개 어서션을 Vitest로 이식(`import` 사용):
1. `getArticles()`가 배열 반환
2. 길이 20
3. `getArticles() !== ARTICLES` (복사본)
4. `getArticleById("econ-001").title` === 실제 제목
5. `getArticleById("nope-999")` === null
6. `getCategories().length` === 4
7. 카테고리 중복 없음
8. `getCategories()[0]` === "경제"
9. (합계 검증 대체) 위 8개가 모두 성립

`npm test`(= `vitest run`)로 이 PC에서 실제 실행되어 통과해야 함.

## 11. 빌드 / 실행

- `npm install` → 의존성 설치
- `npm run dev` → 개발 서버(화면 확인)
- `npm run build` → `dist/` 정적 산출물
- `npm run preview` → 빌드 산출물 미리보기
- `npm test` → Vitest 실행

`vite.config.js`의 `base: './'`로 산출물이 경로에 독립적이도록 함(추후 정적 배포 대비).

## 12. 에러 처리 (기존과 동일)

- 상세: 없는/빈 id → "글을 찾을 수 없습니다." + 홈 링크.
- 썸네일 없으면(`thumbnail` falsy) 이미지 미렌더(깨진 이미지 방지).
- 빈 카테고리는 섹션 미렌더.
- `sourceUrl` 없으면 "원문 보기" 링크 미렌더.

## 13. 검증 & 성공 기준

`npm install` 후:
1. `npm test` → 9개 어서션 전부 통과.
2. `npm run dev` → 브라우저에서:
   - 카테고리 섹션 + 카드 그리드가 기존과 동일하게 보인다.
   - 창 폭을 줄이면 2열 → 1열로 접힌다.
   - 카드 클릭 → `#/article/:id` 상세로 이동.
   - 상세 상단에 핵심 요약이 먼저 보인다.
   - "자세히 보기" → 본문 펼침, 버튼 "접기 ▴"로 변경.
   - `#/article/없는id` → "글을 찾을 수 없습니다." + 홈 링크.
3. `npm run build` → 오류 없이 `dist/` 생성.

**성공 기준**: 위 검증을 모두 통과하고, 사용자가 체감하는 화면·동작이 기존 Vanilla 버전과
동일하다(1:1 이전 달성). 데이터 공급 경계(`lib/api.js`)가 유지되어 추후 RSS/AI 연동과
새 기능 확장의 토대가 된다.
