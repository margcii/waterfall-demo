import React from 'react';

interface StepNavigatorProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (step: number) => void;
  stepTitles?: string[];
}

/**
 * 步骤导航组件
 * 用于在教学过程中导航各个步骤
 */
const StepNavigator: React.FC<StepNavigatorProps> = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onGoTo,
  stepTitles
}) => {
  const defaultTitles = [
    '起因',
    '正问题',
    '犯错',
    '打断',
    '修正',
    '完成'
  ];
  
  const titles = stepTitles || defaultTitles;
  
  return (
    <div className="step-navigator">
      <div className="step-navigator__progress">
        <div className="step-navigator__progress-bar">
          <div 
            className="step-navigator__progress-fill"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <span className="step-navigator__progress-text">
          步骤 {currentStep + 1} / {totalSteps}
        </span>
      </div>
      
      <div className="step-navigator__dots">
        {Array.from({ length: totalSteps }, (_, index) => (
          <button
            key={index}
            className={`step-navigator__dot ${
              index === currentStep ? 'step-navigator__dot--active' : ''
            } ${
              index < currentStep ? 'step-navigator__dot--completed' : ''
            }`}
            onClick={() => onGoTo(index + 1)}
            title={titles[index]}
          >
            <span className="step-navigator__dot-number">{index + 1}</span>
            <span className="step-navigator__dot-title">{titles[index]}</span>
          </button>
        ))}
      </div>
      
      <div className="step-navigator__buttons">
        <button
          className="step-navigator__button step-navigator__button--prev"
          onClick={onPrev}
          disabled={currentStep === 0}
        >
          ← 上一步
        </button>
        <button
          className="step-navigator__button step-navigator__button--next"
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
        >
          下一步 →
        </button>
      </div>
      
      <style>{`
        .step-navigator {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        .step-navigator__progress {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .step-navigator__progress-bar {
          flex: 1;
          height: 6px;
          background: #f0f0f0;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .step-navigator__progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #1890ff, #52c41a);
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        
        .step-navigator__progress-text {
          font-size: 14px;
          color: #666;
          white-space: nowrap;
        }
        
        .step-navigator__dots {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 8px;
        }
        
        .step-navigator__dot {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 4px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .step-navigator__dot-number {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          background: #f0f0f0;
          color: #999;
          margin-bottom: 4px;
          transition: all 0.2s ease;
        }
        
        .step-navigator__dot-title {
          font-size: 11px;
          color: #999;
          text-align: center;
        }
        
        .step-navigator__dot--active .step-navigator__dot-number {
          background: #1890ff;
          color: #fff;
          transform: scale(1.1);
        }
        
        .step-navigator__dot--active .step-navigator__dot-title {
          color: #1890ff;
          font-weight: 500;
        }
        
        .step-navigator__dot--completed .step-navigator__dot-number {
          background: #52c41a;
          color: #fff;
        }
        
        .step-navigator__dot--completed .step-navigator__dot-title {
          color: #52c41a;
        }
        
        .step-navigator__dot:hover:not(.step-navigator__dot--active) .step-navigator__dot-number {
          background: #e6f7ff;
          border: 1px solid #1890ff;
        }
        
        .step-navigator__buttons {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }
        
        .step-navigator__button {
          flex: 1;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .step-navigator__button--prev {
          background: #f5f5f5;
          color: #333;
        }
        
        .step-navigator__button--prev:hover:not(:disabled) {
          background: #e8e8e8;
        }
        
        .step-navigator__button--next {
          background: #1890ff;
          color: #fff;
        }
        
        .step-navigator__button--next:hover:not(:disabled) {
          background: #40a9ff;
        }
        
        .step-navigator__button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default StepNavigator;