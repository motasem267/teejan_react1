import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
const Logo = '/assets/logo.png'
import './App.css'

function Login() {
  const [national, setNational] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Basic guard
    if (!national) return
    // تعيين علامة في sessionStorage للتحقق من صحة الدخول
    sessionStorage.setItem('authenticated', 'true')
    sessionStorage.setItem('timestamp', Date.now().toString())
    // Navigate to /result with national number as query param
    navigate(`/result?national=${encodeURIComponent(national)}`)
  }

  const handleNationalChange = (e) => {
    const value = e.target.value
    // السماح بالأرقام فقط
    if (value === '' || /^\d+$/.test(value)) {
      setNational(value)
    }
  }

  return (
    <div className="root-wrapper" dir="rtl">
      <div className="Login">

        <img src={Logo} alt="شعار المدرسة" className='logo' />

        <h2 className='h2'>مدرسة تيـجان العـلـم</h2>

        <h3 className='h3'>نظام اعلان نتائج الطلاب</h3>

        <form onSubmit={handleSubmit} method='post'>
          <label htmlFor="national" className="sr-only">الرقم الوطني للطالب</label>
          <input id="national" type="text" dir="ltr" className='NationalNumberInput' name='NationalNumber' value={national} onChange={handleNationalChange} placeholder='ادخل الرقم الوطني للطالب' required inputMode="numeric" pattern="\d*" />

          <button type='submit' className='SubmitButton'>عرض النتيجة</button>
        </form>

        <Link to="/" className="home-link">العودة للصفحة الرئيسية</Link>
      </div>
    </div>
  )
}

export default Login
