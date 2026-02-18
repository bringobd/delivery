import React from 'react';

// --- TYPE DEFINITIONS ---
interface Restaurant {
  id: number;
  name: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  category: string;
  deliveryTime: string;
}

// --- MOCK DATA ---
const restaurants: Restaurant[] = [
  { id: 1, name: "Кафе Маестро", imageUrl: 'https://images.unsplash.com/photo-1594007654729-4072c436ab6c?w=800&q=80', rating: 4.8, reviews: 234, category: 'Пицца, Суши, Мангал', deliveryTime: '25-35 хв' },
  { id: 2, name: 'Burger Queen', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', rating: 4.6, reviews: 512, category: 'Бургеры', deliveryTime: '20-30 хв' },
  { id: 3, name: 'Sushi World', imageUrl: 'https://images.unsplash.com/photo-1591141891781-c225a0a3ccc0?w=800&q=80', rating: 4.9, reviews: 450, category: 'Суши', deliveryTime: '35-45 хв' },
  { id: 4, name: 'Pasta Palace', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e326e22e726e?w=800&q=80', rating: 4.7, reviews: 189, category: 'Итальянская', deliveryTime: '30-40 хв' },
  { id: 5, name: 'The Green Bowl', imageUrl: 'https://images.unsplash.com/photo-1540420773420-2850a86b2b50?w=800&q=80', rating: 4.9, reviews: 301, category: 'Веган', deliveryTime: '25-35 хв' },
  { id: 6, name: 'Sweet Dreams', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78c8e3903?w=800&q=80', rating: 4.8, reviews: 420, category: 'Десерты', deliveryTime: '15-25 хв' },
];

// --- UI HELPER COMPONENTS ---

const Header: React.FC = () => (
  <header className="header">
    <a href="#" className="logo">BRINGO</a>
    <nav className="nav-links">
      <a href="#">Главная</a>
      <a href="#">Рестораны</a>
      <a href="#">Акции</a>
      <a href="#">Поддержка</a>
    </nav>
    <div className="header-actions">
      <button className="btn btn-secondary">Войти</button>
      <button className="btn btn-primary">Регистрация</button>
      <button className="cart-btn" aria-label="Корзина">
        <i className="fas fa-shopping-cart"></i>
      </button>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <div className="hero">
    <h1>Ваши желания, доставлены.</h1>
    <p>Откройте для себя местные заведения и получите доставку к вашей двери за минуты.</p>
    <div className="search-bar">
      <input
        type="text"
        placeholder="Найти ресторан или блюдо..."
        className="search-input"
      />
    </div>
  </div>
);

const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => (
  <div className="restaurant-card">
    <div className="rc-img" style={{ backgroundImage: `url(${restaurant.imageUrl})` }}>
      <div className="rc-ov"></div>
      <div className="rc-badge">⏱ {restaurant.deliveryTime}</div>
    </div>
    <div className="rc-body">
      <h3 className="rc-name">{restaurant.name}</h3>
      <div className="rc-meta">
        <span><i className="fas fa-star rc-meta-icon"></i>{restaurant.rating}</span>
        <span> · {restaurant.category}</span>
      </div>
    </div>
  </div>
);

const FeaturedRestaurants: React.FC = () => (
  <section className="section">
    <h2 className="section-title">Доступные рестораны</h2>
    <div className="restaurants-grid">
      {restaurants.map((res) => (
        <RestaurantCard key={res.id} restaurant={res} />
      ))}
    </div>
  </section>
);

const Footer: React.FC = () => (
    <footer className="footer">
        <div className="footer-content">
            <div className="footer-col">
                <a href="#" className="logo">BRINGO</a>
                <p style={{marginTop: '1rem', fontSize: '14px'}}>Ваша любимая еда, в одном клике.</p>
            </div>
            <div className="footer-col">
                <h4>Компания</h4>
                <ul>
                    <li><a href="#">О нас</a></li>
                    <li><a href="#">Карьера</a></li>
                    <li><a href="#">Пресса</a></li>
                </ul>
            </div>
            <div className="footer-col">
                <h4>Поддержка</h4>
                <ul>
                    <li><a href="#">Центр помощи</a></li>
                    <li><a href="#">Связаться с нами</a></li>
                    <li><a href="#">FAQs</a></li>
                </ul>
            </div>
            <div className="footer-col">
                <h4>Мы в соцсетях</h4>
                <div className="social-icons">
                    <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                    <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Bringo. Все права защищены.</p>
        </div>
    </footer>
);


// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Hero />
        <FeaturedRestaurants />
      </main>
      <Footer />
    </div>
  );
};

export default App;
