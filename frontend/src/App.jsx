import './App.css';
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainNavigation from './components/MainNavigation';
import axios from 'axios';
import AddFoodRecipe from './pages/AddFoodRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchRecipes = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/recipe`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Unable to fetch recipes', error);
    return [];
  }
};

const loaderFactory = (mode) => async () => {
  const allRecipes = await fetchRecipes();

  switch (mode) {
    case 'mine': {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        return { items: [], mode };
      }
      const user = JSON.parse(storedUser);
      return {
        items: allRecipes.filter((recipe) => recipe.createdBy === user?._id),
        mode,
      };
    }
    case 'favourites': {
      const favourites = localStorage.getItem('fav');
      return {
        items: favourites ? JSON.parse(favourites) : [],
        mode,
      };
    }
    default:
      return { items: allRecipes, mode: 'all' };
  }
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainNavigation />,
    children: [
      { path: '/', element: <Home />, loader: loaderFactory('all') },
      { path: '/myRecipe', element: <Home />, loader: loaderFactory('mine') },
      {
        path: '/favouriteRecipe',
        element: <Home />,
        loader: loaderFactory('favourites'),
      },
      { path: '/addRecipe', element: <AddFoodRecipe /> },
      { path: '/editRecipe/:id', element: <EditRecipe /> },
      { path: '/recipe/:id', element: <RecipeDetails /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;