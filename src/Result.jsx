import React, { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import './App.css'

const LOGO = '/assets/logo.png'
const API = 'https://dashboard.teejan.ly/api/students/national-id'

function displayValue(val) {
  if (val == null || val === '') return '—'
  if (typeof val === 'object') return val.label || val.name || val.title || '—'
  return val
}

function PeriodTotal({ periodId, totals, subjects }) {
  const api = totals.find(t => t.period_id === periodId)
  if (api) return { student: api.total_student_marks ?? 0, full: api.total_full_marks ?? 0 }
  let student = 0, full = 0
  subjects.forEach(sub => {
    const p = sub.periods?.find(p => p.period_id === periodId)
    if (p?.student_mark != null) student += p.student_mark
    if (p?.full_mark != null) full += p.full_mark
  })
  return { student, full }
}

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const national = new URLSearchParams(location.search).get('national') || ''

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      .then(r => { if (!r.ok) throw new Error('لم يتم العثور على بيانات لهذا الرقم الوطني'); return r.json() })
      .then(res => {
        if (res.success && res.data) setData(res.data)
        else throw new Error('بنية البيانات غير صحيحة')
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

  const periods  = data.periods  ?? []
  const subjects = data.subjects ?? []
  const totals   = data.totals   ?? []

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

        {/* Grades table */}
        <div className="table-wrap">
          <table className="result-table">
            <thead>
              <tr>
                <th rowSpan={2} className="subject-col subject-cell">المادة</th>
                {periods.map(p => (
                  <th key={p.id} colSpan={2}>{displayValue(p.name)}</th>
                ))}
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
              {subjects.map(sub => (
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
                </tr>
              ))}

              {/* Total row */}
              {periods.length > 0 && (
                <tr className="total-row">
                  <td className="subject-cell"><strong>المجموع</strong></td>
                  {periods.map(p => {
                    const t = PeriodTotal({ periodId: p.id, totals, subjects })
                    return (
                      <React.Fragment key={p.id}>
                        <td><strong>{t.student}</strong></td>
                        <td><strong>{t.full}</strong></td>
                      </React.Fragment>
                    )
                  })}
                </tr>
              )}

              {/* Percentage row */}
              {periods.length > 0 && (
                <tr className="pct-row">
                  <td className="subject-cell"><strong>النسبة %</strong></td>
                  {periods.map(p => {
                    const t = PeriodTotal({ periodId: p.id, totals, subjects })
                    const pct = t.full > 0 ? ((t.student / t.full) * 100).toFixed(1) : '0.0'
                    return (
                      <td key={p.id} colSpan={2}>
                        <strong>{pct}%</strong>
                      </td>
                    )
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
