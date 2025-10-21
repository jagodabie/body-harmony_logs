import { ArrowLeft, ArrowRight } from '@mui/icons-material';

import './index.css';

type DateMenuProps = {
  date: string;
  onPrevDateChange: () => void;
  onNextDateChange: () => void;
};
const customStyle = {
  fontSize: 40,
  '&:active': {
    opacity: 0.1,
    transition: 'color 0.3s ease-in-out',
  },
};

export const DateMenu = ({
  date,
  onPrevDateChange,
  onNextDateChange,
}: DateMenuProps) => {
  return (
    <div className="date-menu">
      <div className="date-menu__arrow-left" onClick={onPrevDateChange}>
        <ArrowLeft sx={customStyle} />
      </div>
      <h3>{date}</h3>
      <div className="date-menu__arrow-right" onClick={onNextDateChange}>
        <ArrowRight sx={customStyle} />
      </div>
    </div>
  );
};