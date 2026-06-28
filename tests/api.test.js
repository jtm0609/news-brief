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
