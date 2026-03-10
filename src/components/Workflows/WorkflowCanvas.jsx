import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  Cpu, 
  Bot, 
  Database, 
  Globe, 
  Mail, 
  MessageSquare, 
  Play, 
  Save, 
  Settings2,
  Maximize2,
  MousePointer2,
  Move,
  Activity
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const NODE_TYPES = {
  AgentInference: { icon: <Bot size={20} />, label: 'AI Inference', color: 'primary' },
  ManagerOrchestration: { icon: <Cpu size={20} />, label: 'Manager Node', color: 'secondary' },
  KnowledgeSearch: { icon: <Database size={20} />, label: 'Data Retrieval', color: 'accent' },
  SendEmail: { icon: <Mail size={20} />, label: 'Email Trigger', color: 'info' },
  SlackNotify: { icon: <MessageSquare size={20} />, label: 'Slack Alert', color: 'success' },
  ScheduledTrigger: { icon: <Zap size={20} />, label: 'Scheduled', color: 'warning' },
};

const WorkflowCanvas = ({ workflow, onSave, onChange }) => {
  const [nodes, setNodes] = useState(workflow?.nodes || []);
  const [edges, setEdges] = useState(workflow?.edges || []);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const canvasRef = useRef(null);

  // Sync with parent whenever nodes or edges change
  useEffect(() => {
    if (onChange) {
      onChange({ nodes, edges });
    }
  }, [nodes, edges]);


  // Zoom & Pan Handlers
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = 0.05;
    const delta = e.deltaY > 0 ? -scaleFactor : scaleFactor;
    const newScale = Math.min(Math.max(transform.scale + delta, 0.5), 2);
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.node-element')) return;
    const startX = e.clientX - transform.x;
    const startY = e.clientY - transform.y;

    const onMouseMove = (moveEvent) => {
      setTransform(prev => ({
        ...prev,
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleNodeDragStart = (nodeId, e) => {
    e.stopPropagation();
    const node = nodes.find(n => n.nodeId === nodeId);
    const startX = e.clientX - node.positionX * transform.scale;
    const startY = e.clientY - node.positionY * transform.scale;

    const onMouseMove = (moveEvent) => {
       const newX = (moveEvent.clientX - startX) / transform.scale;
       const newY = (moveEvent.clientY - startY) / transform.scale;
       
       setNodes(prev => prev.map(n => 
         n.nodeId === nodeId ? { ...n, positionX: newX, positionY: newY } : n
       ));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div 
      ref={canvasRef}
      className={`relative w-full ${isFullScreen ? 'fixed inset-0 z-[200] h-screen' : 'min-h-[600px] h-[calc(100vh-350px)] rounded-[3rem]'} bg-[#050508] border border-white/5 overflow-hidden cursor-crosshair shadow-glass-inner isolate transition-all duration-500`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
    >
      {/* Infinite Grid SVG Pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="grid" width={40 * transform.scale} height={40 * transform.scale} patternUnits="userSpaceOnUse">
             <path d={`M ${40 * transform.scale} 0 L 0 0 0 ${40 * transform.scale}`} fill="none" stroke="rgba(157,78,221,0.2)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" transform={`translate(${transform.x % (40 * transform.scale)}, ${transform.y % (40 * transform.scale)})`} />
      </svg>

      {/* Connection Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
           <filter id="glow">
             <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
             <feMerge>
               <feMergeNode in="coloredBlur"/>
               <feMergeNode in="SourceGraphic"/>
             </feMerge>
           </filter>
        </defs>
        {edges.map(edge => {
          const source = nodes.find(n => n.nodeId === edge.sourceNodeId);
          const target = nodes.find(n => n.nodeId === edge.targetNodeId);
          if (!source || !target) return null;

          const x1 = (source.positionX + 280) * transform.scale + transform.x;
          const y1 = (source.positionY + 100) * transform.scale + transform.y;
          const x2 = target.positionX * transform.scale + transform.x;
          const y2 = (target.positionY + 100) * transform.scale + transform.y;
          
          const midX = (x1 + x2) / 2;

          return (
            <g key={edge.edgeId}>
               <path 
                 d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`} 
                 fill="none" 
                 stroke="rgba(157,78,221,0.3)" 
                 strokeWidth="2" 
               />
               <path 
                 d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`} 
                 fill="none" 
                 stroke="#9D4EDD" 
                 strokeWidth="2" 
                 filter="url(#glow)"
                 className="animate-[draw_2s_ease-in-out_infinite]"
                 strokeDasharray="10, 50"
               />
            </g>
          );
        })}
      </svg>

      {/* Nodes Layer */}
      <div 
        className="absolute inset-0 z-20"
        style={{ 
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
      >
        {nodes.map(node => {
          const typeInfo = NODE_TYPES[node.type] || NODE_TYPES.AgentInference;
          return (
            <div 
              key={node.nodeId}
              className="absolute node-element group active:cursor-grabbing"
              style={{ left: node.positionX, top: node.positionY, width: 280 }}
              onMouseDown={(e) => handleNodeDragStart(node.nodeId, e)}
            >
              <GlassCard className="p-4 border border-white/10 group-hover:border-primary/50 transition-all rounded-3xl shadow-2xl backdrop-blur-3xl bg-surface-raised/80">
                 <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                       <div className={`p-2 bg-${typeInfo.color}/10 rounded-lg text-${typeInfo.color}`}>
                          {typeInfo.icon}
                       </div>
                       <span className="text-[10px] font-tech text-white/50 tracking-widest uppercase">{typeInfo.label}</span>
                    </div>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="w-2 h-2 rounded-full bg-secondary" />
                       <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                 </div>

                 <h4 className="text-sm font-tech font-bold text-white mb-2">{node.label}</h4>
                 <div className="flex flex-wrap gap-1 mb-4">
                    {Object.keys(node.config || {}).map(key => (
                      <div key={key} className="px-2 py-0.5 bg-white/5 rounded-md text-[8px] text-text-secondary border border-white/5">
                        {key.toUpperCase()}: {String(node.config[key])}
                      </div>
                    ))}
                 </div>

                 <div className="flex justify-between items-center text-[10px] font-tech uppercase text-text-secondary">
                    <span>In: Dynamic</span>
                    <span className="text-primary glow-text-primary animate-pulse">Running</span>
                 </div>
              </GlassCard>
              
              {/* Connectors */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-surface-raised border border-white/10 rounded-full flex items-center justify-center hover:bg-primary/50 transition-colors">
                 <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-surface-raised border border-white/10 rounded-full flex items-center justify-center hover:bg-primary/50 transition-colors">
                 <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Canvas Controls Overlay */}
      <div className="absolute bottom-10 left-10 z-[100] flex gap-2">
         <div className="flex bg-black/50 p-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
            <Button variant="ghost" size="sm" className={`rounded-full w-10 h-10 p-0 ${isFullScreen ? 'text-primary' : 'text-white/50'} hover:text-white`} onClick={() => setIsFullScreen(!isFullScreen)}>
               <Maximize2 size={16} />
            </Button>
            <div className="w-[1px] h-6 bg-white/10 my-auto mx-1" />
            <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 text-white/50 hover:text-white" onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}>
               <MousePointer2 size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 text-white/50 hover:text-white">
               <Move size={16} />
            </Button>
         </div>
         <div className="flex bg-black/50 p-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
            <Button variant="primary" size="sm" className="rounded-full px-6 shadow-neon-primary" onClick={onSave}>
               <Save size={16} className="mr-2" /> Save Workflow
            </Button>
         </div>
      </div>

      {/* Legend / Info Overlay */}
      <div className="absolute bottom-10 right-10 z-[100]">
          <GlassCard className="p-4 py-3 rounded-full border-white/5 shadow-2xl bg-black/40 backdrop-blur-md flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success shadow-neon-accent" />
                <span className="text-[10px] text-text-secondary uppercase font-tech">SignalR Connected</span>
             </div>
             <div className="h-4 w-[1px] bg-white/10" />
             <div className="flex items-center gap-2">
                <Activity size={14} className="text-secondary" />
                <span className="text-[10px] text-text-secondary uppercase font-tech">4 Active Nodes</span>
             </div>
          </GlassCard>
      </div>

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
