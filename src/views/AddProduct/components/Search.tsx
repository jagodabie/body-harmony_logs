import InputBase from '@mui/material/InputBase';

import './index.css';

// TODO: Add search functionality with debounce
export const Search = () => {
  return (
    <div className="search-wrapper">
      <InputBase name="search" placeholder="Search" className="search-input" />
    </div>
  );
};