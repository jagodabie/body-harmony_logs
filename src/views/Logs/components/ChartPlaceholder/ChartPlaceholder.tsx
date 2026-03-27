import './index.css';

type ChartPlaceholderProps = {
  className?: string;
};

export const ChartPlaceholder = ({ className = '' }: ChartPlaceholderProps) => (
  <div className={`chart-placeholder item ${className}`}>
    <h4 className="chart-placeholder__title">Last 7 days</h4>
    <div className="chart-placeholder__area">
      <span className="chart-placeholder__text">Chart coming soon</span>
    </div>
  </div>
);
