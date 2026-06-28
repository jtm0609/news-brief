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
