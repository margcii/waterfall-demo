import React, { useState, useEffect } from 'react';

interface Question {
  id: string;
  type: 'positive' | 'negative';
  content: string;
  answer?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface QuestionSpaceProps {
  positiveQuestion?: Question;
  negativeQuestions?: Question[];
  onQuestionResolve?: (questionId: string) => void;
  autoExpand?: boolean;
}

const QuestionSpace: React.FC<QuestionSpaceProps> = ({
  positiveQuestion,
  negativeQuestions = [],
  onQuestionResolve,
  autoExpand = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');

  // 当有新问题出现时自动展开
  useEffect(() => {
    const hasPendingQuestion = positiveQuestion?.status === 'pending' || 
      negativeQuestions.some(q => q.status === 'pending');
    
    if (hasPendingQuestion && autoExpand) {
      setIsExpanded(true);
    }
  }, [positiveQuestion, negativeQuestions, autoExpand]);

  // 当所有问题解决后自动折叠
  useEffect(() => {
    const allCompleted = positiveQuestion?.status === 'completed' &&
      negativeQuestions.every(q => q.status === 'completed');
    
    if (allCompleted && autoExpand) {
      setIsExpanded(false);
    }
  }, [positiveQuestion, negativeQuestions, autoExpand]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmitAnswer = (questionId: string) => {
    if (userAnswer.trim()) {
      onQuestionResolve?.(questionId);
      setUserAnswer('');
      setActiveQuestion(null);
    }
  };

  const getQuestionStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'in-progress': return '🔄';
      case 'completed': return '✅';
      default: return '❓';
    }
  };

  return (
    <div className={`question-space ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* 标题栏 - 可点击展开/折叠 */}
      <div className="question-space-header" onClick={handleToggle}>
        <div className="header-left">
          <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
          <h3>正负问题空间</h3>
        </div>
        <div className="header-right">
          <span className="question-count">
            {negativeQuestions.length + (positiveQuestion ? 1 : 0)} 个问题
          </span>
          <span className="status-indicator">
            {positiveQuestion?.status === 'completed' && 
             negativeQuestions.every(q => q.status === 'completed') ? '已全部完成' : '待处理'}
          </span>
        </div>
      </div>

      {/* 展开的内容区域 */}
      {isExpanded && (
        <div className="question-space-content">
          {/* 正问题区域 */}
          {positiveQuestion && (
            <div className={`question-section positive-question ${positiveQuestion.status}`}>
              <div className="question-header">
                <span className="question-type">🎯 正问题</span>
                <span className="status-icon">{getQuestionStatusIcon(positiveQuestion.status)}</span>
              </div>
              <div className="question-content">
                <p>{positiveQuestion.content}</p>
                {positiveQuestion.answer && (
                  <div className="question-answer">
                    <strong>参考答案：</strong>
                    <p>{positiveQuestion.answer}</p>
                  </div>
                )}
              </div>
              {positiveQuestion.status !== 'completed' && (
                <div className="question-input-area">
                  <textarea
                    placeholder="输入你的回答..."
                    value={activeQuestion === positiveQuestion.id ? userAnswer : ''}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onFocus={() => setActiveQuestion(positiveQuestion.id)}
                  />
                  <button 
                    className="submit-btn"
                    onClick={() => handleSubmitAnswer(positiveQuestion.id)}
                    disabled={!userAnswer.trim()}
                  >
                    提交
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 负问题任务空间 */}
          {negativeQuestions.length > 0 && (
            <div className="question-section negative-questions">
              <div className="section-title">
                <span>📋 负问题任务空间</span>
              </div>
              <div className="negative-questions-list">
                {negativeQuestions.map((question) => (
                  <div 
                    key={question.id} 
                    className={`negative-question-item ${question.status}`}
                  >
                    <div className="question-header">
                      <span className="question-type">💭 负问题</span>
                      <span className="status-icon">{getQuestionStatusIcon(question.status)}</span>
                    </div>
                    <div className="question-content">
                      <p>{question.content}</p>
                    </div>
                    {question.status !== 'completed' && (
                      <div className="question-input-area">
                        <textarea
                          placeholder="输入你的回答..."
                          value={activeQuestion === question.id ? userAnswer : ''}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          onFocus={() => setActiveQuestion(question.id)}
                        />
                        <button 
                          className="submit-btn"
                          onClick={() => handleSubmitAnswer(question.id)}
                          disabled={!userAnswer.trim()}
                        >
                          提交
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionSpace;