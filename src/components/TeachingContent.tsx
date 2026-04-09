import React from 'react';
import CodeDisplay from './CodeDisplay';
import SloganDisplay from './SloganDisplay';
import ModeIndicator from './ModeIndicator';
import { ScriptStep } from '../data/script';

interface TeachingContentProps {
  currentStep: ScriptStep | null;
  codeExample: string;
  codeLanguage: string;
  slogan: string;
  teachingMode: 'positive' | 'negative' | 'discussion';
  errorDetected: string;
}

/**
 * 教学内容展示组件
 * 集成教学模式指示器、代码展示、口号展示等功能
 */
const TeachingContent: React.FC<TeachingContentProps> = ({
  currentStep,
  codeExample,
  codeLanguage,
  slogan,
  teachingMode,
  errorDetected
}) => {
  if (!currentStep) {
    return (
      <div className="teaching-content teaching-content--empty">
        <p>暂无教学内容</p>
      </div>
    );
  }

  return (
    <div className={`teaching-content teaching-content--${teachingMode}`}>
      {/* 标题区 */}
      <div className="teaching-content__header">
        <h2 className="teaching-content__title">{currentStep.title}</h2>
        <ModeIndicator mode={teachingMode} />
      </div>
      
      {/* 描述区 */}
      <div className="teaching-content__description">
        <p>{currentStep.description}</p>
      </div>
      
      {/* 错误提示（如果有） */}
      {errorDetected && teachingMode === 'negative' && (
        <div className="teaching-content__error">
          <span className="teaching-content__error-icon">⚠️</span>
          <span className="teaching-content__error-text">{errorDetected}</span>
        </div>
      )}
      
      {/* 讨论提示（如果是讨论模式） */}
      {errorDetected && teachingMode === 'discussion' && (
        <div className="teaching-content__discussion">
          <span className="teaching-content__discussion-icon">💡</span>
          <span className="teaching-content__discussion-text">{errorDetected}</span>
        </div>
      )}
      
      {/* 代码示例区 */}
      {codeExample && (
        <div className="teaching-content__code">
          <CodeDisplay 
            code={codeExample} 
            language={codeLanguage}
            title="示例代码"
          />
        </div>
      )}
      
      {/* 口号/总结区 */}
      {slogan && (
        <div className="teaching-content__slogan">
          <SloganDisplay slogan={slogan} mode={teachingMode} />
        </div>
      )}
      
      <style>{`
        .teaching-content {
          padding: 24px;
          background: #fff;
          border-radius: 12px;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .teaching-content--empty {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: #999;
        }
        
        .teaching-content__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .teaching-content__title {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }
        
        .teaching-content__description {
          margin-bottom: 16px;
        }
        
        .teaching-content__description p {
          margin: 0;
          font-size: 15px;
          line-height: 1.8;
          color: #555;
        }
        
        .teaching-content__error {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #fff2f0;
          border: 1px solid #ffa39e;
          border-radius: 8px;
          margin-bottom: 16px;
          animation: shake 0.5s ease;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .teaching-content__error-icon {
          font-size: 20px;
        }
        
        .teaching-content__error-text {
          font-size: 14px;
          color: #cf1322;
          font-weight: 500;
        }
        
        .teaching-content__discussion {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #fffbe6;
          border: 1px solid #ffe58f;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .teaching-content__discussion-icon {
          font-size: 20px;
        }
        
        .teaching-content__discussion-text {
          font-size: 14px;
          color: #d48806;
          font-weight: 500;
        }
        
        .teaching-content__code {
          margin: 16px 0;
        }
        
        .teaching-content__slogan {
          margin-top: 16px;
        }
        
        /* 根据教学模式调整整体风格 */
        .teaching-content--positive {
          border-left: 4px solid #52c41a;
        }
        
        .teaching-content--negative {
          border-left: 4px solid #ff4d4f;
        }
        
        .teaching-content--discussion {
          border-left: 4px solid #faad14;
        }
      `}</style>
    </div>
  );
};

export default TeachingContent;