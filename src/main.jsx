import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const COMPANY = {
  name: '汝州市浩骄商贸商行(个体工商户)',
  email: 'shopjuepdd@outlook.com',
  phone: '16555178414',
  address: '河南省平顶山市汝州市米庙镇潘庄村村民委员会南200米3号',
}

const categories = [
  { id: 'furniture', name: 'Furniture', cn: '家具', desc: 'Pieces that make a room feel like yours', image: '/assets/category-furniture.webp' },
  { id: 'soft', name: 'Soft furnishings', cn: '软装', desc: 'Texture, colour and a softer landing', image: '/assets/category-soft.webp' },
  { id: 'everyday', name: 'Everyday living', cn: '家居日用品', desc: 'Small upgrades for everyday rituals', image: '/assets/category-everyday.webp' },
  { id: 'dining', name: 'Dining & kitchen', cn: '餐厨用品', desc: 'Useful details for shared tables', image: '/assets/category-dining.webp' },
  { id: 'bath', name: 'Bath & care', cn: '浴室用品', desc: 'A calmer start and finish to the day', image: '/assets/category-bath.webp' },
]

const names = {
  furniture: ['Linen Cloud Sofa', 'Calm Oak Bed', 'Ridge Wardrobe', 'Sunday Dining Table', 'Arc Coffee Table', 'Lowline TV Cabinet', 'Pebble Chest', 'Luna Sideboard', 'Open Shelf Bookcase', 'Soft Angle Lounge Chair'],
  soft: ['Washed Linen Curtain', 'Woven Horizon Rug', 'Clay Stripe Cushion', 'Quiet Morning Print', 'Olive Houseplant', 'Airy Voile Sheer', 'Reed Blind', 'Textured Wallcovering', 'Handloom Tapestry', 'Mellow Seat Pad'],
  everyday: ['Cloud Cotton Bedding', 'Foldaway Storage Crate', 'Pebble Door Mat', 'Cloudweight Quilt', 'Restwell Pillow', 'Everyday Fitted Sheet', 'Cotton Bath Towel', 'Slow Sunday Robe', 'Canvas Laundry Basket', 'Stackable Home Box'],
  dining: ['Natural Linen Placemat', 'Table Day Cloth', 'Cork Heat Mat', 'Rail Kitchen Shelf', 'Quiet Oak Tray', 'Soft Check Runner', 'Loop Napkin Set', 'Everyday Spice Rack', 'Warm Grain Trivet', 'Pantry Jar Set'],
  bath: ['Ripple Shower Curtain', 'Dry Step Bath Mat', 'Rail Towel Holder', 'Corner Care Shelf', 'Clear Vanity Organiser', 'Calm Cotton Hand Towel', 'Stone Soap Dish', 'Linen Hair Wrap', 'Soft Bath Caddy', 'Daily Care Hook'],
}

const prices = [89, 159, 119, 129, 69, 149, 79, 139, 99, 109, 39, 59, 29, 35, 24, 45, 32, 49, 27, 22]
// Keep the photo subject aligned with the product title rather than relying on contact-sheet order.
const assetMap = {
  'furniture-1': 1, 'furniture-2': 2, 'furniture-3': 3, 'furniture-4': 4, 'furniture-5': 5, 'furniture-6': 6, 'furniture-7': 17, 'furniture-8': 18, 'furniture-9': 19, 'furniture-10': 26,
  'soft-1': 8, 'soft-2': 7, 'soft-3': 9, 'soft-4': 34, 'soft-5': 35, 'soft-6': 36, 'soft-7': 37, 'soft-8': 39, 'soft-9': 38, 'soft-10': 33,
  'everyday-1': 49, 'everyday-2': 50, 'everyday-3': 51, 'everyday-4': 52, 'everyday-5': 53, 'everyday-6': 54, 'everyday-7': 55, 'everyday-8': 56, 'everyday-9': 57, 'everyday-10': 58,
  'dining-1': 13, 'dining-2': 28, 'dining-3': 46, 'dining-4': 14, 'dining-5': 20, 'dining-6': 31, 'dining-7': 44, 'dining-8': 27, 'dining-9': 47, 'dining-10': 32,
  'bath-1': 67, 'bath-2': 68, 'bath-3': 69, 'bath-4': 70, 'bath-5': 71, 'bath-6': 72, 'bath-7': 73, 'bath-8': 74, 'bath-9': 75, 'bath-10': 76,
}
const products = Object.entries(names).flatMap(([category, list], ci) => list.map((name, i) => ({
  id: `${category}-${i + 1}`, name, category, price: prices[(ci * 10 + i) % prices.length], image: `/assets/product-${String(assetMap[`${category}-${i + 1}`]).padStart(2, '0')}.webp`, colour: ['#d9d0c3', '#b7c1b2', '#d2b8a4', '#c9c4b7', '#b6b0a2'][ci],
})))

function App() {
  const [view, setView] = useState('home')
  const [activeCategory, setActiveCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [policyKey, setPolicyKey] = useState('payment')

  const filtered = useMemo(() => activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory), [activeCategory])
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const addToCart = (product, direct = false) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id)
      return found ? prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...prev, { ...product, qty: 1 }]
    })
    if (direct) setView('checkout')
    else setCartOpen(true)
  }

  const updateQty = (id, amount) => setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + amount) } : item).filter(item => item.qty))
  const goCategory = (id) => { setActiveCategory(id); setView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const submitDemo = (e) => { e.preventDefault(); setNotice('Demo order received — payment is ready to connect to your merchant account.'); setCart([]) }
  const openPolicy = (key) => { setPolicyKey(key); setView('policy') }

  return <>
    <header className="site-header">
      <button className="wordmark" onClick={() => { setView('home'); setActiveCategory('all') }}>HABITÉ<span>home, made easy</span></button>
      <nav><button onClick={() => setView('shop')}>Shop</button><button onClick={() => goCategory('furniture')}>Furniture</button><button onClick={() => goCategory('soft')}>Soft furnishings</button><button onClick={() => setView('about')}>Our story</button></nav>
      <div className="header-actions"><button className="plain-btn" onClick={() => setView('admin')}>Admin</button><button className="cart-btn" onClick={() => setCartOpen(true)}>Bag <b>{cart.reduce((s, i) => s + i.qty, 0)}</b></button></div>
    </header>

    {view === 'home' && <Home goCategory={goCategory} setView={setView} />}
    {view === 'shop' && <Shop products={filtered} activeCategory={activeCategory} setActiveCategory={setActiveCategory} addToCart={addToCart} />}
    {view === 'checkout' && <Checkout cart={cart} total={total} updateQty={updateQty} setView={setView} submitDemo={submitDemo} notice={notice} />}
    {view === 'about' && <InfoPage title="Our story" kicker="GOOD THINGS, THOUGHTFULLY CHOSEN" content={<><p>HABITÉ is a considered home-living collection for rooms that are lived in, not staged. We look for honest materials, useful shapes and colours that leave space to breathe.</p><p>Every collection is selected for everyday comfort — from the sofa you sink into after work to the towel that starts the morning well.</p></>} />}
    {view === 'admin' && <Admin />}
    {view === 'policy' && <InfoPage title="Policy centre" kicker="CLEAR, PRACTICAL, HUMAN" content={<PolicyContent active={policyKey} />} />}

    <footer className="footer"><div className="footer-main"><div><div className="footer-logo">HABITÉ</div><p>Calm objects for everyday living.</p></div><div><h4>Explore</h4><button onClick={() => setView('shop')}>All products</button><button onClick={() => goCategory('furniture')}>Furniture</button><button onClick={() => goCategory('everyday')}>Everyday living</button></div><div><h4>Help & policies</h4><button onClick={() => openPolicy('payment')}>Payment & billing</button><button onClick={() => openPolicy('returns')}>Returns & refunds</button><button onClick={() => openPolicy('shipping')}>Shipping & tracking</button><button onClick={() => openPolicy('terms')}>Terms of Service</button><button onClick={() => openPolicy('privacy')}>Privacy & DMCA</button></div><div><h4>Contact</h4><p>{COMPANY.name}</p><p>Registration no.: not provided</p><p>{COMPANY.email}</p><p>{COMPANY.phone}</p><p>{COMPANY.address}</p></div></div><div className="footer-bottom"><span>© 2026 {COMPANY.name}</span><span>Payment demo: <b>PayPal</b> · <b>VISA</b> · <b>Card</b></span></div></footer>

    {cartOpen && <aside className="cart-drawer"><div className="drawer-head"><div><span className="eyebrow">YOUR BAG</span><h2>{cart.length ? `${cart.reduce((s, i) => s + i.qty, 0)} items` : 'Your bag is quiet'}</h2></div><button className="close" onClick={() => setCartOpen(false)}>×</button></div>{cart.length ? <>{cart.map(item => <div className="cart-line" key={item.id}><div className="thumb" style={{ backgroundColor: item.colour }}><img src={item.image} alt="" onError={e => { e.currentTarget.style.display='none' }} /></div><div className="cart-copy"><b>{item.name}</b><span>${item.price}</span><div className="qty"><button onClick={() => updateQty(item.id, -1)}>−</button><span>{item.qty}</span><button onClick={() => updateQty(item.id, 1)}>+</button></div></div></div>)}<div className="drawer-total"><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><button className="dark-btn wide" onClick={() => { setCartOpen(false); setView('checkout') }}>Go to checkout</button></> : <div className="empty"><p>Good things take time. Start with a browse.</p><button className="outline-btn" onClick={() => { setCartOpen(false); setView('shop') }}>Shop the collection</button></div>}</aside>}
  </>
}

function Home({ goCategory, setView }) { return <main><section className="hero"><div className="hero-copy"><span className="eyebrow">A QUIETLY CONSIDERED HOME</span><h1>Make room<br /><i>for living.</i></h1><p>Furniture, soft furnishings and everyday essentials chosen to make home feel a little more like you.</p><button className="dark-btn" onClick={() => setView('shop')}>Shop the collection <span>→</span></button></div><div className="hero-art"><div className="sun"></div><div className="hero-sofa"><span></span><span></span><span></span></div><div className="hero-table"></div><div className="hero-plant">♧</div><small>New season · quiet forms</small></div></section><section className="intro"><span className="eyebrow">THE HABITÉ EDIT</span><h2>Useful things, <i>beautifully</i> lived with.</h2><p>A softer approach to the everyday. Discover pieces with good proportions, tactile materials and no unnecessary noise.</p></section><section className="category-grid">{categories.map(c => <button className="category-card" key={c.id} onClick={() => goCategory(c.id)}><div className="category-art" style={{ backgroundColor: c.id === 'furniture' ? '#d8cbbb' : c.id === 'soft' ? '#c9c7b1' : c.id === 'everyday' ? '#d7d0c3' : c.id === 'dining' ? '#c8b7a2' : '#d2d6ce' }}><img src={c.image} alt="" onError={e => { e.currentTarget.style.display='none' }} /><span>{c.id === 'furniture' ? '⌂' : c.id === 'soft' ? '∿' : c.id === 'everyday' ? '□' : c.id === 'dining' ? '◌' : '○'}</span></div><div><span className="eyebrow">{c.cn}</span><h3>{c.name}</h3><p>{c.desc}</p></div><span className="arrow">↗</span></button>)}</section><section className="strip"><div><span className="eyebrow">WHY HABITÉ</span><h2>Made for the everyday.</h2></div><div className="strip-points"><p><b>01</b> Honest materials<br /><span>Comfort you can feel.</span></p><p><b>02</b> Thoughtful prices<br /><span>Good design, fairly considered.</span></p><p><b>03</b> Easy to live with<br /><span>Pieces that settle in.</span></p></div></section></main> }

function Shop({ products, activeCategory, setActiveCategory, addToCart }) { return <main className="shop-page"><div className="shop-head"><div><span className="eyebrow">THE COLLECTION</span><h1>Find your <i>everyday.</i></h1></div><p>{products.length} considered pieces for a calmer home.</p></div><div className="filters"><button className={activeCategory === 'all' ? 'active' : ''} onClick={() => setActiveCategory('all')}>All</button>{categories.map(c => <button className={activeCategory === c.id ? 'active' : ''} key={c.id} onClick={() => setActiveCategory(c.id)}>{c.name}</button>)}</div><div className="product-grid">{products.map((p, index) => <article className="product-card" key={p.id}><div className="product-image" style={{ backgroundColor: p.colour }}><img src={p.image} alt={p.name} onError={e => { e.currentTarget.style.display='none' }} /><span className="product-mark">{String(index + 1).padStart(2, '0')}</span><button className="quick-add" onClick={() => addToCart(p)}>Add +</button></div><div className="product-info"><div><h3>{p.name}</h3><span>{categories.find(c => c.id === p.category)?.name}</span></div><strong>${p.price}</strong></div><button className="buy-now" onClick={() => addToCart(p, true)}>Buy Now — ${p.price}</button></article>)}</div></main> }

function Checkout({ cart, total, updateQty, setView, submitDemo, notice }) { return <main className="checkout"><div className="checkout-head"><button className="back" onClick={() => setView('shop')}>← Continue shopping</button><span className="eyebrow">SECURE CHECKOUT · DEMO</span></div>{notice && <div className="notice">{notice}</div>}<div className="checkout-grid"><section><h1>Almost <i>home.</i></h1>{cart.length ? cart.map(item => <div className="checkout-line" key={item.id}><div className="thumb" style={{ backgroundColor: item.colour }}></div><div><h3>{item.name}</h3><span>${item.price} · Qty {item.qty}</span></div><button onClick={() => updateQty(item.id, -1)}>Remove</button></div>) : <p>Your bag is empty. <button className="text-link" onClick={() => setView('shop')}>Browse the collection.</button></p>}</section><form className="payment-card" onSubmit={submitDemo}><h2>Payment details</h2><p className="muted">This is a front-end payment demo. Connect your merchant credentials before accepting live payments.</p><label>Email<input type="email" required placeholder="you@example.com" /></label><label>Cardholder name<input required placeholder="Name on card" /></label><label>Card number<input required placeholder="4242 4242 4242 4242" /></label><div className="form-row"><label>Expiry<input required placeholder="MM / YY" /></label><label>CVC<input required placeholder="123" /></label></div><div className="payment-options"><span>PayPal</span><span>VISA</span><span>▣ Card</span></div><div className="checkout-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div><button className="dark-btn wide" disabled={!cart.length}>Pay securely · ${total.toFixed(2)}</button><small>By placing this demo order you agree to our Terms of Service.</small></form></div></main> }

function InfoPage({ title, kicker, content }) { return <main className="info-page"><span className="eyebrow">{kicker}</span><h1>{title}</h1><div className="info-content">{content}</div></main> }
function PolicyContent({ active }) { const titles = ['Payment & billing','Returns & refunds','Cancellation policy','About us','Shipping policy','Order tracking','Terms of Service','Privacy policy','DMCA']; const activeMap = { payment: 0, returns: 1, shipping: 4, terms: 6, privacy: 7 }; return <div className="policy-list">{titles.map((title, i) => <section className={activeMap[active] === i ? 'selected' : ''} key={title}><span>0{i + 1}</span><div><h2>{title}</h2><p>{title === 'Terms of Service' ? '1. Agreement · 2. Eligibility · 3. Accounts · 4. Products · 5. Pricing · 6. Orders · 7. Payment · 8. Shipping · 9. Returns · 10. Cancellations · 11. Intellectual property · 12. User content · 13. Privacy · 14. Disclaimer · 15. Liability · 16. Governing law · 17. Contact.' : `Please contact ${COMPANY.email} for assistance. We provide clear, practical support for ${title.toLowerCase()} questions. Any request should include your order details and the email used at checkout.`}</p></div></section>)}</div> }
function Admin() { return <main className="admin"><span className="eyebrow">HABITÉ STUDIO</span><h1>Store <i>admin.</i></h1><div className="admin-login"><h2>Demo access</h2><p>Frontend-only admin preview. No real orders or credentials are stored.</p><label>Username<input defaultValue="admin" /></label><label>Password<input type="password" defaultValue="habite2026" /></label><button className="dark-btn wide" onClick={() => alert('Demo dashboard unlocked')}>Sign in to demo</button><small>Demo account: admin / habite2026</small></div><div className="admin-stats"><div><span>50</span><p>Products</p></div><div><span>5</span><p>Categories</p></div><div><span>Demo</span><p>Payment mode</p></div></div></main> }

createRoot(document.getElementById('root')).render(<App />)
