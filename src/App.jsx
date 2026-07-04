import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Article from './pages/Article.jsx'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
