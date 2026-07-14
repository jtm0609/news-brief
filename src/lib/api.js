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
