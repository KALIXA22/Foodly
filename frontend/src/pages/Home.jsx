import foodRecipe from '../assets/Foodie.png';
import RecipeItems from '../components/RecipeItems';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InputForm from '../components/InputForm';
import Modal from '../components/Modal';

function Home() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Discover Your Next Favorite Dish';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index += 1;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const addRecipe = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/addRecipe');
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-bg-main text-text-main">
        <section className="relative mx-auto max-w-6xl px-6 pt-28 pb-16 flex flex-col items-center justify-center gap-12 overflow-hidden lg:flex-row lg:pt-36">
          <div className="absolute top-10 -right-16 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-60 -z-10" />
          <div className="absolute bottom-0 -left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60 -z-10" />

          <div className="w-full max-w-3xl text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/80 px-5 py-2 rounded-full border border-primary/20 shadow-sm">
              <span className="text-2xl">🍳</span>
              <span className="text-primary font-semibold text-sm">
                Taste the Difference
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent min-h-16 animate-fadeIn">
                {displayedText}
              </span>
            </h1>

            <p className="text-text-muted max-w-2xl text-lg leading-relaxed animate-fadeIn">
              Explore thousands of delicious recipes, share your culinary
              creations, and connect with food lovers around the globe. Cook,
              create, and inspire every day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-center lg:justify-start animate-fadeIn">
              <button
                onClick={addRecipe}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg hover:shadow-green-500/30 text-white px-6 py-3 rounded-2xl shadow-md font-semibold transition duration-300 transform hover:scale-105"
              >
                Share your recipe
              </button>
              <button
                onClick={() =>
                  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
                }
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-secondary text-secondary hover:bg-orange-50 px-6 py-3 rounded-2xl font-semibold transition"
              >
                Browse Recipes
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 w-full pt-6 border-t border-gray-200 text-sm md:text-base">
              {[
                { label: 'Recipes', value: '2K+', color: 'text-primary' },
                { label: 'Chefs', value: '800+', color: 'text-secondary' },
                { label: 'Food Lovers', value: '15K+', color: 'text-primary' },
              ].map((stat) => (
                <div key={stat.label} className="text-center animate-fadeIn">
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <p className="text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-lg flex flex-col items-center justify-center relative mt-6 animate-slideUp">
            <div className="absolute -top-10 -right-8 w-32 h-32 bg-secondary rounded-full opacity-10 blur-2xl" />
            <div className="absolute -bottom-10 -left-8 w-36 h-36 bg-primary rounded-full opacity-10 blur-2xl" />
            <div className="relative">
              <img
                src={foodRecipe}
                alt="Featured recipe"
                className="w-full object-cover rounded-3xl shadow-2xl border-4 border-white"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-secondary to-secondary-hover text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm z-20 flex items-center gap-2">
                <span>⭐</span> 4.9 / 5
              </div>
              <div className="absolute top-6 -left-10 bg-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-primary border border-primary/10">
                🍃 Fresh
              </div>
              <div className="absolute bottom-24 -right-10 bg-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-secondary border border-orange-100">
                🔥 Trending
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-section to-orange-50 py-16 px-6 mt-8">
          <div className="container mx-auto max-w-5xl">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose Us
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '👨‍🍳',
                  title: 'Easy to cook',
                  copy:
                    'Step-by-step instructions that anyone can follow, from beginner to expert.',
                },
                {
                  icon: '🍽️',
                  title: 'Expert Recipes',
                  copy:
                    'Curated recipes from professional chefs and passionate home cooks.',
                },
                {
                  icon: '💚',
                  title: 'Community',
                  copy:
                    'Connect, share, rate, and inspire other food enthusiasts worldwide.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition hover:-translate-y-1 text-center space-y-3"
                >
                  <div className="text-5xl">{card.icon}</div>
                  <h4 className="font-bold text-lg text-text-main">
                    {card.title}
                  </h4>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {card.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="flex flex-col items-center gap-3 mb-12 text-center">
            <p className="text-primary font-semibold uppercase tracking-[0.3em] text-xs">
              Explore
            </p>
            <h3 className="text-3xl md:text-4xl font-bold">Popular Recipes</h3>
            <p className="text-text-muted">
              Fresh picks from the community, updated daily for every craving.
            </p>
          </div>
          <RecipeItems />
        </section>
        {isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
            <InputForm setIsOpen={() => setIsOpen(false)} />
          </Modal>
        )}
      </main>
    </>
  );
}

export default Home;