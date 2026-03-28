import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Save, 
  Maximize2,
  MousePointer2,
  Move,
  Trash2,
  X,
  GripVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NODE_TYPES } from '../../constants/workflows.js';

/* ────────────────────────────────────────────────────────────────────────────
 * Helper: generate unique IDs
 * ──────────────────────────────────────────────────────────────────────────── */
let _idCounter = Date.now();
const uid = (prefix = 'id') => `${prefix}_${_idCounter++}`;

/* ────────────────────────────────────────────────────────────────────────────
 * Sub-component: Node Palette (left sidebar)
 * ──────────────────────────────────────────────────────────────────────────── */
function NodePalette({ onAddNode, collapsed, onToggle }) {
  return (
    <div className={`absolute top-0 left-0 z-[120] h-full flex transition-all duration-500 ${collapsed ? 'w-12' : 'w-64'}`}>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-[130] w-8 h-8 rounded-full bg-surface-raised border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-primary/50 transition-all shadow-lg"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`h-full bg-[#08080d]/95 backdrop-blur-xl border-r border-white/5 flex flex-col overflow-hidden transition-all duration-500 ${collapsed ? 'w-12' : 'w-64'}`}>
        {/* Header */}
        {!collapsed && (
          <div className="px-5 pt-6 pb-4 border-b border-white/5">
            <p className="text-[10px] font-tech text-text-secondary uppercase tracking-[0.2em] mb-1">Toolbox</p>
            <p className="text-[9px] text-text-secondary/60">Click to add a node</p>
          </div>
        )}

        {/* Node list */}
        <div className={`flex-1 overflow-y-auto py-3 space-y-1 ${collapsed ? 'px-1.5' : 'px-3'}`}>
          {Object.entries(NODE_TYPES).map(([type, info]) => {
            const Icon = info.icon;
            return (
              <button
                key={type}
                onClick={() => onAddNode(type)}
                className={`w-full flex items-center gap-3 rounded-xl transition-all duration-200 
                  hover:bg-white/[0.06] active:scale-[0.97] group border border-transparent hover:border-white/10
                  ${collapsed ? 'p-2 justify-center' : 'p-3'}`}
                title={info.label}
              >
                <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                  bg-${info.color}/10 text-${info.color} group-hover:bg-${info.color}/20`}>
                  <Icon size={18} />
                </div>
                {!collapsed && (
                  <div className="text-left min-w-0">
                    <p className="text-xs font-tech font-bold text-white/80 group-hover:text-white truncate">{info.label}</p>
                    <p className="text-[9px] text-text-secondary truncate leading-tight mt-0.5">{info.description}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  )
}
/* ────────────────────────────────────────────────────────────────────────────
 * Main Canvas Component
 * ──────────────────────────────────────────────────────────────────────────── */
const WorkflowCanvas = ({ workflow, onSave, onChange }) => {
  const [nodes, setNodes] = useState(workflow?.nodes || []);
  const [edges, setEdges] = useState(workflow?.edges || []);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Edge-drawing state
  const [connectingFrom, setConnectingFrom] = useState(null); // { nodeId, side: 'right' }
  const [tempEdgeEnd, setTempEdgeEnd] = useState(null);       // { x, y } — mouse position in canvas space

  const canvasRef = useRef(null);
  const NODE_WIDTH = 280;
  const NODE_HEIGHT = 200;

  // ── Sync back to parent ──
  useEffect(() => {
    if (onChange) onChange({ nodes, edges });
  }, [nodes, edges]);

  // ── Keyboard shortcut: Delete/Backspace removes selected ──
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        // Don't delete if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        handleDeleteNode(selectedNodeId);
      }
      if (e.key === 'Escape') {
        setSelectedNodeId(null);
        cancelConnection();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedNodeId]);

  // ── Add node from palette ──
  const handleAddNode = useCallback((type) => {
    const typeInfo = NODE_TYPES[type];
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    // Place near center of visible canvas
    const centerX = canvasRect ? (canvasRect.width / 2 - transform.x) / transform.scale - NODE_WIDTH / 2 : 200;
    const centerY = canvasRect ? (canvasRect.height / 2 - transform.y) / transform.scale - NODE_HEIGHT / 2 : 200;
    // Offset slightly based on existing node count so they don't stack
    const offset = nodes.length * 30;

    const newNode = {
      nodeId: uid('node'),
      type,
      label: typeInfo.label,
      positionX: centerX + offset,
      positionY: centerY + offset,
      config: { ...(typeInfo.defaultConfig || {}) },
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.nodeId);
  }, [nodes.length, transform]);

  // ── Delete node ──
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(n => n.nodeId !== nodeId));
    setEdges(prev => prev.filter(e => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }, [selectedNodeId]);

  // ── Update node (from properties panel) ──
  const handleUpdateNode = useCallback((updatedNode) => {
    setNodes(prev => prev.map(n => n.nodeId === updatedNode.nodeId ? updatedNode : n));
  }, []);

  // ── Connection drawing ──
  const startConnection = (nodeId, side) => {
    setConnectingFrom({ nodeId, side });
  };

  const cancelConnection = () => {
    setConnectingFrom(null);
    setTempEdgeEnd(null);
  };

  const finishConnection = (targetNodeId, targetSide) => {
    if (!connectingFrom) return;
    if (connectingFrom.nodeId === targetNodeId) { cancelConnection(); return; }
    // Don't allow duplicate edges
    const duplicate = edges.some(e =>
      (e.sourceNodeId === connectingFrom.nodeId && e.targetNodeId === targetNodeId) ||
      (e.sourceNodeId === targetNodeId && e.targetNodeId === connectingFrom.nodeId)
    );
    if (duplicate) { cancelConnection(); return; }

    const sourceId = connectingFrom.side === 'right' ? connectingFrom.nodeId : targetNodeId;
    const targetId = connectingFrom.side === 'right' ? targetNodeId : connectingFrom.nodeId;

    const newEdge = { edgeId: uid('edge'), sourceNodeId: sourceId, targetNodeId: targetId };
    setEdges(prev => [...prev, newEdge]);
    cancelConnection();
  };

  // ── Delete edge ──
  const handleDeleteEdge = (edgeId) => {
    setEdges(prev => prev.filter(e => e.edgeId !== edgeId));
  };

  // ── Canvas-level mouse tracking (for temp edge + panning) ──
  const handleCanvasMouseMove = (e) => {
    if (!connectingFrom) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setTempEdgeEnd({
      x: (e.clientX - rect.left - transform.x) / transform.scale,
      y: (e.clientY - rect.top - transform.y) / transform.scale,
    });
  };

  const handleCanvasMouseUp = () => {
    if (connectingFrom) cancelConnection();
  };

  // ── Zoom ──
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = 0.05;
    const delta = e.deltaY > 0 ? -scaleFactor : scaleFactor;
    const newScale = Math.min(Math.max(transform.scale + delta, 0.3), 2.5);
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  // ── Pan (drag canvas background) ──
  const handleCanvasMouseDown = (e) => {
    // Only pan when clicking on canvas bg (not nodes/connectors)
    if (e.target.closest('.node-element') || e.target.closest('.connector-dot')) return;
    if (connectingFrom) return; // don't pan while connecting

    // Deselect node when clicking background
    setSelectedNodeId(null);

    const startX = e.clientX - transform.x;
    const startY = e.clientY - transform.y;

    const onMove = (moveEvent) => {
      setTransform(prev => ({ ...prev, x: moveEvent.clientX - startX, y: moveEvent.clientY - startY }));
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── Drag node ──
  const handleNodeDragStart = (nodeId, e) => {
    e.stopPropagation();
    if (connectingFrom) return; // don't drag while connecting
    const node = nodes.find(n => n.nodeId === nodeId);
    const startX = e.clientX - node.positionX * transform.scale;
    const startY = e.clientY - node.positionY * transform.scale;

    const onMove = (moveEvent) => {
      const newX = (moveEvent.clientX - startX) / transform.scale;
      const newY = (moveEvent.clientY - startY) / transform.scale;
      setNodes(prev => prev.map(n => n.nodeId === nodeId ? { ...n, positionX: newX, positionY: newY } : n));
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── Helpers for edge geometry ──
  const getConnectorPos = (node, side) => {
    if (side === 'left')  return { x: node.positionX, y: node.positionY + NODE_HEIGHT / 2 };
    if (side === 'right') return { x: node.positionX + NODE_WIDTH, y: node.positionY + NODE_HEIGHT / 2 };
    return { x: node.positionX + NODE_WIDTH / 2, y: node.positionY + NODE_HEIGHT / 2 };
  };

  const bezier = (x1, y1, x2, y2) => {
    const midX = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
  };

  // ── Selected node object ──
  const selectedNode = nodes.find(n => n.nodeId === selectedNodeId) || null;

  // ── Render ──
  return (
    <div 
      ref={canvasRef}
      className={`relative w-full ${isFullScreen ? 'fixed inset-0 z-[200] h-screen' : 'min-h-[600px] h-[calc(100vh-350px)] rounded-[3rem]'} bg-[#050508] border border-white/5 overflow-hidden cursor-crosshair shadow-glass-inner isolate transition-all duration-500`}
      onWheel={handleWheel}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
    >
      {/* ── Grid ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="grid" width={40 * transform.scale} height={40 * transform.scale} patternUnits="userSpaceOnUse">
             <path d={`M ${40 * transform.scale} 0 L 0 0 0 ${40 * transform.scale}`} fill="none" stroke="rgba(157,78,221,0.2)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" transform={`translate(${transform.x % (40 * transform.scale)}, ${transform.y % (40 * transform.scale)})`} />
      </svg>

      {/* ── Edge Layer (SVG) ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6 Z" fill="#9D4EDD" fillOpacity="0.7" />
          </marker>
        </defs>

        {/* Permanent edges */}
        {edges.map(edge => {
          const source = nodes.find(n => n.nodeId === edge.sourceNodeId);
          const target = nodes.find(n => n.nodeId === edge.targetNodeId);
          if (!source || !target) return null;

          const p1 = getConnectorPos(source, 'right');
          const p2 = getConnectorPos(target, 'left');
          const sx = p1.x * transform.scale + transform.x;
          const sy = p1.y * transform.scale + transform.y;
          const tx = p2.x * transform.scale + transform.x;
          const ty = p2.y * transform.scale + transform.y;

          return (
            <g key={edge.edgeId} className="pointer-events-auto cursor-pointer" onClick={() => handleDeleteEdge(edge.edgeId)}>
              {/* Hit area (invisible, wider for easier clicking) */}
              <path d={bezier(sx, sy, tx, ty)} fill="none" stroke="transparent" strokeWidth="16" />
              {/* Shadow */}
              <path d={bezier(sx, sy, tx, ty)} fill="none" stroke="rgba(157,78,221,0.15)" strokeWidth="3" />
              {/* Main line */}
              <path d={bezier(sx, sy, tx, ty)} fill="none" stroke="#9D4EDD" strokeWidth="2" markerEnd="url(#arrowhead)" />
              {/* Animated pulse */}
              <path d={bezier(sx, sy, tx, ty)} fill="none" stroke="rgba(207,255,4,0.5)" strokeWidth="2" filter="url(#glow)" strokeDasharray="8, 52" className="animate-[draw_2s_linear_infinite]" />
              {/* Delete indicator on hover */}
              <circle cx={(sx + tx) / 2} cy={(sy + ty) / 2} r="8" fill="#ff0055" fillOpacity="0" className="hover:fill-opacity-80 transition-all">
                <title>Click to remove connection</title>
              </circle>
              <text x={(sx + tx) / 2} y={(sy + ty) / 2 + 3.5} textAnchor="middle" fill="white" fontSize="9" className="pointer-events-none opacity-0 hover:opacity-100">×</text>
            </g>
          );
        })}

        {/* Temporary edge while connecting */}
        {connectingFrom && tempEdgeEnd && (() => {
          const sourceNode = nodes.find(n => n.nodeId === connectingFrom.nodeId);
          if (!sourceNode) return null;
          const p1 = getConnectorPos(sourceNode, connectingFrom.side);
          const sx = p1.x * transform.scale + transform.x;
          const sy = p1.y * transform.scale + transform.y;
          const tx = tempEdgeEnd.x * transform.scale + transform.x;
          const ty = tempEdgeEnd.y * transform.scale + transform.y;
          return (
            <path d={bezier(sx, sy, tx, ty)} fill="none" stroke="#9D4EDD" strokeWidth="2" strokeDasharray="6, 6" opacity="0.6" />
          );
        })()}
      </svg>

      {/* ── Nodes Layer ── */}
      <div 
        className="absolute inset-0 z-20"
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}
      >
        {nodes.map(node => {
          const typeInfo = NODE_TYPES[node.type] || NODE_TYPES.AgentInference;
          const isSelected = node.nodeId === selectedNodeId;
          return (
            <div 
              key={node.nodeId}
              className={`absolute node-element group active:cursor-grabbing select-none`}
              style={{ left: node.positionX, top: node.positionY, width: NODE_WIDTH }}
              onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.nodeId); }}
            >
              <GlassCard className={`p-4 border transition-all rounded-3xl shadow-2xl backdrop-blur-3xl bg-surface-raised/80
                ${isSelected ? 'border-primary/70 shadow-[0_0_20px_rgba(207,255,4,0.15)]' : 'border-white/10 group-hover:border-white/20'}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 bg-${typeInfo.color}/10 rounded-lg text-${typeInfo.color}`}>
                      <typeInfo.icon size={20} />
                    </div>
                    <span className="text-[10px] font-tech text-white/50 tracking-widest uppercase">{typeInfo.label}</span>
                  </div>
                  {/* Drag handle */}
                  <div 
                    className="p-1 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors"
                    onMouseDown={(e) => handleNodeDragStart(node.nodeId, e)}
                  >
                    <GripVertical size={16} />
                  </div>
                </div>

                <h4 className="text-sm font-tech font-bold text-white mb-2 truncate">{node.label}</h4>

                {/* Config preview badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {Object.entries(node.config || {}).slice(0, 3).map(([key, val]) => (
                    <div key={key} className="px-2 py-0.5 bg-white/5 rounded-md text-[8px] text-text-secondary border border-white/5 truncate max-w-[120px]">
                      {key}: {String(val) || '—'}
                    </div>
                  ))}
                  {Object.keys(node.config || {}).length > 3 && (
                    <div className="px-2 py-0.5 bg-white/5 rounded-md text-[8px] text-text-secondary border border-white/5">
                      +{Object.keys(node.config).length - 3} more
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-[10px] font-tech uppercase text-text-secondary">
                  <span>Type: {node.type}</span>
                  {isSelected && <span className="text-primary glow-text-primary">Selected</span>}
                </div>
              </GlassCard>
              
              {/* ── Left Connector (Input) ── */}
              <div 
                className={`connector-dot absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer z-30
                  ${connectingFrom 
                    ? 'bg-primary/30 border-2 border-primary scale-125 shadow-[0_0_12px_rgba(207,255,4,0.4)]' 
                    : 'bg-surface-raised border border-white/10 hover:bg-primary/30 hover:border-primary/50 hover:scale-110'
                  }`}
                onMouseDown={(e) => { e.stopPropagation(); startConnection(node.nodeId, 'left'); }}
                onMouseUp={(e) => { e.stopPropagation(); finishConnection(node.nodeId, 'left'); }}
              >
                <div className={`w-2 h-2 rounded-full transition-colors ${connectingFrom ? 'bg-primary' : 'bg-white/20'}`} />
              </div>

              {/* ── Right Connector (Output) ── */}
              <div 
                className={`connector-dot absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer z-30
                  ${connectingFrom 
                    ? 'bg-primary/30 border-2 border-primary scale-125 shadow-[0_0_12px_rgba(207,255,4,0.4)]' 
                    : 'bg-surface-raised border border-white/10 hover:bg-primary/30 hover:border-primary/50 hover:scale-110'
                  }`}
                onMouseDown={(e) => { e.stopPropagation(); startConnection(node.nodeId, 'right'); }}
                onMouseUp={(e) => { e.stopPropagation(); finishConnection(node.nodeId, 'right'); }}
              >
                <div className={`w-2 h-2 rounded-full transition-colors ${connectingFrom ? 'bg-primary' : 'bg-white/20'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Node Palette Sidebar ── */}
      <NodePalette onAddNode={handleAddNode} collapsed={paletteCollapsed} onToggle={() => setPaletteCollapsed(p => !p)} />

      {/* ── Properties Panel ── */}
      {selectedNode && (
        <NodePropertiesPanel 
          node={selectedNode} 
          onUpdate={handleUpdateNode} 
          onClose={() => setSelectedNodeId(null)} 
          onDelete={handleDeleteNode}
        />
      )}

      {/* ── Canvas Controls ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] flex gap-2">
        <div className="flex bg-black/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-2xl items-center gap-1">
          <Button variant="ghost" size="sm" className={`rounded-full w-10 h-10 p-0 ${isFullScreen ? 'text-primary' : 'text-white/50'} hover:text-white`} onClick={() => setIsFullScreen(!isFullScreen)}>
            <Maximize2 size={16} />
          </Button>
          <div className="w-[1px] h-6 bg-white/10 mx-0.5" />
          <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 text-white/50 hover:text-white" onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}>
            <MousePointer2 size={16} />
          </Button>
          <div className="w-[1px] h-6 bg-white/10 mx-0.5" />
          <span className="text-[10px] font-tech text-text-secondary tabular-nums px-2">{Math.round(transform.scale * 100)}%</span>
        </div>
        <div className="flex bg-black/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
          <Button variant="primary" size="sm" className="rounded-full px-6 shadow-neon-primary" onClick={onSave}>
            <Save size={16} className="mr-2" /> Save Workflow
          </Button>
        </div>
      </div>

      {/* ── Status/Info Bar ── */}
      <div className="absolute top-5 right-5 z-[100]">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/5 rounded-full px-4 py-2">
          <span className="text-[10px] font-tech text-text-secondary uppercase tracking-widest">{nodes.length} Nodes</span>
          <div className="w-[1px] h-3 bg-white/10" />
          <span className="text-[10px] font-tech text-text-secondary uppercase tracking-widest">{edges.length} Edges</span>
        </div>
      </div>

      {/* ── Connection hint overlay ── */}
      {connectingFrom && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[150]">
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2 backdrop-blur-md animate-pulse">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-tech text-primary uppercase tracking-widest">Drop on a connector to create an edge • Press ESC to cancel</span>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes draw {
          0% { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }
      `}} />
    </div>
  );
};

export default WorkflowCanvas;
