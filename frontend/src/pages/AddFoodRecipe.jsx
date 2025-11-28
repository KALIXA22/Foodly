import axios from 'axios';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaListUl, FaUpload } from 'react-icons/fa';
import { MdOutlineTitle } from 'react-icons/md';

const initialFormState = {
  title: '',
  time: '',
  difficulty: 'Easy',
  servings: '',
  ingredients: '',
  instructions: '',
  tips: '',
  file: null,
};

const difficultyOptions = ['Easy', 'Intermediate', 'Advanced'];

function AddFoodRecipe() {
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const stats = useMemo(
    () => [
      { label: 'Prep time', value: recipeData.time || '--' },
      { label: 'Servings', value: recipeData.servings || '--' },
      { label: 'Difficulty', value: recipeData.difficulty },
    ],
    [recipeData],
  );

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setRecipeData((prev) => ({
      ...prev,
      [name]: name === 'file' ? files?.[0] || null : value,
    }));
  };

  const transformList = (rawValue) =>
    rawValue
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);

  const onHandleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to add a recipe.');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', recipeData.title);
      formData.append('time', recipeData.time);
      formData.append('instructions', recipeData.instructions);
      formData.append('difficulty', recipeData.difficulty);
      formData.append('servings', recipeData.servings);
      formData.append('tips', recipeData.tips);

      transformList(recipeData.ingredients).forEach((ingredient) =>
        formData.append('ingredients', ingredient),
      );

      if (recipeData.file) {
        formData.append('file', recipeData.file);
      }

      await axios.post(`${apiBaseUrl}/recipe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${token}`,
        },
      });

      setRecipeData(initialFormState);
      navigate('/myRecipe');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add recipe.');
    } finally {
      setSubmitting(false);
    }
  };
    
  return (
    <section className="bg-gradient-to-b from-white to-[#FFF5EF] px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-10 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                Add a New Recipe
              </p>
              <h1 className="text-3xl font-bold text-text-main md:text-4xl">
                Share your signature dish with the community
              </h1>
              <p className="text-text-muted max-w-2xl text-sm">
                Upload ingredients, instructions, and the story behind your dish. High-quality
                photos help other food lovers recreate it perfectly.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-text-main sm:grid-cols-3">
              {stats.map(({ label, value }) => (
                <div key={label} className="rounded-2xl bg-white/90 px-4 py-3 text-center shadow">
                  <p className="text-xs uppercase tracking-[0.3em] text-text-muted">{label}</p>
                  <p className="text-lg font-semibold">{value || '--'}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <aside className="space-y-6 rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-muted">
              Tips for better recipes
            </p>
            <ul className="space-y-4 text-sm text-text-muted">
              <li>• Use high-quality photos in good lighting.</li>
              <li>• Break instructions into concise steps.</li>
              <li>• Mention cook/prep time separately if possible.</li>
              <li>• Add chef tips to help others customize the dish.</li>
            </ul>
            <div className="rounded-2xl bg-primary/10 p-4 text-xs text-primary">
              Need inspiration? Check your favourite saved recipes for structure ideas.
            </div>
          </aside>

          <form
            className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl lg:col-span-2"
            onSubmit={onHandleSubmit}
            encType="multipart/form-data"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-text-main md:col-span-2">
                Title
                <div className="mt-2 flex items-center rounded-2xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-primary/30">
                  <span className="px-3 text-primary">
                    <MdOutlineTitle />
                  </span>
                  <input
                    type="text"
                    name="title"
                    value={recipeData.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-r-2xl border-l border-gray-100 bg-transparent px-3 py-2 text-sm outline-none"
                    placeholder="Grandma's classic lasagna"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-text-main">
                Total time
                <div className="mt-2 flex items-center rounded-2xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-primary/30">
                  <span className="px-3 text-primary">
                    <FaClock />
                  </span>
                  <input
                    type="text"
                    name="time"
                    value={recipeData.time}
                    onChange={handleChange}
                    required
                    className="w-full rounded-r-2xl border-l border-gray-100 bg-transparent px-3 py-2 text-sm outline-none"
                    placeholder="45 mins"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-text-main">
                Servings
                <input
                  type="number"
                  min="1"
                  name="servings"
                  value={recipeData.servings}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="4 people"
                />
              </label>

              <label className="block text-sm font-medium text-text-main">
                Difficulty
                <select
                  name="difficulty"
                  value={recipeData.difficulty}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {difficultyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-text-main md:col-span-2">
                Ingredients
                <div className="mt-2 rounded-2xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-primary/30">
                  <textarea
                    name="ingredients"
                    rows="5"
                    required
                    value={recipeData.ingredients}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-none bg-transparent px-4 py-3 text-sm outline-none"
                    placeholder="Use commas or new lines. Example: 2 cups flour, 1 tbsp sugar..."
                  />
                </div>
            </label>
      
              <label className="block text-sm font-medium text-text-main md:col-span-2">
                Instructions
                <div className="mt-2 rounded-2xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-primary/30">
                  <textarea
                    name="instructions"
                    rows="6"
                    required
                    value={recipeData.instructions}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-none bg-transparent px-4 py-3 text-sm outline-none"
                    placeholder="Step 1: ...
Step 2: ..."
                  />
                </div>
            </label>

              <label className="block text-sm font-medium text-text-main md:col-span-2">
                Chef tips (optional)
                <textarea
                  name="tips"
                  rows="3"
                  value={recipeData.tips}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Share plating ideas, substitutions, or fun facts."
                />
            </label>
        
              <label className="block text-sm font-medium text-text-main">
                Recipe image
                <div className="mt-2 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
                  <FaUpload className="text-2xl text-primary" />
                  <p className="text-xs text-text-muted">
                    Drag & drop or click to upload. Recommended 1200x800px.
                  </p>
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    required
                    onChange={handleChange}
                    className="text-sm text-text-muted"
                  />
                </div>
            </label>
        </div>

            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-60"
              >
                {submitting ? 'Publishing...' : 'Publish recipe'}
              </button>
              <button
                type="button"
                onClick={() => setRecipeData(initialFormState)}
                className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary"
              >
                Reset form
              </button>
        </div>
        </form>
        </div>
      </div>
    </section>
  );
}

export default AddFoodRecipe;