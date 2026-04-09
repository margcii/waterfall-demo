import { useState, useCallback, useEffect, useRef } from 'react';
import {
  script,
  ScriptAct,
  Message,
  SectionNode,
  KnowledgeNode,
  sectionNodes as defaultSectionNodes,
  validateConnection,
  isPositiveQuestionTrigger,
  getPositiveQuestionMessage,
  getNegativeQuestionMessage,
  getSuccessMessage
} from '../data/script';

// ============================================
// 类型定义
// ============================================

/** 教学模式类型 */
export type TeachingMode = 'positive' | 'negative' | 'discussion';

/** 连线验证结果 */
export interface ConnectionValidation {
  isValid: boolean;
  message: string;
}

/** Hook 返回类型 */
export interface UseDemoReturn {
  // 教学状态（v4.0新命名）
  currentAct: number;           // 当前幕号（1-5）
  totalActs: number;            // 总幕数
  teachingMode: TeachingMode;   // 当前教学模式
  currentScriptAct: ScriptAct | null; // 当前剧本

  // 向后兼容的别名（v3.0旧命名）
  currentStep: number;          // 同 currentAct
  totalSteps: number;           // 同 totalActs
  currentScriptStep: ScriptAct | null; // 同 currentScriptAct

  // 对话消息
  messages: Message[];          // 消息列表
  sendMessage: (content: string) => void; // 发送消息

  // Mcanvas进度状态
  sectionNodes: SectionNode[];  // 章节进度（v4.0）
  currentSection: number;       // 当前章节（1-4）
  knowledgeNodes: KnowledgeNode[]; // 向后兼容（从当前剧本获取）

  // 连线验证
  lastConnectionValidation: ConnectionValidation | null;

  // 控制方法（v4.0新命名）
  nextAct: () => void;          // 下一幕
  prevAct: () => void;          // 上一幕
  goToAct: (actNumber: number) => void; // 跳转到指定幕

  // 向后兼容的别名（v3.0旧命名）
  nextStep: () => void;         // 同 nextAct
  prevStep: () => void;         // 同 prevAct
  goToStep: (step: number) => void; // 同 goToAct

  resetDemo: () => void;        // 重置演示

  // Scanvas验证回调
  validateScanvasConnection: (source: string, target: string) => ConnectionValidation;
}

// ============================================
// Hook实现
// ============================================

export const useDemo = (): UseDemoReturn => {
  // ----------------------------------------
  // 状态定义
  // ----------------------------------------

  // 教学状态
  const [currentAct, setCurrentAct] = useState<number>(1);
  const [teachingMode, setTeachingMode] = useState<TeachingMode>('discussion');
  const [currentScriptAct, setCurrentScriptAct] = useState<ScriptAct | null>(script[0]);

  // 对话消息
  const [messages, setMessages] = useState<Message[]>([]);

  // Mcanvas进度状态（第1-4节完成状态）
  const [sectionNodes, setSectionNodes] = useState<SectionNode[]>(defaultSectionNodes);
  const [currentSection, setCurrentSection] = useState<number>(1);

  // 连线验证结果
  const [lastConnectionValidation, setLastConnectionValidation] = useState<ConnectionValidation | null>(null);

  // 用于跟踪已显示的消息索引
  const displayedMessageIndexRef = useRef<number>(-1);
  
  // 用于防止 React StrictMode 导致的重复执行
  const isLoadingRef = useRef<boolean>(false);

  // ----------------------------------------
  // 副作用：自动加载当前幕的消息
  // ----------------------------------------

  useEffect(() => {
    if (currentScriptAct?.messages && currentScriptAct.messages.length > 0) {
      // 防止重复加载
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      
      // 重置消息显示索引
      displayedMessageIndexRef.current = -1;

      // 清空之前的消息
      setMessages([]);

      // 按顺序显示消息（带延迟效果）
      currentScriptAct.messages.forEach((msg, index) => {
        setTimeout(() => {
          const message: Message = {
            role: msg.role,
            content: msg.content,
            type: msg.type || 'normal',
            questionData: msg.questionData
          };
          setMessages(prev => [...prev, message]);
          displayedMessageIndexRef.current = index;
        }, index * 800); // 每条消息延迟800ms
      });
      
      // 3秒后重置加载标志，允许下一次切换
      setTimeout(() => {
        isLoadingRef.current = false;
      }, currentScriptAct.messages.length * 800 + 500);
    }

    // 更新教学模式
    if (currentScriptAct?.mode) {
      setTeachingMode(currentScriptAct.mode);
    }
  }, [currentScriptAct]);

  // ----------------------------------------
  // 方法：发送消息（用户输入）
  // ----------------------------------------

  const sendMessage = useCallback((content: string) => {
    // 检测是否触发正问题空间（关键词："为什么/什么是"等）
    const isPositiveQuestion = isPositiveQuestionTrigger(content);

    if (isPositiveQuestion) {
      // 正问题空间：用户问题 + AI回复作为一个组合
      // 1. 先添加用户的问题（作为正问题空间的一部分）
      const userQuestionMessage: Message = {
        role: 'user',
        content,
        type: 'positive-question',
        questionData: {
          title: content,
          content: '', // 用户问题本身不需要额外内容
          isCollapsed: false
        }
      };
      setMessages(prev => [...prev, userQuestionMessage]);

      // 2. 然后添加AI的详细回复
      setTimeout(() => {
        const assistantMessage = getPositiveQuestionMessage();
        setMessages(prev => [...prev, assistantMessage]);
      }, 500);
    } else {
      // 普通消息流程
      // 添加用户消息
      const userMessage: Message = {
        role: 'user',
        content,
        type: 'normal'
      };
      setMessages(prev => [...prev, userMessage]);

      // 模拟 AI 回复
      setTimeout(() => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: `收到您的问题："${content}"。\n\n${currentScriptAct?.description || '继续学习IoT视觉识别系统吧！'}`,
          type: 'normal'
        };
        setMessages(prev => [...prev, assistantMessage]);
      }, 500);
    }
  }, [currentScriptAct]);

  // ----------------------------------------
  // 方法：更新到指定幕
  // ----------------------------------------

  const updateToAct = useCallback((actNumber: number) => {
    if (actNumber < 1 || actNumber > script.length) return;

    const actData = script[actNumber - 1]; // 转换为0-based索引

    // 更新教学状态
    setCurrentAct(actNumber);
    setTeachingMode(actData.mode || 'discussion');
    setCurrentScriptAct(actData);

    // 清除连线验证结果
    setLastConnectionValidation(null);

    // 更新章节进度（根据幕号）
    if (actNumber >= 4) {
      // 第4幕完成第1节
      setSectionNodes(prev => prev.map((node, idx) => ({
        ...node,
        isCompleted: idx === 0 ? true : node.isCompleted,
        isActive: idx === 1 ? true : false
      })));
      setCurrentSection(2);
    }
  }, []);

  // ----------------------------------------
  // 方法：导航控制
  // ----------------------------------------

  // 下一幕
  const nextAct = useCallback(() => {
    if (currentAct < script.length) {
      updateToAct(currentAct + 1);
    }
  }, [currentAct, updateToAct]);

  // 上一幕
  const prevAct = useCallback(() => {
    if (currentAct > 1) {
      updateToAct(currentAct - 1);
    }
  }, [currentAct, updateToAct]);

  // 跳转到指定幕
  const goToAct = useCallback((actNumber: number) => {
    if (actNumber >= 1 && actNumber <= script.length) {
      updateToAct(actNumber);
    }
  }, [updateToAct]);

  // 重置演示
  const resetDemo = useCallback(() => {
    setMessages([]);
    setLastConnectionValidation(null);
    setSectionNodes(defaultSectionNodes);
    setCurrentSection(1);
    updateToAct(1);
  }, [updateToAct]);

  // ----------------------------------------
  // 方法：Scanvas连线验证
  // ----------------------------------------

  const validateScanvasConnection = useCallback((source: string, target: string): ConnectionValidation => {
    const validation = validateConnection(source, target, currentAct);
    setLastConnectionValidation(validation);

    // 根据验证结果添加系统消息
    if (!validation.isValid) {
      // 验证失败，触发负问题空间
      // 1. 先添加用户的错误操作（作为负问题空间的一部分）
      const userErrorMessage: Message = {
        role: 'user',
        content: `连线: ${source} → ${target}`,
        type: 'negative-question',
        questionData: {
          title: '数据流顺序错误',
          content: '',
          isCollapsed: false
        }
      };
      setMessages(prev => [...prev, userErrorMessage]);

      // 2. 然后添加AI的负问题回复
      setTimeout(() => {
        const negativeMessage = getNegativeQuestionMessage(validation.message);
        setMessages(prev => [...prev, negativeMessage]);
      }, 300);
    } else {
      // 验证成功，添加成功消息并更新进度
      // 1. 先添加用户的正确操作
      const userSuccessMessage: Message = {
        role: 'user',
        content: `连线: ${source} → ${target}`,
        type: 'normal'
      };
      setMessages(prev => [...prev, userSuccessMessage]);

      // 2. 然后添加AI的成功回复
      setTimeout(() => {
        const successMessage = getSuccessMessage();
        setMessages(prev => [...prev, successMessage]);

        // 更新章节完成状态
        if (currentAct === 1 || currentAct === 2) {
          // 完成第1节
          setSectionNodes(prev => prev.map((node, idx) => ({
            ...node,
            isCompleted: idx === 0 ? true : node.isCompleted,
            isActive: idx === 1 ? true : node.isActive
          })));
        }
      }, 300);
    }

    return validation;
  }, [currentAct]);

  // ----------------------------------------
  // 计算属性：向后兼容
  // ----------------------------------------

  // 从当前剧本获取知识节点（向后兼容）
  const knowledgeNodes: KnowledgeNode[] = currentScriptAct?.knowledgeNodes || [];

  // ----------------------------------------
  // 返回
  // ----------------------------------------

  return {
    // 教学状态（v4.0新命名）
    currentAct,
    totalActs: script.length,
    teachingMode,
    currentScriptAct,

    // 向后兼容的别名（v3.0旧命名）
    currentStep: currentAct,
    totalSteps: script.length,
    currentScriptStep: currentScriptAct,

    // 对话消息
    messages,
    sendMessage,

    // Mcanvas进度状态
    sectionNodes,
    currentSection,
    knowledgeNodes,

    // 连线验证
    lastConnectionValidation,

    // 控制方法（v4.0新命名）
    nextAct,
    prevAct,
    goToAct,

    // 向后兼容的别名（v3.0旧命名）
    nextStep: nextAct,
    prevStep: prevAct,
    goToStep: goToAct,

    resetDemo,

    // Scanvas验证回调
    validateScanvasConnection
  };
};

export default useDemo;