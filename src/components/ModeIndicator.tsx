import React from 'react';

type TeachingMode = 'positive' | 'negative' | 'discussion';

interface ModeIndicatorProps {
  mode: TeachingMode;
  className?: string;
}

/**
 * 教学模式指示器组件
 * 显示当前教学模式（正面教学/错误示例/讨论引导）
 */
const ModeIndicator: React.FC<ModeIndicatorProps> = ({ mode, className = '' }) => {
  const modeConfig = {
    positive: {
      label: '正面教学',
      icon: '✅',
      color: '#52c41a',
      bgColor: '#f6ffed',
      borderColor: '#b7eb8f',
      description: '展示正确的做法和最佳实践'
    },
    negative: {
      label: '错误示例',
      icon: '⚠️',
      color: '#ff4d4f',
      bgColor: '#fff2f0',
      borderColor: '#ffa39e',
      description: '展示常见错误和问题场景'
    },
    discussion: {
      label: '讨论引导',
      icon: '💡',
      color: '#faad14',
      bgColor: '#fffbe6',
      borderColor: '#ffe58f',
      description: '引导思考和讨论'
    }
  };

  const config = modeConfig[mode];

  return (
    <div 
      className={`mode-indicator mode-indicator--${mode} ${className}`}
      style={{
        '--mode-color': config.color,
        '--mode-bg-color': config.bgColor,
        '--mode-border-color': config.borderColor
      } as React.CSSProperties}
    >
      <div className="mode-indicator__icon">{config.icon}</div>
      <div className="mode-indicator__content">
        <span className="mode-indicator__label">{config.label}</span>
        <span className="mode-indicator__description">{config.description}</span>
      </div>
      <style>{`
        .mode-indicator {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: var(--mode-bg-color);
          border: 1px solid var(--mode-border-color);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .mode-indicator--positive {
          animation: pulse-green 2s infinite;
        }
        
        .mode-indicator--negative {
          animation: pulse-red 2s infinite;
        }
        
        .mode-indicator--discussion {
          animation: pulse-yellow 2s infinite;
        }
        
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(82, 196, 26, 0); }
        }
        
        @keyframes pulse-red {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(255, 77, 79, 0); }
        }
        
        @keyframes pulse-yellow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(250, 173, 20, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(250, 173, 20, 0); }
        }
        
        .mode-indicator__icon {
          font-size: 20px;
        }
        
        .mode-indicator__content {
          display: flex;
          flex-direction: column;
        }
        
        .mode-indicator__label {
          font-size: 14px;
          font-weight: 600;
          color: var(--mode-color);
        }
        
        .mode-indicator__description {
          font-size: 11px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default ModeIndicator;