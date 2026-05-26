import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './assets/logo.png'
import photo1 from './assets/images/photo1.jpg'
import photo2 from './assets/images/photo2.jpg'
import photo3 from './assets/images/photo3.jpg'
import photo4 from './assets/images/photo4.jpg'
import photo5 from './assets/images/photo5.jpg'
import photo6 from './assets/images/photo6.jpg'
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const images = [
    photo1,
    photo2,
    photo3,
    photo4,
    photo5,
    photo6
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToResults = () => {
    navigate('/login');
  };

  const openGoogleMaps = () => {
    window.open('https://maps.app.goo.gl/LxSQUJMdYNvt5FMm8', '_blank');
  };

  const educationLevels = [
    {
      id: 1,
      title: 'رياض الأطفال',
      icon: '🎨',
      description: 'مرحلة تأسيسية لتنمية مهارات الطفل الإبداعية والاجتماعية من خلال اللعب والأنشطة التفاعلية',
      features: ['تعليم تفاعلي', 'أنشطة فنية', 'تنمية المهارات'],
      color: '#FF6B9D'
    },
    {
      id: 2,
      title: 'المرحلة الابتدائية',
      icon: '📚',
      description: 'بناء الأساس العلمي القوي وتطوير مهارات القراءة والكتابة والحساب بطرق تعليمية حديثة',
      features: ['منهج شامل', 'تعليم تفاعلي', 'متابعة مستمرة'],
      color: '#4ECDC4'
    },
    {
      id: 3,
      title: 'المرحلة الإعدادية',
      icon: '🎓',
      description: 'مرحلة تطوير القدرات العلمية والفكرية وإعداد الطلاب للمراحل المتقدمة من التعليم',
      features: ['برامج متقدمة', 'تحضير للثانوية', 'تطوير المهارات'],
      color: '#95E1D3'
    }
  ];

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
        <div className="shape shape4"></div>
        <div className="shape shape5"></div>
      </div>

      {/* Navigation Bar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <img src={Logo} alt="Logo" className="logo-img" />
            <span className="logo-text">تيجان العلم</span>
          </div>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li>
              <a 
                href="#home" 
                className={activeSection === 'home' ? 'active' : ''}
                onClick={() => scrollToSection('home')}
              >
                الصفحة الرئيسية
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={activeSection === 'about' ? 'active' : ''}
                onClick={() => scrollToSection('about')}
              >
                من نحن
              </a>
            </li>
            <li>
              <a 
                href="#levels" 
                className={activeSection === 'levels' ? 'active' : ''}
                onClick={() => scrollToSection('levels')}
              >
                المراحل التعليمية
              </a>
            </li>
            <li>
              <a 
                href="#children" 
                className={activeSection === 'children' ? 'active' : ''}
                onClick={() => scrollToSection('children')}
              >
                أطفالنا
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={() => scrollToSection('contact')}
              >
                تواصل معنا
              </a>
            </li>
            <li>
              <button onClick={goToResults} className="nav-results-btn">
                النتائج
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">✨ مرحباً بكم في</div>
          <h1 className="hero-title">
            <span className="gradient-text">مدرسة تيجان العلم</span>
          </h1>
          <p className="hero-subtitle">نبني مستقبل أطفالنا بالعلم والمعرفة</p>
          <div className="hero-buttons">
            <button onClick={() => scrollToSection('about')} className="btn-primary">
              اكتشف المزيد
            </button>
            <button onClick={() => scrollToSection('contact')} className="btn-secondary">
              تواصل معنا
            </button>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="floating-icon icon1">📚</div>
          <div className="floating-icon icon2">✏️</div>
          <div className="floating-icon icon3">🎨</div>
          <div className="floating-icon icon4">🌟</div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">من نحن</span>
            <h2 className="section-title">مدرسة تيجان العلم</h2>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon">🎯</div>
              <h3>رؤيتنا</h3>
              <p>نسعى لأن نكون منارة التعليم في ليبيا، نبني جيلاً متعلماً ومبدعاً قادراً على صنع المستقبل</p>
            </div>
            <div className="about-card">
              <div className="about-icon">💡</div>
              <h3>رسالتنا</h3>
              <p>تقديم تعليم متميز في بيئة آمنة ومحفزة للإبداع، مع التركيز على تنمية المهارات والقيم الأخلاقية</p>
            </div>
            <div className="about-card">
              <div className="about-icon">⭐</div>
              <h3>قيمنا</h3>
              <p>الالتزام، التميز، الإبداع، الاحترام، والتعاون - قيم نغرسها في نفوس أبنائنا الطلاب</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Levels Section */}
      <section id="levels" className="levels-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">التعليم</span>
            <h2 className="section-title">المراحل التعليمية</h2>
            <p className="section-description">نوفر تعليماً متكاملاً لجميع المراحل الدراسية</p>
          </div>
          <div className="levels-grid">
            {educationLevels.map((level, index) => (
              <div 
                key={level.id} 
                className="level-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="level-icon" style={{ backgroundColor: level.color }}>
                  {level.icon}
                </div>
                <h3 className="level-title">{level.title}</h3>
                <p className="level-description">{level.description}</p>
                <div className="level-features">
                  {level.features.map((feature, idx) => (
                    <span key={idx} className="feature-tag">
                      ✓ {feature}
                    </span>
                  ))}
                </div>
                <div className="level-decoration" style={{ backgroundColor: level.color }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Children Gallery Section */}
      <section id="children" className="gallery-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">معرض الصور</span>
            <h2 className="section-title">أطفالنا</h2>
            <p className="section-description">لحظات من الفرح والتعلم مع طلابنا الأعزاء</p>
          </div>
          <div className="gallery-wrapper">
            <div className="gallery-main">
              <img 
                src={images[currentImageIndex]} 
                alt="أطفال مدرسة تيجان العلم" 
                className="gallery-image"
              />
              <div className="gallery-overlay">
                <div className="image-counter">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>
            </div>
            <div className="gallery-thumbnails">
              {images.map((img, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={img} alt={`صورة ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">اتصل بنا</span>
            <h2 className="section-title">تواصل معنا</h2>
            <p className="section-description">نحن هنا للإجابة على جميع استفساراتكم</p>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon-wrapper">
                <div className="contact-icon">📞</div>
              </div>
              <h3>الهاتف</h3>
              <a href="tel:0912446494" className="contact-link">0912446494</a>
              <p className="contact-note">نستقبل اتصالاتكم يومياً</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon-wrapper">
                <div className="contact-icon">✉️</div>
              </div>
              <h3>البريد الإلكتروني</h3>
              <a href="mailto:info@teejan.ly" className="contact-link">info@teejan.ly</a>
              <p className="contact-note">راسلنا في أي وقت</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon-wrapper">
                <div className="contact-icon">📍</div>
              </div>
              <h3>العنوان</h3>
              <p className="contact-address">ليبيا - طرابلس - اللانشة</p>
              <button onClick={openGoogleMaps} className="map-btn">
                <span>عرض على الخريطة</span>
                <span>🗺️</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results CTA Section */}
      <section className="results-cta-section">
        <div className="cta-content">
          <div className="cta-icon">📊</div>
          <h2>استعلم عن نتائج الطلاب</h2>
          <p>يمكنك الآن الاطلاع على النتائج بسهولة</p>
          <button onClick={goToResults} className="cta-btn">
            <span>الدخول إلى صفحة النتائج</span>
            <span className="btn-arrow">←</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src={Logo} alt="Logo" className="logo-img" />
              <span>مدرسة تيجان العلم</span>
            </div>
            <p>نبني مستقبل أطفالنا بالعلم والمعرفة</p>
          </div>
          <div className="footer-section">
            <h4>روابط سريعة</h4>
            <ul>
              <li><a href="#home" onClick={() => scrollToSection('home')}>الرئيسية</a></li>
              <li><a href="#about" onClick={() => scrollToSection('about')}>من نحن</a></li>
              <li><a href="#levels" onClick={() => scrollToSection('levels')}>المراحل التعليمية</a></li>
              <li><a href="#contact" onClick={() => scrollToSection('contact')}>تواصل معنا</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>تواصل معنا</h4>
            <ul>
              <li>📞  0912446494</li>
              <li>📍 ليبيا - طرابلس - اللانشة</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 مدرسة تيجان العلم - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
