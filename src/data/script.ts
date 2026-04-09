// 瀑布流教学演示系统 - 剧本数据 v4.0
// 核心理解：正/负问题空间是消息的特殊类型，嵌入在对话流中

// ============================================
// 类型定义
// ============================================

/**
 * 消息类型 - v4.0标准
 * 正/负问题空间是消息的特殊渲染形式，不是独立模块
 */
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  type?: 'normal' | 'positive-question' | 'negative-question';
  questionData?: {
    title: string;        // 问题标题
    content: string;      // 详细内容
    codeSnippet?: string; // 代码示例（负问题）
    hint?: string;        // 引导提示
    isCollapsed?: boolean; // 是否折叠
  };
}

/**
 * Mcanvas章节节点 - 显示学习进度
 */
export interface SectionNode {
  id: string;
  title: string;           // 章节标题
  description: string;     // 章节描述
  isCompleted: boolean;    // 是否已完成
  isActive: boolean;       // 是否进行中
  order: number;           // 顺序
}

/**
 * Scanvas节点定义
 */
export interface ScanvasNode {
  id: string;
  label: string;
  type: 'input' | 'process' | 'output' | 'storage';
  position: { x: number; y: number };
  description?: string;
}

/**
 * Scanvas期望连线
 */
export interface ExpectedConnection {
  source: string;
  target: string;
  description: string;
}

/**
 * 剧本步骤 - 5幕结构
 */
export interface ScriptAct {
  id: string;
  actNumber: number;       // 幕号 1-5
  title: string;
  description: string;
  mode?: 'positive' | 'negative' | 'discussion'; // 向后兼容
  messages: Message[];     // 该幕的对话消息
  expectedConnections?: ExpectedConnection[]; // 期望的连线
  scanvasNodes?: ScanvasNode[]; // Scanvas节点配置
  knowledgeNodes?: KnowledgeNode[]; // 向后兼容：知识节点
  dialogMessages?: Message[]; // 向后兼容：消息列表
}

// ============================================
// 向后兼容的类型别名（用于现有组件）
// ============================================

/** @deprecated 使用 Message 替代 */
export type DialogMessage = Message;

/** @deprecated 使用 SectionNode 替代 */
export interface KnowledgeNode {
  id: string;
  label: string;
  category: 'concept' | 'component' | 'process' | 'skill';
  isNew?: boolean;
  isCompleted?: boolean;
}

/** @deprecated 使用 ScriptAct 替代 */
export type ScriptStep = ScriptAct;

/** @deprecated 使用 Message['questionData'] 替代 */
export type QuestionData = Message['questionData'];

// ============================================
// 第1幕：系统欢迎消息
// ============================================

const act1Welcome: ScriptAct = {
  id: 'act-1-welcome',
  actNumber: 1,
  title: '📚 第一幕：系统介绍',
  description: '欢迎来到 IoT 视觉识别系统教学！',
  mode: 'discussion',
  messages: [
    {
      role: 'assistant',
      content: '欢迎使用ESP教学系统！本节将介绍IoT视觉识别系统的核心概念。\n\n本系统通过摄像头采集图像，经ESP32暂存后上传云端进行AI推理，最后在显示终端展示识别结果。',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '💡 提示：请在下方Scanvas中观察系统组件，准备开始连接数据流。',
      type: 'normal'
    }
  ],
  dialogMessages: [
    {
      role: 'assistant',
      content: '欢迎使用ESP教学系统！本节将介绍IoT视觉识别系统的核心概念。\n\n本系统通过摄像头采集图像，经ESP32暂存后上传云端进行AI推理，最后在显示终端展示识别结果。',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '💡 提示：请在下方Scanvas中观察系统组件，准备开始连接数据流。',
      type: 'normal'
    }
  ],
  expectedConnections: [
    { source: 'camera', target: 'esp32', description: '摄像头 → ESP32：图像数据传输' },
    { source: 'esp32', target: 'cloud', description: 'ESP32 → 云端：预处理后数据上传' },
    { source: 'cloud', target: 'display', description: '云端 → 显示：识别结果下发' }
  ],
  scanvasNodes: [
    { id: 'camera', label: '📷 摄像头', type: 'input', position: { x: 100, y: 100 }, description: '图像采集设备' },
    { id: 'esp32', label: '🔧 ESP32', type: 'process', position: { x: 300, y: 100 }, description: '边缘计算节点' },
    { id: 'cloud', label: '☁️ 云端', type: 'process', position: { x: 500, y: 100 }, description: 'AI推理服务器' },
    { id: 'display', label: '📱 显示', type: 'output', position: { x: 700, y: 100 }, description: '结果展示终端' }
  ],
  knowledgeNodes: [
    { id: 'iot-concept', label: 'IoT 物联网', category: 'concept', isNew: true },
    { id: 'edge-computing', label: '边缘计算', category: 'concept', isNew: true },
    { id: 'camera', label: '📷 摄像头', category: 'component', isNew: true },
    { id: 'esp32', label: '🔧 ESP32', category: 'component', isNew: true }
  ]
};

// ============================================
// 第2幕：正问题空间（用户问"为什么"触发）
// ============================================

const act2PositiveQuestion: ScriptAct = {
  id: 'act-2-positive',
  actNumber: 2,
  title: '✅ 第二幕：正问题空间',
  description: '学生提问触发正问题空间展开',
  mode: 'positive',
  messages: [
    {
      role: 'user',
      content: '为什么需要ESP32暂存器，不能直接传到云端吗？',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '',
      type: 'positive-question',
      questionData: {
        title: '为什么需要本地暂存？',
        content: '好问题！原因有三：\n\n1️⃣ **网络不稳定时数据会丢失**\n   如果直接传云端，网络中断时图像就丢失了\n\n2️⃣ **批量上传更省流量成本**\n   ESP32可以缓存多帧后批量上传，减少请求次数\n\n3️⃣ **ESP32可做预处理过滤无效帧**\n   本地预处理可以减少云端计算压力',
        hint: '思考：想想快递站的作用——如果快递不经过站点直接送，收件人不在家怎么办？',
        isCollapsed: false
      }
    },
    {
      role: 'user',
      content: '明白了',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '很好！你已经理解了ESP32缓存的价值。接下来请在Scanvas中尝试连接数据流，建立正确的处理流程。',
      type: 'normal'
    }
  ],
  dialogMessages: [
    {
      role: 'user',
      content: '为什么需要ESP32暂存器，不能直接传到云端吗？',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '',
      type: 'positive-question',
      questionData: {
        title: '为什么需要本地暂存？',
        content: '好问题！原因有三：\n\n1️⃣ **网络不稳定时数据会丢失**\n   如果直接传云端，网络中断时图像就丢失了\n\n2️⃣ **批量上传更省流量成本**\n   ESP32可以缓存多帧后批量上传，减少请求次数\n\n3️⃣ **ESP32可做预处理过滤无效帧**\n   本地预处理可以减少云端计算压力',
        hint: '思考：想想快递站的作用——如果快递不经过站点直接送，收件人不在家怎么办？',
        isCollapsed: false
      }
    },
    {
      role: 'user',
      content: '明白了',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '很好！你已经理解了ESP32缓存的价值。接下来请在Scanvas中尝试连接数据流，建立正确的处理流程。',
      type: 'normal'
    }
  ],
  knowledgeNodes: [
    { id: 'bandwidth-optimization', label: '带宽优化', category: 'process', isNew: true },
    { id: 'latency-reduction', label: '延迟降低', category: 'process', isNew: true },
    { id: 'data-reliability', label: '数据可靠性', category: 'concept', isNew: true }
  ]
};

// ============================================
// 第3幕：负问题空间（错误连线触发）
// ============================================

const act3NegativeQuestion: ScriptAct = {
  id: 'act-3-negative',
  actNumber: 3,
  title: '❌ 第三幕：负问题空间',
  description: '学生连错线触发负问题空间展开',
  mode: 'negative',
  messages: [
    {
      role: 'user',
      content: '（尝试连线：摄像头 → 云端 → ESP32 → 显示）',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '',
      type: 'negative-question',
      questionData: {
        title: '💥 数据流顺序错误！',
        content: '你发现了一个关键问题：\n摄像头 → 云端 → ESP32 的顺序是错误的！\n\n📋 **错误场景模拟：**\n如果跳过ESP32直接上传，网络中断时数据会丢失！',
        codeSnippet: `// ❌ 错误示例：跳过 ESP32
camera.connect(cloud);  // 危险！无本地缓存

// ✅ 正确做法
camera.connect(esp32);  // 先本地缓存
esp32.connect(cloud);   // 再上传云端`,
        hint: '请检查：1) 数据流向是否正确？2) 是否遗漏了 ESP32 预处理？3) 连接顺序是否符合逻辑？',
        isCollapsed: false
      }
    }
  ],
  dialogMessages: [
    {
      role: 'user',
      content: '（尝试连线：摄像头 → 云端 → ESP32 → 显示）',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '',
      type: 'negative-question',
      questionData: {
        title: '💥 数据流顺序错误！',
        content: '你发现了一个关键问题：\n摄像头 → 云端 → ESP32 的顺序是错误的！\n\n📋 **错误场景模拟：**\n如果跳过ESP32直接上传，网络中断时数据会丢失！',
        codeSnippet: `// ❌ 错误示例：跳过 ESP32
camera.connect(cloud);  // 危险！无本地缓存

// ✅ 正确做法
camera.connect(esp32);  // 先本地缓存
esp32.connect(cloud);   // 再上传云端`,
        hint: '请检查：1) 数据流向是否正确？2) 是否遗漏了 ESP32 预处理？3) 连接顺序是否符合逻辑？',
        isCollapsed: false
      }
    }
  ],
  knowledgeNodes: [
    { id: 'error-handling', label: '错误处理', category: 'skill', isNew: true },
    { id: 'data-flow', label: '数据流设计', category: 'process', isNew: true }
  ]
};

// ============================================
// 第4幕：成功反馈（正确连线）
// ============================================

const act4Success: ScriptAct = {
  id: 'act-4-success',
  actNumber: 4,
  title: '🔧 第四幕：修正成功',
  description: '学生修正连线，系统给予成功反馈',
  mode: 'discussion',
  messages: [
    {
      role: 'user',
      content: '（修正连线：摄像头 → ESP32 → 云端 → 显示）',
      type: 'normal'
    },
    {
      role: 'system',
      content: '✅ 连线正确！数据流：摄像头 → ESP32 → 云端 → 显示',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '完美！你已经建立了正确的数据流。\nESP32作为边缘缓存节点，确保了数据可靠性。',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '🎉 第1节完成！进入第2节：图像预处理...',
      type: 'normal'
    }
  ],
  dialogMessages: [
    {
      role: 'user',
      content: '（修正连线：摄像头 → ESP32 → 云端 → 显示）',
      type: 'normal'
    },
    {
      role: 'system',
      content: '✅ 连线正确！数据流：摄像头 → ESP32 → 云端 → 显示',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '完美！你已经建立了正确的数据流。\nESP32作为边缘缓存节点，确保了数据可靠性。',
      type: 'normal'
    },
    {
      role: 'assistant',
      content: '🎉 第1节完成！进入第2节：图像预处理...',
      type: 'normal'
    }
  ],
  knowledgeNodes: [
    { id: 'section1-complete', label: '✅ 第1节：数据流设计', category: 'skill', isNew: true, isCompleted: true },
    { id: 'section2-start', label: '📚 第2节：图像预处理', category: 'process', isNew: true }
  ]
};

// ============================================
// 第5幕：进入下一节
// ============================================

const act5NextSection: ScriptAct = {
  id: 'act-5-next',
  actNumber: 5,
  title: '📚 第五幕：进入下一节',
  description: 'Mcanvas更新进度，进入下一节学习',
  mode: 'discussion',
  messages: [
    {
      role: 'assistant',
      content: '📚 **第2节：图像预处理**\n\nESP32如何压缩图像以减少传输带宽？\n\n本节课将学习：\n• 图像灰度化\n• 分辨率压缩\n• 批量上传策略\n\n💡 提示：观察Scanvas中的新节点，学习预处理流程。',
      type: 'normal'
    }
  ],
  dialogMessages: [
    {
      role: 'assistant',
      content: '📚 **第2节：图像预处理**\n\nESP32如何压缩图像以减少传输带宽？\n\n本节课将学习：\n• 图像灰度化\n• 分辨率压缩\n• 批量上传策略\n\n💡 提示：观察Scanvas中的新节点，学习预处理流程。',
      type: 'normal'
    }
  ],
  knowledgeNodes: [
    { id: 'image-preprocessing', label: '图像预处理', category: 'process', isNew: true },
    { id: 'grayscale', label: '灰度化', category: 'process', isNew: true },
    { id: 'compression', label: '压缩算法', category: 'skill', isNew: true },
    { id: 'batch-upload', label: '批量上传', category: 'process', isNew: true }
  ]
};

// ============================================
// 导出剧本数据
// ============================================

export const script: ScriptAct[] = [
  act1Welcome,
  act2PositiveQuestion,
  act3NegativeQuestion,
  act4Success,
  act5NextSection
];

// ============================================
// Mcanvas章节配置（4节课）
// ============================================

export const sectionNodes: SectionNode[] = [
  {
    id: 'section-1',
    title: '第1节：数据流设计',
    description: 'IoT视觉识别系统的数据流向',
    isCompleted: false,
    isActive: true,
    order: 1
  },
  {
    id: 'section-2',
    title: '第2节：图像预处理',
    description: 'ESP32图像压缩与缓存策略',
    isCompleted: false,
    isActive: false,
    order: 2
  },
  {
    id: 'section-3',
    title: '第3节：AI推理',
    description: '云端AI模型推理流程',
    isCompleted: false,
    isActive: false,
    order: 3
  },
  {
    id: 'section-4',
    title: '第4节：结果展示',
    description: '识别结果展示与存储',
    isCompleted: false,
    isActive: false,
    order: 4
  }
];

// ============================================
// 辅助函数
// ============================================

/**
 * 根据幕号获取剧本
 */
export const getActByNumber = (actNumber: number): ScriptAct | undefined => {
  return script.find(act => act.actNumber === actNumber);
};

/**
 * 根据ID获取剧本
 */
export const getActById = (id: string): ScriptAct | undefined => {
  return script.find(act => act.id === id);
};

/**
 * 验证连线是否正确
 * @param source 源节点ID
 * @param target 目标节点ID
 * @param actNumber 当前幕号
 * @returns 验证结果
 */
export const validateConnection = (
  source: string,
  target: string,
  actNumber: number
): { isValid: boolean; message: string } => {
  const act = getActByNumber(actNumber);
  if (!act || !act.expectedConnections) {
    return { isValid: true, message: '✓ 连线已建立' };
  }

  const isExpected = act.expectedConnections.some(
    conn => conn.source === source && conn.target === target
  );

  if (isExpected) {
    return { isValid: true, message: '✅ 连线正确！' };
  }

  // 检查是否是反向连接
  const isReverse = act.expectedConnections.some(
    conn => conn.source === target && conn.target === source
  );

  if (isReverse) {
    return { isValid: false, message: '❌ 方向错误！数据流方向反了。' };
  }

  // 检查是否跳过必要节点
  if (source === 'camera' && target === 'cloud') {
    return { isValid: false, message: '❌ 跳过 ESP32！边缘预处理不能省略。' };
  }

  if (source === 'esp32' && target === 'display') {
    return { isValid: false, message: '❌ 跳过云端AI！需要先进行AI推理。' };
  }

  return { isValid: false, message: '❌ 连接不合理，请检查数据流逻辑。' };
};

/**
 * 检测是否触发正问题空间
 * 关键词：为什么、什么是、如何、怎么、请解释等
 */
export const isPositiveQuestionTrigger = (content: string): boolean => {
  const keywords = ['为什么', '什么是', '如何', '怎么', '请解释', '请说明', '原理', '机制', '作用', '优势', '好处', '原因'];
  return keywords.some(keyword => content.includes(keyword));
};

/**
 * 获取正问题空间的回复消息
 */
export const getPositiveQuestionMessage = (): Message => {
  return act2PositiveQuestion.messages.find(m => m.type === 'positive-question') || {
    role: 'assistant',
    content: '这是一个很好的问题！让我来详细解释一下...',
    type: 'positive-question'
  };
};

/**
 * 获取负问题空间的回复消息
 * @param errorMessage 错误信息
 */
export const getNegativeQuestionMessage = (errorMessage: string): Message => {
  const baseMessage = act3NegativeQuestion.messages.find(m => m.type === 'negative-question');
  return {
    role: 'assistant',
    content: '',
    type: 'negative-question',
    questionData: {
      title: '💥 数据流顺序错误！',
      content: errorMessage + '\n\n请检查数据流逻辑，确保按照正确顺序连接组件。',
      codeSnippet: baseMessage?.questionData?.codeSnippet,
      hint: '正确的顺序是：摄像头 → ESP32 → 云端 → 显示',
      isCollapsed: false
    }
  };
};

/**
 * 获取成功反馈消息
 */
export const getSuccessMessage = (): Message => {
  return {
    role: 'system',
    content: '✅ 连线正确！数据流：摄像头 → ESP32 → 云端 → 显示',
    type: 'normal'
  };
};

// 默认导出
export default script;