import React, { useState } from 'react';

interface HistoryItem {
  id: string;
  title: string;
  type: 'single-learning' | 'interactive' | 'question-space';
  timestamp?: string;
  children?: HistoryItem[];
}

interface ModelOption {
  id: string;
  name: string;
  selected: boolean;
}

const RightSidebar: React.FC = () => {
  // 历史记录数据
  const [historyItems] = useState<HistoryItem[]>([
    {
      id: '1',
      title: '单次学习',
      type: 'single-learning',
      children: [
        { id: '1-1', title: '教材节点1 - 负问题', type: 'question-space' },
        { id: '1-2', title: '教材节点2 - 正问题', type: 'question-space' },
      ]
    },
    {
      id: '2',
      title: '互动界面跳转',
      type: 'interactive',
    },
    {
      id: '3',
      title: '正反问题空间',
      type: 'question-space',
    }
  ]);

  // 模型选项
  const [models, setModels] = useState<ModelOption[]>([
    { id: 'gpt-4', name: 'GPT-4', selected: true },
    { id: 'gpt-3.5', name: 'GPT-3.5', selected: false },
    { id: 'claude', name: 'Claude', selected: false },
  ]);

  const handleModelChange = (modelId: string) => {
    setModels(models.map(m => ({
      ...m,
      selected: m.id === modelId
    })));
  };

  // 获取历史项图标
  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'single-learning': return '📋';
      case 'interactive': return '🔗';
      case 'question-space': return '❓';
      default: return '📄';
    }
  };

  // 渲染历史项
  const renderHistoryItem = (item: HistoryItem, level: number = 0) => {
    return (
      <div key={item.id} className="mb-1">
        <div 
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[#333]
            ${level === 0 ? 'font-medium' : 'pl-8 text-gray-400 text-[13px]'}
          `}
          onClick={() => console.log('Navigate to:', item.id)}
        >
          <span className="text-sm">{getHistoryIcon(item.type)}</span>
          <span className="text-[13px] text-gray-300 truncate">{item.title}</span>
        </div>
        {item.children && (
          <div className="ml-3 border-l border-[#333]">
            {item.children.map(child => renderHistoryItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      {/* 历史记录区域 */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-[#2a2a2a]">
          <h2 className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <span>📋</span>
            <span>历史记录</span>
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {historyItems.map(item => renderHistoryItem(item))}
        </div>
      </div>

      {/* 模型选择区域 */}
      <div className="border-t border-[#2a2a2a] bg-[#1e1e1e]">
        <div className="px-4 py-3 border-b border-[#2a2a2a]">
          <h2 className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <span>🤖</span>
            <span>模型选择</span>
          </h2>
        </div>
        <div className="p-3 space-y-1">
          {models.map(model => (
            <label 
              key={model.id} 
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[#333]"
            >
              <input
                type="radio"
                name="model"
                checked={model.selected}
                onChange={() => handleModelChange(model.id)}
                className="accent-[#10a37f] w-4 h-4"
              />
              <span className={`text-[13px] ${model.selected ? 'text-gray-200 font-medium' : 'text-gray-400'}`}>
                {model.name}
              </span>
            </label>
          ))}
        </div>
        
        {/* 底部信息 */}
        <div className="px-4 py-3 border-t border-[#2a2a2a]">
          <p className="text-xs text-gray-500 text-center">
            瀑布流教学演示系统 v4.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;