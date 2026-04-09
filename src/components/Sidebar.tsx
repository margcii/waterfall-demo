import React, { useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Connection,
  Background,
  Controls,
  MiniMap,
  NodeProps,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface SidebarProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onConnect: (params: Connection) => void;
  highlightNodeId: string | null;
}

// 自定义节点组件
const CustomNode: React.FC<NodeProps> = ({ data, type, selected }) => {
  const isHighlighted = data.isHighlighted;
  const isError = data.isError;
  
  const getNodeStyle = () => {
    let baseStyle: React.CSSProperties = {
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      border: '2px solid',
      transition: 'all 0.3s ease',
    };
    
    if (isError) {
      return {
        ...baseStyle,
        background: '#fff2f0',
        borderColor: '#ff4d4f',
        color: '#cf1322',
      };
    }
    
    if (isHighlighted) {
      return {
        ...baseStyle,
        background: '#e6f7ff',
        borderColor: '#1890ff',
        color: '#1890ff',
        boxShadow: '0 0 12px rgba(24, 144, 255, 0.4)',
      };
    }
    
    switch (type) {
      case 'start':
        return {
          ...baseStyle,
          background: '#f6ffed',
          borderColor: '#52c41a',
          color: '#389e0d',
          borderRadius: '20px',
        };
      case 'end':
        return {
          ...baseStyle,
          background: '#fff2f0',
          borderColor: '#ff4d4f',
          color: '#cf1322',
          borderRadius: '20px',
        };
      case 'decision':
        return {
          ...baseStyle,
          background: '#fffbe6',
          borderColor: '#faad14',
          color: '#d48806',
          borderRadius: '4px',
          transform: 'rotate(0deg)',
        };
      case 'document':
        return {
          ...baseStyle,
          background: '#f9f0ff',
          borderColor: '#722ed1',
          color: '#531dab',
        };
      case 'error':
        return {
          ...baseStyle,
          background: '#fff2f0',
          borderColor: '#ff4d4f',
          color: '#cf1322',
        };
      default:
        return {
          ...baseStyle,
          background: '#fff',
          borderColor: '#d9d9d9',
          color: '#333',
        };
    }
  };
  
  const style = getNodeStyle();
  
  return (
    <div 
      style={{
        ...style,
        transform: isHighlighted ? `scale(1.05)` : 'scale(1)',
        boxShadow: selected 
          ? '0 0 0 2px #1890ff' 
          : isHighlighted 
            ? '0 0 12px rgba(24, 144, 255, 0.4)' 
            : 'none',
      }}
    >
      {type !== 'start' && type !== 'end' && (
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      )}
      <div>{String(data.label || "")}</div>
      {data.description && (
        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
          {String(data.description)}
        </div>
      )}
      {type !== 'start' && type !== 'end' && (
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      )}
    </div>
  );
};

// 节点类型映射
const nodeTypes = {
  start: CustomNode,
  end: CustomNode,
  process: CustomNode,
  decision: CustomNode,
  document: CustomNode,
  error: CustomNode,
};

/**
 * 侧边栏组件
 * 包含流程图展示
 */
const Sidebar: React.FC<SidebarProps> = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  onConnect,
  highlightNodeId
}) => {
  // 当 highlightNodeId 变化时，更新节点的高亮状态
  const highlightedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        isHighlighted: node.id === highlightNodeId || node.data.isHighlighted,
      },
    }));
  }, [nodes, highlightNodeId]);
  
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h3 className="sidebar__title">流程图</h3>
        <span className="sidebar__hint">当前步骤的流程展示</span>
      </div>
      <div className="sidebar__flow">
        <ReactFlow
          nodes={highlightedNodes}
          edges={edges}
          onNodesChange={(changes) => {
            // 防止用户拖动节点
          }}
          onEdgesChange={(changes) => {
            // 防止用户修改边
          }}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background color="#e0e0e0" gap={16} />
          <Controls showInteractive={false} />
          <MiniMap 
            nodeColor={(node) => {
              if (node.data.isError) return '#ff4d4f';
              if (node.data.isHighlighted) return '#1890ff';
              switch (node.type) {
                case 'start': return '#52c41a';
                case 'end': return '#ff4d4f';
                case 'decision': return '#faad14';
                case 'document': return '#722ed1';
                default: return '#1890ff';
              }
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>
      
      <style>{`
        .sidebar {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .sidebar__header {
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .sidebar__title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        
        .sidebar__hint {
          font-size: 12px;
          color: #999;
        }
        
        .sidebar__flow {
          flex: 1;
          min-height: 300px;
        }
        
        /* ReactFlow 样式覆盖 */
        .react-flow__node {
          cursor: default;
        }
        
        .react-flow__edge-path {
          stroke-width: 2;
        }
        
        .react-flow__controls {
          bottom: 10px;
          left: 10px;
        }
        
        .react-flow__minimap {
          bottom: 10px;
          right: 10px;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;