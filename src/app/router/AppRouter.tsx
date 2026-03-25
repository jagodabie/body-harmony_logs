import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AddProduct } from '../../views/AddProduct/AddProduct';
import { Home } from '../../views/Home/Home';
import { Logs } from '../../views/Logs/Logs';
import { MealLogs } from '../../views/MealLogs/MealLogs';
import { AddProductLayout } from '../layout/AddProductLayout/AddProductLayout';
import { MainLayout } from '../layout/MainLayout';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/meal-logs" element={<MealLogs />} />
        </Route>

        <Route element={<AddProductLayout />}>
          <Route path="/add-product/:mealId" element={<AddProduct />} />
        </Route>
      </Routes>
    </Router>
  );
};
