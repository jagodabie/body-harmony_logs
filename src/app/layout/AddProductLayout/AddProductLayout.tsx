import { Outlet, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Button from '../../../components/Button/Button';

import './index.css';

function AddProductLayout() {
  const navigate = useNavigate();
  return (
    <div className="app">
      <header className="header app-header">
      <Button Icon={ArrowBackIcon} onClick={() => navigate('/meal-logs')} className="header-back" />
        <h3>Add product</h3>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AddProductLayout;
