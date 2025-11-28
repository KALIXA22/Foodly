import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const initialFormState = {
  title: '',
  time: '',
  ingredients: '',
  instructions: '',
  file: null,
};

function EditRecipe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(initialFormState);
  const [currentImage, setCurrentImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/recipe/${id}`);
        setRecipeData({
          title: data.title || '',
          time: data.time || '',
          ingredients: Array.isArray(data.ingredients)
            ? data.ingredients.join('\n')
            : '',
          instructions: data.instructions || '',
          file: null,
        });
        setCurrentImage(data.coverImage);
      } catch (err) {
        setError('Unable to load recipe. Please try again later.');
      }
    };
    getData();
  }, [apiBaseUrl, id]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setRecipeData((prev) => ({
      ...prev,
      [name]: name === 'file' ? files?.[0] || null : value,
    }));
  };

  const transformIngredients = (rawValue) =>
    rawValue
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);

  const onHandleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', recipeData.title);
      formData.append('time', recipeData.time);
      formData.append('instructions', recipeData.instructions);
      transformIngredients(recipeData.ingredients).forEach((ingredient) =>
        formData.append('ingredients', ingredient),
      );
      if (recipeData.file) {
        formData.append('file', recipeData.file);
      }

      await axios.put(`${apiBaseUrl}/recipe/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/myRecipe');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update recipe.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-orange-50 px-4 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl bg-white/90 p-6 shadow-xl md:flex-row md:p-10">
        <div className="w-full md:w-1/3 space-y-4">
          <h2 className="text-3xl font-bold text-text-main">Edit Recipe</h2>
          <p className="text-sm text-text-muted">
            Update your recipe details below. You can keep the existing image or
            upload a new one for a refreshed look.
          </p>
          {currentImage && (
            <img
              src={`${apiBaseUrl}/images/${currentImage}`}
              alt={recipeData.title}
              className="rounded-2xl border border-gray-100 object-cover"
            />
          )}
        </div>

        <form
          className="w-full md:w-2/3 space-y-6"
          onSubmit={onHandleSubmit}
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="text-sm text-text-muted">Title</span>
              <input
                type="text"
                name="title"
                value={recipeData.title}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm text-text-muted">Time</span>
              <input
                type="text"
                name="time"
                value={recipeData.time}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm text-text-muted">Ingredients</span>
              <textarea
                name="ingredients"
                rows="5"
                required
                value={recipeData.ingredients}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm text-text-muted">Instructions</span>
              <textarea
                name="instructions"
                rows="6"
                required
                value={recipeData.instructions}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="block">
              <span className="text-sm text-text-muted">Replace Image</span>
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white"
              />
            </label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default EditRecipe;
