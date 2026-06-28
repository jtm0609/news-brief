# QuickBrief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 더미 데이터로 동작하는 "핵심만 빠르게 읽는 뉴스 웹 서비스(QuickBrief)" 1차 UI를 빌드 도구 없이 완성한다.

**Architecture:** 순수 HTML/CSS/Vanilla JS. 데이터(`data.js`) → 데이터 공급 격리 계층(`api.js`) → 화면 렌더링(`home.js`, `article.js`)으로 단방향 의존. 메인(`index.html`)은 카테고리별 반응형 카드 그리드, 상세(`article.html`)는 핵심 요약 → "자세히 보기" 아코디언.

**Tech Stack:** HTML5, CSS3(Grid + 미디어쿼리), Vanilla JavaScript (ES5/ES6 문법, 모듈 시스템 없음).

## Global Constraints

- **빌드 도구·Node.js 사용 금지.** 브라우저로 `index.html`을 더블클릭해 `file://`로 열어 동작해야 한다.
- **ES 모듈(import/export) 사용 금지.** `file://`에서 막힌다. 모든 스크립트는 일반 `<script>` 태그로 로드하고, 공유가 필요한 함수/데이터는 `window` 전역에 노출한다.
- **데이터 접근은 반드시 `api.js`의 함수를 통해서만.** `home.js`/`article.js`는 `window.ARTICLES`를 직접 참조하지 않는다.
- **카테고리는 하드코딩 금지.** 항상 데이터에서 도출한다.
- **인코딩은 UTF-8.** 모든 HTML에 `<meta charset="utf-8">` 포함.
- 제외(YAGNI): 로그인/개인화, 실제 RSS·AI 연동, 검색 동작, 더보기/페이지네이션, 다크모드.

---

### Task 1: 더미 데이터 (`data.js`)

**Files:**
- Create: `C:/Users/jtm06/news-brief/js/data.js`

**Interfaces:**
- Consumes: 없음
- Produces: 전역 `window.ARTICLES` — 글 객체 배열. 각 객체 형태:
  `{ id:string, category:string, title:string, thumbnail:string|null, source:string, publishedAt:string, summaryPoints:string[], fullBody:string, sourceUrl:string|null }`

- [ ] **Step 1: `data.js` 작성 — 전역 배열로 더미 글 정의**

설계 10장 범위: 카테고리 4개(경제 / IT·기술 / 사회 / 세계), 카테고리당 4~6개, 총 약 20개. 각 글은 핵심 불릿 3개 + 본문 2~3문단. 아래는 카테고리당 1개씩 본보기 + 채우기 규칙. **나머지 글도 동일한 형태로 카테고리당 5개가 되도록 채운다(총 20개).** `thumbnail`은 더미 이미지가 없으므로 모두 `null`로 둔다(렌더링 시 자동 생략됨). `id`는 `<카테고리축약>-001` 형식으로 유일하게 부여한다(econ-, tech-, soc-, world-).

```javascript
// js/data.js
// 더미 글 데이터. 모듈 시스템을 쓰지 않으므로 window 전역에 노출한다.
window.ARTICLES = [
  // ── 경제 (econ-001 ~ econ-005) ──
  {
    id: "econ-001",
    category: "경제",
    title: "원·달러 환율 1,400원 돌파",
    thumbnail: null,
    source: "한국경제",
    publishedAt: "2026-06-28T08:30",
    summaryPoints: [
      "원·달러 환율이 장중 1,400원을 넘어서며 연고점 경신",
      "수입 물가 상승으로 하반기 인플레 압력 확대 우려",
      "외환당국, 과도한 쏠림에 구두 개입 시사"
    ],
    fullBody: "28일 서울 외환시장에서 원·달러 환율이 장중 1,400원을 돌파했다. 미국의 금리 인하 지연 전망과 달러 강세가 맞물린 결과다.\n\n환율 상승은 수입 원자재 가격을 끌어올려 하반기 물가에 부담으로 작용할 전망이다. 정유·항공 등 달러 결제 비중이 큰 업종의 비용 부담도 커지고 있다.\n\n외환당국은 \"환율의 과도한 변동성에 대해 시장 안정 조치를 적극 검토하겠다\"며 구두 개입에 나섰다.",
    sourceUrl: "https://example.com/econ-001"
  },
  // ── IT·기술 (tech-001 ~ tech-005) ──
  {
    id: "tech-001",
    category: "IT·기술",
    title: "새 온디바이스 AI 모델 공개",
    thumbnail: null,
    source: "테크리뷰",
    publishedAt: "2026-06-28T09:10",
    summaryPoints: [
      "스마트폰에서 동작하는 경량 AI 모델 신규 공개",
      "인터넷 연결 없이 요약·번역 기능 처리 가능",
      "개인정보가 기기 밖으로 나가지 않아 보안 강점"
    ],
    fullBody: "한 기술 기업이 스마트폰에서 직접 구동되는 온디바이스 AI 모델을 공개했다. 클라우드 서버를 거치지 않고 기기 내부에서 연산을 처리한다.\n\n이 모델은 문서 요약, 번역, 음성 받아쓰기 등을 오프라인에서 수행한다. 네트워크가 없는 환경에서도 동작한다는 점이 특징이다.\n\n데이터가 기기를 벗어나지 않으므로 개인정보 보호 측면에서 유리하다는 평가가 나온다.",
    sourceUrl: "https://example.com/tech-001"
  },
  // ── 사회 (soc-001 ~ soc-005) ──
  {
    id: "soc-001",
    category: "사회",
    title: "수도권 출퇴근 광역버스 증차",
    thumbnail: null,
    source: "시민일보",
    publishedAt: "2026-06-28T07:50",
    summaryPoints: [
      "출퇴근 혼잡 노선에 광역버스 운행 횟수 확대",
      "다음 달부터 주요 30개 노선 우선 적용",
      "입석 승차 감소로 안전·편의 개선 기대"
    ],
    fullBody: "국토교통부가 수도권 출퇴근 혼잡을 완화하기 위해 광역버스 증차 계획을 발표했다. 다음 달부터 이용객이 많은 주요 노선에 우선 적용된다.\n\n증차 대상은 출퇴근 시간대 입석률이 높은 30개 노선이다. 배차 간격을 줄여 혼잡을 분산한다는 방침이다.\n\n당국은 입석 승차가 줄어 안전과 이용 편의가 함께 개선될 것으로 기대했다.",
    sourceUrl: "https://example.com/soc-001"
  },
  // ── 세계 (world-001 ~ world-005) ──
  {
    id: "world-001",
    category: "세계",
    title: "주요국 중앙은행 금리 동결 잇따라",
    thumbnail: null,
    source: "월드뉴스",
    publishedAt: "2026-06-28T06:20",
    summaryPoints: [
      "여러 주요국 중앙은행이 기준금리를 동결",
      "물가 둔화 흐름을 확인하려는 신중 기조",
      "시장은 연내 인하 시점에 주목"
    ],
    fullBody: "이번 주 여러 주요국 중앙은행이 기준금리를 동결했다. 물가가 목표치로 안정되는지 추가로 확인하려는 신중한 기조다.\n\n각국은 성급한 인하가 물가를 다시 자극할 수 있다는 점을 경계하고 있다. 고용과 소비 지표도 함께 점검 대상이다.\n\n시장의 관심은 연내 첫 인하 시점에 쏠려 있다. 통화정책 회의 결과에 따라 환율과 증시가 움직일 전망이다.",
    sourceUrl: "https://example.com/world-001"
  }
  // TODO 아님 — 실제로 채울 것: 위와 동일한 형태로 각 카테고리에 4개씩 더 추가하여
  // econ-002~005, tech-002~005, soc-002~005, world-002~005 까지 총 20개를 만든다.
  // 모든 글은 summaryPoints 3개, fullBody 2~3문단, thumbnail: null, 유일한 id 를 갖는다.
];
```

- [ ] **Step 2: 브라우저 콘솔에서 데이터 적재 확인**

`js/data.js`를 임시로 로드할 `tmp-check.html`을 만들 필요 없이, Task 2에서 만들 테스트 하니스로 함께 검증한다. 지금은 파일 문법만 확인: 브라우저에서 `data.js`를 직접 열어 콘솔에 에러가 없는지 본다(빈 화면 + 콘솔 무에러면 OK). 또는 다음 명령으로 JS 문법 점검:

Run: `node -e "1"` 은 사용 불가(Node 없음). 대신 브라우저 콘솔 확인으로 갈음한다.
Expected: 콘솔에 SyntaxError 없음.

- [ ] **Step 3: 커밋**

```bash
cd /c/Users/jtm06/news-brief
git add js/data.js
git commit -m "feat: add dummy article data"
```

---

### Task 2: 데이터 공급 계층 + 테스트 하니스 (`api.js`, `tests/run-tests.html`, `tests/api.test.js`)

**Files:**
- Create: `C:/Users/jtm06/news-brief/js/api.js`
- Create: `C:/Users/jtm06/news-brief/tests/run-tests.html`
- Create: `C:/Users/jtm06/news-brief/tests/api.test.js`

**Interfaces:**
- Consumes: `window.ARTICLES` (Task 1)
- Produces: 전역 함수 3개
  - `getArticles(): Array` — 전체 글 배열 반환(원본 변형 방지 위해 얕은 복사 배열)
  - `getArticleById(id: string): Object|null` — 매칭 글 1개, 없으면 `null`
  - `getCategories(): string[]` — 글들에 등장하는 카테고리를 **첫 등장 순서대로**, 중복 없이 반환

- [ ] **Step 1: 실패하는 테스트 작성 (`tests/api.test.js` + `tests/run-tests.html`)**

모듈/Node 없이 브라우저에서 도는 초경량 테스트 하니스를 만든다. `run-tests.html`이 `data.js` → `api.js` → `api.test.js`를 순서대로 로드하고, 결과를 화면과 콘솔에 출력한다.

`tests/run-tests.html`:
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>QuickBrief Tests</title>
  <style>
    body { font-family: sans-serif; padding: 16px; }
    .pass { color: #137333; } .fail { color: #c5221f; font-weight: bold; }
    li { margin: 2px 0; }
  </style>
</head>
<body>
  <h1>API Tests</h1>
  <ul id="results"></ul>
  <!-- 순서 중요: 데이터 → api → 테스트 -->
  <script src="../js/data.js"></script>
  <script src="../js/api.js"></script>
  <script src="api.test.js"></script>
</body>
</html>
```

`tests/api.test.js`:
```javascript
// 초경량 assert 하니스 (외부 라이브러리 없음)
(function () {
  var results = document.getElementById("results");
  var failed = 0, passed = 0;
  function check(name, cond) {
    var li = document.createElement("li");
    if (cond) { li.className = "pass"; li.textContent = "PASS — " + name; passed++; }
    else { li.className = "fail"; li.textContent = "FAIL — " + name; failed++; }
    results.appendChild(li);
  }

  // getArticles
  var all = getArticles();
  check("getArticles는 배열을 반환한다", Array.isArray(all));
  check("getArticles는 20개 글을 반환한다", all.length === 20);
  check("getArticles는 원본을 노출하지 않는다(다른 배열 참조)", all !== window.ARTICLES);

  // getArticleById
  var one = getArticleById("econ-001");
  check("getArticleById는 정확한 글을 반환한다", one && one.title === "원·달러 환율 1,400원 돌파");
  check("getArticleById는 없는 id에 null을 반환한다", getArticleById("nope-999") === null);

  // getCategories
  var cats = getCategories();
  check("getCategories는 4개 카테고리를 반환한다", cats.length === 4);
  check("getCategories는 중복이 없다", new Set(cats).size === cats.length);
  check("getCategories는 첫 등장 순서를 따른다(경제가 먼저)", cats[0] === "경제");

  var li = document.createElement("li");
  li.style.marginTop = "12px";
  li.textContent = "총 " + (passed + failed) + "개 중 " + passed + " PASS / " + failed + " FAIL";
  results.appendChild(li);
  console.log("[tests]", passed, "pass /", failed, "fail");
})();
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

브라우저로 `tests/run-tests.html`을 연다(더블클릭).
Expected: `api.js`가 아직 없어 `getArticles is not defined` 류 에러로 테스트가 실행되지 않거나 전부 FAIL. (콘솔에 ReferenceError 표시)

- [ ] **Step 3: `api.js` 구현 (최소 구현)**

```javascript
// js/api.js
// 데이터 공급을 한 곳으로 격리한다. 후속 단계(RSS/AI/React)에서는
// 이 파일 내부만 교체하고 호출부(home.js/article.js)는 그대로 둔다.

function getArticles() {
  // 호출자가 원본 배열을 변형하지 못하도록 얕은 복사본을 반환한다.
  return (window.ARTICLES || []).slice();
}

function getArticleById(id) {
  var list = window.ARTICLES || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
  return null;
}

function getCategories() {
  var list = window.ARTICLES || [];
  var seen = {};
  var order = [];
  for (var i = 0; i < list.length; i++) {
    var c = list[i].category;
    if (!seen[c]) { seen[c] = true; order.push(c); }
  }
  return order;
}
```

- [ ] **Step 4: 테스트 실행 → 통과 확인**

브라우저로 `tests/run-tests.html`을 새로고침한다.
Expected: 모든 항목이 PASS, 하단에 "총 9개 중 9 PASS / 0 FAIL". (20개 글을 아직 다 못 채웠다면 length 테스트가 FAIL → Task 1로 돌아가 20개를 채운다.)

- [ ] **Step 5: 커밋**

```bash
cd /c/Users/jtm06/news-brief
git add js/api.js tests/run-tests.html tests/api.test.js
git commit -m "feat: add data-access layer with browser test harness"
```

---

### Task 3: 메인 페이지 골격 + 기본 스타일 (`index.html`, `css/style.css`)

**Files:**
- Create: `C:/Users/jtm06/news-brief/index.html`
- Create: `C:/Users/jtm06/news-brief/css/style.css`

**Interfaces:**
- Consumes: 없음(이 작업은 정적 골격과 마운트 지점만 만든다)
- Produces: `index.html`에 빈 컨테이너 `<main id="feed"></main>`와 헤더. `home.js`가 `#feed`에 렌더링한다(Task 4). 로드 순서: `data.js` → `api.js` → `home.js`.

- [ ] **Step 1: `index.html` 작성**

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>QuickBrief — 핵심만 빠르게</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="index.html">🗞 QuickBrief</a>
      <nav class="site-header__actions">
        <button class="icon-btn" aria-label="검색(준비 중)" disabled>🔍</button>
        <button class="icon-btn" aria-label="메뉴">☰</button>
      </nav>
    </div>
  </header>

  <main id="feed" class="feed">
    <!-- home.js가 카테고리 섹션을 렌더링 -->
  </main>

  <!-- 로드 순서 중요: 데이터 → api → 렌더 -->
  <script src="js/data.js"></script>
  <script src="js/api.js"></script>
  <script src="js/home.js"></script>
</body>
</html>
```

- [ ] **Step 2: `css/style.css` 기본 스타일 작성**

```css
/* css/style.css */
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

/* 헤더 */
.site-header {
  position: sticky; top: 0; z-index: 10;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
}
.site-header__inner {
  max-width: var(--maxw); margin: 0 auto; padding: 12px 16px;
  display: flex; align-items: center; justify-content: space-between;
}
.brand { font-size: 20px; font-weight: 700; }
.site-header__actions { display: flex; gap: 8px; }
.icon-btn {
  border: none; background: transparent; font-size: 18px;
  cursor: pointer; padding: 6px; border-radius: 8px;
}
.icon-btn:hover:not([disabled]) { background: #f1f3f4; }
.icon-btn[disabled] { opacity: .4; cursor: default; }

/* 피드 컨테이너 */
.feed { max-width: var(--maxw); margin: 0 auto; padding: 8px 16px 48px; }
```

- [ ] **Step 3: 육안 확인**

브라우저로 `index.html`을 연다.
Expected: 상단에 "🗞 QuickBrief" 헤더와 🔍/☰ 버튼이 보인다. 본문은 아직 비어 있다. 콘솔에 에러 없음.

- [ ] **Step 4: 커밋**

```bash
cd /c/Users/jtm06/news-brief
git add index.html css/style.css
git commit -m "feat: add home page shell and base styles"
```

---

### Task 4: 메인 렌더링 + 카드 그리드 (`home.js`, 카드/그리드 CSS)

**Files:**
- Create: `C:/Users/jtm06/news-brief/js/home.js`
- Modify: `C:/Users/jtm06/news-brief/css/style.css` (그리드·카드·섹션 스타일 추가)

**Interfaces:**
- Consumes: `getArticles()`, `getCategories()` (Task 2); `#feed` 컨테이너 (Task 3)
- Produces: 메인 화면에 카테고리 섹션 + 반응형 카드 그리드. 각 카드는 `article.html?id=<id>`로 링크.

- [ ] **Step 1: `home.js` 작성**

설계 7장: 카테고리 순서대로 섹션, 카테고리당 최대 6개, 카드는 "썸네일(있을 때) + 제목 + 핵심 불릿 1개 + 자세히 →". 빈 카테고리는 렌더 안 함. 안전한 텍스트 삽입을 위해 `textContent`/DOM 생성 방식을 사용한다(innerHTML 문자열 결합 지양).

```javascript
// js/home.js
(function () {
  var feed = document.getElementById("feed");
  if (!feed) return;

  var MAX_PER_CATEGORY = 6;

  function articlesByCategory(cat, all) {
    var out = [];
    for (var i = 0; i < all.length && out.length < MAX_PER_CATEGORY; i++) {
      if (all[i].category === cat) out.push(all[i]);
    }
    return out;
  }

  function buildCard(article) {
    var a = document.createElement("a");
    a.className = "card";
    a.href = "article.html?id=" + encodeURIComponent(article.id);

    if (article.thumbnail) {
      var img = document.createElement("img");
      img.className = "card__thumb";
      img.src = article.thumbnail;
      img.alt = "";
      a.appendChild(img);
    }

    var body = document.createElement("div");
    body.className = "card__body";

    var h3 = document.createElement("h3");
    h3.className = "card__title";
    h3.textContent = article.title;
    body.appendChild(h3);

    if (article.summaryPoints && article.summaryPoints.length) {
      var p = document.createElement("p");
      p.className = "card__lead";
      p.textContent = "• " + article.summaryPoints[0];
      body.appendChild(p);
    }

    var more = document.createElement("span");
    more.className = "card__more";
    more.textContent = "자세히 →";
    body.appendChild(more);

    a.appendChild(body);
    return a;
  }

  function buildSection(cat, items) {
    var section = document.createElement("section");
    section.className = "cat-section";

    var h2 = document.createElement("h2");
    h2.className = "cat-section__title";
    h2.textContent = cat;
    section.appendChild(h2);

    var grid = document.createElement("div");
    grid.className = "card-grid";
    for (var i = 0; i < items.length; i++) {
      grid.appendChild(buildCard(items[i]));
    }
    section.appendChild(grid);
    return section;
  }

  function render() {
    var all = getArticles();
    var cats = getCategories();
    for (var i = 0; i < cats.length; i++) {
      var items = articlesByCategory(cats[i], all);
      if (items.length === 0) continue; // 빈 카테고리는 렌더 안 함
      feed.appendChild(buildSection(cats[i], items));
    }
  }

  render();
})();
```

- [ ] **Step 2: 그리드·카드·섹션 CSS를 `css/style.css` 끝에 추가**

설계 9장(가독성, 카테고리 포인트 컬러)과 7장(반응형 2~3열→1열) 반영.

```css
/* ── 카테고리 섹션 ── */
.cat-section { margin-top: 28px; }
.cat-section__title {
  font-size: 18px; font-weight: 700; margin: 0 0 12px;
  padding-left: 10px; border-left: 4px solid var(--accent);
}

/* ── 카드 그리드: 폰 1열 → 태블릿 2열 → PC 3열 ── */
.card-grid {
  display: grid; gap: 14px;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 960px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}

/* ── 카드 ── */
.card {
  display: flex; flex-direction: column;
  border: 1px solid var(--line); border-radius: 12px;
  overflow: hidden; background: #fff;
  transition: box-shadow .15s ease, transform .15s ease;
}
.card:hover { box-shadow: 0 6px 18px rgba(0,0,0,.08); transform: translateY(-2px); }
.card__thumb { width: 100%; height: 150px; object-fit: cover; background: #f1f3f4; }
.card__body { padding: 14px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.card__title { font-size: 16px; font-weight: 700; margin: 0; }
.card__lead { font-size: 14px; color: var(--text-dim); margin: 0; flex: 1; }
.card__more { font-size: 13px; color: var(--accent); font-weight: 600; align-self: flex-end; }
```

- [ ] **Step 3: 육안 확인**

브라우저로 `index.html`을 새로고침한다.
Expected:
- 경제 / IT·기술 / 사회 / 세계 섹션이 순서대로 보인다.
- 각 섹션에 카드들이 그리드로 배치된다(PC 창에서 3열).
- 각 카드에 제목 + "• 핵심 불릿 1개" + "자세히 →"가 보인다.
- 창 폭을 좁히면 2열 → 1열로 접힌다.
- 콘솔 에러 없음.

- [ ] **Step 4: 커밋**

```bash
cd /c/Users/jtm06/news-brief
git add js/home.js css/style.css
git commit -m "feat: render category sections and responsive card grid"
```

---

### Task 5: 상세 페이지 — 핵심 요약 + 자세히 보기 아코디언 (`article.html`, `article.js`, 상세 CSS)

**Files:**
- Create: `C:/Users/jtm06/news-brief/article.html`
- Create: `C:/Users/jtm06/news-brief/js/article.js`
- Modify: `C:/Users/jtm06/news-brief/css/style.css` (상세 화면 스타일 추가)

**Interfaces:**
- Consumes: `getArticleById(id)` (Task 2); URL 쿼리 `?id=<id>`
- Produces: 상세 화면. 상단 핵심 요약 → "자세히 보기" 클릭 시 본문 펼침. 잘못된 id는 안내 + 메인 링크.

- [ ] **Step 1: `article.html` 작성**

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>QuickBrief</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="index.html">🗞 QuickBrief</a>
    </div>
  </header>

  <main id="article" class="article">
    <!-- article.js가 렌더링 -->
  </main>

  <script src="js/data.js"></script>
  <script src="js/api.js"></script>
  <script src="js/article.js"></script>
</body>
</html>
```

- [ ] **Step 2: `article.js` 작성**

설계 8장: id 추출 → 조회 → 제목+핵심요약 렌더(본문 접힘) → "자세히 보기"로 펼침. 없는 id는 안내. 본문 문단은 `\n\n` 기준 분리.

```javascript
// js/article.js
(function () {
  var root = document.getElementById("article");
  if (!root) return;

  function getIdFromUrl() {
    var q = window.location.search.replace(/^\?/, "");
    var parts = q.split("&");
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split("=");
      if (kv[0] === "id") return decodeURIComponent(kv[1] || "");
    }
    return "";
  }

  function renderNotFound() {
    var box = document.createElement("div");
    box.className = "notfound";
    var p = document.createElement("p");
    p.textContent = "글을 찾을 수 없습니다.";
    var a = document.createElement("a");
    a.className = "btn-link";
    a.href = "index.html";
    a.textContent = "← 메인으로 돌아가기";
    box.appendChild(p);
    box.appendChild(a);
    root.appendChild(box);
  }

  function render(article) {
    // 상단 바: 뒤로 + 카테고리 뱃지
    var top = document.createElement("div");
    top.className = "article__top";
    var back = document.createElement("a");
    back.className = "btn-link";
    back.href = "index.html";
    back.textContent = "← 뒤로";
    var badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = article.category;
    top.appendChild(back);
    top.appendChild(badge);
    root.appendChild(top);

    // 제목 + 메타
    var h1 = document.createElement("h1");
    h1.className = "article__title";
    h1.textContent = article.title;
    root.appendChild(h1);

    var meta = document.createElement("p");
    meta.className = "article__meta";
    meta.textContent = article.source + " · " + article.publishedAt.replace("T", " ");
    root.appendChild(meta);

    // 핵심 요약 박스
    var summary = document.createElement("section");
    summary.className = "summary-box";
    var sh = document.createElement("h2");
    sh.className = "summary-box__title";
    sh.textContent = "핵심 요약";
    summary.appendChild(sh);
    var ul = document.createElement("ul");
    ul.className = "summary-box__list";
    for (var i = 0; i < article.summaryPoints.length; i++) {
      var li = document.createElement("li");
      li.textContent = article.summaryPoints[i];
      ul.appendChild(li);
    }
    summary.appendChild(ul);
    root.appendChild(summary);

    // 자세히 보기 토글
    var toggle = document.createElement("button");
    toggle.className = "detail-toggle";
    toggle.textContent = "자세히 보기 ▾";
    root.appendChild(toggle);

    // 본문(기본 접힘)
    var body = document.createElement("div");
    body.className = "article__body";
    body.hidden = true;
    var paras = article.fullBody.split("\n\n");
    for (var j = 0; j < paras.length; j++) {
      var p = document.createElement("p");
      p.textContent = paras[j];
      body.appendChild(p);
    }
    if (article.sourceUrl) {
      var src = document.createElement("a");
      src.className = "btn-link";
      src.href = article.sourceUrl;
      src.target = "_blank";
      src.rel = "noopener";
      src.textContent = "원문 보기 →";
      body.appendChild(src);
    }
    root.appendChild(body);

    toggle.addEventListener("click", function () {
      var nowHidden = !body.hidden;
      body.hidden = nowHidden;
      toggle.textContent = nowHidden ? "자세히 보기 ▾" : "접기 ▴";
    });
  }

  var id = getIdFromUrl();
  var article = id ? getArticleById(id) : null;
  if (!article) renderNotFound();
  else render(article);
})();
```

- [ ] **Step 3: 상세 화면 CSS를 `css/style.css` 끝에 추가**

```css
/* ── 상세 화면 ── */
.article { max-width: 720px; margin: 0 auto; padding: 16px 16px 64px; }
.article__top { display: flex; align-items: center; gap: 12px; margin: 8px 0 16px; }
.btn-link { color: var(--accent); font-weight: 600; font-size: 14px; }
.badge {
  font-size: 12px; padding: 3px 10px; border-radius: 999px;
  background: var(--summary-bg); color: var(--accent); font-weight: 600;
}
.article__title { font-size: 26px; line-height: 1.35; margin: 0 0 6px; }
.article__meta { color: var(--text-dim); font-size: 13px; margin: 0 0 20px; }

.summary-box {
  background: var(--summary-bg); border: 1px solid #d8e6fb;
  border-radius: 12px; padding: 16px 18px; margin-bottom: 18px;
}
.summary-box__title { font-size: 15px; margin: 0 0 10px; color: var(--accent); }
.summary-box__list { margin: 0; padding-left: 18px; }
.summary-box__list li { margin: 6px 0; font-size: 15px; }

.detail-toggle {
  width: 100%; padding: 12px; border: 1px solid var(--line);
  background: #fff; border-radius: 10px; cursor: pointer;
  font-size: 15px; font-weight: 600; color: var(--text);
}
.detail-toggle:hover { background: #f8f9fa; }

.article__body { margin-top: 16px; }
.article__body p { margin: 0 0 14px; font-size: 16px; }

.notfound { text-align: center; padding: 64px 16px; display: grid; gap: 16px; }
```

- [ ] **Step 4: 육안 확인 — 정상 흐름**

브라우저로 `index.html`을 열고 아무 카드나 클릭한다.
Expected:
- 상세 페이지로 이동(`article.html?id=...`).
- 상단에 "← 뒤로"와 카테고리 뱃지.
- 제목 + 출처·시각.
- "핵심 요약" 박스에 불릿 3개가 먼저 보인다(본문은 접힘).
- "자세히 보기 ▾" 클릭 → 본문 문단이 펼쳐지고 버튼이 "접기 ▴"로 바뀐다. 맨 아래 "원문 보기 →" 링크.
- "← 뒤로" 클릭 → 메인으로 복귀.

- [ ] **Step 5: 육안 확인 — 에러 흐름**

브라우저 주소창에서 `article.html?id=does-not-exist`를 직접 연다.
Expected: "글을 찾을 수 없습니다." + "← 메인으로 돌아가기" 링크가 보인다.

- [ ] **Step 6: 커밋**

```bash
cd /c/Users/jtm06/news-brief
git add article.html js/article.js css/style.css
git commit -m "feat: add article detail page with summary and expandable body"
```

---

### Task 6: 최종 통합 검증 + README

**Files:**
- Create: `C:/Users/jtm06/news-brief/README.md`

**Interfaces:**
- Consumes: 전체 산출물
- Produces: 실행 방법 문서, 설계 12장 검증 1~6 전체 통과 확인

- [ ] **Step 1: 설계 12장 수동 검증 전체 수행**

브라우저로 `index.html`을 새로 열어 아래를 순서대로 확인한다:
1. 카테고리 섹션과 카드 그리드가 보인다.
2. 창 폭을 줄이면 카드가 1열로 접힌다.
3. 카드를 클릭하면 상세로 이동한다.
4. 상세 상단에 핵심 요약이 먼저 보인다.
5. "자세히 보기"로 전체 본문이 펼쳐진다.
6. `article.html?id=bad`로 접근하면 안내 메시지가 보인다.

Expected: 6개 항목 모두 통과. 하나라도 실패하면 해당 Task로 돌아가 수정 후 재확인.

- [ ] **Step 2: 테스트 하니스 재실행**

브라우저로 `tests/run-tests.html`을 연다.
Expected: 모든 항목 PASS, "총 9개 중 9 PASS / 0 FAIL".

- [ ] **Step 3: `README.md` 작성**

```markdown
# QuickBrief

출퇴근 등 짧은 시간에 뉴스·정보를 핵심만 빠르게 파악하는 웹 서비스 (1차: 더미 데이터 UI).

## 실행 방법

빌드 도구가 필요 없습니다. `index.html`을 브라우저로 더블클릭해 여세요.

## 구조

- `index.html` — 메인(카테고리 섹션 + 반응형 카드 그리드)
- `article.html` — 상세(핵심 요약 → 자세히 보기)
- `js/data.js` — 더미 글 데이터
- `js/api.js` — 데이터 공급 격리 계층 (후속 단계에서 RSS/AI로 교체)
- `js/home.js` / `js/article.js` — 화면 렌더링
- `css/style.css` — 스타일
- `tests/run-tests.html` — 데이터/공급 계층 브라우저 테스트

## 후속 단계

- `js/api.js` 내부를 실제 RSS/뉴스 API + AI 요약 호출로 교체
- 검색 기능 동작 구현
- (선택) React + Vite로 렌더링 계층 이전
```

- [ ] **Step 4: 커밋**

```bash
cd /c/Users/jtm06/news-brief
git add README.md
git commit -m "docs: add README with run instructions"
```

---

## Self-Review

**1. Spec coverage:**
- 목적/핵심 경험(핵심→자세히) → Task 5 ✅
- 기술 접근(순수 정적, 모듈 없음) → Global Constraints + 전 작업 ✅
- 파일 구성(설계 4장) → Task 1~5에서 모두 생성 ✅
- 데이터 모델(설계 5장) → Task 1 ✅
- 데이터 공급 격리(설계 6장: getArticles/getArticleById/getCategories) → Task 2 ✅
- 메인 화면(설계 7장: 섹션/그리드/카드/반응형/최대 6개/빈 카테고리 제외) → Task 4 ✅
- 상세 화면(설계 8장: 핵심 요약 먼저 + 아코디언 + 없는 id 처리) → Task 5 ✅
- 디자인 톤(설계 9장: 흰 배경/포인트 컬러/요약 박스 강조) → Task 3·4·5 CSS ✅
- 더미 데이터 범위(설계 10장: 4카테고리×약20개) → Task 1 ✅
- 에러 처리(설계 11장: 없는 id 안내 / 썸네일 없으면 생략 / 빈 카테고리 제외) → Task 4(썸네일·빈 카테고리)·Task 5(없는 id) ✅
- 검증(설계 12장 1~6) → Task 6 ✅
- 검색 아이콘 자리만(동작 없음) → Task 3 `disabled` 버튼 ✅

**2. Placeholder scan:** Task 1의 "TODO 아님" 주석은 실제 채울 내용을 명시한 지시(20개 채우기)이며 빈 placeholder가 아님. 그 외 TBD/TODO/모호 표현 없음. ✅

**3. Type consistency:** `getArticles()`/`getArticleById(id)`/`getCategories()` 시그니처가 Task 2 정의와 Task 4·5 사용처에서 일치. 글 객체 필드명(`id/category/title/thumbnail/source/publishedAt/summaryPoints/fullBody/sourceUrl`)이 Task 1 정의와 Task 4·5 사용처에서 일치. ✅

스펙 누락 없음 — 추가 작업 불필요.
