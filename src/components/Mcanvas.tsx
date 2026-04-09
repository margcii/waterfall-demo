import React from 'react';
import { SectionNode } from '../data/script';

interface McanvasProps {
  sectionNodes?: SectionNode[];
  currentSection?: number;
}

const Mcanvas: React.FC<McanvasProps> = ({ 
  sectionNodes = [], 
  currentSection = 1 
}) => {
  // 默认4个章节（如果没有提供）
  const defaultSections: SectionNode[] = [
    { id: 'section-1', title: '第1节：数据流设计', description: 'IoT视觉识别系统的数据流向', isCompleted: false, isActive: true, order: 1 },
    { id: 'section-2', title: '第2节：图像预处理', description: 'ESP32图像压缩与缓存策略', isCompleted: false, isActive: false, order: 2 },
    { id: 'section-3', title: '第3节：AI推理', description: '云端AI模型推理流程', isCompleted: false, isActive: false, order: 3 },
    { id: 'section-4', title: '第4节：结果展示', description: '识别结果展示与存储', isCompleted: false, isActive: false, order: 4 },
  ];

  const sections = sectionNodes.length > 0 ? sectionNodes : defaultSections;

  // 计算完成进度
  const completedCount = sections.filter(s => s.isCompleted).length;
  const progress = Math.round((completedCount / sections.length) * 100);

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      {/* 标题栏 */}
      <div className="px-4 py-3 border-b border-[#2a2a2a]">
        <h2 className="text-sm font-medium text-gray-200 flex items-center gap-2">
          <span>📚</span>
          <span>知识图谱</span>
        </h2>
      </div>

      {/* 进度条 */}
      <div className="px-4 py-3 border-b border-[#2a2a2a] bg-[#1e1e1e]">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>学习进度</span>
          <span>{completedCount} / {sections.length}</span>
        </div>
        <div className="w-full bg-[#2a2a2a] rounded-full h-1.5">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 章节列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`
                relative pl-6 pb-4 last:pb-0
                ${index !== sections.length - 1 ? 'border-l-2 border-[#2a2a2a] ml-2' : 'ml-2'}
              `}
            >
              {/* 状态圆圈 */}
              <div 
                className={`
                  absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-[9px]
                  flex items-center justify-center text-[10px]
                  ${section.isCompleted 
                    ? 'bg-green-500 text-white' 
                    : section.isActive 
                      ? 'bg-blue-500 text-white ring-2 ring-blue-500/30'
                      : 'bg-[#2a2a2a] border-2 border-[#3a3a3a]'
                  }
                `}
              >
                {section.isCompleted && '●'}
                {section.isActive && !section.isCompleted && '●'}
                {!section.isCompleted && !section.isActive && '○'}
              </div>

              {/* 章节内容 */}
              <div 
                className={`
                  p-3 rounded-lg border transition-all
                  ${section.isActive 
                    ? 'bg-blue-500/10 border-blue-500/30' 
                    : section.isCompleted
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-[#252525] border-[#2a2a2a]'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`
                    text-xs font-medium
                    ${section.isActive ? 'text-blue-400' : section.isCompleted ? 'text-green-400' : 'text-gray-400'}
                  `}>
                    第{section.order}节
                  </span>
                  {section.isCompleted && (
                    <span className="text-[10px] text-green-400">✓ 已完成</span>
                  )}
                  {section.isActive && !section.isCompleted && (
                    <span className="text-[10px] text-blue-400">进行中</span>
                  )}
                </div>
                <h3 className="text-sm text-gray-200 font-medium mb-1">
                  {section.title.replace(`第${section.order}节：`, '')}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-3 border-t border-[#2a2a2a] bg-[#1e1e1e]">
        <p className="text-xs text-gray-500">
          当前：第 {currentSection} 节
        </p>
      </div>
    </div>
  );
};

export default Mcanvas;