import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';

import Home from '../views/Home/Home';
import  WeightLogs  from '../views/WeightLogs';

import './index.css';

function App() {
  return (
    <div className="app">
      <header className="header app-header">
        <h3>Body Harmony Logs</h3>
      </header>
      <main className="app-main">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weight-logs" element={<WeightLogs />} />
          </Routes>
        </Router>
      </main>
      <footer className="app-footer">
        <p>
          &copy; {new Date().getFullYear()} Body Harmony Logs. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
