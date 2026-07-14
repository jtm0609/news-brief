import styles from './SummaryBox.module.css'

export default function SummaryBox({ points }) {
  return (
    <section className={styles.box}>
      <h2 className={styles.title}>핵심 요약</h2>
      <ul className={styles.list}>
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </section>
  )
}
