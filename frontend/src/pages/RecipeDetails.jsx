import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaStopwatch } from 'react-icons/fa';
import fallbackImage from '../assets/food2.jpeg';

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState(() => {
    const stored = localStorage.getItem('fav');
    return stored ? JSON.parse(stored) : [];
  });
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/recipe/${id}`);
        if (!response.ok) throw new Error('Unable to fetch recipe');
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [apiBaseUrl, id]);

  useEffect(() => {
    localStorage.setItem('fav', JSON.stringify(favourites));
  }, [favourites]);

  const toggleFavourite = () => {
    if (!recipe) return;
    setFavourites((prev) => {
      const exists = prev.some((item) => item._id === recipe._id);
      if (exists) {
        return prev.filter((item) => item._id !== recipe._id);
      }
      return [...prev, recipe];
    });
  };

  const isFavourite = recipe
    ? favourites.some((item) => item._id === recipe._id)
    : false;

  if (loading) {
    return (
      <section className="container mx-auto max-w-5xl px-6 py-20 text-center text-text-muted">
        Loading recipe...
      </section>
    );
  }

  if (!recipe) {
    return (
      <section className="container mx-auto max-w-5xl px-6 py-20 text-center text-text-muted">
        Recipe not found.
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-5xl px-6 py-20">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-text-muted transition hover:bg-gray-50"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl shadow-lg">
          <img
            src={
              recipe.coverImage
                ? `${apiBaseUrl}/images/${recipe.coverImage}`
                : fallbackImage
            }
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-primary">
              <FaStopwatch />
              {recipe.time || 'N/A'}
            </div>
            <h2 className="text-3xl font-bold text-text-main">{recipe.title}</h2>
            <p className="text-text-muted leading-relaxed">
              {recipe.instructions?.slice(0, 160)}...
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Ingredients</h3>
            <ul className="grid gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              {(recipe.ingredients || []).map((ingredient, index) => (
                <li
                  key={ingredient + index}
                  className="flex items-center gap-3 text-text-muted"
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Instructions</h3>
            <p className="rounded-2xl border border-gray-100 bg-white p-4 text-sm leading-relaxed text-text-muted shadow-sm">
              {recipe.instructions}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleFavourite}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition ${
              isFavourite ? 'bg-secondary' : 'bg-primary'
            }`}
          >
            <FaHeart />
            {isFavourite ? 'Saved to favourites' : 'Save to favourites'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default RecipeDetails;