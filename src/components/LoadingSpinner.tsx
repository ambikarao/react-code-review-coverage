import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#007bff',
  text,
  fullScreen = false
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return '20px';
      case 'large':
        return '60px';
      case 'medium':
      default:
        return '40px';
    }
  };

  const spinnerStyle: React.CSSProperties = {
    width: getSize(),
    height: getSize(),
    border: `3px solid ${color}20`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block'
  };

  const containerClass = fullScreen ? 'loading-spinner-fullscreen' : 'loading-spinner-container';

  return (
    <div className={containerClass} role="region">
      <div style={spinnerStyle} />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
