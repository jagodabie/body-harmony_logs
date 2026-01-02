import './index.css';

type OverlayLoaderProps = {
  isLoading: boolean;
};

export const OverlayLoader = ({ isLoading }: OverlayLoaderProps) => {
  if (!isLoading) return null;

  return (
    <div className="overlay-loader">
      <div className="overlay-loader__spinner"></div>
    </div>
  );
};
