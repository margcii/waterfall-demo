import React from 'react';
import DialogArea, { Message as DialogMessage } from './DialogArea';
import Scanvas from './Scanvas';
import { ConnectionValidation } from '../hooks/useDemo';

interface MainContentProps {
  // 教学内容（可选，用于显示在对话中）
  teachingContent?: string;
  
  // 对话消息
  dialogMessages: DialogMessage[];
  onSendMessage?: (message: string, messageId?: string) => void;
  
  // 步骤控制
  currentStep?: number;
  totalSteps?: number;
  onNextStep?: () => void;
  onPrevStep?: () => void;
  onReset?: () => void;
  
  // Scanvas 验证回调
  onValidateConnection?: (source: string, target: string) => ConnectionValidation;
}

const MainContent: React.FC<MainContentProps> = ({
  teachingContent,
  dialogMessages,
  onSendMessage,
  currentStep,
  totalSteps,
  onNextStep,
  onPrevStep,
  onReset,
  onValidateConnection,
}) => {
  // 直接使用 dialogMessages，不添加额外的教学内容
  // 因为 useDemo 已经自动加载了当前幕的消息
  const messages = dialogMessages;

  return (
    <div className="h-full flex flex-col gap-3 p-3 bg-[#0f0f0f]">
      {/* AI 教学交互空间（上部 70%） */}
      <div className="flex-[7] min-h-0 flex flex-col rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-b from-[#2d2d2d] to-[#252525] border-b border-[#333] shrink-0">
          <span className="text-base">💬</span>
          <span className="text-sm font-medium text-gray-200">AI 教学交互空间</span>
          {currentStep && totalSteps && (
            <span className="ml-auto text-sm text-gray-500">
              步骤 {currentStep} / {totalSteps}
            </span>
          )}
        </div>
        {/* 内容 */}
        <div className="flex-1 min-h-0 p-3 overflow-hidden">
          <DialogArea
            messages={messages}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>

      {/* Scanvas 区域（底部 30%） */}
      <div className="flex-[3] min-h-[200px] flex flex-col rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#2d2d2d] to-[#252525] border-b border-[#333] shrink-0">
          <span className="text-base">🎨</span>
          <span className="text-sm font-medium text-gray-200">可视化画布 (Scanvas)</span>
          <div className="ml-auto flex gap-2">
            {onPrevStep && (
              <button 
                onClick={onPrevStep}
                className="px-3 py-1.5 text-xs bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded transition-colors"
              >
                ← 上一步
              </button>
            )}
            {onNextStep && (
              <button 
                onClick={onNextStep}
                className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                下一步 →
              </button>
            )}
            {onReset && (
              <button 
                onClick={onReset}
                className="px-3 py-1.5 text-xs bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded transition-colors"
              >
                ↻ 重置
              </button>
            )}
          </div>
        </div>
        {/* 内容 */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <Scanvas
            isInteractive={true}
            onValidateConnection={onValidateConnection}
          />
        </div>
      </div>
    </div>
  );
};

export default MainContent;