import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getArticleById } from '../lib/api.js'
import SummaryBox from '../components/SummaryBox.jsx'
import styles from './Article.module.css'

export default function Article() {
  const { id } = useParams()
  const article = getArticleById(id)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (article) document.title = article.title + ' — QuickBrief'
  }, [article])

  if (!article) {
    return (
      <main className={styles.notfound}>
        <p>글을 찾을 수 없습니다.</p>
        <Link className={styles.btnLink} to="/">← 메인으로 돌아가기</Link>
      </main>
    )
  }

  const paragraphs = article.fullBody.split('\n\n')

  return (
    <main className={styles.article}>
      <div className={styles.top}>
        <Link className={styles.btnLink} to="/">← 뒤로</Link>
        <span className={styles.badge}>{article.category}</span>
      </div>
      <h1 className={styles.title}>{article.title}</h1>
      <p className={styles.meta}>{article.source} · {article.publishedAt.replace('T', ' ')}</p>

      <SummaryBox points={article.summaryPoints} />

      <button className={styles.toggle} onClick={() => setExpanded((v) => !v)}>
        {expanded ? '접기 ▴' : '자세히 보기 ▾'}
      </button>

      {expanded && (
        <div className={styles.body}>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {article.sourceUrl && (
            <a
              className={styles.btnLink}
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              원문 보기 →
            </a>
          )}
        </div>
      )}
    </main>
  )
}
