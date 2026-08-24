import React, { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import './App.css'

const LOGO = '/assets/logo.png'
const API = 'https://dashboard.teejan.ly/api/students/national-id'

function formatDateTime(date) {
  const pad = n => String(n).padStart(2, '0')
  const datePart = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
  const timePart = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  return `${datePart} - ${timePart}`
}

function displayValue(val) {
  if (val == null || val === '') return '—'
  if (typeof val === 'object') return val.label || val.name || val.title || '—'
  return val
}

function SubjectTotal(sub, periods) {
  let student = 0, full = 0
  periods.forEach(p => {
    const g = sub.periods?.find(x => x.period_id === p.id)
    if (g?.student_mark != null) student += g.student_mark
    if (g?.full_mark != null) full += g.full_mark
  })
  return { student, full }
}

function termKey(name) {
  const n = typeof name === 'object' && name != null ? (name.label || name.name || name.title || '') : String(name || '')
  if (n.includes('الأولى') || n.includes('الاولى')) return 'term1'
  if (n.includes('الثانية')) return 'term2'
  return n
}

function groupPeriodsByTerm(periods) {
  const order = []
  const map = new Map()
  periods.forEach(p => {
    const key = termKey(p.name)
    if (!map.has(key)) { map.set(key, []); order.push(key) }
    map.get(key).push(p)
  })
  return order.map(key => map.get(key))
}

const INTERNATIONAL_SUBJECT_NAMES = new Set(['computer', 'math', 'science', 'french', 'english', 'قران كريم', 'arabic', 'conversation'])

function isInternationalSubject(subjectName) {
  const text = typeof subjectName === 'object' && subjectName != null
    ? (subjectName.label || subjectName.name || subjectName.title || '')
    : String(subjectName || '')
  return INTERNATIONAL_SUBJECT_NAMES.has(text.trim().toLowerCase())
}

function GroupPeriodTotal(periodId, subjectsSubset) {
  let student = 0, full = 0
  subjectsSubset.forEach(sub => {
    const p = sub.periods?.find(p => p.period_id === periodId)
    if (p?.student_mark != null) student += p.student_mark
    if (p?.full_mark != null) full += p.full_mark
  })
  return { student, full }
}

function SubjectsTable({ title, subjects, periods: allPeriods }) {
  if (subjects.length === 0) return null

  const periods = allPeriods.filter(p =>
    subjects.some(sub => {
      const g = sub.periods?.find(x => x.period_id === p.id)
      return g?.student_mark != null || g?.full_mark != null
    })
  )
  if (periods.length === 0) return null

  const finalTotal = periods.reduce((acc, p) => {
    const t = GroupPeriodTotal(p.id, subjects)
    return { student: acc.student + t.student, full: acc.full + t.full }
  }, { student: 0, full: 0 })
  const finalPct = finalTotal.full > 0 ? ((finalTotal.student / finalTotal.full) * 100).toFixed(1) : '0.0'

  return (
    <div className="subjects-section">
      <h2 className="section-title">{title}</h2>
      <div className="table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th rowSpan={2} className="subject-col subject-cell">المادة</th>
              {periods.map(p => (
                <th key={p.id} colSpan={2}>{displayValue(p.name)}</th>
              ))}
              <th rowSpan={2}>نسبة المادة</th>
            </tr>
            <tr>
              {periods.map(p => (
                <React.Fragment key={p.id}>
                  <th>المتحصل عليها</th>
                  <th>الدرجة الكلية</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects.map(sub => {
              const st = SubjectTotal(sub, periods)
              const subPct = st.full > 0 ? ((st.student / st.full) * 100).toFixed(1) : '0.0'
              return (
                <tr key={sub.subject_id}>
                  <td className="subject-cell">{displayValue(sub.subject_name)}</td>
                  {periods.map(p => {
                    const g = sub.periods?.find(x => x.period_id === p.id)
                    return (
                      <React.Fragment key={p.id}>
                        <td>{g?.student_mark ?? '—'}</td>
                        <td>{g?.full_mark ?? '—'}</td>
                      </React.Fragment>
                    )
                  })}
                  <td><strong>{subPct}%</strong></td>
                </tr>
              )
            })}

            <tr className="total-row">
              <td className="subject-cell"><strong>المجموع</strong></td>
              {periods.map(p => {
                const t = GroupPeriodTotal(p.id, subjects)
                return (
                  <React.Fragment key={p.id}>
                    <td><strong>{t.student}</strong></td>
                    <td><strong>{t.full}</strong></td>
                  </React.Fragment>
                )
              })}
              <td>—</td>
            </tr>

            <tr className="pct-row">
              <td className="subject-cell"><strong>النسبة النهائية</strong></td>
              <td colSpan={periods.length * 2 + 1}>
                <strong>{finalPct}%</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const national = new URLSearchParams(location.search).get('national') || ''

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [printedAt, setPrintedAt] = useState(null)

  useEffect(() => {
    const handleBeforePrint = () => setPrintedAt(new Date())
    window.addEventListener('beforeprint', handleBeforePrint)
    return () => window.removeEventListener('beforeprint', handleBeforePrint)
  }, [])

  useEffect(() => {
    const auth = sessionStorage.getItem('authenticated')
    const ts = sessionStorage.getItem('timestamp')
    if (auth !== 'true') { navigate('/login', { replace: true }); return }
    if (ts && Date.now() - parseInt(ts) > 30 * 60 * 1000) {
      sessionStorage.clear()
      navigate('/login', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    if (!national) { setLoading(false); setError('الرجاء إدخال رقم وطني'); return }
    setLoading(true)
    fetch(`${API}/${national}`)
      .then(async r => {
        const res = await r.json().catch(() => null)
        if (!res) throw new Error('لم يتم العثور على بيانات لهذا الرقم الوطني')
        if (!res.success || !res.data) throw new Error(res.message || 'بنية البيانات غير صحيحة')
        setData(res.data)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [national])

  if (loading) {
    return (
      <div className="status-page" dir="rtl">
        <div className="status-card"><p>جاري تحميل البيانات...</p></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="status-page" dir="rtl">
        <div className="status-card">
          <p className="error">{error}</p>
          <Link to="/login" className="back-btn">عودة إلى صفحة البحث</Link>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="status-page" dir="rtl">
        <div className="status-card">
          <p>لا توجد بيانات للعرض</p>
          <Link to="/login" className="back-btn">عودة</Link>
        </div>
      </div>
    )
  }

  const subjects = data.subjects ?? []
  const termGroups = groupPeriodsByTerm(data.periods ?? [])
  const periods = termGroups.flat()
  const localSubjects = subjects.filter(sub => !isInternationalSubject(sub.subject_name))
  const internationalSubjects = subjects.filter(sub => isInternationalSubject(sub.subject_name))

  return (
    <div className="result-root" dir="rtl">
      <div className="result-wrap">

        {/* Header */}
        <header className="result-header">
          <img src={LOGO} alt="شعار المدرسة" />
          <div>
            <h1>مدرسة تيـجان العـلـم</h1>
            <p>نظام إعلان نتائج الطلاب</p>
          </div>
        </header>

        {/* Student info */}
        <div className="student-info">
          <div className="info-item"><strong>الاسم:</strong> {displayValue(data.full_name)}</div>
          <div className="info-item"><strong>الرقم الوطني:</strong> {displayValue(data.national_id || national)}</div>
          <div className="info-item"><strong>السنة الدراسية:</strong> {displayValue(data.academic_year)}</div>
          <div className="info-item"><strong>الصف:</strong> {displayValue(data.grade)}</div>
        </div>

        {/* Grades tables */}
        <SubjectsTable title="المواد المحلية" subjects={localSubjects} periods={periods} />
        <SubjectsTable title="المواد الدولية" subjects={internationalSubjects} periods={periods} />

        {/* Print timestamp (visible only when printing) */}
        {printedAt && (
          <div className="print-timestamp">تاريخ الطباعة: {formatDateTime(printedAt)}</div>
        )}

        {/* Actions */}
        <div className="result-actions">
          <button className="print-btn" onClick={() => window.print()}>
            🖨️ طباعة النتيجة
          </button>
          <Link to="/login" className="back-btn">← عودة</Link>
        </div>

      </div>
    </div>
  )
}
