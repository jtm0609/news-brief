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
