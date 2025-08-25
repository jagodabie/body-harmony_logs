import { Outlet } from 'react-router-dom';

import AppFooter from '../components/AppFooter/AppFooter';
import UserBadge from '../components/UserBadge/UserBadge';

function MainLayout() {
  return (
    <div className="app">
      <header className="header app-header">
        <h3>Body Harmony Logs</h3>
        <UserBadge />
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}

export default MainLayout;
