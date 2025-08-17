import logo from '../../../assets/koala.png';

import './index.css';

const UserBadge = ({ img }: { img?: string }) => {
  return (
    <div className="user-badge">
      <div className="user-badge__icon">
        <img src={ img || logo} alt="User Avatar" className="user-avatar" />
      </div>
    </div>
  );
};

export default UserBadge;
