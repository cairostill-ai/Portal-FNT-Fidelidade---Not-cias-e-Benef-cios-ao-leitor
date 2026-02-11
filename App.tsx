
import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  Tag, 
  User as UserIcon, 
  Bookmark, 
  Bell, 
  Share2, 
  Menu, 
  X, 
  Search,
  ChevronRight,
  ChevronLeft,
  Gift,
  Coffee,
  ExternalLink,
  RefreshCw,
  Sun,
  Moon,
  Megaphone,
  Mail,
  Send,
  Camera,
  ShieldCheck,
  Clock,
  Instagram
} from 'lucide-react';
import { NewsItem, Category, Columnist, Coupon } from './types';
import { fetchNewsFromAI, generateCoupon } from './geminiService';

const RED = '#e31e24';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'news' | 'vantagens' | 'colunistas' | 'favorites' | 'denuncie'>('home');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Form states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
    const savedFavs = localStorage.getItem('fnt-favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    
    const savedTheme = localStorage.getItem('fnt-theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('fnt-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [newsData, couponData] = await Promise.all([
        fetchNewsFromAI(),
        generateCoupon()
      ]);
      setNews(newsData);
      setCoupons(couponData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const data = await fetchNewsFromAI(selectedCategory || undefined);
    setNews(data);
    setRefreshing(false);
  };

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id) 
      ? favorites.filter(f => f !== id) 
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('fnt-favorites', JSON.stringify(newFavs));
  };

  const shareNews = (item: NewsItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.excerpt,
        url: item.sourceUrl || window.location.href,
      });
    } else {
      alert(`Link copiado: ${item.sourceUrl || 'https://www.portalfnt.com.br'}`);
    }
  };

  const handleCategorySelect = async (cat: Category) => {
    setLoading(true);
    setSelectedCategory(cat);
    setCurrentView('news');
    setSelectedNews(null);
    const data = await fetchNewsFromAI(cat);
    setNews(data);
    setLoading(false);
    setIsSidebarOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSubmitDenuncia = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1500);
  };

  // UI Components
  const Header = () => (
    <header className={`sticky top-0 z-50 border-b shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
        <div 
          className="flex flex-col items-center cursor-pointer group" 
          onClick={() => { setCurrentView('home'); setSelectedCategory(null); setSelectedNews(null); }}
        >
          <div className="flex items-baseline space-x-1">
            <span className={`text-xl font-black italic tracking-tighter transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'} group-hover:text-[#e31e24]`}>PORTAL</span>
            <span className="text-3xl font-black italic tracking-tighter text-[#e31e24] group-hover:scale-105 transition-transform">FNT</span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest mt-[-4px] transition-colors ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Fidelidade
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-700'}`}
            aria-label="Alternar Tema"
          >
            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
          </button>
          <button 
            className={`p-2 rounded-full transition-colors relative ${theme === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => alert('Notificações ativadas!')}
            aria-label="Notificações"
          >
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#e31e24] rounded-full"></span>
          </button>
        </div>
      </div>
      <div className="bg-[#e31e24] text-white py-1.5 px-4 text-center text-[10px] font-black uppercase tracking-[0.2em]">
        Portal FNT Fidelidade - Notícias e Vantagens ao leitor
      </div>
    </header>
  );

  const BottomNav = () => (
    <nav className={`fixed bottom-0 left-0 right-0 border-t px-6 py-2 pb-4 flex justify-between items-center z-50 md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)] transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 border-gray-800 shadow-black/20' : 'bg-white border-gray-100'}`}>
      <button 
        onClick={() => { setCurrentView('home'); setSelectedCategory(null); setSelectedNews(null); }} 
        className={`flex flex-col items-center transition-colors ${currentView === 'home' ? 'text-[#e31e24]' : 'text-gray-400'}`}
      >
        <HomeIcon size={22} />
        <span className="text-[9px] mt-1 font-bold uppercase">Início</span>
      </button>
      <button 
        onClick={() => { setCurrentView('denuncie'); setSelectedNews(null); }} 
        className={`flex flex-col items-center transition-colors ${currentView === 'denuncie' ? 'text-[#e31e24]' : 'text-gray-400'}`}
      >
        <Megaphone size={22} />
        <span className="text-[9px] mt-1 font-bold uppercase">Denuncie</span>
      </button>
      <button 
        onClick={() => { setCurrentView('vantagens'); setSelectedNews(null); }} 
        className={`flex flex-col items-center transition-colors ${currentView === 'vantagens' ? 'text-[#e31e24]' : 'text-gray-400'}`}
      >
        <Gift size={22} />
        <span className="text-[9px] mt-1 font-bold uppercase">Clube</span>
      </button>
      <button 
        onClick={() => { setCurrentView('favorites'); setSelectedNews(null); }} 
        className={`flex flex-col items-center transition-colors ${currentView === 'favorites' ? 'text-[#e31e24]' : 'text-gray-400'}`}
      >
        <Bookmark size={22} />
        <span className="text-[9px] mt-1 font-bold uppercase">Salvos</span>
      </button>
    </nav>
  );

  const Sidebar = () => (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <div className={`fixed top-0 left-0 bottom-0 w-80 z-[70] transition-transform duration-500 ease-out shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black italic tracking-tighter">PORTAL</span>
            <span className="text-3xl font-black italic tracking-tighter text-[#e31e24]">FNT</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
            <X size={24} />
          </button>
        </div>
        <div className="py-6 overflow-y-auto h-full">
          <div className="px-6 mb-6">
            <button 
              onClick={() => { setCurrentView('denuncie'); setIsSidebarOpen(false); }}
              className="w-full bg-[#e31e24] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
            >
              <Megaphone size={16} />
              Sugestão de Pauta
            </button>
          </div>
          <p className="px-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Editorias</p>
          {Object.values(Category).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`w-full text-left px-8 py-4 transition-all flex items-center justify-between group ${selectedCategory === cat ? 'bg-red-50 text-[#e31e24] border-r-4 border-[#e31e24] dark:bg-red-900/20' : theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <span className="font-bold text-base">{cat}</span>
              <ChevronRight size={18} />
            </button>
          ))}
          <div className={`mt-8 pt-8 border-t pb-20 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
            <button onClick={() => { setCurrentView('colunistas'); setIsSidebarOpen(false); }} className="w-full text-left px-8 py-3 text-sm font-semibold text-gray-500 hover:text-[#e31e24]">Colunistas</button>
          </div>
        </div>
      </div>
    </>
  );

  const NewsDetailView = ({ item }: { item: NewsItem }) => (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} />
        <button 
          onClick={() => setSelectedNews(null)} 
          className={`absolute top-6 left-6 p-3 rounded-full shadow-xl z-20 ${theme === 'dark' ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-900'}`}
        >
          <ChevronLeft size={24} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
          <span className="bg-[#e31e24] text-white px-3 py-1.5 text-xs font-black uppercase rounded-sm mb-4 inline-block">
            {item.category}
          </span>
          <h1 className="news-font text-3xl md:text-5xl font-bold leading-tight text-white drop-shadow-lg">
            {item.title}
          </h1>
        </div>
      </div>
      <div className="px-6 py-8 max-w-3xl mx-auto">
        <div className={`news-font text-lg md:text-xl leading-[1.8] space-y-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
          {item.content.split('\n').map((para, i) => (
            <p key={i} className="mb-6">{para}</p>
          ))}
        </div>
        {item.sourceUrl && (
          <div className={`mt-12 p-6 rounded-2xl border text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-[#e31e24] text-white px-6 py-3 rounded-xl font-bold shadow-lg">
              <span>Ler no portal oficial</span>
              <ExternalLink size={18} />
            </a>
          </div>
        )}
      </div>
    </div>
  );

  const HomeView = () => (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-32">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Pesquisar notícias..." 
          className={`w-full pl-12 pr-4 py-4 border rounded-2xl shadow-sm focus:outline-none transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-black uppercase tracking-tight border-l-4 border-[#e31e24] pl-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Principais Notícias</h2>
          <button onClick={handleRefresh} className="text-xs font-black text-gray-400 uppercase hover:text-[#e31e24]">Atualizar</button>
        </div>
        {loading ? (
          <div className="h-[45vh] bg-gray-200 rounded-3xl animate-pulse" />
        ) : (
          news.length > 0 && (
            <div 
              className="relative h-[45vh] md:h-[60vh] rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => setSelectedNews(news[0])}
            >
              <img src={news[0].imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={news[0].title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10">
                <span className="bg-[#e31e24] text-white px-3 py-1.5 text-[10px] font-black uppercase rounded-sm mb-4 self-start">
                  {news[0].category}
                </span>
                <h3 className="text-white text-3xl md:text-5xl font-bold news-font leading-tight drop-shadow-xl">
                  {news[0].title}
                </h3>
              </div>
            </div>
          )
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(1).map((item) => (
          <div 
            key={item.id} 
            className={`rounded-3xl shadow-sm overflow-hidden border flex md:flex-col cursor-pointer transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
            onClick={() => setSelectedNews(item)}
          >
            <img src={item.imageUrl} className="w-1/3 md:w-full h-32 md:h-56 object-cover" alt={item.title} />
            <div className="p-4 md:p-6 flex flex-1 flex-col justify-between">
              <h4 className={`font-bold news-font text-base md:text-xl leading-snug line-clamp-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
            </div>
          </div>
        ))}
      </section>
    </div>
  );

  const DenuncieView = () => (
    <div className="p-6 md:p-12 space-y-8 pb-32 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <ShieldCheck size={48} className="mx-auto text-[#e31e24] mb-4" />
        <h1 className={`text-4xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>SUGESTÃO DE PAUTA</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Canal Direto com a Redação do Portal FNT</p>
      </div>

      {formSubmitted ? (
        <div className="p-10 bg-green-500 rounded-[3rem] text-center text-white shadow-xl">
          <Send size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-black italic tracking-tighter">RELATO ENVIADO!</h2>
          <p className="font-medium mt-4">Nossa equipe de jornalismo já recebeu suas informações. Se necessário, entraremos em contato.</p>
          <button onClick={() => setFormSubmitted(false)} className="mt-8 bg-white text-green-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Enviar Outro</button>
        </div>
      ) : (
        <form onSubmit={handleSubmitDenuncia} className={`p-8 md:p-12 rounded-[3rem] shadow-xl border space-y-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Nome (opcional)" className={`w-full p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
            <input type="text" required placeholder="WhatsApp ou E-mail" className={`w-full p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
          </div>
          <textarea rows={6} required placeholder="Relate o ocorrido com o máximo de detalhes..." className={`w-full p-4 rounded-xl border resize-none ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#e31e24] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3">
            {isSubmitting ? <RefreshCw className="animate-spin" /> : <Send size={20} />}
            {isSubmitting ? 'ENVIANDO...' : 'ENVIAR DENÚNCIA'}
          </button>
          <div className="text-center pt-6 border-t border-gray-700 space-y-2">
            <p className="text-[10px] font-black text-gray-500 uppercase">Ou envie diretamente para:</p>
            <p className="text-xs font-bold text-[#e31e24]">cairostill@portalfnt.com.br</p>
          </div>
        </form>
      )}
    </div>
  );

  const VantagensView = () => (
    <div className="p-6 space-y-8 pb-32 max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-12">
        <Gift size={48} className="mx-auto text-[#e31e24]" />
        <h1 className={`text-4xl md:text-5xl font-black italic tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>FNT CLUBE</h1>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Nossos parceiros reais em Franca e região</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {coupons.map((coupon) => (
          <div key={coupon.id} className={`rounded-[2rem] shadow-xl overflow-hidden border flex flex-col group ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="relative h-64 overflow-hidden">
              <img src={coupon.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={coupon.partnerName} />
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl">
                <Clock size={14} />
                EM BREVE
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                <h3 className="text-2xl font-black text-white italic tracking-tighter">{coupon.partnerName}</h3>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <p className={`text-base leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{coupon.description}</p>
              
              <div className={`p-6 rounded-3xl border border-dashed text-center space-y-4 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Benefícios em negociação...</p>
                <a 
                  href={coupon.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#e31e24] transition-all"
                >
                  {coupon.partnerName.includes('Chillis') ? <Instagram size={16} /> : <ExternalLink size={16} />}
                  Conhecer Parceiro
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-12 p-8 rounded-[3rem] text-center space-y-4 border-2 border-dashed ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Informação Importante</p>
        <p className={`max-w-xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Estamos em fase de expansão do nosso Clube de Vantagens. Em breve, cada um desses parceiros oferecerá cupons de descontos exclusivos e promoções imperdíveis para os leitores ativos do app Portal FNT. Fique atento às notificações!
        </p>
      </div>
    </div>
  );

  const ColunistasView = () => (
    <div className="p-6 md:p-12 space-y-12 pb-32 max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className={`text-4xl font-black italic tracking-tighter border-b-8 border-[#e31e24] inline-block pb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>COLUNISTAS</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`p-8 rounded-[2.5rem] shadow-sm border flex flex-col items-center text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <img src={`https://i.pravatar.cc/300?img=${i+20}`} className="w-32 h-32 rounded-full mb-6 border-4 border-gray-700" alt="Colunista" />
            <h3 className={`text-2xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Analista Regional {i}</h3>
            <p className="text-[#e31e24] text-[10px] font-black uppercase mb-4 tracking-widest">Sociedade & Opinião</p>
            <p className="text-gray-500 italic">"Analisando os fatos que moldam a região da Alta Mogiana."</p>
          </div>
        ))}
      </div>
    </div>
  );

  const FavoritesView = () => {
    const favoriteItems = news.filter(item => favorites.includes(item.id));
    return (
      <div className="p-6 md:p-12 space-y-8 pb-32 max-w-5xl mx-auto">
        <h2 className={`text-3xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>SUAS SALVAS</h2>
        {favoriteItems.length === 0 ? (
          <div className="text-center py-24 text-gray-500">Nenhuma notícia salva ainda.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoriteItems.map((item) => (
              <div key={item.id} className={`rounded-3xl border flex items-center p-2 cursor-pointer ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`} onClick={() => setSelectedNews(item)}>
                <img src={item.imageUrl} className="w-20 h-20 rounded-2xl object-cover mr-4" alt="" />
                <h4 className={`font-bold news-font line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#e31e24] selection:text-white transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#fcfcfc]'}`}>
      <Header />
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        {selectedNews ? (
          <NewsDetailView item={selectedNews} />
        ) : (
          <div className="animate-in fade-in duration-700">
            {currentView === 'home' && <HomeView />}
            {currentView === 'vantagens' && <VantagensView />}
            {currentView === 'colunistas' && <ColunistasView />}
            {currentView === 'favorites' && <FavoritesView />}
            {currentView === 'denuncie' && <DenuncieView />}
            {currentView === 'news' && <HomeView />}
          </div>
        )}
      </main>
      <BottomNav />
      {!selectedNews && (
        <div className="fixed bottom-28 right-6 md:right-12 z-40">
           <button 
            onClick={() => {
              if (currentView === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
              else setCurrentView('home');
            }}
            className={`p-4 rounded-full shadow-2xl transition-all ${theme === 'dark' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white hover:bg-[#e31e24]'}`}
           >
            <ChevronRight className="-rotate-90" size={24} />
           </button>
        </div>
      )}
    </div>
  );
};

export default App;
