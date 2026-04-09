import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, ChevronUp, HelpCircle, AlertCircle, Code2 } from 'lucide-react';

// 问题数据接口
export interface QuestionData {
  title: string;
  content: string;
  codeSnippet?: string;
  hint?: string;
  isCollapsed?: boolean;
}

// 消息类型定义
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  type?: 'normal' | 'positive-question' | 'negative-question';
  questionData?: QuestionData;
}

interface DialogAreaProps {
  messages?: Message[];
  onSendMessage?: (message: string, messageId?: string) => void;
}

// 正问题空间卡片组件（绿色边框）
const PositiveQuestionCard: React.FC<{
  message: Message;
}> = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(!(message.questionData?.isCollapsed ?? false));
  const questionData = message.questionData;

  if (!questionData) return null;

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-green-500/30 bg-gradient-to-b from-[#1e2d24] to-[#1a2820] max-w-[90%] self-start"
      style={{ animation: 'slideIn 0.3s ease' }}>
      {/* 卡片头部 - 可点击展开/折叠 */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-black/20 cursor-pointer hover:bg-black/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <HelpCircle size={16} className="text-green-500" />
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-green-500/20 text-green-400">
            正问题空间
          </span>
          <span className="text-sm text-gray-200 font-medium">{questionData.title}</span>
        </div>
        <div className="text-gray-500 hover:text-gray-400 transition-colors">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* 卡片内容 */}
      {isExpanded && (
        <div className="px-4 py-4 space-y-4">
          {/* 对话内容 */}
          <div className="text-[13px] leading-relaxed text-gray-300 whitespace-pre-wrap">
            {questionData.content}
          </div>

          {/* 提示信息 */}
          {questionData.hint && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-xs font-semibold shrink-0">💡 提示：</span>
                <span className="text-[13px] text-gray-300 leading-relaxed">{questionData.hint}</span>
              </div>
            </div>
          )}

          {/* 折叠提示 */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-green-500/20">
            [讨论结束，可点击头部折叠]
          </div>
        </div>
      )}
    </div>
  );
};

// 负问题空间卡片组件（红色边框，含代码）
const NegativeQuestionCard: React.FC<{
  message: Message;
}> = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(!(message.questionData?.isCollapsed ?? false));
  const questionData = message.questionData;

  if (!questionData) return null;

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-red-500/30 bg-gradient-to-b from-[#2d1e1e] to-[#281a1a] max-w-[90%] self-start"
      style={{ animation: 'slideIn 0.3s ease' }}>
      {/* 卡片头部 - 可点击展开/折叠 */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-black/20 cursor-pointer hover:bg-black/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400">
            负问题空间
          </span>
          <span className="text-sm text-gray-200 font-medium">{questionData.title}</span>
        </div>
        <div className="text-gray-500 hover:text-gray-400 transition-colors">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* 卡片内容 */}
      {isExpanded && (
        <div className="px-4 py-4 space-y-4">
          {/* 错误提示 */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-[13px] font-medium">
            <AlertCircle size={14} />
            <span>发现潜在问题</span>
          </div>

          {/* 对话内容/引导 */}
          <div className="text-[13px] leading-relaxed text-gray-300 whitespace-pre-wrap">
            {questionData.content}
          </div>

          {/* 代码示例 */}
          {questionData.codeSnippet && (
            <div className="rounded-lg overflow-hidden bg-[#1a1a2e] border border-[#2a2a4e]">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#252540] border-b border-[#2a2a4e]">
                <Code2 size={12} className="text-gray-500" />
                <span className="text-xs text-gray-500 font-medium">代码示例</span>
              </div>
              <pre className="p-3 m-0 overflow-x-auto font-mono text-[12px] leading-relaxed text-gray-300 whitespace-pre-wrap">
                <code>{questionData.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* 提示信息 */}
          {questionData.hint && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-2">
                <span className="text-red-400 text-xs font-semibold shrink-0">🔍 排查指引：</span>
                <span className="text-[13px] text-gray-300 leading-relaxed">{questionData.hint}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DialogArea: React.FC<DialogAreaProps> = ({ messages: propMessages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [propMessages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      if (onSendMessage) {
        onSendMessage(inputValue.trim());
      }
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 获取消息图标
  const getMessageIcon = (role: string) => {
    if (role === 'system') return '🤖';
    return role === 'user' ? '👤' : '🤖';
  };

  // 获取消息标签
  const getMessageLabel = (role: string) => {
    if (role === 'system') return '系统';
    return role === 'user' ? '用户' : 'AI 助手';
  };

  // 渲染单条消息
  const renderMessage = (msg: Message, index: number) => {
    const messageId = `msg-${index}`;

    // 根据消息类型渲染不同的卡片
    if (msg.type === 'positive-question') {
      return (
        <PositiveQuestionCard
          key={messageId}
          message={msg}
        />
      );
    }

    if (msg.type === 'negative-question') {
      return (
        <NegativeQuestionCard
          key={messageId}
          message={msg}
        />
      );
    }

    // 普通消息渲染
    const isUser = msg.role === 'user';
    const isSystem = msg.role === 'system';

    return (
      <div
        key={messageId}
        className={`
          max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed
          ${isUser 
            ? 'self-end bg-gradient-to-br from-[#10a37f] to-[#0d8c6a] text-white rounded-br-md' 
            : isSystem 
              ? 'self-start bg-gradient-to-br from-[#1e3a5f] to-[#1a2d4a] text-blue-200 border border-[#2a4a6f] rounded-bl-md border-l-4 border-l-blue-500'
              : 'self-start bg-gradient-to-br from-[#2a2a2a] to-[#252525] text-gray-200 border border-[#3a3a3a] rounded-bl-md'
          }
        `}
        style={{ animation: 'fadeIn 0.3s ease' }}
      >
        {/* 消息头部 */}
        <div className="flex items-center gap-2 mb-1.5 text-xs opacity-80">
          <span>{getMessageIcon(msg.role)}</span>
          <span className="font-medium">{getMessageLabel(msg.role)}</span>
        </div>
        {/* 消息内容 */}
        <div className="whitespace-pre-wrap break-words">
          {msg.content}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden">
      {/* 对话历史 */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {!propMessages || propMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center">
            <div className="text-5xl mb-4 opacity-50">💬</div>
            <p className="text-base mb-2">开始与 AI 助手对话</p>
            <span className="text-sm">或等待教学过程中的互动问题</span>
          </div>
        ) : (
          propMessages.map((msg, index) => renderMessage(msg, index))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 bg-[#252525] border-t border-[#333]">
        <div className="flex gap-3 items-end">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题或回答..."
            className="flex-1 min-h-[44px] max-h-[120px] px-4 py-2.5 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-gray-200 text-[13px] leading-relaxed resize-none focus:outline-none focus:border-[#10a37f] transition-colors placeholder:text-gray-600"
            rows={2}
          />
          <button 
            onClick={handleSend} 
            disabled={!inputValue.trim()}
            className="px-4 py-2.5 bg-gradient-to-br from-[#10a37f] to-[#0d8c6a] text-white rounded-lg flex items-center justify-center transition-all hover:from-[#14b88f] hover:to-[#10a37f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 text-[11px] text-gray-500 text-center">
          按 Enter 发送，Shift + Enter 换行
        </div>
      </div>
    </div>
  );
};

export default DialogArea;