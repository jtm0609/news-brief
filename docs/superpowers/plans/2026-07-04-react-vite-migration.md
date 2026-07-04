# QuickBrief React + Vite 이전 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 Vanilla QuickBrief를 화면·동작 그대로 유지한 채 React + Vite 프로젝트로 1:1 이전한다.

**Architecture:** Vite로 번들링하는 React SPA. 단일 `index.html` + `HashRouter`로 목록(`/`)·상세(`/article/:id`) 두 화면. 데이터는 `src/data/articles.js`(더미 20개)를 `src/lib/api.js`가 공급(격리 유지). 스타일은 CSS Modules(전역 변수/리셋은 `global.css`). api 계층은 Vitest로 자동 테스트.

**Tech Stack:** React 18, react-dom, react-router-dom v6, Vite 5, @vitejs/plugin-react, Vitest, CSS Modules, JavaScript(.jsx).

## Global Constraints

- 순수 1:1 이전(기능 동결): 새 기능(검색 동작·다크모드·TS·BrowserRouter·배포) 금지.
- 언어는 JavaScript(.jsx). TypeScript 사용 금지.
- 라우팅은 `react-router-dom`의 `HashRouter` 사용(`BrowserRouter` 아님).
- 스타일은 CSS Modules(`*.module.css`) + 전역 `src/styles/global.css`(:root 변수/리셋/body만).
- 데이터 접근은 `src/lib/api.js`의 `getArticles`/`getArticleById`/`getCategories`만 통해서. 컴포넌트가 `ARTICLES`를 직접 import하지 않는다(테스트 파일 제외).
- 카테고리는 하드코딩 금지 — 항상 `getCategories()`로 도출.
- 시각적 결과(레이아웃/색/간격/반응형 분기 640px·960px)는 기존과 동일해야 한다.
- 모든 텍스트는 JSX로 렌더(React 자동 이스케이프) — `dangerouslySetInnerHTML` 금지.
- 인코딩 UTF-8.
- **Node PATH 주의:** Node.js는 Task 1에서 winget으로 설치한다. 설치 직후 기존 셸에는 PATH가 반영되지 않을 수 있다. 검증 명령은 **새 PowerShell 호출**로 실행하고, `npm`이 안 잡히면 전체 경로 `& "C:\Program Files\nodejs\npm.cmd"`를 사용한다.

---

### Task 1: 환경 설치 + Vite/React 스캐폴드 (부팅 가능한 빈 앱)

**Files:**
- Create: `C:/Users/jtm06/news-brief/package.json`
- Create: `C:/Users/jtm06/news-brief/vite.config.js`
- Create: `C:/Users/jtm06/news-brief/index.html` (기존 Vanilla index.html을 덮어씀)
- Create: `C:/Users/jtm06/news-brief/src/main.jsx`
- Create: `C:/Users/jtm06/news-brief/src/App.jsx`
- Create: `C:/Users/jtm06/news-brief/src/styles/global.css`
- Modify: `C:/Users/jtm06/news-brief/.gitignore`

**Interfaces:**
- Consumes: 없음
- Produces: 부팅 가능한 Vite React 앱. `src/App.jsx`는 이후 Task 3/4에서 라우트로 교체됨. `#root` div, `main.jsx`가 마운트.

- [ ] **Step 1: Node.js LTS 설치 (winget)**

Run (PowerShell): `winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements`
Expected: "설치 성공" 또는 이미 설치됨 메시지. 이후 `& "C:\Program Files\nodejs\node.exe" --version`로 버전 확인(v20+ LTS).

- [ ] **Step 2: `package.json` 작성**

```json
{
  "name": "quickbrief",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.8",
    "vitest": "^2.1.2"
  }
}
```

- [ ] **Step 3: `vite.config.js` 작성 (vitest 설정 포함)**

`vitest/config`의 `defineConfig`를 써야 `test` 키가 인식된다.

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 4: `index.html` 작성 (Vite 진입점, 기존 파일 덮어씀)**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>QuickBrief — 핵심만 빠르게</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: `src/styles/global.css` 작성 (기존 style.css의 전역 부분만)**

```css
:root {
  --bg: #ffffff;
  --text: #1f2328;
  --text-dim: #6e7781;
  --line: #e6e8eb;
  --accent: #1a73e8;
  --summary-bg: #f3f7fe;
  --maxw: 1080px;
}

* { box-sizing: border-box; }
html, body { margin: 0; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  line-height: 1.6;
}
a { color: inherit; text-decoration: none; }
```

- [ ] **Step 6: `src/main.jsx` 작성**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
```

- [ ] **Step 7: `src/App.jsx` 임시 플레이스홀더 작성 (Task 3에서 교체)**

```jsx
export default function App() {
  return <h1 style={{ padding: 16 }}>QuickBrief (React 이전 진행 중)</h1>
}
```

- [ ] **Step 8: `.gitignore`에 node_modules / dist 추가**

기존 `.gitignore`(현재 `.superpowers/` 한 줄)에 다음 두 줄을 추가한다:
```
node_modules/
dist/
```

- [ ] **Step 9: 의존성 설치**

Run (새 PowerShell): `npm install` (안 잡히면 `& "C:\Program Files\nodejs\npm.cmd" install`)
Expected: `node_modules/` 생성, `package-lock.json` 생성, 오류 없음.

- [ ] **Step 10: dev/build 스모크 검증**

Run: `npm run build` (또는 전체경로 npm.cmd)
Expected: 오류 없이 `dist/` 생성("built in ..." 메시지). (dev 서버는 백그라운드가 필요하므로 build 성공으로 부팅 가능성 검증을 갈음한다.)

- [ ] **Step 11: 커밋**

```bash
cd /c/Users/jtm06/news-brief
git add package.json package-lock.json vite.config.js index.html src/ .gitignore
git commit -m "chore: scaffold Vite + React app (empty shell)"
```

---

### Task 2: 데이터 + api 계층 + Vitest 테스트

**Files:**
- Create: `C:/Users/jtm06/news-brief/src/data/articles.js`
- Create: `C:/Users/jtm06/news-brief/src/lib/api.js`
- Create: `C:/Users/jtm06/news-brief/src/lib/api.test.js`

**Interfaces:**
- Consumes: 없음 (기존 `js/data.js`의 데이터를 이식)
- Produces:
  - `export const ARTICLES` (배열, 20개; 각 글: `{id, category, title, thumbnail, source, publishedAt, summaryPoints, fullBody, sourceUrl}`)
  - `export function getArticles(): Article[]` (복사본)
  - `export function getArticleById(id): Article|null`
  - `export function getCategories(): string[]` (첫 등장 순서, 중복 제거)

- [ ] **Step 1: `src/data/articles.js` 작성 (기존 데이터 이식)**

기존 `C:/Users/jtm06/news-brief/js/data.js`를 읽어, `window.ARTICLES = [` 로 시작하는 배열 리터럴을 그대로 가져와 첫 줄만 `export const ARTICLES = [` 로 바꾼다. **20개 글 객체의 내용(문자열/필드)은 한 글자도 바꾸지 않는다.** 파일 끝은 `]` 로 닫는다. (필드: id, category, title, thumbnail, source, publishedAt, summaryPoints, fullBody, sourceUrl — 기존과 동일)

- [ ] **Step 2: 실패하는 테스트 작성 `src/lib/api.test.js`**

```js
import { describe, it, expect } from 'vitest'
import { ARTICLES } from '../data/articles.js'
import { getArticles, getArticleById, getCategories } from './api.js'

describe('api', () => {
  it('getArticles가 배열을 반환한다', () => {
    expect(Array.isArray(getArticles())).toBe(true)
  })
  it('getArticles가 20개 글을 반환한다', () => {
    expect(getArticles().length).toBe(20)
  })
  it('getArticles가 원본이 아닌 복사본을 반환한다', () => {
    expect(getArticles()).not.toBe(ARTICLES)
  })
  it('getArticleById가 정확한 글을 반환한다', () => {
    expect(getArticleById('econ-001').title).toBe('원·달러 환율 1,400원 돌파')
  })
  it('getArticleById가 없는 id에 null을 반환한다', () => {
    expect(getArticleById('nope-999')).toBe(null)
  })
  it('getCategories가 4개 카테고리를 반환한다', () => {
    expect(getCategories().length).toBe(4)
  })
  it('getCategories에 중복이 없다', () => {
    const cats = getCategories()
    expect(new Set(cats).size).toBe(cats.length)
  })
  it('getCategories가 첫 등장 순서를 따른다(경제가 먼저)', () => {
    expect(getCategories()[0]).toBe('경제')
  })
})
```

- [ ] **Step 3: 테스트 실행 → 실패 확인**

Run: `npm test`
Expected: `api.js`가 없어 import 실패로 전체 FAIL (모듈 해석 오류).

- [ ] **Step 4: `src/lib/api.js` 구현**

```js
import { ARTICLES } from '../data/articles.js'

export function getArticles() {
  return ARTICLES.slice()
}

export function getArticleById(id) {
  for (let i = 0; i < ARTICLES.length; i++) {
    if (ARTICLES[i].id === id) return ARTICLES[i]
  }
  return null
}

export function getCategories() {
  const seen = {}
  const order = []
  for (let i = 0; i < ARTICLES.length; i++) {
    const c = ARTICLES[i].category
    if (!seen[c]) {
      seen[c] = true
      order.push(c)
    }
  }
  return order
}
```

- [ ] **Step 5: 테스트 실행 → 통과 확인**

Run: `npm test`
Expected: 8개 테스트 모두 PASS ("Test Files 1 passed", "Tests 8 passed"). 20개/제목/카테고리 관련 실패 시 Step 1의 데이터 이식을 점검한다.

- [ ] **Step 6: 커밋**

```bash
cd /c/Users/jtm06/news-brief
git add src/data/articles.js src/lib/api.js src/lib/api.test.js
git commit -m "feat: port article data and api layer with Vitest tests"
```

---

### Task 3: 헤더 + 목록 화면 (Header, Home, CategorySection, ArticleCard)

**Files:**
- Create: `C:/Users/jtm06/news-brief/src/components/Header.jsx`
- Create: `C:/Users/jtm06/news-brief/src/components/Header.module.css`
- Create: `C:/Users/jtm06/news-brief/src/components/ArticleCard.jsx`
- Create: `C:/Users/jtm06/news-brief/src/components/ArticleCard.module.css`
- Create: `C:/Users/jtm06/news-brief/src/components/CategorySection.jsx`
- Create: `C:/Users/jtm06/news-brief/src/components/CategorySection.module.css`
- Create: `C:/Users/jtm06/news-brief/src/pages/Home.jsx`
- Create: `C:/Users/jtm06/news-brief/src/pages/Home.module.css`
- Modify: `C:/Users/jtm06/news-brief/src/App.jsx` (플레이스홀더 → 헤더 + 라우트)

**Interfaces:**
- Consumes: `getArticles()`, `getCategories()` (Task 2); `react-router-dom`의 `Link`, `Routes`, `Route`, `Navigate`
- Produces: 목록 화면. `ArticleCard`는 `<Link to={`/article/${id}`}>`로 상세 경로 링크(상세 라우트는 Task 4에서 추가; 그전까지 클릭 시 `*`→홈으로 돌아감 — 정상 중간 상태).

- [ ] **Step 1: `Header.jsx` + `Header.module.css`**

`Header.jsx`:
```jsx
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/">🗞 QuickBrief</Link>
        <nav className={styles.actions}>
          <button className={styles.iconBtn} aria-label="검색(준비 중)" disabled>🔍</button>
          <button className={styles.iconBtn} aria-label="메뉴">☰</button>
        </nav>
      </div>
    </header>
  )
}
```

`Header.module.css`:
```css
.header {
  position: sticky; top: 0; z-index: 10;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
}
.inner {
  max-width: var(--maxw); margin: 0 auto; padding: 12px 16px;
  display: flex; align-items: center; justify-content: space-between;
}
.brand { font-size: 20px; font-weight: 700; }
.actions { display: flex; gap: 8px; }
.iconBtn {
  border: none; background: transparent; font-size: 18px;
  cursor: pointer; padding: 6px; border-radius: 8px;
}
.iconBtn:hover:not([disabled]) { background: #f1f3f4; }
.iconBtn[disabled] { opacity: .4; cursor: default; }
```

- [ ] **Step 2: `ArticleCard.jsx` + `ArticleCard.module.css`**

`ArticleCard.jsx`:
```jsx
import { Link } from 'react-router-dom'
import styles from './ArticleCard.module.css'

export default function ArticleCard({ article }) {
  return (
    <Link className={styles.card} to={`/article/${article.id}`}>
      {article.thumbnail && (
        <img className={styles.thumb} src={article.thumbnail} alt="" />
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>{article.title}</h3>
        {article.summaryPoints && article.summaryPoints.length > 0 && (
          <p className={styles.lead}>• {article.summaryPoints[0]}</p>
        )}
        <span className={styles.more}>자세히 →</span>
      </div>
    </Link>
  )
}
```

`ArticleCard.module.css`:
```css
.card {
  display: flex; flex-direction: column;
  border: 1px solid var(--line); border-radius: 12px;
  overflow: hidden; background: #fff;
  transition: box-shadow .15s ease, transform .15s ease;
}
.card:hover { box-shadow: 0 6px 18px rgba(0,0,0,.08); transform: translateY(-2px); }
.thumb { width: 100%; height: 150px; object-fit: cover; background: #f1f3f4; }
.body { padding: 14px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.title { font-size: 16px; font-weight: 700; margin: 0; }
.lead { font-size: 14px; color: var(--text-dim); margin: 0; flex: 1; }
.more { font-size: 13px; color: var(--accent); font-weight: 600; align-self: flex-end; }
```

- [ ] **Step 3: `CategorySection.jsx` + `CategorySection.module.css`**

`CategorySection.jsx`:
```jsx
import ArticleCard from './ArticleCard.jsx'
import styles from './CategorySection.module.css'

export default function CategorySection({ category, articles }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{category}</h2>
      <div className={styles.grid}>
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  )
}
```

`CategorySection.module.css`:
```css
.section { margin-top: 28px; }
.title {
  font-size: 18px; font-weight: 700; margin: 0 0 12px;
  padding-left: 10px; border-left: 4px solid var(--accent);
}
.grid {
  display: grid; gap: 14px;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 960px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

- [ ] **Step 4: `Home.jsx` + `Home.module.css`**

`Home.jsx`:
```jsx
import { getArticles, getCategories } from '../lib/api.js'
import CategorySection from '../components/CategorySection.jsx'
import styles from './Home.module.css'

const MAX_PER_CATEGORY = 6

export default function Home() {
  const all = getArticles()
  const categories = getCategories()

  return (
    <main className={styles.feed}>
      {categories.map((cat) => {
        const items = all.filter((a) => a.category === cat).slice(0, MAX_PER_CATEGORY)
        if (items.length === 0) return null
        return <CategorySection key={cat} category={cat} articles={items} />
      })}
    </main>
  )
}
```

`Home.module.css`:
```css
.feed { max-width: var(--maxw); margin: 0 auto; padding: 8px 16px 48px; }
```

- [ ] **Step 5: `App.jsx`를 헤더 + 라우트로 교체**

```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
```

- [ ] **Step 6: 빌드 검증**

Run: `npm run build`
Expected: 오류 없이 `dist/` 생성. (CSS Modules/JSX 컴파일 오류 없음 확인.)

- [ ] **Step 7: 커밋**

```bash
cd /c/Users/jtm06/news-brief
git add src/components/ src/pages/Home.jsx src/pages/Home.module.css src/App.jsx
git commit -m "feat: build home list view (header, category sections, cards)"
```

---

### Task 4: 상세 화면 (Article, SummaryBox) + 상세 라우트

**Files:**
- Create: `C:/Users/jtm06/news-brief/src/components/SummaryBox.jsx`
- Create: `C:/Users/jtm06/news-brief/src/components/SummaryBox.module.css`
- Create: `C:/Users/jtm06/news-brief/src/pages/Article.jsx`
- Create: `C:/Users/jtm06/news-brief/src/pages/Article.module.css`
- Modify: `C:/Users/jtm06/news-brief/src/App.jsx` (상세 라우트 추가)

**Interfaces:**
- Consumes: `getArticleById(id)` (Task 2); `useParams`, `useState`, `useEffect`, `Link`
- Produces: 상세 화면. 상단 핵심 요약 → "자세히 보기" 토글 본문. 없는 id → not-found.

- [ ] **Step 1: `SummaryBox.jsx` + `SummaryBox.module.css`**

`SummaryBox.jsx`:
```jsx
import styles from './SummaryBox.module.css'

export default function SummaryBox({ points }) {
  return (
    <section className={styles.box}>
      <h2 className={styles.title}>핵심 요약</h2>
      <ul className={styles.list}>
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </section>
  )
}
```

`SummaryBox.module.css`:
```css
.box {
  background: var(--summary-bg); border: 1px solid #d8e6fb;
  border-radius: 12px; padding: 16px 18px; margin-bottom: 18px;
}
.title { font-size: 15px; margin: 0 0 10px; color: var(--accent); }
.list { margin: 0; padding-left: 18px; }
.list li { margin: 6px 0; font-size: 15px; }
```

- [ ] **Step 2: `Article.jsx` 작성**

```jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getArticleById } from '../lib/api.js'
import SummaryBox from '../components/SummaryBox.jsx'
import styles from './Article.module.css'

export default function Article() {
  const { id } = useParams()
  const article = getArticleById(id)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (article) document.title = article.title + ' — QuickBrief'
  }, [article])

  if (!article) {
    return (
      <main className={styles.notfound}>
        <p>글을 찾을 수 없습니다.</p>
        <Link className={styles.btnLink} to="/">← 메인으로 돌아가기</Link>
      </main>
    )
  }

  const paragraphs = article.fullBody.split('\n\n')

  return (
    <main className={styles.article}>
      <div className={styles.top}>
        <Link className={styles.btnLink} to="/">← 뒤로</Link>
        <span className={styles.badge}>{article.category}</span>
      </div>
      <h1 className={styles.title}>{article.title}</h1>
      <p className={styles.meta}>{article.source} · {article.publishedAt.replace('T', ' ')}</p>

      <SummaryBox points={article.summaryPoints} />

      <button className={styles.toggle} onClick={() => setExpanded((v) => !v)}>
        {expanded ? '접기 ▴' : '자세히 보기 ▾'}
      </button>

      {expanded && (
        <div className={styles.body}>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {article.sourceUrl && (
            <a
              className={styles.btnLink}
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              원문 보기 →
            </a>
          )}
        </div>
      )}
    </main>
  )
}
```

- [ ] **Step 3: `Article.module.css` 작성**

```css
.article { max-width: 720px; margin: 0 auto; padding: 16px 16px 64px; }
.top { display: flex; align-items: center; gap: 12px; margin: 8px 0 16px; }
.btnLink { color: var(--accent); font-weight: 600; font-size: 14px; }
.badge {
  font-size: 12px; padding: 3px 10px; border-radius: 999px;
  background: var(--summary-bg); color: var(--accent); font-weight: 600;
}
.title { font-size: 26px; line-height: 1.35; margin: 0 0 6px; }
.meta { color: var(--text-dim); font-size: 13px; margin: 0 0 20px; }
.toggle {
  width: 100%; padding: 12px; border: 1px solid var(--line);
  background: #fff; border-radius: 10px; cursor: pointer;
  font-size: 15px; font-weight: 600; color: var(--text);
}
.toggle:hover { background: #f8f9fa; }
.body { margin-top: 16px; }
.body p { margin: 0 0 14px; font-size: 16px; }
.notfound { text-align: center; padding: 64px 16px; display: grid; gap: 16px; }
```

- [ ] **Step 4: `App.jsx`에 상세 라우트 추가**

`Article` import와 `/article/:id` 라우트를 추가한다(전체 파일):
```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Article from './pages/Article.jsx'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
```

- [ ] **Step 5: 빌드 검증**

Run: `npm run build`
Expected: 오류 없이 `dist/` 생성.

- [ ] **Step 6: 커밋**

```bash
cd /c/Users/jtm06/news-brief
git add src/components/SummaryBox.jsx src/components/SummaryBox.module.css src/pages/Article.jsx src/pages/Article.module.css src/App.jsx
git commit -m "feat: build article detail page with summary and expandable body"
```

---

### Task 5: 옛 Vanilla 파일 제거 + README 갱신 + 최종 검증

**Files:**
- Delete: `C:/Users/jtm06/news-brief/article.html`
- Delete: `C:/Users/jtm06/news-brief/js/` (data.js, api.js, home.js, article.js)
- Delete: `C:/Users/jtm06/news-brief/css/` (style.css)
- Delete: `C:/Users/jtm06/news-brief/tests/` (run-tests.html, api.test.js)
- Modify: `C:/Users/jtm06/news-brief/README.md`

**Interfaces:**
- Consumes: 전체 산출물
- Produces: React 단일 프로젝트로 정리된 저장소.

- [ ] **Step 1: 옛 Vanilla 파일 제거**

Run:
```bash
cd /c/Users/jtm06/news-brief
git rm -r js css tests article.html
```
Expected: 4개 경로가 삭제 스테이징됨. (루트 `index.html`은 Task 1에서 이미 Vite용으로 교체되었으므로 제거 대상 아님.)

- [ ] **Step 2: `README.md` 갱신 (React 기준)**

```markdown
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
```

- [ ] **Step 3: 테스트 재실행**

Run: `npm test`
Expected: 8개 테스트 모두 PASS (파일 제거가 api/데이터에 영향 없음 확인).

- [ ] **Step 4: 최종 빌드 검증**

Run: `npm run build`
Expected: 오류 없이 `dist/` 생성.

- [ ] **Step 5: 수동 UI 검증 (dev 서버)**

Run: `npm run dev` (백그라운드) 후 브라우저로 표시된 `http://localhost:5173/` 접속. 확인:
1. 카테고리 섹션 + 카드 그리드가 기존과 동일하게 보인다.
2. 창 폭을 줄이면 3열 → 2열 → 1열로 접힌다.
3. 카드 클릭 → URL이 `#/article/econ-001` 등으로 바뀌며 상세로 이동.
4. 상세 상단에 핵심 요약이 먼저 보인다.
5. "자세히 보기 ▾" 클릭 → 본문 펼침, 버튼 "접기 ▴"로 변경.
6. 주소창에 `#/article/없는id` → "글을 찾을 수 없습니다." + 홈 링크.
7. 브라우저 콘솔 에러 없음.

Expected: 7개 항목 모두 통과. (dev 서버는 확인 후 종료.)

- [ ] **Step 6: 커밋**

```bash
cd /c/Users/jtm06/news-brief
git add -A
git commit -m "chore: remove legacy vanilla files and update README for React"
```

---

## Self-Review

**1. Spec coverage:**
- 프로젝트 구조(설계 4장) → Task 1·2·3·4에서 생성, Task 5에서 옛 파일 제거 ✅
- window 전역 → ES 모듈(설계 5장) → Task 2 api.js/articles.js가 import/export ✅
- 데이터 계층(설계 6장) → Task 2 ✅
- 컴포넌트 1:1 매핑(설계 7장: Header/Home/CategorySection/ArticleCard/Article/SummaryBox) → Task 3·4 ✅
- 라우팅(설계 8장: HashRouter, `/`·`/article/:id`·`*`→홈) → Task 1(HashRouter)·3·4(라우트) ✅
- CSS Modules + 전역(설계 9장) → Task 1(global.css) + Task 3·4(각 module.css) ✅
- 테스트(설계 10장: 9개 어서션) → Task 2 (8개 `it` + describe; 기존 9번째 "합계"는 러너가 자동 집계하므로 8개 `it`로 동일 검증) ✅
- 빌드/실행(설계 11장) → Task 1 scripts, 각 Task build 검증, Task 5 dev 검증 ✅
- 에러 처리(설계 12장) → Task 3(빈 카테고리·썸네일 조건부)·Task 4(없는 id·sourceUrl 조건부) ✅
- 검증/성공기준(설계 13장) → Task 5 Step 5 ✅

**2. Placeholder scan:** Task 1 Step 7의 "플레이스홀더"는 Task 3 Step 5에서 실제 라우트로 교체되는 의도된 중간물이며 빈 TODO가 아님. Task 2 Step 1은 기존 파일에서 데이터를 그대로 이식하라는 구체 지시(내용 불변). 그 외 TBD/모호 표현 없음. ✅

**3. Type consistency:** `getArticles()`/`getArticleById(id)`/`getCategories()` 시그니처가 Task 2 정의와 Task 3·4 사용처에서 일치. props 이름(`article`, `category`, `articles`, `points`) 일관. 글 객체 필드명이 설계·데이터·소비처에서 동일. CSS Modules 로컬 클래스명(`header/inner/brand/actions/iconBtn`, `card/thumb/body/title/lead/more`, `section/title/grid`, `feed`, `box/title/list`, `article/top/btnLink/badge/title/meta/toggle/body/notfound`)이 각 컴포넌트 JSX와 module.css에서 일치. ✅

스펙 누락 없음 — 추가 작업 불필요.
