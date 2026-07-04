// js/article.js
(function () {
  var root = document.getElementById("article");
  if (!root) return;

  function getIdFromUrl() {
    var q = window.location.search.replace(/^\?/, "");
    var parts = q.split("&");
    for (var i = 0; i < parts.length; i++) {
      var eq = parts[i].indexOf("=");
      if (eq > -1 && parts[i].slice(0, eq) === "id") {
        return decodeURIComponent(parts[i].slice(eq + 1));
      }
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
    document.title = article.title + " — QuickBrief";
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
      src.rel = "noopener noreferrer";
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
