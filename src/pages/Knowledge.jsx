import React, { useState } from "react";
import { 
  Database, 
  Upload, 
  FileText, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Cpu, 
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Pin,
  Bot
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { toast } from "react-hot-toast";

const Knowledge = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const [isUploading, setIsUploading] = useState(false);
  
  const [documents, setDocuments] = useState([
    { id: "doc_1", name: "Enterprise_ComplianceV2.pdf", size: "2.4 MB", status: "Indexed", tokens: "128,400", lastSync: "2h ago" },
    { id: "doc_2", name: "Technical_Blueprint_Sinux.md", size: "45 KB", status: "Vectorizing", tokens: "5,200", lastSync: "Just now" },
    { id: "doc_3", name: "API_Documentation_Standard.json", size: "120 KB", status: "Indexed", tokens: "18,900", lastSync: "1d ago" },
  ]);

  const [agentPins, setAgentPins] = useState([
    { id: "pin_1", agent: "Atlas", role: "Primary Researcher", docs: 3 },
    { id: "pin_2", agent: "Nexus", role: "Logic Analyst", docs: 1 },
    { id: "pin_3", agent: "Sentinel", role: "Security Guardian", docs: 2 },
  ]);

  const handleUploadClick = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Document ingested and queued for vectorization.");
    }, 2000);
  };

  return (
    <div className="bg-background pb-32 relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full animate-in fade-in duration-1000">
      {/* Background Orbs */}
      <div className="absolute top-[15%] -left-[5%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] -right-[5%] w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader 
        title="Knowledge Assets" 
        subtitle="The long-term memory of your organization. Upload documents to the Sinux Vector Store and pin them to specialized workforce nodes." 
      />

      <div className="flex gap-8 mb-12 border-b border-white/5 pb-0">
        <button 
          onClick={() => setActiveTab("documents")}
          className={`pb-4 text-tech font-bold tracking-widest uppercase text-xs transition-all relative ${activeTab === 'documents' ? 'text-primary' : 'text-text-secondary hover:text-white'}`}
        >
          // VECTOR_STORE
          {activeTab === 'documents' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-neon-primary" />}
        </button>
        <button 
          onClick={() => setActiveTab("pinning")}
          className={`pb-4 text-tech font-bold tracking-widest uppercase text-xs transition-all relative ${activeTab === 'pinning' ? 'text-secondary' : 'text-text-secondary hover:text-white'}`}
        >
          // CONTEXT_PINNING
          {activeTab === 'pinning' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary shadow-neon-pink" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          {activeTab === 'documents' ? (
            <div className="space-y-6">
              {/* Upload Zone */}
              <div 
                className="group relative h-48 rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/50 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden"
                onClick={handleUploadClick}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Activity size={32} className="text-primary animate-pulse" />
                    <p className="text-tech text-xs tracking-[0.2em] text-white uppercase animate-pulse">Analyzing Document Layers...</p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-black/40 rounded-2xl mb-4 group-hover:scale-110 group-hover:shadow-neon-primary transition-all duration-500">
                      <Upload size={24} className="text-primary" />
                    </div>
                    <p className="text-tech text-xs tracking-[0.2em] text-text-secondary uppercase">
                      Drop PDFs, Markdown or Text to Ingest
                    </p>
                  </>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </div>

              {/* SearchBar */}
              <div className="relative">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="SEARCH_VECTOR_INDEX..."
                  className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-tech text-xs tracking-widest focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Documents List */}
              <div className="grid gap-4">
                {documents.map(doc => (
                  <GlassCard key={doc.id} className="p-6 flex items-center justify-between group hover:border-white/20 transition-all border-white/5">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                        <FileText size={24} className="text-primary group-hover:glow-text-primary" />
                      </div>
                      <div>
                        <h4 className="font-tech font-bold text-white mb-1 uppercase tracking-tight">{doc.name}</h4>
                        <div className="flex items-center gap-4 text-[10px] text-text-secondary font-tech uppercase tracking-widest">
                          <span>{doc.size}</span>
                          <span className="w-1 h-1 bg-white/10 rounded-full" />
                          <span>{doc.tokens} Tokens</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right hidden md:block">
                        <Badge variant={doc.status === 'Indexed' ? 'success' : 'info'} className="mb-1 uppercase tracking-tighter">
                          {doc.status}
                        </Badge>
                        <p className="text-[9px] text-text-secondary/50 font-tech uppercase">Synced {doc.lastSync}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="p-2 hover:bg-error/10 text-text-secondary hover:text-error">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
              {agentPins.map(pin => (
                <GlassCard key={pin.id} className="p-8 relative group overflow-hidden border-white/5 hover:border-secondary/40">
                  <div className="absolute top-0 right-0 p-4">
                     <Pin size={20} className="text-secondary opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:shadow-neon-pink transition-all">
                      <Bot size={32} className="text-secondary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-tech font-bold text-white uppercase tracking-tight">{pin.agent}</h4>
                      <p className="text-[10px] text-text-secondary font-tech uppercase tracking-widest">{pin.role}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-[10px] font-tech text-white/30 uppercase tracking-[0.2em] mb-4">// PINNED_RESOURCES: {pin.docs}</p>
                    <div className="space-y-2">
                       {documents.slice(0, pin.docs).map(doc => (
                         <div key={doc.id} className="flex items-center justify-between p-2 px-3 bg-white/5 rounded-xl border border-white/5 text-[10px] font-tech tracking-widest">
                           <span className="text-white/60 truncate max-w-[150px]">{doc.name}</span>
                           <span className="text-secondary">ACTIVE</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  <Button variant="secondary" size="sm" className="w-full rounded-xl">
                    Configure Context
                  </Button>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar / Stats */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-8 border-primary/20 bg-primary/[0.02]">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck size={20} className="text-primary" />
              <h4 className="text-xs font-tech font-bold text-white uppercase tracking-widest">Neural_Security</h4>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-tech uppercase tracking-widest mb-1">
                  <span className="text-text-secondary">Storage Capacity</span>
                  <span className="text-white">65.2%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[65%]" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-start gap-3">
                   <div className="p-1 bg-success/10 rounded text-success mt-0.5"><CheckCircle2 size={12} /></div>
                   <p className="text-[10px] text-text-secondary uppercase tracking-tight leading-normal">
                     AES-256 Encryption at Rest
                   </p>
                </div>
                <div className="flex items-start gap-3">
                   <div className="p-1 bg-primary/10 rounded text-primary mt-0.5"><CheckCircle2 size={12} /></div>
                   <p className="text-[10px] text-text-secondary uppercase tracking-tight leading-normal">
                     Private Vector Cloud Verified
                   </p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h4 className="text-[10px] font-tech font-bold text-white/30 uppercase tracking-widest mb-6">// RECENT_ACTIVITY</h4>
            <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="flex gap-4 items-start group">
                    <div className="w-1 h-8 bg-white/5 group-hover:bg-primary transition-colors rounded-full" />
                    <div>
                       <p className="text-[10px] font-tech text-white uppercase mb-0.5">Vector Re-indexing</p>
                       <p className="text-[9px] text-text-secondary uppercase">Node: Atlas | 14:02 PM</p>
                    </div>
                 </div>
               ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default Knowledge;
