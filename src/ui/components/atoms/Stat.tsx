import React from "react";
import round from "lodash/round";

interface StatProps {
  delimeter?: string;
  label: string;
  value: number;
  polarity?: number;
}

const Stat: React.FC<StatProps> = ({ delimeter = ":", label, value, polarity }) => {
  const getColor = (): string => {
    if (!polarity) return 'black';
    return polarity > 0 ? '#10b981' : '#ef4444';
  };

  const formatValue = (): string => {
    const roundedValue = round(value, 2);
    if (polarity !== undefined) {
      return polarity > 0 ? `+${roundedValue}` : `${roundedValue}`;
    }
    return `${roundedValue}`;
  };

  return (
    <>
      <dt className="stat-label">
        {label}{delimeter}
      </dt>
      <dd className="stat-value">
        {formatValue()}
      </dd>
      
      <style jsx>{`
        .stat-label {
          clear: left;
          float: left;
          margin-right: 0.5rem;
          text-align: left;
          text-transform: capitalize;
          white-space: nowrap;
        }
        
        .stat-value {
          overflow: hidden;
          text-align: right;
          margin-left: 0;
          color: ${getColor()};
        }
      `}</style>
    </>
  );
};

export default Stat;