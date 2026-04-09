import React from 'react';

interface CodeDisplayProps {
  code: string;
  language: string;
  title?: string;
}

/**
 * 代码展示组件
 * 用于在教学中展示代码示例
 */
const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, language, title }) => {
  return (
    <div className="code-display">
      {title && (
        <div className="code-display__header">
          <span className="code-display__language">{language}</span>
          <span className="code-display__title">{title}</span>
        </div>
      )}
      <pre className="code-display__pre">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <style>{`
        .code-display {
          background: #1e1e1e;
          border-radius: 8px;
          overflow: hidden;
          margin: 16px 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .code-display__header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: #2d2d2d;
          border-bottom: 1px solid #404040;
        }
        
        .code-display__language {
          font-size: 12px;
          color: #1890ff;
          background: rgba(24, 144, 255, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 500;
        }
        
        .code-display__title {
          font-size: 14px;
          color: #a0a0a0;
        }
        
        .code-display__pre {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
          font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .code-display__pre code {
          color: #d4d4d4;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default CodeDisplay;