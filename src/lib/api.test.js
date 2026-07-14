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
