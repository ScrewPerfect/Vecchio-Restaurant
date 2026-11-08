import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft, Bell, CalendarDays, Check, ChevronRight, CircleUserRound,
  Clock3, Edit3, Home, Info, LogOut, Menu as MenuIcon, Phone, Search,
  Settings, Sparkles, Star, Users, UtensilsCrossed, X, MapPin
} from 'lucide-react';
import './styles.css';

const dishes = [
  { id: 1, name: 'Truffle Mushroom Pasta', category: 'Pasta', price: 28, emoji: '🍝', note: 'Creamy truffle sauce, wild mushrooms, parmesan', rating: 4.8 },
  { id: 2, name: 'Herb Grilled Salmon', category: 'Mains', price: 42, emoji: '🐟', note: 'Herb butter, roasted vegetables, lemon', rating: 4.9 },
  { id: 3, name: 'Classic Beef Steak', category: 'Mains', price: 56, emoji: '🥩', note: 'Black pepper jus, potato gratin, greens', rating: 4.7 },
  { id: 4, name: 'Garden Burrata Salad', category: 'Starter', price: 24, emoji: '🥗', note: 'Burrata, tomato, basil oil, balsamic glaze', rating: 4.6 },
  { id: 5, name: 'Tiramisu', category: 'Dessert', price: 18, emoji: '🍰', note: 'Mascarpone, espresso, cocoa', rating: 4.9 },
  { id: 6, name: 'Citrus Sparkler', category: 'Drinks', price: 14, emoji: '🍹', note: 'Orange, lime, soda, mint', rating: 4.5 },
];

const tables = [
  { id: 1, seats: 2, status: 'available', zone: 'Window' },
  { id: 2, seats: 2, status: 'reserved', zone: 'Window' },
  { id: 3, seats: 4, status: 'available', zone: 'Main Hall' },
  { id: 4, seats: 4, status: 'reserved', zone: 'Main Hall' },
  { id: 5, seats: 8, status: 'unavailable', zone: 'Main Hall' },
  { id: 6, seats: 4, status: 'available', zone: 'Quiet Corner' },
  { id: 7, seats: 4, status: 'available', zone: 'Quiet Corner' },
  { id: 8, seats: 4, status: 'reserved', zone: 'Patio' },
  { id: 9, seats: 6, status: 'available', zone: 'Patio' },
];

const dateOptions = [
  { day: 'MON', date: '10', full: '2026-11-10', available: true },
  { day: 'TUE', date: '11', full: '2026-11-11', available: true },
  { day: 'WED', date: '12', full: '2026-11-12', available: false },
  { day: 'THU', date: '13', full: '2026-11-13', available: true },
  { day: 'FRI', date: '14', full: '2026-11-14', available: true },
];

const times = ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'];

function App() {
  const [page, setPage] = useState('welcome');
  const [loggedIn, setLoggedIn] = useState(false);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [reservation, setReservation] = useState({
    date: '2026-11-11', time: '6:30 PM', guests: 4, special: false,
    specialNote: '', tableId: null, autoAssign: false, name: 'Test User', phone: '0123456789'
  });
  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vecchioBookings')) || []; } catch { return []; }
  });

  const selectedTable = tables.find(t => t.id === reservation.tableId);
  const availableForParty = tables.filter(t => t.status === 'available' && t.seats >= reservation.guests);
  const filteredDishes = dishes.filter(d =>
    `${d.name} ${d.category}`.toLowerCase().includes(search.toLowerCase())
  );

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };

  const nav = (target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmBooking = () => {
    const table = reservation.autoAssign
      ? availableForParty[0]
      : selectedTable;
    if (!table) {
      notify('Please choose an available table or use auto-assign.');
      return;
    }
    const booking = {
      id: `VR-${String(Date.now()).slice(-6)}`,
      ...reservation,
      tableId: table.id,
      tableZone: table.zone,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    const next = [booking, ...bookings];
    setBookings(next);
    localStorage.setItem('vecchioBookings', JSON.stringify(next));
    setReservation(r => ({ ...r, tableId: table.id }));
    nav('confirmation');
  };

  const cancelBooking = (id) => {
    const next = bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b);
    setBookings(next);
    localStorage.setItem('vecchioBookings', JSON.stringify(next));
    notify('Reservation cancelled.');
  };

  const resetReservation = () => {
    setReservation({
      date: '2026-11-11', time: '6:30 PM', guests: 4, special: false,
      specialNote: '', tableId: null, autoAssign: false, name: 'Test User', phone: '0123456789'
    });
  };

  const body = useMemo(() => {
    const props = { nav, notify, reservation, setReservation, selectedTable, availableForParty, confirmBooking, bookings, cancelBooking, resetReservation, loggedIn, setLoggedIn, search, setSearch, filteredDishes };
    switch (page) {
      case 'welcome': return <Welcome {...props} />;
      case 'login': return <Login {...props} />;
      case 'home': return <HomePage {...props} />;
      case 'menu': return <MenuPage {...props} />;
      case 'reserve': return <ReservationDetails {...props} />;
      case 'tables': return <TableSelection {...props} />;
      case 'review': return <ReviewPage {...props} />;
      case 'confirmation': return <Confirmation {...props} />;
      case 'bookings': return <Bookings {...props} />;
      case 'profile': return <Profile {...props} />;
      default: return <Welcome {...props} />;
    }
  }, [page, reservation, bookings, loggedIn, search]);

  const showBottomNav = loggedIn && !['welcome', 'login'].includes(page);

  return (
    <div className="app-shell">
      <div className="phone-frame">
        {toast && <div className="toast"><Check size={17}/>{toast}</div>}
        {body}
        {showBottomNav && <BottomNav page={page} nav={nav} />}
      </div>
    </div>
  );
}

function Brand({ light = false }) {
  return (
    <div className={`brand ${light ? 'brand-light' : ''}`}>
      <div className="brand-mark"><UtensilsCrossed size={22}/><Clock3 size={18}/></div>
      <div><div className="brand-name">Vecchio</div><div className="brand-sub">RESTAURANT</div></div>
    </div>
  );
}

function Welcome({ nav }) {
  return (
    <main className="welcome-page">
      <div className="welcome-overlay">
        <Brand light />
        <div className="welcome-copy">
          <div className="eyebrow">Italian dining, simplified</div>
          <h1>Reserve your table in minutes.</h1>
          <p>Browse the menu, check real-time availability, add special requests and receive instant confirmation.</p>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-primary btn-large" onClick={() => nav('login')}>Login to continue <ChevronRight size={20}/></button>
          <button className="btn btn-ghost-light">Explore as guest</button>
        </div>
      </div>
    </main>
  );
}

function Login({ nav, setLoggedIn, notify }) {
  const [phone, setPhone] = useState('0123456789');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (phone.replace(/\D/g,'').length < 8 || password.length < 4) {
      setError('Enter a valid phone number and password.');
      return;
    }
    setLoggedIn(true);
    notify('Login successful');
    nav('home');
  };
  return (
    <main className="page light-page auth-page">
      <button className="icon-button" onClick={() => nav('welcome')}><ArrowLeft size={20}/></button>
      <Brand />
      <section className="auth-card">
        <div className="eyebrow dark">Welcome back</div>
        <h2>Login</h2>
        <p className="muted">Use the demo details below during usability testing.</p>
        <form onSubmit={submit}>
          <label>Phone number</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" aria-label="Phone number" />
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" aria-label="Password" />
          {error && <div className="form-error"><Info size={16}/>{error}</div>}
          <div className="demo-note">Testing account: <strong>0123456789</strong> / <strong>demo123</strong></div>
          <button className="btn btn-primary full" type="submit">Login</button>
        </form>
      </section>
    </main>
  );
}

function HomePage({ nav, bookings }) {
  const active = bookings.find(b => b.status === 'Confirmed');
  return (
    <main className="page home-page">
      <header className="topbar dark-topbar"><Brand light/><button className="icon-button glass"><Bell size={20}/></button></header>
      <section className="hero-card">
        <div className="eyebrow light-text">Good evening</div>
        <h2>Plan your next dining moment.</h2>
        <p>Choose a date, check availability and confirm your table.</p>
        <button className="btn btn-gold" onClick={() => nav('reserve')}>Book a table <ChevronRight size={19}/></button>
      </section>
      <section className="section pad">
        <div className="section-head"><h3>Quick actions</h3></div>
        <div className="quick-grid">
          <button className="quick-card" onClick={() => nav('menu')}><MenuIcon/><span>View menu</span><small>Explore dishes</small></button>
          <button className="quick-card" onClick={() => nav('bookings')}><CalendarDays/><span>My bookings</span><small>{active ? '1 active reservation' : 'View reservations'}</small></button>
        </div>
      </section>
      <section className="section pad">
        <div className="section-head"><h3>Popular tonight</h3><button className="text-link" onClick={() => nav('menu')}>See all</button></div>
        <div className="dish-row">
          {dishes.slice(0,3).map(d => <DishMini key={d.id} d={d}/>) }
        </div>
      </section>
      <section className="info-banner"><Sparkles size={20}/><div><strong>Testing tip</strong><span>Complete the reservation flow, then find it again under My Bookings.</span></div></section>
    </main>
  );
}

function DishMini({ d }) {
  return <div className="dish-mini"><div className="dish-emoji">{d.emoji}</div><strong>{d.name}</strong><span>RM {d.price}</span></div>;
}

function MenuPage({ nav, search, setSearch, filteredDishes }) {
  return (
    <main className="page light-page">
      <PageHeader title="Menu" onBack={() => nav('home')} />
      <div className="pad">
        <div className="search-box"><Search size={18}/><input placeholder="Search dishes" value={search} onChange={e=>setSearch(e.target.value)} /></div>
        <div className="category-pills"><span className="pill active">All</span><span className="pill">Mains</span><span className="pill">Pasta</span><span className="pill">Dessert</span></div>
        <div className="menu-list">
          {filteredDishes.map(d => (
            <article className="menu-card" key={d.id}>
              <div className="menu-visual">{d.emoji}</div>
              <div className="menu-copy"><div className="menu-top"><h4>{d.name}</h4><strong>RM {d.price}</strong></div><p>{d.note}</p><div className="rating"><Star size={15} fill="currentColor"/> {d.rating} · {d.category}</div></div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function ReservationDetails({ nav, reservation, setReservation, notify }) {
  const validDate = dateOptions.find(d => d.full === reservation.date)?.available;
  const next = () => {
    if (!validDate) return notify('Please select an available date.');
    if (reservation.special && !reservation.specialNote.trim()) return notify('Add a short special occasion note.');
    nav('tables');
  };
  return (
    <main className="page light-page">
      <PageHeader title="New reservation" onBack={() => nav('home')} />
      <Progress active={1}/>
      <div className="pad form-stack">
        <section className="form-section">
          <h3>Select a date</h3><p className="muted">Unavailable dates are labelled, not shown by colour alone.</p>
          <div className="date-strip">
            {dateOptions.map(d => (
              <button key={d.full} disabled={!d.available} className={`date-card ${reservation.date===d.full?'selected':''} ${!d.available?'disabled':''}`} onClick={()=>setReservation(r=>({...r,date:d.full}))}>
                <small>{d.day}</small><strong>{d.date}</strong><span>{d.available?'Available':'Unavailable'}</span>
              </button>
            ))}
          </div>
        </section>
        <section className="form-section two-col">
          <div><label>Time</label><select value={reservation.time} onChange={e=>setReservation(r=>({...r,time:e.target.value}))}>{times.map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label>Guests</label><select value={reservation.guests} onChange={e=>setReservation(r=>({...r,guests:Number(e.target.value),tableId:null}))}>{[2,3,4,5,6].map(n=><option key={n} value={n}>{n} people</option>)}</select></div>
        </section>
        <section className="form-section">
          <div className="toggle-row"><div><h3>Special occasion?</h3><p className="muted">Birthday, anniversary or another request.</p></div><button className={`toggle ${reservation.special?'on':''}`} onClick={()=>setReservation(r=>({...r,special:!r.special,specialNote:r.special?'':r.specialNote}))}><span/></button></div>
          {reservation.special && <textarea maxLength={200} placeholder="Example: Birthday celebration, please prepare a small candle." value={reservation.specialNote} onChange={e=>setReservation(r=>({...r,specialNote:e.target.value}))} />}
        </section>
        <button className="btn btn-primary full" onClick={next}>Continue to table selection <ChevronRight size={18}/></button>
      </div>
    </main>
  );
}

function TableSelection({ nav, reservation, setReservation, availableForParty, notify }) {
  const choose = (t) => {
    if (t.status !== 'available') return;
    if (t.seats < reservation.guests) return notify(`Table ${t.id} only fits ${t.seats} guests.`);
    setReservation(r=>({...r,tableId:t.id,autoAssign:false}));
  };
  const next = () => {
    if (!reservation.tableId && !reservation.autoAssign) return notify('Choose a table or select auto-assign.');
    nav('review');
  };
  return (
    <main className="page light-page">
      <PageHeader title="Choose a table" onBack={() => nav('reserve')} />
      <Progress active={2}/>
      <div className="pad">
        <div className="legend"><span><i className="dot available"/>Available</span><span><i className="dot reserved"/>Reserved</span><span><i className="dot unavailable"/>Unavailable</span></div>
        <button className={`auto-assign ${reservation.autoAssign?'selected':''}`} onClick={()=>setReservation(r=>({...r,autoAssign:true,tableId:null}))}><Sparkles size={19}/><div><strong>Auto-assign best available table</strong><small>Fastest option for your group of {reservation.guests}</small></div>{reservation.autoAssign&&<Check/>}</button>
        <div className="floor-plan">
          <div className="window-label">WINDOW</div>
          {tables.map(t => {
            const tooSmall = t.seats < reservation.guests;
            const status = tooSmall && t.status==='available' ? 'unavailable' : t.status;
            const selected = reservation.tableId === t.id;
            return <button key={t.id} className={`table-node ${status} ${selected?'selected':''}`} disabled={status!=='available'} onClick={()=>choose(t)} aria-label={`Table ${t.id}, ${t.seats} seats, ${status}`}>
              <span className="table-num">{t.id}</span><small>{t.seats} seats</small><em>{status==='available'?'Available':status==='reserved'?'Reserved':'Unavailable'}</em>
            </button>
          })}
        </div>
        <button className="btn btn-primary full" onClick={next}>Review reservation <ChevronRight size={18}/></button>
      </div>
    </main>
  );
}

function ReviewPage({ nav, reservation, selectedTable, availableForParty, confirmBooking, setReservation }) {
  const table = reservation.autoAssign ? availableForParty[0] : selectedTable;
  return (
    <main className="page light-page">
      <PageHeader title="Review reservation" onBack={() => nav('tables')} />
      <Progress active={3}/>
      <div className="pad">
        <div className="review-card">
          <div className="review-title"><div className="success-icon small"><UtensilsCrossed/></div><div><div className="eyebrow dark">Vecchio Restaurant</div><h3>Dining reservation</h3></div></div>
          <ReviewRow icon={<CalendarDays/>} label="Date" value={formatDate(reservation.date)} />
          <ReviewRow icon={<Clock3/>} label="Time" value={reservation.time} />
          <ReviewRow icon={<Users/>} label="Guests" value={`${reservation.guests} people`} />
          <ReviewRow icon={<MapPin/>} label="Table" value={table ? `Table ${table.id} · ${table.zone}` : 'Not selected'} />
          <ReviewRow icon={<Sparkles/>} label="Special request" value={reservation.special ? reservation.specialNote : 'None'} />
        </div>
        <section className="form-section compact"><label>Reservation name</label><input value={reservation.name} onChange={e=>setReservation(r=>({...r,name:e.target.value}))}/><label>Contact number</label><input value={reservation.phone} onChange={e=>setReservation(r=>({...r,phone:e.target.value}))}/></section>
        <div className="review-notice"><Info size={18}/><span>Please check all details before confirming. You can manage this booking later in My Bookings.</span></div>
        <button className="btn btn-primary full" onClick={confirmBooking}>Confirm reservation <Check size={18}/></button>
      </div>
    </main>
  );
}

function Confirmation({ nav, reservation, bookings, resetReservation }) {
  const latest = bookings[0];
  return (
    <main className="page light-page confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon"><Check size={42}/></div>
        <div className="eyebrow dark">Reservation confirmed</div>
        <h2>Your table is ready to be planned.</h2>
        <p>Confirmation ID <strong>{latest?.id}</strong></p>
        <div className="confirmation-summary"><span>{formatDate(reservation.date)}</span><span>•</span><span>{reservation.time}</span><span>•</span><span>Table {latest?.tableId}</span></div>
        <button className="btn btn-primary full" onClick={()=>nav('bookings')}>View in My Bookings</button>
        <button className="btn btn-secondary full" onClick={()=>{resetReservation();nav('home')}}>Return home</button>
      </div>
    </main>
  );
}

function Bookings({ nav, bookings, cancelBooking }) {
  return (
    <main className="page light-page">
      <PageHeader title="My Bookings" onBack={() => nav('home')} />
      <div className="pad">
        {bookings.length===0 ? <div className="empty-state"><CalendarDays size={44}/><h3>No bookings yet</h3><p>Complete a reservation and it will appear here.</p><button className="btn btn-primary" onClick={()=>nav('reserve')}>Book a table</button></div> :
          <div className="booking-list">{bookings.map(b=><article className={`booking-card ${b.status==='Cancelled'?'cancelled':''}`} key={b.id}><div className="booking-head"><div><span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span><h3>{formatDate(b.date)}</h3><p>{b.time} · {b.guests} guests</p></div><div className="table-badge">T{b.tableId}</div></div><div className="booking-meta"><span><MapPin size={15}/>{b.tableZone || 'Restaurant'}</span><span><Sparkles size={15}/>{b.special ? b.specialNote : 'No special request'}</span></div>{b.status==='Confirmed'&&<div className="booking-actions"><button className="btn btn-secondary" onClick={()=>nav('reserve')}><Edit3 size={16}/>New booking</button><button className="btn btn-danger" onClick={()=>cancelBooking(b.id)}><X size={16}/>Cancel</button></div>}</article>)}</div>
        }
      </div>
    </main>
  );
}

function Profile({ nav, setLoggedIn }) {
  return (
    <main className="page light-page"><PageHeader title="Profile & Settings" onBack={()=>nav('home')}/><div className="pad"><div className="profile-card"><CircleUserRound size={64}/><h3>Test User</h3><p>0123456789</p></div><div className="settings-list"><button><Settings/><span>Account settings</span><ChevronRight/></button><button><Bell/><span>Notification settings</span><ChevronRight/></button><button><Phone/><span>Customer support</span><ChevronRight/></button><button onClick={()=>{setLoggedIn(false);nav('welcome')}}><LogOut/><span>Log out</span><ChevronRight/></button></div></div></main>
  );
}

function BottomNav({ page, nav }) {
  const items = [
    ['home','Home',Home], ['menu','Menu',MenuIcon], ['bookings','Bookings',CalendarDays], ['profile','Profile',CircleUserRound]
  ];
  return <nav className="bottom-nav">{items.map(([id,label,Icon])=><button key={id} className={page===id?'active':''} onClick={()=>nav(id)}><Icon size={21}/><span>{label}</span></button>)}</nav>;
}

function PageHeader({ title, onBack }) {
  return <header className="page-header"><button className="icon-button" onClick={onBack}><ArrowLeft size={20}/></button><h2>{title}</h2><div className="header-spacer"/></header>;
}
function Progress({ active }) {
  return <div className="progress-wrap"><div className="progress-steps">{['Details','Table','Review'].map((s,i)=><div key={s} className={`progress-step ${i<active?'done':''} ${i===active-1?'current':''}`}><span>{i<active?<Check size={14}/>:i+1}</span><small>{s}</small></div>)}</div></div>;
}
function ReviewRow({ icon, label, value }) { return <div className="review-row"><span className="review-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>; }
function formatDate(date) { try { return new Intl.DateTimeFormat('en-MY',{weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(new Date(date+'T12:00:00')); } catch { return date; } }

createRoot(document.getElementById('root')).render(<App/>);
