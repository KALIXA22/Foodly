import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { FaStopwatch, FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa6';
import fallbackImage from '../assets/food1.jpeg';

function RecipeItems() {
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const { items = [], mode = 'all' } = loaderData || {};
  const [recipes, setRecipes] = useState(items);
  const [favourites, setFavourites] = useState(() => {
    const stored = localStorage.getItem('fav');
    return stored ? JSON.parse(stored) : [];
  });
  const [isDeleting, setIsDeleting] = useState('');
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setRecipes(items);
  }, [items]);

  useEffect(() => {
    localStorage.setItem('fav', JSON.stringify(favourites));
    if (mode === 'favourites') {
      setRecipes(favourites);
    }
  }, [favourites, mode]);

  const isMyRecipes = mode === 'mine';
  const isFavouriteView = mode === 'favourites';

  const emptyState = useMemo(
    () => ({
      title: isMyRecipes
        ? "You haven't added any recipes yet"
        : isFavouriteView
        ? 'No favourite recipes yet'
        : 'No recipes available right now',
      subtitle: isMyRecipes
        ? 'Share your first creation with the community.'
        : isFavouriteView
        ? 'Tap the heart icon to save favourites as you browse.'
        : 'Check back soon or add a new recipe!',
      actionLabel: isMyRecipes ? 'Add recipe' : 'Browse recipes',
    }),
    [isFavouriteView, isMyRecipes],
  );

  const handleDelete = async (id) => {
    setIsDeleting(id);
    try {
      await axios.delete(`${apiBaseUrl}/recipe/${id}`);
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
      setFavourites((prev) => prev.filter((recipe) => recipe._id !== id));
    } catch (error) {
      console.error('Failed to delete recipe', error);
    } finally {
      setIsDeleting('');
    }
  };

  const toggleFavourite = (recipe) => {
    setFavourites((prev) => {
      const exists = prev.some((item) => item._id === recipe._id);
      if (exists) {
        return prev.filter((item) => item._id !== recipe._id);
      }
      return [...prev, recipe];
    });
  };

  const isFavourited = (id) =>
    favourites.some((recipe) => recipe._id === id || recipe.id === id);

  if (!recipes?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-12 text-center">
        <p className="text-2xl">🍽️</p>
        <h4 className="text-xl font-semibold">{emptyState.title}</h4>
        <p className="text-text-muted max-w-md text-sm">{emptyState.subtitle}</p>
        <button
          onClick={() =>
            isMyRecipes ? navigate('/addRecipe') : window.scrollTo({ top: 0, behavior: 'smooth' })
          }
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-hover"
        >
          {emptyState.actionLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((item) => {
        const recipeId = item._id || item.id;
        const imageSrc = item.coverImage
          ? `${apiBaseUrl}/images/${item.coverImage}`
          : fallbackImage;
        const instructionsText = item.instructions || '';
        const snippet =
          instructionsText.length > 0
            ? `${instructionsText.slice(0, 70)}${
                instructionsText.length > 70 ? '...' : ''
              }`
            : 'Tap to learn more about this recipe.';
        return (
          <article
            key={recipeId}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={imageSrc}
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() =>
                  isMyRecipes ? navigate(`/editRecipe/${item._id}`) : toggleFavourite(item)
                }
                className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition ${
                  isMyRecipes ? 'text-secondary hover:bg-orange-50' : 'hover:bg-white'
                }`}
                aria-label={isMyRecipes ? 'Edit recipe' : 'Toggle favourite'}
              >
                {isMyRecipes ? (
                  <FaEdit className="text-secondary" />
                ) : (
                  <FaHeart className={isFavourited(item._id) ? 'text-secondary' : 'text-gray-400'} />
                )}
              </button>
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                <FaStopwatch className="text-[10px]" />
                {item.time || 'N/A'}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5">
              <div>
                <h4 className="text-lg font-semibold text-text-main truncate">{item.title}</h4>
                <p className="mt-1 text-sm text-text-muted">{snippet}</p>
              </div>

              <div className="mt-auto flex items-center justify-between text-sm text-text-muted">
                <button
                  type="button"
                  onClick={() => navigate(`/recipe/${recipeId}`)}
                  className="font-semibold text-primary hover:text-primary-hover"
                >
                  View details
                </button>
                {isMyRecipes ? (
                  <button
                    type="button"
                    disabled={isDeleting === recipeId}
                    onClick={() => handleDelete(recipeId)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {isDeleting === recipeId ? (
                      'Removing...'
                    ) : (
                      <>
                        <MdDelete /> Remove
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleFavourite(item)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-text-muted transition hover:bg-gray-50"
                  >
                    <FaHeart className={isFavourited(recipeId) ? 'text-secondary' : ''} />
                    {isFavourited(recipeId) ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default RecipeItems;