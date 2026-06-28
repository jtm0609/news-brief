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
