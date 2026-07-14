import { useEffect } from 'react'
import { getArticles, getCategories } from '../lib/api.js'
import CategorySection from '../components/CategorySection.jsx'
import styles from './Home.module.css'

const MAX_PER_CATEGORY = 6

export default function Home() {
  const all = getArticles()
  const categories = getCategories()

  useEffect(() => {
    document.title = 'QuickBrief — 핵심만 빠르게'
  }, [])

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
