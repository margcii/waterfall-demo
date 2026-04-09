import React from 'react';

interface SloganDisplayProps {
  slogan: string;
  mode?: 'positive' | 'negative' | 'discussion';
}

/**
 * 口号/总结展示组件
 * 用于在教学过程中展示关键信息总结
 */
const SloganDisplay: React.FC<SloganDisplayProps> = ({ slogan, mode = 'positive' }) => {
  const modeStyles = {
    positive: {
      background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
      borderColor: '#b7eb8f',
      color: '#389e0d',
      icon: '💡'
    },
    negative: {
      background: 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
      borderColor: '#ffa39e',
      color: '#cf1322',
      icon: '⚡'
    },
    discussion: {
      background: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)',
      borderColor: '#ffe58f',
      color: '#d48806',
      icon: '🤔'
    }
  };

  const style = modeStyles[mode];

  return (
    <div 
      className="slogan-display"
      style={{
        background: style.background,
        borderColor: style.borderColor
      }}
    >
      <span className="slogan-display__icon">{style.icon}</span>
      <p className="slogan-display__text" style={{ color: style.color }}>
        {slogan}
      </p>
      <style>{`
        .slogan-display {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          border: 2px solid;
          margin: 16px 0;
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .slogan-display__icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        
        .slogan-display__text {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default SloganDisplay;