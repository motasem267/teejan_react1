import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const LOGO = '/assets/logo.png'
const PHOTOS = [
  '/assets/photo1.jpg',
  '/assets/photo2.jpg',
  '/assets/photo3.jpg',
  '/assets/photo4.jpg',
  '/assets/photo5.jpg',
  '/assets/photo6.jpg',
]

const LEVELS = [
  {
    id: 1,
    title: 'رياض الأطفال',
    icon: '🎨',
    desc: 'مرحلة تأسيسية لتنمية مهارات الطفل الإبداعية والاجتماعية من خلال اللعب والأنشطة التفاعلية',
    tags: ['تعليم تفاعلي', 'أنشطة فنية', 'تنمية المهارات'],
    color: '#FF6B9D',
  },
  {
    id: 2,
    title: 'المرحلة الابتدائية',
    icon: '📚',
    desc: 'بناء الأساس العلمي القوي وتطوير مهارات القراءة والكتابة والحساب بطرق تعليمية حديثة',
    tags: ['منهج شامل', 'تعليم تفاعلي', 'متابعة مستمرة'],
    color: '#4ECDC4',
  },
  {
    id: 3,
    title: 'المرحلة الإعدادية',
    icon: '🎓',
    desc: 'مرحلة تطوير القدرات العلمية والفكرية وإعداد الطلاب للمراحل المتقدمة من التعليم',
    tags: ['برامج متقدمة', 'تحضير للثانوية', 'تطوير المهارات'],
    color: '#95E1D3',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [photoIdx, setPhotoIdx] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setPhotoIdx(i => (i + 1) % PHOTOS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="home" dir="rtl">
      {/* Navbar */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-brand">
            <img src={LOGO} alt="شعار المدرسة" className="nav-logo" />
            <span>تيجان العلم</span>
          </div>

          <button className="burger" onClick={() => setMenuOpen(o => !o)} aria-label="القائمة">
            <span /><span /><span />
          </button>

          <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
            <li><a href="#home" onClick={() => scrollTo('home')}>الرئيسية</a></li>
            <li><a href="#about" onClick={() => scrollTo('about')}>من نحن</a></li>
            <li><a href="#levels" onClick={() => scrollTo('levels')}>المراحل التعليمية</a></li>
            <li><a href="#gallery" onClick={() => scrollTo('gallery')}>أطفالنا</a></li>
            <li><a href="#contact" onClick={() => scrollTo('contact')}>تواصل معنا</a></li>
            <li><a onClick={() => navigate('/curricula')}>المناهج</a></li>
            <li>
              <button className="nav-results-btn" onClick={() => navigate('/login')}>
                النتائج
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="hero-shapes">
          <div className="shape s1" /><div className="shape s2" />
          <div className="shape s3" /><div className="shape s4" />
        </div>
        <div className="hero-body">
          <span className="badge">✨ مرحباً بكم في</span>
          <h1>مدرسة تيجان العلم</h1>
          <p>نبني مستقبل أطفالنا بالعلم والمعرفة</p>
          <div className="hero-btns">
            <button onClick={() => scrollTo('about')} className="btn-gold">اكتشف المزيد</button>
            <button onClick={() => scrollTo('contact')} className="btn-outline">تواصل معنا</button>
          </div>
        </div>
        <div className="floating-icons" aria-hidden="true">
          <span className="fi fi1">📚</span>
          <span className="fi fi2">✏️</span>
          <span className="fi fi3">🎨</span>
          <span className="fi fi4">🌟</span>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-head">
            <span className="tag">من نحن</span>
            <h2>مدرسة تيجان العلم</h2>
          </div>
          <div className="cards-grid">
            <div className="card">
              <div className="card-icon">🎯</div>
              <h3>رؤيتنا</h3>
              <p>نسعى لأن نكون منارة التعليم في ليبيا، نبني جيلاً متعلماً ومبدعاً قادراً على صنع المستقبل</p>
            </div>
            <div className="card">
              <div className="card-icon">💡</div>
              <h3>رسالتنا</h3>
              <p>تقديم تعليم متميز في بيئة آمنة ومحفزة للإبداع، مع التركيز على تنمية المهارات والقيم الأخلاقية</p>
            </div>
            <div className="card">
              <div className="card-icon">⭐</div>
              <h3>قيمنا</h3>
              <p>الالتزام، التميز، الإبداع، الاحترام، والتعاون — قيم نغرسها في نفوس أبنائنا الطلاب</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Levels */}
      <section id="levels" className="section bg-soft">
        <div className="container">
          <div className="section-head">
            <span className="tag">التعليم</span>
            <h2>المراحل التعليمية</h2>
            <p>نوفر تعليماً متكاملاً لجميع المراحل الدراسية</p>
          </div>
          <div className="cards-grid">
            {LEVELS.map(lvl => (
              <div key={lvl.id} className="level-card">
                <div className="level-icon" style={{ background: lvl.color }}>{lvl.icon}</div>
                <h3>{lvl.title}</h3>
                <p>{lvl.desc}</p>
                <div className="tags">
                  {lvl.tags.map(t => <span key={t} className="tag-pill">✓ {t}</span>)}
                </div>
                <div className="level-bar" style={{ background: lvl.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="gallery" className="section">
        <div className="container">
          <div className="section-head">
            <span className="tag">معرض الصور</span>
            <h2>أطفالنا</h2>
            <p>لحظات من الفرح والتعلم مع طلابنا الأعزاء</p>
          </div>
          <div className="gallery">
            <div className="gallery-main">
              <img src={PHOTOS[photoIdx]} alt={`صورة ${photoIdx + 1}`} />
              <span className="gallery-counter">{photoIdx + 1} / {PHOTOS.length}</span>
            </div>
            <div className="gallery-thumbs">
              {PHOTOS.map((src, i) => (
                <button
                  key={i}
                  className={`thumb${i === photoIdx ? ' active' : ''}`}
                  onClick={() => setPhotoIdx(i)}
                  aria-label={`صورة ${i + 1}`}
                >
                  <img src={src} alt={`صورة ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section bg-soft">
        <div className="container">
          <div className="section-head">
            <span className="tag">اتصل بنا</span>
            <h2>تواصل معنا</h2>
            <p>نحن هنا للإجابة على جميع استفساراتكم</p>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>الهاتف</h3>
              <a href="tel:0912446494" className="contact-link">0912446494</a>
              <p>نستقبل اتصالاتكم يومياً</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3>البريد الإلكتروني</h3>
              <a href="mailto:info@teejan.ly" className="contact-link">info@teejan.ly</a>
              <p>راسلنا في أي وقت</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>العنوان</h3>
              <p className="address">ليبيا — طرابلس — اللانشة</p>
              <a
                href="https://maps.app.goo.gl/LxSQUJMdYNvt5FMm8"
                target="_blank"
                rel="noreferrer"
                className="map-link"
              >
                🗺️ عرض على الخريطة
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Results CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-icon">📊</div>
          <h2>استعلم عن نتائج الطلاب</h2>
          <p>يمكنك الآن الاطلاع على النتائج بسهولة</p>
          <button onClick={() => navigate('/login')} className="cta-btn">
            الدخول إلى صفحة النتائج ←
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <img src={LOGO} alt="شعار المدرسة" />
                <span>مدرسة تيجان العلم</span>
              </div>
              <p>نبني مستقبل أطفالنا بالعلم والمعرفة</p>
            </div>
            <div>
              <h4>روابط سريعة</h4>
              <ul>
                <li><a href="#home" onClick={() => scrollTo('home')}>الرئيسية</a></li>
                <li><a href="#about" onClick={() => scrollTo('about')}>من نحن</a></li>
                <li><a href="#levels" onClick={() => scrollTo('levels')}>المراحل التعليمية</a></li>
                <li><a href="#contact" onClick={() => scrollTo('contact')}>تواصل معنا</a></li>
              </ul>
            </div>
            <div>
              <h4>تواصل معنا</h4>
              <ul>
                <li>📞 0912446494</li>
                <li>📍 ليبيا — طرابلس — اللانشة</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 مدرسة تيجان العلم — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
