import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './App.css'

const LOGO = '/assets/logo.png'

export default function Login() {
  const navigate = useNavigate()
  const [national, setNational] = useState('')

  const onChange = (e) => {
    if (/^\d*$/.test(e.target.value)) setNational(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!national) return
    sessionStorage.setItem('authenticated', 'true')
    sessionStorage.setItem('timestamp', Date.now().toString())
    navigate(`/result?national=${encodeURIComponent(national)}`)
  }

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        <img src={LOGO} alt="شعار المدرسة" className="login-logo" />
        <h2>مدرسة تيـجان العـلـم</h2>
        <h3>نظام إعلان نتائج الطلاب</h3>
        <form onSubmit={onSubmit}>
          <input
            id="national"
            type="text"
            dir="ltr"
            className="login-input"
            placeholder="أدخل الرقم الوطني للطالب"
            value={national}
            onChange={onChange}
            inputMode="numeric"
            required
          />
          <button type="submit" className="login-btn">عرض النتيجة</button>
        </form>
        <Link to="/" className="login-back">العودة للصفحة الرئيسية</Link>
      </div>
    </div>
  )
}
