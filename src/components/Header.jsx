import { Link } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/">🗞 QuickBrief</Link>
        <nav className={styles.actions}>
          <button className={styles.iconBtn} aria-label="검색(준비 중)" disabled>🔍</button>
          <button className={styles.iconBtn} aria-label="메뉴">☰</button>
        </nav>
      </div>
    </header>
  )
}
