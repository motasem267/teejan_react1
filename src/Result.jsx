import React from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'

const Logo = '/assets/logo.png'

function Result() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(search)
  const national = params.get('national') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [studentData, setStudentData] = useState(null)
  const periods = studentData?.periods ?? []
  const subjects = studentData?.subjects ?? []
  const totals = studentData?.totals ?? []

  const getDisplayValue = (value) => {
    if (value == null || value === '') {
      return '—'
    }

    if (typeof value === 'object') {
      return value.label || value.name || value.title || value.value || '—'
    }

    return value
  }

  // التحقق من صحة الوصول إلى الصفحة
  useEffect(() => {
    const authenticated = sessionStorage.getItem('authenticated')
    const timestamp = sessionStorage.getItem('timestamp')
    
    // التحقق من وجود علامة المصادقة
    if (!authenticated || authenticated !== 'true') {
      // إعادة التوجيه إلى صفحة الدخول
      navigate('/login', { replace: true })
      return
    }
    
    // التحقق من صلاحية الجلسة (30 دقيقة)
    if (timestamp) {
      const elapsed = Date.now() - parseInt(timestamp)
      const thirtyMinutes = 30 * 60 * 1000
      if (elapsed > thirtyMinutes) {
        sessionStorage.removeItem('authenticated')
        sessionStorage.removeItem('timestamp')
        navigate('/login', { replace: true })
        return
      }
    }
  }, [navigate])

  useEffect(() => {
    if (!national) {
      setLoading(false)
      setError('الرجاء إدخال رقم وطني')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
       const response = await fetch(`https://dashboard.teejan.ly/api/students/national-id/${national}`)

        
        if (!response.ok) {
          throw new Error('لم يتم العثور على بيانات لهذا الرقم الوطني')
        }
        
        const result = await response.json()
        
        // التحقق من البنية: {success: true, data: {...}}
        if (result.success && result.data) {
          setStudentData(result.data)
        } else {
          throw new Error('بنية البيانات غير صحيحة')
        }
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [national])

  const getPeriodTotal = (periodId) => {
    const apiTotal = totals.find((total) => total.period_id === periodId)

    if (apiTotal) {
      return {
        studentTotal: apiTotal.total_student_marks ?? 0,
        fullTotal: apiTotal.total_full_marks ?? 0,
      }
    }

    let studentTotal = 0
    let fullTotal = 0

    subjects.forEach((subject) => {
      const periodGrade = subject.periods?.find((period) => period.period_id === periodId)

      if (periodGrade?.student_mark != null) {
        studentTotal += periodGrade.student_mark
      }

      if (periodGrade?.full_mark != null) {
        fullTotal += periodGrade.full_mark
      }
    })

    return { studentTotal, fullTotal }
  }

  const academicYearLabel = getDisplayValue(studentData?.academic_year)
  const gradeLabel = getDisplayValue(studentData?.grade)

  if (loading) {
    return (
      <div className="root-wrapper result-root" dir="rtl">
        <div className="result-page">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="root-wrapper result-root" dir="rtl">
        <div className="result-page">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</p>
            <Link to="/login" className="back-link">عودة إلى صفحة البحث</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!studentData) {
    return (
      <div className="root-wrapper result-root" dir="rtl">
        <div className="result-page">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>لا توجد بيانات للعرض</p>
            <Link to="/login" className="back-link">عودة</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="root-wrapper result-root" dir="rtl">
      <div className="result-page">
        <header className="result-header">
          <img src={Logo} alt="شعار المدرسة" className="result-logo" />
          <div className="school-name">
            <h1>مدرسة تيـجان العـلـم</h1>
            <p className="system-name">نظام اعلان نتائج الطلاب</p>
          </div>
        </header>

        <section className="student-info">
          <div><strong>الاسم الكامل:</strong> {getDisplayValue(studentData.full_name)}</div>
          <div><strong>الرقم الوطني:</strong> {getDisplayValue(studentData.national_id || national)}</div>
          <div><strong>السنة الدراسية:</strong> {academicYearLabel}</div>
          <div><strong>الصف:</strong> {gradeLabel}</div>
        </section>

        <section className="table-wrap">
          <table className="result-table" dir="rtl">
            <thead>
              <tr>
                <th rowSpan={2} className="subject-col">المادة</th>
                {periods.map((period) => (
                  <th key={period.id} colSpan={2}>{getDisplayValue(period.name)}</th>
                ))}
              </tr>
              <tr>
                {periods.map((period) => (
                  <React.Fragment key={`sub-${period.id}`}>
                    <th>المتحصل عليها</th>
                    <th>الدرجة الكلية</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.subject_id}>
                  <td className="subject-name">{getDisplayValue(subject.subject_name)}</td>
                  {periods.map((period) => {
                    const gradeData = subject.periods?.find((p) => p.period_id === period.id)
                    const studentMark = gradeData?.student_mark
                    const fullMark = gradeData?.full_mark
                    
                    return (
                      <React.Fragment key={period.id}>
                        <td>
                          <span className="cell-text">
                            {studentMark != null ? studentMark : '-'}
                          </span>
                        </td>
                        <td>
                          <span className="cell-text">
                            {fullMark != null ? fullMark : '-'}
                          </span>
                        </td>
                      </React.Fragment>
                    )
                  })}
                </tr>
              ))}
              {periods.length > 0 && (
                <>
                  <tr className="total-row">
                    <td className="subject-name"><strong>المجموع</strong></td>
                    {periods.map((period) => {
                      const { studentTotal, fullTotal } = getPeriodTotal(period.id)

                      return (
                        <React.Fragment key={`total-${period.id}`}>
                          <td>
                            <span className="cell-text"><strong>{studentTotal}</strong></span>
                          </td>
                          <td>
                            <span className="cell-text"><strong>{fullTotal}</strong></span>
                          </td>
                        </React.Fragment>
                      )
                    })}
                  </tr>
                  <tr className="percentage-row">
                    <td className="subject-name"><strong>النسبة</strong></td>
                    {periods.map((period) => {
                      const { studentTotal, fullTotal } = getPeriodTotal(period.id)
                      const pct = fullTotal > 0 ? Math.round((studentTotal / fullTotal) * 100) : 0

                      return (
                        <td key={`pct-${period.id}`} colSpan={2}>
                          <strong>{pct}%</strong>
                        </td>
                      )
                    })}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </section>

        <div className="result-actions">
          <button className="print-btn" onClick={() => window.print()}>طباعة النتيجة</button>
          <Link to="/login" className="back-link">عودة</Link>
        </div>
      </div>
    </div>
  )
}

export default Result
