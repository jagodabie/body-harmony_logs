import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { WeightLogsProvider } from '../context/WeightLogsContext';
import { AddProduct } from '../views/AddProduct/AddProduct';
import { Home } from '../views/Home/Home';
import { MealLogs } from '../views/MealLogs/MealLogs';
import { WeightLogs } from '../views/WeightLogs/WeightLogs';
import { AddProductLayout } from './layout/AddProductLayout/AddProductLayout';
import { MainLayout } from './layout/MainLayout';

import './index.css';

export const App = () => {
  return (
    <WeightLogsProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/weight-logs" element={<WeightLogs />} />
            <Route path="/meal-logs" element={<MealLogs />} />
          </Route>

          <Route element={<AddProductLayout />}>
            <Route path="/add-product/:mealId" element={<AddProduct />} />
          </Route>
        </Routes>
      </Router>
    </WeightLogsProvider>
  );
};
