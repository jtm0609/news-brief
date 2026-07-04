import { Link } from 'react-router-dom'
import styles from './ArticleCard.module.css'

export default function ArticleCard({ article }) {
  return (
    <Link className={styles.card} to={`/article/${article.id}`}>
      {article.thumbnail && (
        <img className={styles.thumb} src={article.thumbnail} alt="" />
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>{article.title}</h3>
        {article.summaryPoints && article.summaryPoints.length > 0 && (
          <p className={styles.lead}>• {article.summaryPoints[0]}</p>
        )}
        <span className={styles.more}>자세히 →</span>
      </div>
    </Link>
  )
}
