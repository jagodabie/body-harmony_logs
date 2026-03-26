import './index.css';

type ChartPlaceholderProps = {
  className?: string;
};

export const ChartPlaceholder = ({ className = '' }: ChartPlaceholderProps) => (
  <div className={`chart-placeholder item ${className}`}>
    <h4 className="chart-placeholder__title">Ostatnie 7 dni</h4>
    <div className="chart-placeholder__area">
      <span className="chart-placeholder__text">Wykres wkrótce</span>
    </div>
  </div>
);
