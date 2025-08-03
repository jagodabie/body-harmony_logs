import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';

import { WeightLogsProvider } from '../context/WeightLogsContext';
import Home from '../views/Home/Home';
import WeightLogs from '../views/WeightLogs';
import YoursMeal from '../views/YoursMeal';
import AppFooter from './componets/AppFooter/AppFooter';
import { UserBadge } from './componets/UserBagde/UserBadge';

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
            <Route path="/yours-meal" element={<YoursMeal />} />
          </Routes>
      </main>
      <AppFooter />
      </Router>

    </div>
    </WeightLogsProvider>
  );
}

export default App;
