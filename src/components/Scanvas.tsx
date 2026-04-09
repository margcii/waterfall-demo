import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ConnectionValidation } from '../hooks/useDemo';

interface ScanvasProps {
  isInteractive?: boolean;
  onValidateConnection?: (source: string, target: string) => ConnectionValidation;
}

// IoT系统架构的初始节点 - 独立于剧本，始终显示这4个节点
const iotNodes: Node[] = [
  {
    id: 'camera',
    type: 'input',
    position: { x: 50, y: 50 },
    data: { label: '📷 摄像头' },
    style: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '500',
      border: '2px solid #60a5fa',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
      width: 140,
    }
  },
  {
    id: 'esp32',
    type: 'default',
    position: { x: 220, y: 50 },
    data: { label: '🔧 ESP32' },
    style: {
      backgroundColor: '#10b981',
      color: 'white',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '500',
      border: '2px solid #34d399',
      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
      width: 140,
    }
  },
  {
    id: 'cloud',
    type: 'default',
    position: { x: 390, y: 50 },
    data: { label: '☁️ 云端AI' },
    style: {
      backgroundColor: '#8b5cf6',
      color: 'white',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '500',
      border: '2px solid #a78bfa',
      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
      width: 140,
    }
  },
  {
    id: 'display',
    type: 'output',
    position: { x: 560, y: 50 },
    data: { label: '📱 显示终端' },
    style: {
      backgroundColor: '#f59e0b',
      color: 'white',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '500',
      border: '2px solid #fbbf24',
      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
      width: 140,
    }
  }
];

// IoT系统架构的初始连线 - 空，等待学生连线
const iotEdges: Edge[] = [];

const Scanvas: React.FC<ScanvasProps> = ({
  isInteractive = true,
  onValidateConnection,
}) => {
  // Scanvas 独立管理自己的节点和连线状态
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(iotNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(iotEdges);
  
  const [height, setHeight] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // 连线处理 - 带验证
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      
      // 验证连线
      let validation: ConnectionValidation;
      if (onValidateConnection) {
        validation = onValidateConnection(params.source, params.target);
      } else {
        // 默认验证逻辑
        const validOrder = [
          ['camera', 'esp32'],
          ['esp32', 'cloud'],
          ['cloud', 'display']
        ];
        const isValid = validOrder.some(
          ([s, t]) => s === params.source && t === params.target
        );
        validation = {
          isValid,
          message: isValid ? '✅ 连线正确！' : '❌ 连接不合理，请检查数据流逻辑。'
        };
      }
      
      // 添加边，根据验证结果设置样式
      const edgeColor = validation.isValid ? '#10b981' : '#ef4444';
      setEdges((eds) => addEdge({
        ...params,
        type: 'default',
        animated: validation.isValid,
        style: { 
          stroke: edgeColor, 
          strokeWidth: 3,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 20,
          height: 20,
        },
        label: validation.message,
        labelStyle: { 
          fill: edgeColor,
          fontWeight: 600,
          fontSize: 12
        },
        labelBgStyle: { 
          fill: '#1a1a1a', 
          fillOpacity: 0.9 
        },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
      }, eds));
      
      // 如果验证成功，高亮相关节点
      if (validation.isValid) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === params.source || node.id === params.target) {
              return {
                ...node,
                style: {
                  ...node.style,
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
                  borderWidth: '3px',
                  borderColor: '#10b981',
                },
              };
            }
            return node;
          })
        );
        
        // 1秒后移除高亮
        setTimeout(() => {
          setNodes((nds) =>
            nds.map((node) => ({
              ...node,
              style: {
                ...node.style,
                boxShadow: node.style?.boxShadow?.toString().includes('rgba(59, 130, 246') 
                  ? '0 2px 8px rgba(59, 130, 246, 0.3)'
                  : node.style?.boxShadow?.toString().includes('rgba(16, 185, 129')
                    ? '0 2px 8px rgba(16, 185, 129, 0.3)'
                    : node.style?.boxShadow?.toString().includes('rgba(139, 92, 246')
                      ? '0 2px 8px rgba(139, 92, 246, 0.3)'
                      : '0 2px 8px rgba(245, 158, 11, 0.3)',
                borderWidth: '2px',
                borderColor: node.id === 'camera' ? '#60a5fa' 
                  : node.id === 'esp32' ? '#34d399'
                  : node.id === 'cloud' ? '#a78bfa'
                  : '#fbbf24',
              },
            }))
          );
        }, 1000);
      }
    },
    [onValidateConnection, setEdges, setNodes]
  );

  // 处理鼠标按下事件（开始拖动调整大小）
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  // 处理鼠标移动和释放事件
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaY = e.clientY - startYRef.current;
      const newHeight = Math.max(180, Math.min(500, startHeightRef.current + deltaY));
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        height: '100%',
        backgroundColor: '#1e1e1e', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        border: '1px solid #333' 
      }}
    >
      {/* 可拖动调节大小的上边框 */}
      <div 
        style={{
          height: '20px',
          backgroundColor: '#252525',
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'row-resize',
          transition: 'background-color 0.2s',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
        title="拖动调节高度"
      >
        <div style={{ flex: 1, height: '2px', backgroundColor: '#444', margin: '0 10px', maxWidth: '60px' }} />
        <div style={{ color: '#666', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>⋮⋮</div>
        <div style={{ flex: 1, height: '2px', backgroundColor: '#444', margin: '0 10px', maxWidth: '60px' }} />
      </div>

      {/* Scanvas 标题栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#252525',
        borderBottom: '1px solid #333',
      }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#e0e0e0' }}>🎨 Scanvas - IoT系统架构图</span>
        <span style={{ fontSize: '11px', color: '#888' }}>
          {isInteractive ? '💡 拖拽连接节点：摄像头 → ESP32 → 云端 → 显示' : '👁️ 预览模式'}
        </span>
      </div>

      {/* Scanvas 内容 */}
      <div style={{ flex: 1, minHeight: '150px', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-left"
          connectionMode={ConnectionMode.Loose}
          nodesDraggable={isInteractive}
          nodesConnectable={isInteractive}
          elementsSelectable={isInteractive}
          zoomOnDoubleClick={isInteractive}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnScroll={true}
          panOnDrag={true}
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={12} 
            size={1} 
            color="#334155" 
          />
          <Controls position="bottom-left" showInteractive={false} />
          <MiniMap
            position="bottom-right"
            style={{
              backgroundColor: '#1e293b',
              width: 100,
              height: 80,
              border: '1px solid #334155',
              borderRadius: '6px',
            }}
            nodeColor={(node) => {
              if (node.id === 'camera') return '#3b82f6';
              if (node.id === 'esp32') return '#10b981';
              if (node.id === 'cloud') return '#8b5cf6';
              if (node.id === 'display') return '#f59e0b';
              return '#64748b';
            }}
          />
        </ReactFlow>
      </div>

      {/* 状态栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 16px',
        backgroundColor: '#252525',
        borderTop: '1px solid #333',
        fontSize: '11px',
        color: '#888',
      }}>
        <span style={{ fontWeight: '500' }}>
          节点: {nodes.length} | 连线: {edges.length}
        </span>
        {isInteractive && (
          <span style={{ fontStyle: 'italic' }}>
            按 Delete 删除选中元素
          </span>
        )}
      </div>
    </div>
  );
};

export default Scanvas;