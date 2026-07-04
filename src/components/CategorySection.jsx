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
