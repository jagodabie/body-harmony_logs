import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useAppFooter = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleNavigate = (path: string) => {
    setDrawerOpen(false);
    navigate(path);
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return { isActive, handleNavigate, drawerOpen, openDrawer, closeDrawer };
};
