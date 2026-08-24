import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './Curricula.css'

const LOGO = '/assets/logo.png'
const API = 'https://dashboard.teejan.ly/api/curricula'

export default function Curricula() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [gradeFilter, setGradeFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')

  useEffect(() => {
    fetch(API)
      .then(res => {
        if (!res.ok) throw new Error('تعذر تحميل قائمة المناهج')
        return res.json()
      })
      .then(json => setItems(json.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const grades = useMemo(
    () => [...new Set(items.map(i => i.grade).filter(Boolean))],
    [items],
  )
  const subjects = useMemo(
    () => [...new Set(items.map(i => i.subject).filter(Boolean))],
    [items],
  )

  const filtered = items.filter(
    i => (!gradeFilter || i.grade === gradeFilter) && (!subjectFilter || i.subject === subjectFilter),
  )

  return (
    <div className="curricula-page" dir="rtl">
      <header className="curricula-header">
        <img src={LOGO} alt="شعار المدرسة" className="curricula-logo" />
        <h2>مدرسة تيـجان العـلـم</h2>
        <h3>المناهج الدراسية</h3>
      </header>

      <div className="curricula-container">
        {!loading && !error && items.length > 0 && (
          <div className="curricula-filters">
            <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
              <option value="">كل الصفوف</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
              <option value="">كل المواد</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {loading && <p className="curricula-state">جارِ التحميل...</p>}
        {error && <p className="curricula-state curricula-error">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="curricula-state">لا توجد مناهج متاحة حالياً</p>
        )}
        {!loading && !error && items.length > 0 && filtered.length === 0 && (
          <p className="curricula-state">لا توجد نتائج مطابقة</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="curricula-grid">
            {filtered.map(item => (
              <div key={item.id} className="curricula-card">
                <div className="curricula-icon">📘</div>
                <h4>{item.book_name}</h4>
                <p className="curricula-meta">{item.grade} — {item.subject}</p>
                <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="curricula-btn">
                  عرض الملف
                </a>
              </div>
            ))}
          </div>
        )}

        <Link to="/" className="curricula-back">العودة للصفحة الرئيسية</Link>
      </div>
    </div>
  )
}
