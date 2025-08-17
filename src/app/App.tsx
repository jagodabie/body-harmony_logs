import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';

import { WeightLogsProvider } from '../context/WeightLogsContext';
import Home from '../views/Home/Home';
import MealLogs from '../views/MealLogs/MealLogs';
import WeightLogs from '../views/WeightLogs/WeightLogs';
import AppFooter from './components/AppFooter/AppFooter';
import UserBadge from './components/UserBadge/UserBadge';

import './index.css';

function App() {
  return (
    <WeightLogsProvider>
     <div className="app">
      <Router>
      <header className="header app-header">
        <h3>Body Harmony Logs</h3>
        <UserBadge />
      </header>
      <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weight-logs" element={<WeightLogs />} />
            <Route path="/meal-logs" element={<MealLogs />} />
          </Routes>
      </main>
      <AppFooter />
      </Router>

    </div>
    </WeightLogsProvider>
  );
}

export default App;
