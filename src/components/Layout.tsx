import React, { useEffect, useCallback } from 'react';
import Mcanvas from './Mcanvas';
import MainContent from './MainContent';
import RightSidebar from './RightSidebar';
import { useDemo } from '../hooks/useDemo';

const Layout: React.FC = () => {
  // 使用 useDemo hook 管理教学状态
  const {
    // 教学状态
    currentStep,
    totalSteps,
    teachingMode,
    currentScriptStep,
    
    // 对话消息
    messages,
    sendMessage,
    
    // 知识图谱 - 章节进度
    sectionNodes,
    currentSection,
    
    // 连线验证
    lastConnectionValidation,
    
    // 控制方法
    nextStep,
    prevStep,
    goToStep,
    resetDemo,
    
    // Scanvas 验证回调
    validateScanvasConnection,
  } = useDemo();

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止在输入框中触发
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          // 空格键：下一步
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowRight':
          // 右箭头：下一步
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          // 左箭头：上一步
          e.preventDefault();
          prevStep();
          break;
        case 'r':
        case 'R':
          // R 键：重置
          e.preventDefault();
          resetDemo();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          // 数字键 1-5：跳转到对应步骤
          e.preventDefault();
          goToStep(parseInt(e.key));
          break;
        case 'Escape':
          // ESC：重置
          e.preventDefault();
          resetDemo();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStep, prevStep, goToStep, resetDemo]);

  // 处理消息发送
  const handleSendMessage = useCallback((message: string) => {
    sendMessage(message);
  }, [sendMessage]);

  // 获取当前教学内容
  const getTeachingContent = () => {
    if (!currentScriptStep) return '';
    
    return `
### ${currentScriptStep.title}

${currentScriptStep.description}

---

**当前步骤**: ${currentStep + 1} / ${totalSteps}
**教学模式**: ${teachingMode === 'positive' ? '✅ 正问题空间' : teachingMode === 'negative' ? '❌ 负问题空间' : '💬 讨论模式'}

${lastConnectionValidation ? `\n📝 **连线验证**: ${lastConnectionValidation.message}` : ''}
    `.trim();
  };

  return (
    <div className="h-screen w-full bg-[#0f0f0f] flex flex-col overflow-hidden">
      {/* 顶部标题栏 */}
      <header className="h-12 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-4 shrink-0">
        <h1 className="text-sm font-medium text-gray-200">瀑布流教学演示系统</h1>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>第 {currentStep} / {totalSteps} 幕</span>
          <span className="px-2 py-0.5 rounded bg-[#2a2a2a]">
            {teachingMode === 'positive' ? '✅ 正问题' : teachingMode === 'negative' ? '❌ 负问题' : '💬 讨论'}
          </span>
        </div>
      </header>

      {/* 三栏布局主体 - 使用 flex-row 明确水平排列 */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* 左侧 - Mcanvas (20%) */}
        <aside className="w-[20%] min-w-[200px] max-w-[280px] bg-[#1a1a1a] border-r border-[#2a2a2a] overflow-hidden flex-shrink-0">
          <Mcanvas
            sectionNodes={sectionNodes}
            currentSection={currentSection}
          />
        </aside>

        {/* 中间 - DialogArea + Scanvas (60%) */}
        <main className="flex-1 flex flex-col min-w-[400px] bg-[#0f0f0f] overflow-hidden">
          <MainContent
            teachingContent={getTeachingContent()}
            dialogMessages={messages}
            onSendMessage={handleSendMessage}
            currentStep={currentStep + 1}
            totalSteps={totalSteps}
            onNextStep={nextStep}
            onPrevStep={prevStep}
            onReset={resetDemo}
            onValidateConnection={validateScanvasConnection}
          />
        </main>

        {/* 右侧 - RightSidebar (20%) */}
        <aside className="w-[20%] min-w-[200px] max-w-[280px] bg-[#1a1a1a] border-l border-[#2a2a2a] overflow-hidden flex-shrink-0">
          <RightSidebar />
        </aside>
      </div>

      {/* 键盘快捷键提示 */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/90 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-4 z-50">
        <span className="flex items-center gap-1">
          <kbd className="bg-slate-600 px-1.5 py-0.5 rounded">Space</kbd>
          下一步
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-slate-600 px-1.5 py-0.5 rounded">←</kbd>
          <kbd className="bg-slate-600 px-1.5 py-0.5 rounded">→</kbd>
          切换
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-slate-600 px-1.5 py-0.5 rounded">1-5</kbd>
          跳转
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-slate-600 px-1.5 py-0.5 rounded">R</kbd>
          重置
        </span>
      </div>
    </div>
  );
};

export default Layout;