
import React, { useState, useEffect } from 'react';
import {
  Nfc, ShoppingCart, Plus, Minus, Trash2, X, Check, Star, MapPin, Truck, Zap,
  ShieldCheck, MessageCircle, Sparkles, ChevronDown, Smartphone, MousePointer2, Send,
  Eye, Shield, CreditCard
} from 'lucide-react';
import { supabase } from './supabaseClient';

// ==========================================
// 1. CONFIGURATION & DATABASE
// ==========================================
const WHATSAPP_PHONE = '966590592636';
const CURRENCY = '﷼';

const PRODUCTS = [
  {
    id: 1,
    name: 'ستاند الكاونتر الفاخر (NFC)',
    price: 70,
    oldPrice: 90,
    rating: 4.9,
    reviewsCount: 253,
    description: 'ستاند أكريليك أسود لامع مخصص لنقاط البيع والكاشير، لجلب تقييمات قوقل ماب بلمسة واحدة.',
    longDescription: 'ارتقِ بتجربة عملائك في نقطة البيع مع هذا الستاند الفاخر المصنوع من الأكريليك عالي الكثافة. مصمم خصيصاً ليوضع بجانب الكاشير أو على طاولات الاستقبال. يحتوي على شريحة NFC فائقة السرعة تلتقط هواتف العملاء في أجزاء من الثانية وتوجههم مباشرة لصفحة تقييم متجرك على قوقل ماب، مما يرفع من تصنيفك الرقمي دون إحراج العميل بطلب التقييم شفهياً.',
    image: '/stand.png',
    badge: 'الأكثر مبيعا',
    stockStatus: 'متوفر',
    features: [
      'قاعدة أكريليك ثقيلة مقاومة للانزلاق',
      'استجابة فورية للشريحة (أقل من 0.1 ثانية)',
      'تصميم عصري مقاوم للبصمات والخدوش',
      'لا يتطلب أي بطارية أو شحن (يعمل مدى الحياة)'
    ]
  },
  {
    id: 2,
    name: 'البطاقة الذكية المتنقلة',
    price: 50,
    oldPrice: 70,
    rating: 4.9,
    reviewsCount: 160,
    description: 'بطاقة PVC فاخرة بحجم البطاقة البنكية. مناسبة لمن يخدم العميل أثناء الانتظار، أو موظفي الاستقبال ومناديب التوصيل لطلب التقييم أينما تواجدوا.',
    longDescription: 'الحل الأمثل لمن يخدم العميل أثناء الانتظار والكوادر المتنقلة! بطاقة ذكية بحجم وشعور البطاقة الائتمانية الكلاسيكية. يمكن لمقدم الخدمة أو موظف الاستقبال أو مندوب التوصيل حملها بسهولة لطلب التقييم فور انتهاء الخدمة وبلمسة واحدة.',
    image: '/card.png',
    badge: '',
    stockStatus: 'متوفر',
    features: [
      'هيكل PVC متين مقاوم للكسر والالتواء',
      'مقاومة كاملة للماء والسوائل (Waterproof)',
      'حجم قياسي يسهل حفظه في المحفظة',
      'طباعة حرارية عالية الدقة لا تُمحى'
    ]
  },
  {
    id: 3,
    name: 'الملصق الدائري الذكي',
    price: 60,
    oldPrice: 80,
    rating: 4.8,
    reviewsCount: 115,
    description: 'ملصقات ذكية بلاصق 3M قوي. الحل الأمثل للطاولات في المقاهي والمطاعم لجمع التقييمات من العملاء أثناء جلوسهم.',
    longDescription: 'حوّل طاولات مطعمك أو مقهاك إلى نقاط ذكية لجمع التقييمات! ملصق دائري أنيق ومقاوم للتلف مزود بلاصق 3M أصلي فائق القوة يثبت على الخشب، الزجاج، والرخام. يمكن للعميل تقييم تجربته أثناء استمتاعه بقهوته دون الحاجة للنهوض أو التحدث مع الموظفين.',
    image: '/sticker.png',
    badge: '',
    stockStatus: 'متوفر',
    features: [
      'لاصق 3M أصلي يتحمل الاستخدام الشاق',
      'طبقة إيبوكسي علوية مقاومة لسوائل التنظيف والحرارة',
      'مظهر أنيق وصغير الحجم لا يشوه ديكور الطاولة',
      'تغطية واسعة بأسعار اقتصادية'
    ]
  },
  {
    id: 4,
    name: 'البطاقات السادة المخصصة',
    price: 45,
    oldPrice: 60,
    rating: 5.0,
    reviewsCount: 58,
    description: 'بطاقات ذكية سادة سوداء، نبرمجها لك مسبقا على رابط من اختيارك.',
    longDescription: 'أطلق العنان لإبداعك التقني! بطاقات ذكية سادة ونظيفة تماماً تلبي كافة احتياجاتك. نبرمجها لك مسبقا على رابط من اختيارك.',
    image: '/blank.png',
    badge: 'الأعلى تقييما',
    stockStatus: 'متوفر',
    features: [
      'نبرمجها لك مسبقاً على الرابط الذي تختاره',
      'سطح أملس اسود قابل للطباعة الحرارية والتخصيص',
      'رقاقة ذكية متوافقة مع معايير NFC العالمية',
      'متعددة الاستخدامات وتعمل مع كافة الهواتف'
    ]
  }
];

const FAQS = [
  { q: 'هل يحتاج العميل إلى تحميل تطبيق للتقييم؟', a: 'أبداً! تقنية NFC مدمجة بشكل افتراضي في جميع الهواتف الذكية الحديثة (آيفون وأندرويد). بمجرد تمرير الهاتف، يفتح رابط التقييم مباشرة في المتصفح.' },
  { q: 'هل تشمل الخدمة البرمجة قبل التسليم؟', a: 'نعم، نحن نريحك تماماً؛ نقوم ببرمجة واختبار الشريحة الذكية مسبقاً على رابط نشاطك وتستلمها جاهزة للعمل 100%.' },
  { q: 'أين يتوفر التوصيل المجاني؟', a: 'التوصيل الميداني والبرمجة مجانية وفي نفس اليوم داخل مدينة أبها ومحافظة خميس مشيط.' },
  { q: 'هل يمكنني تغيير الرابط مستقبلاً (مثلاً لتغيير حساب قوقل ماب)؟', a: 'بكل تأكيد، الشرائح التي نستخدمها قابلة لإعادة البرمجة وتغيير الروابط آلاف المرات بكل سهولة.' }
];

// ==========================================
// 2. MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tq_cart')) || []; } catch { return []; }
  });
  
  const [reviews, setReviews] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const [scrolled, setScrolled] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', role: '', text: '', rating: 5 });

  useEffect(() => { localStorage.setItem('tq_cart', JSON.stringify(cart)); }, [cart]);
  
  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data, error } = await supabase.from('reviews').select('*').order('id', { ascending: false });
    if (error) console.log('خطأ في جلب التعليقات:', error);
    else setReviews(data || []);
  }
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isCartOpen || selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isCartOpen, selectedProduct]);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`تمت إضافة ${product.name} للسلة`);
    if (selectedProduct) {
      setSelectedProduct(null);
      setTimeout(() => setIsCartOpen(true), 300);
    }
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, qty: Math.max(1, item.qty + delta) };
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast('تم الحذف من السلة', 'error');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // ==========================================
  // دالة الدفع الإلكتروني عبر مويسار
  // ==========================================
  const handleElectronicPay1 = async () => {
    if (!cart.length) return;

    // تم تعطيل الدفع الإلكتروني مؤقتاً
    showToast('عذراً، خدمات الدفع الإلكتروني متوقفة مؤقتاً. يرجى استخدام الدفع عند الاستلام.', 'error');
    return;

    /*
    try {
      showToast('جاري تجهيز صفحة الدفع الآمنة...', 'success');
      
      const response = await fetch('/moyasar-api/v1/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(import.meta.env.VITE_MOYASAR_SECRET_KEY + ':')
        },
        body: JSON.stringify({
          amount: cartTotal * 100,
          currency: 'SAR',
          description: 'مشتريات من متجر وصول - Wosol',
          back_url: window.location.href
        })
      });

      const invoice = await response.json();

      if (invoice.url) {
        window.location.href = invoice.url; 
      } else {
        showToast('تعذر إعداد رابط الدفع', 'error');
        console.error('تفاصيل الخطأ من مويسار:', invoice);
      }
    } catch (error) {
      console.error('خطأ في الاتصال بالشبكة:', error);
      showToast('حدث خطأ في الشبكة، يرجى المحاولة لاحقاً', 'error');
    }
    */
  };

  const checkoutWhatsApp = () => {
    if (!cart.length) return;
    let text = `*طلب جديد من Wosol* 🌟

`;
    cart.forEach((item, i) => {
      text += `${i + 1}. ${item.name} (الكمية: ${item.qty})
`;
    });
    text += `
الإجمالي: ${cartTotal} ${CURRENCY}
`;
    text += `الموقع: أبها / خميس مشيط
`;
    text += `💳 طريقة الدفع: الدفع عند التسليم`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleElectronicPay2 = () => {
    if (!cart.length) return;
    let text = `*طلب تحويل بنكي (مصرف الراجحي) - Wosol* 🌟

`;
    cart.forEach((item, i) => {
      text += `${i + 1}. ${item.name} (الكمية: ${item.qty})
`;
    });
    text += `
الإجمالي: ${cartTotal} ${CURRENCY}
`;
    text += `البنك: مصرف الراجحي
رقم الآيبان المحول إليه: SA74 8000 0542 6080 1601 5013 

هذا إيصال التحويل:`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) return showToast('أكمل البيانات', 'error');
    
    const { error } = await supabase.from('reviews').insert([{
      name: reviewForm.name,
      comment: reviewForm.text,
      rating: Number(reviewForm.rating)
    }]);

    if (error) {
      showToast('حدث خطأ أثناء إرسال التقييم', 'error');
    } else {
      setReviewForm({ name: '', role: '', text: '', rating: 5 });
      fetchReviews();
      showToast('تم نشر تقييمك بنجاح!');
    }
  };

  return (
    <div className="tq-app" dir="rtl">
      {/* --- MASTER CSS DESIGN SYSTEM --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

        :root {
          --bg-main: #050505;
          --bg-surface: #0f0f0f;
          --bg-card: #141414;
          --bg-elevated: #1a1a1a;
          
          --brand-primary: #00d26a;
          --brand-hover: #00b056;
          --brand-glow: rgba(0, 210, 106, 0.4);
          --brand-dim: rgba(0, 210, 106, 0.1);
          
          --text-100: #ffffff;
          --text-200: #e2e8f0;
          --text-300: #94a3b8;
          
          --border-light: rgba(255, 255, 255, 0.08);
          --border-focus: rgba(0, 210, 106, 0.5);
          
          --shadow-sm: 0 4px 20px rgba(0,0,0,0.5);
          --shadow-lg: 0 20px 40px rgba(0,0,0,0.8);
          
          --radius-sm: 12px;
          --radius-md: 16px;
          --radius-lg: 24px;
          
          --trans-fast: 0.2s ease;
          --trans-smooth: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Tajawal', sans-serif; -webkit-font-smoothing: antialiased; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg-main); color: var(--text-100); overflow-x: hidden; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-main); }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--brand-primary); }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; width: 100%; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }

        .toast-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 9999; pointer-events: none; }
        .toast { 
          display: flex; align-items: center; gap: 12px; padding: 16px 24px; 
          background: var(--bg-elevated); border: 1px solid var(--border-light); 
          border-radius: var(--radius-sm); box-shadow: var(--shadow-lg); 
          animation: slideInRight var(--trans-smooth); pointer-events: auto; backdrop-filter: blur(10px);
        }
        .toast.success { border-right: 4px solid var(--brand-primary); }
        .toast.error { border-right: 4px solid #ef4444; }
        .toast-icon { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; }
        .toast.success .toast-icon { background: var(--brand-dim); color: var(--brand-primary); }
        .toast.error .toast-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .toast p { font-size: 14px; font-weight: 700; margin: 0; }

        .navbar { 
          position: fixed; top: 0; left: 0; width: 100%; height: 85px; 
          z-index: 1000; transition: var(--trans-smooth); display: flex; align-items: center;
        }
        .navbar.scrolled { 
          height: 72px; background: rgba(5,5,5,0.85); backdrop-filter: blur(16px); 
          border-bottom: 1px solid var(--border-light); box-shadow: var(--shadow-sm); 
        }
        .nav-content { display: flex; justify-content: space-between; align-items: center; }
        
        .brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: white; cursor: pointer; }
        .brand-icon { 
          width: 46px; height: 46px; background: var(--brand-dim); color: var(--brand-primary); 
          border-radius: var(--radius-sm); display: grid; place-items: center; 
          border: 1px solid var(--brand-glow); transition: var(--trans-fast);
        }
        .brand:hover .brand-icon { transform: rotate(-5deg) scale(1.05); }
        
        .brand-text { display: flex; flex-direction: column; }
        .brand-text h1 { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; line-height: 1; margin: 0; }
        .brand-text p { font-size: 11px; color: var(--brand-primary); font-weight: 700; margin: 0; padding-top: 2px; }
        
        .cart-btn { 
          background: var(--bg-surface); border: 1px solid var(--border-light); color: white; 
          padding: 10px 20px; border-radius: 100px; display: flex; align-items: center; gap: 8px; 
          cursor: pointer; transition: var(--trans-fast); font-weight: 700; font-size: 14px;
        }
        .cart-btn:hover { background: var(--bg-elevated); border-color: var(--brand-primary); }
        .cart-badge { 
          background: var(--brand-primary); color: black; width: 22px; height: 22px; 
          border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 900; 
        }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
          z-index: 3000; display: flex; justify-content: center; align-items: center; padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        .modal-content {
          background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-lg);
          width: 100%; max-width: 900px; max-height: 90vh; overflow-y: auto; position: relative;
          display: grid; grid-template-columns: 1fr 1.2fr; box-shadow: 0 30px 60px rgba(0,0,0,0.8);
          animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal-close-btn {
          position: absolute; top: 16px; right: 16px; z-index: 10;
          background: rgba(0,0,0,0.5); border: 1px solid var(--border-light); color: white;
          width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center;
          cursor: pointer; transition: var(--trans-fast); backdrop-filter: blur(4px);
        }
        .modal-close-btn:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; border-color: rgba(239, 68, 68, 0.4); transform: rotate(90deg); }
        
        .modal-image-col {
          background: #080808; display: flex; justify-content: center; align-items: center;
          padding: 40px; border-left: 1px solid var(--border-light); position: relative;
        }
        .modal-image-col img { max-width: 100%; height: auto; object-fit: contain; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.6)); }
        
        .modal-details-col { padding: 40px; display: flex; flex-direction: column; }
        .modal-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
        .modal-meta .stock { color: var(--brand-primary); background: var(--brand-dim); padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 800; }
        .modal-details-col h2 { font-size: 28px; font-weight: 900; margin-bottom: 12px; color: white; line-height: 1.3; }
        
        .modal-price-box { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border-light); }
        .modal-price-box .current { font-size: 32px; font-weight: 900; color: var(--brand-primary); }
        .modal-price-box .old { font-size: 16px; color: var(--text-300); text-decoration: line-through; }
        
        .modal-desc { font-size: 15px; color: var(--text-200); line-height: 1.9; margin-bottom: 30px; font-weight: 500; }
        
        .modal-features-list { list-style: none; margin-bottom: 32px; display: flex; flex-direction: column; gap: 14px; }
        .modal-features-list li { display: flex; align-items: flex-start; gap: 12px; font-size: 14.5px; color: var(--text-100); font-weight: 600; }
        .modal-features-list li svg { color: var(--brand-primary); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px; }
        
        .modal-add-btn {
          background: var(--brand-primary); color: black; border: none; padding: 18px; border-radius: var(--radius-sm);
          font-weight: 900; font-size: 16px; display: flex; justify-content: center; align-items: center; gap: 12px;
          cursor: pointer; transition: var(--trans-fast); margin-top: auto; width: 100%;
        }
        .modal-add-btn:hover { background: var(--brand-hover); transform: translateY(-3px); box-shadow: 0 10px 25px var(--brand-glow); }

        .hero { 
          padding: 180px 0 100px; position: relative; overflow: hidden; 
          background: radial-gradient(circle at top right, var(--brand-dim), transparent 50%); 
        }
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; align-items: center; }
        .hero-text { animation: fadeUp 0.8s var(--trans-smooth); }
        .hero-tag { 
          display: inline-flex; align-items: center; gap: 8px; background: var(--brand-dim); 
          color: var(--brand-primary); padding: 8px 18px; border-radius: 100px; font-size: 13px; 
          font-weight: 800; margin-bottom: 24px; border: 1px solid var(--brand-glow); 
        }
        .hero h1 { font-size: clamp(36px, 5vw, 60px); font-weight: 900; line-height: 1.2; margin-bottom: 24px; letter-spacing: -1px; }
        .hero h1 span { color: var(--brand-primary); }
        .hero p { font-size: 18px; color: var(--text-300); line-height: 1.8; margin-bottom: 36px; font-weight: 500; }
        .hero-cta { 
          display: inline-flex; align-items: center; gap: 10px; background: var(--brand-primary); 
          color: black; padding: 16px 36px; border-radius: var(--radius-sm); font-size: 16px; 
          font-weight: 900; text-decoration: none; transition: var(--trans-fast); border: none; cursor: pointer;
        }
        .hero-cta:hover { transform: translateY(-4px); box-shadow: 0 12px 30px var(--brand-glow); }

        .visual-box { 
          background: linear-gradient(145deg, var(--bg-card), var(--bg-elevated)); 
          padding: 36px; border-radius: var(--radius-lg); border: 1px solid var(--border-light); 
          box-shadow: var(--shadow-lg); animation: fadeUp 0.8s var(--trans-smooth) 0.2s both; 
        }
        .visual-item { display: flex; gap: 18px; margin-bottom: 28px; }
        .visual-item:last-child { margin-bottom: 0; }
        .v-icon { 
          width: 52px; height: 52px; background: rgba(0,0,0,0.5); border: 1px solid var(--border-light); 
          border-radius: var(--radius-sm); display: grid; place-items: center; color: var(--brand-primary); flex-shrink: 0; 
        }
        .v-text h4 { font-size: 17px; font-weight: 800; margin-bottom: 6px; }
        .v-text p { font-size: 14px; color: var(--text-300); line-height: 1.6; }

        .ribbon { border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); padding: 45px 0; background: var(--bg-surface); }
        .ribbon-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px; }
        .ribbon-item { display: flex; gap: 16px; align-items: flex-start; }
        .ribbon-item svg { color: var(--brand-primary); flex-shrink: 0; }
        .ribbon-item h4 { font-size: 16px; font-weight: 800; margin-bottom: 8px; color: white; }
        .ribbon-item p { font-size: 13.5px; color: var(--text-300); line-height: 1.6; }

        .store { padding: 100px 0; }
        .sec-header { text-align: center; margin-bottom: 60px; }
        .sec-header h2 { font-size: 38px; font-weight: 900; margin-bottom: 16px; letter-spacing: -0.5px; }
        .sec-header p { color: var(--text-300); font-size: 16px; max-width: 600px; margin: 0 auto; line-height: 1.7; }
        .grid-products { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }
        
        .card { 
          background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-lg); 
          overflow: hidden; transition: var(--trans-smooth); display: flex; flex-direction: column; cursor: pointer;
        }
        .card:hover { transform: translateY(-8px); border-color: var(--border-focus); box-shadow: 0 20px 45px rgba(0,210,106,0.15); }
        
        .card-img { height: 280px; background: #080808; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 20px; }
        .card-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8)); }
        .card-img img { max-width: 100%; max-height: 100%; object-fit: contain; z-index: 1; transition: var(--trans-smooth); filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)); }
        .card:hover .card-img img { transform: scale(1.08) rotate(2deg); }
        .card-badge { 
          position: absolute; top: 16px; right: 16px; z-index: 2; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); 
          color: #f5b041; padding: 6px 14px; border-radius: 10px; font-size: 12px; font-weight: 900; border: 1px solid var(--border-light); 
        }
        .quick-view-badge {
          position: absolute; bottom: 16px; left: 16px; z-index: 2; background: rgba(0,210,106,0.2); backdrop-filter: blur(8px);
          color: var(--brand-primary); padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 800;
          display: flex; align-items: center; gap: 6px; border: 1px solid var(--brand-glow); opacity: 0; transform: translateY(10px);
          transition: var(--trans-smooth);
        }
        .card:hover .quick-view-badge { opacity: 1; transform: translateY(0); }
        
        .card-body { padding: 28px; display: flex; flex-direction: column; flex-grow: 1; }
        .card-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 13px; }
        .rating { color: #f5b041; display: flex; align-items: center; gap: 4px; font-weight: 800; }
        .rating span { color: var(--text-300); font-weight: 600; margin-right: 4px; }
        .stock { color: var(--brand-primary); background: var(--brand-dim); padding: 4px 12px; border-radius: 8px; font-weight: 700; }
        
        .card h3 { font-size: 20px; font-weight: 900; margin-bottom: 10px; color: white; line-height: 1.4; }
        .card p { color: var(--text-300); font-size: 14px; line-height: 1.7; margin-bottom: 24px; flex-grow: 1; }
        
        .features-list { list-style: none; margin-bottom: 24px; border-top: 1px dashed var(--border-light); padding-top: 20px; }
        .features-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: var(--text-200); margin-bottom: 10px; font-weight: 500; }
        .features-list li svg { color: var(--brand-primary); width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; }
        
        .card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 20px; }
        .price-col { display: flex; flex-direction: column; }
        .price-col .current { font-size: 24px; font-weight: 900; color: var(--brand-primary); letter-spacing: -0.5px; }
        .price-col .old { font-size: 13px; color: var(--text-300); text-decoration: line-through; font-weight: 600; }
        
        .add-btn { 
          background: white; color: black; border: none; padding: 12px 20px; border-radius: var(--radius-sm); 
          font-weight: 900; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: var(--trans-fast); 
        }
        .add-btn:hover { background: var(--brand-primary); transform: translateY(-2px); }

        .reviews-sec { padding: 100px 0; background: var(--bg-main); border-top: 1px solid var(--border-light); }
        .reviews-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 40px; align-items: start; }
        
        .review-form-box { 
          background: linear-gradient(180deg, var(--bg-card), var(--bg-main)); 
          border: 1px solid var(--border-light); padding: 32px; border-radius: var(--radius-lg); 
          position: sticky; top: 110px; box-shadow: var(--shadow-lg); 
        }
        .review-form-box h3 { font-size: 22px; font-weight: 900; margin-bottom: 24px; color: white; display: flex; align-items: center; gap: 10px; }
        .form-group { display: flex; flex-direction: column; gap: 16px; }
        .form-input { 
          width: 100%; background: rgba(0,0,0,0.4); border: 1px solid var(--border-light); 
          color: white; padding: 16px 20px; border-radius: var(--radius-sm); font-size: 15px; 
          outline: none; transition: var(--trans-fast); 
        }
        .form-input:focus { border-color: var(--brand-primary); box-shadow: 0 0 0 3px var(--brand-dim); }
        .form-textarea { resize: vertical; min-height: 120px; }
        
        .rating-select { display: flex; gap: 12px; align-items: center; background: var(--bg-elevated); padding: 12px 20px; border-radius: var(--radius-sm); border: 1px solid var(--border-light); }
        .rating-select span { font-size: 14px; color: var(--text-300); font-weight: 700; }
        .stars-btn-group { display: flex; gap: 4px; }
        .star-btn { background: none; border: none; cursor: pointer; color: #444; transition: var(--trans-fast); padding: 0; }
        .star-btn:hover, .star-btn.active { color: #f5b041; transform: scale(1.15); }
        
        .submit-btn { 
          background: var(--brand-primary); color: black; border: none; padding: 16px; border-radius: var(--radius-sm); 
          font-weight: 900; font-size: 16px; cursor: pointer; display: flex; justify-content: center; 
          align-items: center; gap: 10px; transition: var(--trans-fast); margin-top: 8px; 
        }
        .submit-btn:hover { background: var(--brand-hover); transform: translateY(-2px); box-shadow: 0 10px 20px var(--brand-glow); }

        .reviews-feed { display: flex; flex-direction: column; gap: 24px; }
        .empty-reviews { 
          background: var(--bg-card); border: 2px dashed var(--border-light); padding: 60px 20px; 
          text-align: center; border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; gap: 16px; 
        }
        .empty-reviews svg { color: var(--border-light); }
        .empty-reviews p { font-size: 16px; font-weight: 700; color: var(--text-300); }
        
        .review-card { 
          background: var(--bg-surface); border: 1px solid var(--border-light); padding: 32px; 
          border-radius: var(--radius-lg); position: relative; animation: fadeUp 0.6s var(--trans-smooth) both; 
          transition: var(--trans-smooth); 
        }
        .review-card:hover { border-color: rgba(255,255,255,0.15); transform: translateX(-5px); }
        .r-stars { display: flex; gap: 4px; color: #f5b041; margin-bottom: 16px; }
        .r-text { font-size: 16px; color: var(--text-200); line-height: 1.8; margin-bottom: 24px; font-weight: 500; }
        .r-author { display: flex; align-items: center; gap: 16px; border-top: 1px solid var(--border-light); padding-top: 20px; }
        .r-avatar { width: 46px; height: 46px; background: var(--bg-elevated); border: 1px solid var(--brand-dim); border-radius: 50%; display: grid; place-items: center; color: var(--brand-primary); font-weight: 900; font-size: 18px; }
        .r-info h5 { font-size: 16px; color: white; font-weight: 900; margin-bottom: 4px; }
        .r-info span { font-size: 13px; color: var(--text-300); font-weight: 600; }

        .faq-sec { padding: 100px 0; background: var(--bg-surface); }
        .faq-list { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
        .faq-item { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-md); overflow: hidden; transition: var(--trans-smooth); }
        .faq-item:hover { border-color: rgba(255,255,255,0.15); }
        .faq-item.active { border-color: var(--border-focus); background: var(--bg-elevated); }
        .faq-q { 
          width: 100%; padding: 24px; background: none; border: none; text-align: right; 
          font-size: 17px; font-weight: 900; color: white; cursor: pointer; display: flex; 
          justify-content: space-between; align-items: center; gap: 20px; 
        }
        .faq-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--bg-main); display: grid; place-items: center; transition: var(--trans-smooth); color: var(--brand-primary); flex-shrink: 0; }
        .faq-item.active .faq-icon { background: var(--brand-dim); transform: rotate(180deg); }
        .faq-a { padding: 0 24px 24px; color: var(--text-300); font-size: 15px; line-height: 1.9; }

        .drawer-overlay { 
          position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); 
          z-index: 2000; opacity: 0; pointer-events: none; transition: var(--trans-smooth); 
        }
        .drawer-overlay.open { opacity: 1; pointer-events: auto; }
        
        .drawer-panel { 
          position: fixed; top: 0; left: 0; bottom: 0; width: 100%; max-width: 450px; 
          background: var(--bg-card); border-right: 1px solid var(--border-light); z-index: 2001; 
          transform: translateX(-100%); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); 
          display: flex; flex-direction: column; box-shadow: 20px 0 50px rgba(0,0,0,0.5); 
        }
        .drawer-panel.open { transform: translateX(0); }
        
        .drawer-header { padding: 24px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; background: var(--bg-main); }
        .drawer-header h3 { font-size: 20px; font-weight: 900; color: white; display: flex; align-items: center; gap: 10px; }
        .close-btn { 
          background: var(--bg-elevated); border: 1px solid var(--border-light); color: white; 
          width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; 
          cursor: pointer; transition: var(--trans-fast); 
        }
        .close-btn:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.3); transform: rotate(90deg); }
        
        .drawer-body { padding: 24px; flex-grow: 1; overflow-y: auto; }
        .empty-cart { text-align: center; margin-top: 80px; color: var(--text-300); display: flex; flex-direction: column; align-items: center; gap: 16px; }
        
        .cart-item { 
          display: flex; gap: 16px; padding: 16px; background: var(--bg-surface); 
          border: 1px solid var(--border-light); border-radius: var(--radius-md); margin-bottom: 16px; 
        }
        .cart-item-img { width: 70px; height: 70px; background: var(--bg-main); border-radius: var(--radius-sm); padding: 5px; display: grid; place-items: center; flex-shrink: 0; }
        .cart-item-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .cart-item-info { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; }
        .cart-item-info h4 { font-size: 15px; color: white; font-weight: 800; margin-bottom: 6px; }
        .cart-item-price { font-size: 15px; color: var(--brand-primary); font-weight: 900; }
        
        .cart-item-actions { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; }
        .remove-btn { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; border-radius: 8px; padding: 6px; cursor: pointer; transition: var(--trans-fast); }
        .remove-btn:hover { background: #ef4444; color: white; }
        
        .qty-box { display: flex; align-items: center; gap: 10px; background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 8px; padding: 4px; }
        .qty-btn { width: 26px; height: 26px; background: var(--bg-elevated); border: none; color: white; border-radius: 6px; cursor: pointer; display: grid; place-items: center; }
        .qty-btn:hover { background: var(--border-light); }
        .qty-box span { font-size: 14px; font-weight: 800; min-width: 16px; text-align: center; }
        
        .drawer-footer { padding: 30px 24px; border-top: 1px solid var(--border-light); background: var(--bg-main); }
        .total-row { display: flex; justify-content: space-between; font-size: 20px; font-weight: 900; color: white; margin-bottom: 16px; }
        
        .checkout-whatsapp { 
          width: 100%; background: #25d366; color: white; border: none; padding: 16px; 
          border-radius: var(--radius-sm); font-size: 15px; font-weight: 900; display: flex; 
          align-items: center; justify-content: center; gap: 10px; cursor: pointer; 
          transition: var(--trans-fast); box-shadow: 0 10px 25px rgba(37, 211, 102, 0.2); 
          margin-bottom: 12px;
        }
        .checkout-whatsapp:hover { background: #1ebd5a; transform: translateY(-2px); }

        .checkout-epay { 
          width: 100%; background: var(--bg-surface); color: var(--text-300); border: 1px solid var(--border-light); 
          padding: 14px; border-radius: var(--radius-sm); font-size: 14.5px; font-weight: 800; display: flex; 
          align-items: center; justify-content: center; gap: 10px; cursor: not-allowed; 
          transition: var(--trans-fast); margin-bottom: 10px;
        }

        .checkout-epay-msg {
          text-align: center; font-size: 12px; color: #ef4444; margin-bottom: 10px; font-weight: 700;
        }

        .footer { border-top: 1px solid var(--border-light); padding: 40px 0; background: var(--bg-main); text-align: center; }
        .footer-logo { display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--brand-primary); font-weight: 900; font-size: 22px; margin-bottom: 16px; }
        .footer p { color: var(--text-300); font-size: 14px; font-weight: 500; }

        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr; text-align: center; gap: 40px; }
          .hero-cta { margin: 0 auto; }
          .reviews-grid { grid-template-columns: 1fr; }
          .review-form-box { position: static; margin-bottom: 40px; }
          .modal-content { grid-template-columns: 1fr; max-height: 95vh; }
          .modal-image-col { padding: 25px; height: 220px; }
        }
        
        @media (max-width: 768px) {
          .navbar { height: 75px; }
          .navbar.scrolled { height: 70px; }
          .brand-text h1 { font-size: 18px; }
          .brand-text p { font-size: 10px; }
          .hero { padding: 140px 0 60px; }
          .hero h1 { font-size: 32px; }
          .drawer-panel { max-width: 100%; }
          
          .grid-products { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .card-body { padding: 14px; }
          .card h3 { font-size: 14px; }
          .card p { font-size: 11.5px; margin-bottom: 12px; }
          .card-img { height: 140px; padding: 10px; }
          .features-list { display: none; }
          .add-btn { padding: 8px 10px; font-size: 11.5px; }
          .price-col .current { font-size: 16px; }
          .price-col .old { font-size: 11px; }
        }
      `}</style>

      {toast.show && (
        <div className="toast-wrap">
          <div className={`toast ${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
            </div>
            <p>{toast.msg}</p>
          </div>
        </div>
      )}

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-content">
          <a href="#" className="brand">
            <div className="brand-icon">
              <Nfc size={24} strokeWidth={2.5} />
            </div>
            <div className="brand-text">
              <h1>Wosol</h1>
              <p>لمسة تترك أثر</p>
            </div>
          </a>
          
          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={18} />
            <span>السلة</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-text">
              <div className="hero-tag">
                <Sparkles size={14} /> التقنية الأذكى لجمع التقييمات
              </div>
              <h1>
                ارتقِ بتقييمات متجرك <span>بلمسة واحدة</span>
              </h1>
              <p>
                حوّل زوارك العابرين إلى مقيمين دائمين. حلول NFC ذكية وفاخرة لتعزيز حضورك الرقمي في قوقل ماب وزيادة مبيعاتك بأحدث التقنيات وبدون أي تعقيد.
              </p>
              <a href="#shop" className="hero-cta">
                تصفح المنتجات <MousePointer2 size={18} />
              </a>
            </div>

            <div className="visual-box">
              <div className="visual-item">
                <div className="v-icon"><MousePointer2 size={24} /></div>
                <div className="v-text">
                  <h4>بدون تطبيقات أو تعقيد</h4>
                  <p>بمجرد تمرير الهاتف الذكي، يفتح رابط تقييم قوقل ماب فوراً في متصفح العميل.</p>
                </div>
              </div>
              <div className="visual-item">
                <div className="v-icon"><Smartphone size={24} /></div>
                <div className="v-text">
                  <h4>توافق شامل وسريع</h4>
                  <p>يعمل بكفاءة مطلقة ودون تأخير مع كافة هواتف الآيفون والأندرويد.</p>
                </div>
              </div>
              <div className="visual-item">
                <div className="v-icon"><Zap size={24} /></div>
                <div className="v-text">
                  <h4>جاهزة للعمل فوراً</h4>
                  <p>نبرمج الأجهزة مسبقاً على رابط نشاط التجاري لتستلمها جاهزة ومختبرة 100%.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="ribbon">
          <div className="container ribbon-grid">
            <div className="ribbon-item">
              <Truck size={24} />
              <div>
                <h4>توصيل ميداني فوري</h4>
                <p>توصيل مجاني في نفس اليوم لجميع عملائنا الكرام في أبها وخميس مشيط.</p>
              </div>
            </div>
            <div className="ribbon-item">
              <ShieldCheck size={24} />
              <div>
                <h4>جودة تصنيع فائقة</h4>
                <p>خامات أكريليك وبلاستيك PVC مقاومة للخدش تليق بفخامة منشأتك.</p>
              </div>
            </div>
            <div className="ribbon-item">
              <Zap size={24} />
              <div>
                <h4>جاهزية تامة</h4>
                <p>نختبر البرمجة والاتصال لكل قطعة قبل تسليمها لضمان تجربة خالية من الأخطاء.</p>
              </div>
            </div>
          </div>
        </div>

        <section className="store" id="shop">
          <div className="container">
            <div className="sec-header">
              <h2>تشكيلة منتجاتنا الذكية</h2>
              <p>انقر على أي منتج لاستعراض تفاصيله ووصفه الكامل، واختار ما يناسب نشاطك التجاري.</p>
            </div>
            
            <div className="grid-products">
              {PRODUCTS.map(product => (
                <div key={product.id} className="card" onClick={() => setSelectedProduct(product)}>
                  <div className="card-img">
                    <img src={product.image} alt={product.name} />
                    {product.badge && <span className="card-badge">{product.badge}</span>}
                    <div className="quick-view-badge">
                      <Eye size={14} /> استعراض التفاصيل
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="card-meta">
                      <div className="rating">
                        <Star size={14} fill="currentColor" />
                        <span>{product.rating}</span> ({product.reviewsCount})
                      </div>
                      <span className="stock">{product.stockStatus}</span>
                    </div>
                    
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    
                    <ul className="features-list">
                      {product.features.slice(0, 2).map((feat, idx) => (
                        <li key={idx}><Check size={14} /> {feat}</li>
                      ))}
                    </ul>
                    
                    <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                      <div className="price-col">
                        <span className="current">{product.price} {CURRENCY}</span>
                        <span className="old">{product.oldPrice} {CURRENCY}</span>
                      </div>
                      <button className="add-btn" onClick={() => addToCart(product)}>
                        <Plus size={16} strokeWidth={3} /> إضافة للسلة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
                <X size={20} />
              </button>
              
              <div className="modal-image-col">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              
              <div className="modal-details-col">
                <div className="modal-meta">
                  <span className="stock">{selectedProduct.stockStatus}</span>
                  <div className="rating">
                    <Star size={14} fill="currentColor" />
                    <span>{selectedProduct.rating}</span> ({selectedProduct.reviewsCount} تقييم)
                  </div>
                </div>
                
                <h2>{selectedProduct.name}</h2>
                
                <div className="modal-price-box">
                  <span className="current">{selectedProduct.price} {CURRENCY}</span>
                  <span className="old">{selectedProduct.oldPrice} {CURRENCY}</span>
                </div>
                
                <p className="modal-desc">{selectedProduct.longDescription}</p>
                
                <ul className="modal-features-list">
                  {selectedProduct.features.map((feat, idx) => (
                    <li key={idx}><Check size={16} /> {feat}</li>
                  ))}
                </ul>
                
                <button className="modal-add-btn" onClick={() => addToCart(selectedProduct)}>
                  <ShoppingCart size={18} /> إضافة للسلة وإتمام الطلب
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="reviews-sec">
          <div className="container">
            <div className="sec-header">
              <h2>آراء شركاء النجاح</h2>
              <p>اقرأ تجارب أصحاب الأنشطة التجارية، أو شاركنا تجربتك لتظهر هنا فوراً لجميع الزوار!</p>
            </div>
            
            <div className="reviews-grid">
              <div className="review-form-box">
                <h3><Star size={22} color="#f5b041" fill="#f5b041" /> أضف تقييمك</h3>
                <form className="form-group" onSubmit={submitReview}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="اسمك الكريم (مطلوب)"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="اسم نشاطك التجاري (اختياري)"
                    value={reviewForm.role}
                    onChange={(e) => setReviewForm({...reviewForm, role: e.target.value})}
                  />
                  <div className="rating-select">
                    <span>التقييم:</span>
                    <div className="stars-btn-group">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                          onClick={() => setReviewForm({...reviewForm, rating: star})}
                        >
                          <Star size={22} fill={reviewForm.rating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="اكتب تجربتك وكيف ساعدت منتجاتنا متجرك..."
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                    required
                  ></textarea>
                  <button type="submit" className="submit-btn">
                    نشر التقييم مباشرة <Send size={16} />
                  </button>
                </form>
              </div>

              <div className="reviews-feed">
                {reviews.length === 0 ? (
                  <div className="empty-reviews">
                    <MessageCircle size={48} strokeWidth={1.5} />
                    <p>لا توجد تقييمات حالياً. كن أول من يشاركنا نجاحه وتجربته اليوم!</p>
                  </div>
                ) : (
                  reviews.map((r, index) => (
                    <div key={r.id || index} className="review-card">
                      <div className="r-stars">
                        {[...Array(r.rating || 5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                      </div>
                      <p className="r-text">"{r.comment || r.text}"</p>
                      <div className="r-author">
                        <div className="r-avatar">{r.name ? r.name.charAt(0) : 'ع'}</div>
                        <div className="r-info">
                          <h5>{r.name}</h5>
                          <span>{r.role || 'عميل معتمد'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="faq-sec">
          <div className="container">
            <div className="sec-header">
              <h2>الأسئلة الشائعة</h2>
              <p>إليك إجابات وافية لأكثر الاستفسارات تكراراً حول تقنياتنا وخدماتنا.</p>
            </div>
            
            <div className="faq-list">
              {FAQS.map((faq, idx) => (
                <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                  <button className="faq-q" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                    <span>{faq.q}</span>
                    <div className="faq-icon"><ChevronDown size={20} /></div>
                  </button>
                  {activeFaq === idx && <div className="faq-a">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-logo">
          <Nfc size={24} /> Wosol
          </div>
          <p>جميع الحقوق محفوظة © 2026 - الحلول التقنية المتقدمة لجمع التقييمات عبر NFC (أبها وخميس مشيط).</p>
          <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-300)' }}>
            وثيقة العمل الحر: FL-148096727
          </p>
        </div>
      </footer>

      <div className={`drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      
      <div className={`drawer-panel ${isCartOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3><ShoppingCart size={20} /> سلة المشتريات</h3>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}><X size={20} /></button>
        </div>
        
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
              <p>سلتك فارغة حالياً. تصفح المنتجات وأضف ما يناسب نشاطك التجاري!</p>
            </div>
          ) : (
             cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <span className="cart-item-price">{item.price * item.qty} {CURRENCY}</span>
                </div>
                <div className="cart-item-actions">
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                  <div className="qty-box">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}><Minus size={12} /></button>
                    <span>{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}><Plus size={12} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="total-row">
              <span>الإجمالي الكلي:</span>
              <span style={{ color: 'var(--brand-primary)' }}>{cartTotal} {CURRENCY}</span>
            </div>
            <p style={{ textAlign: 'center', color: 'var(--brand-primary)', fontSize: '14.5px', marginBottom: '16px', fontWeight: '800' }}>
              🤝 متوفر خدمة الدفع عند التسليم
            </p>
            <button className="checkout-whatsapp" onClick={checkoutWhatsApp}>
             (للدفع عند الاستلام) إتمام الطلب الفوري عبر واتساب <MessageCircle size={20} />
            </button>
            <p className="checkout-epay-msg">عذراً، خدمات الدفع الإلكتروني متوقفة مؤقتاً</p>
            <button className="checkout-epay" disabled>
              الدفع الإلكتروني - بطاقة / أبل باي <CreditCard size={18} />
            </button>
            <button className="checkout-epay" disabled>
              الدفع عبر تحويل مصرف الراجحي <CreditCard size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}