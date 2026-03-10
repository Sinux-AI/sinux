import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Globe, 
  MessageSquare, 
  Mail, 
  ShieldCheck, 
  Search, 
  Plus, 
  Terminal, 
  Link as LinkIcon, 
  ArrowRight,
  Settings2,
  CheckCircle2,
  XCircle,
  Database,
  Cpu,
  Code2
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { 
  getToolsAsync, 
  getConnectionsAsync, 
  toggleChannelStatusAsync, 
  parseDocumentationAsync,
  registerChannelAsync,
  saveServiceCredentialsAsync
} from "../services/integrationService";


import { toast } from "react-hot-toast";

import { useAuthStore } from "../authentication/authStore";
import { getAgentsAsync } from "../services/agentService";

const Integrations = () => {
  const { organizationId } = useAuthStore();
  const [activeTab, setActiveTab] = useState("connectors");
  const [tools, setTools] = useState([]);
  const [connections, setConnections] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [showCredsModal, setShowCredsModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Registration Fields (Matches RegisterChannelDto)
  const [agentProfileId, setAgentProfileId] = useState("");
  const [externalChannelId, setExternalChannelId] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [botToken, setBotToken] = useState("");
  
  // Service Creds Fields (Matches SaveCredentialsDto)
  const [apiKey, setApiKey] = useState("");

  // Auto Tool Builder State
  const [parsingUrl, setParsingUrl] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    fetchData();
    fetchAgents();
  }, [organizationId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [toolsData, connectionsData] = await Promise.all([
        getToolsAsync(),
        getConnectionsAsync(organizationId)
      ]);
      setTools(toolsData || []);
      setConnections(connectionsData || []);
    } catch (err) {
      toast.error("Failed to sync connectors.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await getAgentsAsync(organizationId);
      setAgents(data || []);
      if (data?.length > 0) setAgentProfileId(data[0].agentProfileId);
    } catch (err) {
      console.error("Failed to load agents for connector mapping.");
    }
  };

  const resetModal = () => {
    setApiKey("");
    setExternalChannelId("");
    setWebhookUrl("");
    setBotToken("");
    setIsRegistering(false);
  };

  const handleOpenModal = (platform) => {
    resetModal();
    setSelectedPlatform(platform);
    setShowCredsModal(true);
  };

  const handleToggleChannel = async (id, currentStatus) => {
    try {
      await toggleChannelStatusAsync(id, !currentStatus);
      fetchData();
      toast.success("Uplink status updated.");
    } catch (err) {
      toast.error("Handshake failed.");
    }
  };

  const handleParse = async () => {
    if (!parsingUrl) return;
    setIsParsing(true);
    try {
      await parseDocumentationAsync(parsingUrl);
      toast.success("Documentation ingested. Synthesizing tool schema...");
      fetchData();
      setParsingUrl("");
    } catch (err) {
      toast.error("Parsing logic failed. Ensure text is valid API documentation.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveCredentials = async () => {
    const isChannel = ['discord', 'slack', 'email', 'teams'].includes(selectedPlatform);
    setIsRegistering(true);
    
    try {
      if (isChannel) {
        // Platform Enum Mapping
        const platformMap = { discord: 1, slack: 2, teams: 3, email: 4 };
        await registerChannelAsync({
          agentProfileId,
          platform: platformMap[selectedPlatform] || 0,
          externalChannelId,
          webhookUrl,
          plainTextBotToken: botToken,
          organizationId
        });
      } else {
        await saveServiceCredentialsAsync({
          serviceName: selectedPlatform,
          plainTextApiKey: apiKey,
          organizationId
        });
      }
      
      toast.success(`${selectedPlatform} uplift successful.`);
      setShowCredsModal(false);
      resetModal();
      fetchData();
    } catch (err) {
      toast.error("Handshake failed. Verify security tokens.");
    } finally {
      setIsRegistering(false);
    }
  };




  const platformIcons = {
    discord: <MessageSquare className="text-[#5865F2]" />,
    slack: <MessageSquare className="text-[#4A154B]" />,
    email: <Mail className="text-[#EA4335]" />,
    teams: <Globe className="text-[#6264A7]" />
  };

  return (
    <div className="bg-background pb-20 relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full animate-in fade-in duration-700">
      {/* Background Orbs */}
      <div className="absolute top-[10%] -left-[5%] w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] -right-[5%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader 
        title="Connectors & APIs" 
        subtitle="Manage the Sinux nervous system. Ingest tools from docs or bridge to enterprise communication platforms." 
      />

      {/* TABS */}
      <div className="flex gap-8 mb-12 border-b border-white/5 pb-0">
        <button 
          onClick={() => setActiveTab("connectors")}
          className={`pb-4 text-tech font-bold tracking-widest uppercase text-xs transition-all relative ${activeTab === 'connectors' ? 'text-primary' : 'text-text-secondary hover:text-white'}`}
        >
          // OMNI_CHANNEL_HUB
          {activeTab === 'connectors' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-neon-primary" />}
        </button>
        <button 
          onClick={() => setActiveTab("parser")}
          className={`pb-4 text-tech font-bold tracking-widest uppercase text-xs transition-all relative ${activeTab === 'parser' ? 'text-accent' : 'text-text-secondary hover:text-white'}`}
        >
          // AUTO_TOOL_BUILDER
          {activeTab === 'parser' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent shadow-neon-accent" />}
        </button>
      </div>

      {activeTab === 'connectors' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Connection Status */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {['discord', 'slack', 'email', 'teams'].map(platform => {
              const conn = connections.find(c => c.type?.toLowerCase() === platform);
              return (
                <GlassCard key={platform} className="p-6 relative overflow-hidden group">
                   <div className="flex items-center justify-between mb-8">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:border-white/20 transition-all">
                         {platformIcons[platform]}
                      </div>
                      <Badge variant={conn?.status === 1 ? "success" : "info"}>
                         {conn?.status === 1 ? 'UPLINK_CONNECTED' : 'STANDBY'}
                      </Badge>
                   </div>
                   
                   <h3 className="text-xl font-tech font-bold text-white mb-2 uppercase tracking-tight">{platform}</h3>
                   <p className="text-xs text-text-secondary font-sans mb-8">
                     Enterprise {platform} integration for autonomous notification and interactive command loops.
                   </p>

                   <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${conn?.status === 1 ? 'bg-success animate-pulse' : 'bg-white/10'}`} />
                         <span className="text-[10px] font-tech text-text-secondary uppercase">Status: {conn?.status === 1 ? 'Active' : 'Offline'}</span>
                      </div>
                      <Button 
                        variant={conn?.status === 1 ? "secondary" : "primary"} 
                        size="sm" 
                        className="rounded-full px-6"
                        onClick={() => {
                          if (conn?.status === 1) {
                            handleToggleChannel(conn.id, true);
                          } else {
                            handleOpenModal(platform);
                          }
                        }}


                      >
                         {conn?.status === 1 ? 'Disconnect' : 'Connect'}
                      </Button>

                   </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Sidebar: Security & Health */}
          <div className="space-y-6">
             <GlassCard className="p-8 border-accent/20">
                <div className="flex items-center gap-3 mb-6">
                   <ShieldCheck size={20} className="text-accent" />
                   <h4 className="text-xs font-tech font-bold text-white uppercase tracking-widest">Security_Gateway</h4>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[11px] font-sans">
                      <span className="text-text-secondary">AES-256 Encryption</span>
                      <span className="text-success font-tech uppercase">Active</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-sans">
                      <span className="text-text-secondary">OIDC Handshakes</span>
                      <span className="text-success font-tech uppercase">Verified</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-sans">
                      <span className="text-text-secondary">Audit Logging</span>
                      <span className="text-accent font-tech uppercase">Enabled</span>
                   </div>
                </div>
                <Button variant="ghost" className="w-full mt-8 border border-white/5 rounded-xl text-[10px] tracking-widest font-tech uppercase">
                   View Audit Trails
                </Button>
             </GlassCard>

             <GlassCard className="p-8 bg-black/40">
                  <div className="flex items-center gap-3 mb-4">
                     <Database size={18} className="text-white/20" />
                     <span className="text-[10px] font-tech text-white/30 uppercase tracking-widest">Platform_Infrastructure</span>
                  </div>
                  <p className="text-[10px] text-text-secondary font-sans leading-relaxed">
                     Hardware accelerated inference enabled. All connections are routed through the Sinux Unified Gateway for maximum stability and enterprise-grade security.
                  </p>
             </GlassCard>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-500">
           <div className="text-center mb-12">
              <div className="inline-flex p-4 bg-accent/20 rounded-3xl mb-6 shadow-neon-accent">
                 <Code2 size={40} className="text-accent" />
              </div>
              <h2 className="text-3xl font-tech font-bold text-white mb-4">AUTO_TOOL_BUILDER</h2>
              <p className="text-text-secondary max-w-xl mx-auto font-sans leading-relaxed">
                Paste the **raw API documentation text** below. Our AI identifies endpoints, parameters, and authentication schemas to automatically generate autonomous tools.
              </p>
           </div>

           <GlassCard className="p-10 border-accent/30 shadow-neon-accent relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                 <Badge variant="accent" className="px-6 py-1">SYNTHESIZER_READY</Badge>
              </div>
              
              <div className="flex flex-col gap-4 mb-4">
                 <div className="relative">
                    <textarea 
                      placeholder="Paste cURL examples or documentation text here..." 
                      className="w-full bg-black/50 border border-white/10 rounded-2xl py-6 px-6 text-white font-mono text-xs focus:border-accent transition-all outline-none min-h-[200px] resize-none"
                      value={parsingUrl}
                      onChange={(e) => setParsingUrl(e.target.value)}
                    />
                 </div>
                 <Button 
                    variant="accent" 
                    size="lg" 
                    className="rounded-2xl w-full py-6"
                    onClick={handleParse}
                    disabled={isParsing || !parsingUrl}
                  >
                   {isParsing ? 'Synthesizing Patterns...' : 'Build Tool from Context'}
                 </Button>
              </div>

              
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="p-1.5 bg-accent/10 rounded-lg text-accent"><CheckCircle2 size={12} /></div>
                   <span className="text-[10px] font-tech text-text-secondary uppercase">Swagger/OpenAPI Support</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="p-1.5 bg-accent/10 rounded-lg text-accent"><CheckCircle2 size={12} /></div>
                   <span className="text-[10px] font-tech text-text-secondary uppercase">Postman Collection Link</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="p-1.5 bg-accent/10 rounded-lg text-accent"><CheckCircle2 size={12} /></div>
                   <span className="text-[10px] font-tech text-text-secondary uppercase">Raw MD Code Block</span>
                 </div>
              </div>
           </GlassCard>

           {/* Ingested Tools List */}
           <div className="space-y-6">
              <h3 className="text-tech tracking-[0.4em] text-white/30 uppercase text-xs">// INGESTED_RESOURCES</h3>
              
              {tools.length === 0 ? (
                <div className="p-12 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center opacity-30 text-center">
                   <Cpu size={40} className="mb-4" />
                   <p className="text-xs font-tech uppercase tracking-widest font-bold">No custom tools synthesized yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {tools.map(tool => (
                     <GlassCard key={tool.id} className="p-6 border-white/5 hover:border-accent/40 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-4">
                           <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-black transition-all">
                              <Terminal size={18} />
                           </div>
                           <Badge variant="accent">VERSION 1.2</Badge>
                        </div>
                        <h4 className="text-lg font-tech font-bold text-white mb-1 uppercase tracking-tight">{tool.name}</h4>
                        <p className="text-[11px] text-text-secondary font-sans line-clamp-2 mb-6">{tool.description}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                           <span className="text-[9px] font-tech text-text-secondary uppercase">Endpoints: {tool.endpointsCount || 0}</span>
                           <ArrowRight size={14} className="text-accent opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                     </GlassCard>
                   ))}
                </div>
              )}
           </div>
        </div>
      )}
      {/* --- CREDENTIALS MODAL --- */}
      {showCredsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <GlassCard className="max-w-md w-full p-8 border-primary/20 shadow-neon-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <button onClick={() => setShowCredsModal(false)} className="text-text-secondary hover:text-white transition-colors">
                    <XCircle size={24} />
                 </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-primary/20 rounded-xl text-primary">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-tech font-bold text-white uppercase tracking-tight">Handshake: {selectedPlatform}</h3>
                    <p className="text-[10px] text-text-secondary font-tech uppercase tracking-widest">Secure_Credential_Uplink</p>
                 </div>
              </div>

              <div className="space-y-6">
                 {/* Agent Selector (Required for Registration) */}
                 {['discord', 'slack', 'email', 'teams'].includes(selectedPlatform) && (
                   <div>
                      <label className="block text-[10px] font-tech text-text-secondary uppercase tracking-[0.2em] mb-2">Target_Agent_Node</label>
                      <select 
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-6 text-white font-tech text-xs focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                        value={agentProfileId}
                        onChange={(e) => setAgentProfileId(e.target.value)}
                      >
                        {agents.map(agent => (
                          <option key={agent.agentProfileId} value={agent.agentProfileId}>{agent.name} ({agent.role})</option>
                        ))}
                      </select>
                   </div>
                 )}

                 {/* Platform Specific Fields */}
                 {selectedPlatform === 'email' ? (
                   <div>
                      <label className="block text-[10px] font-tech text-text-secondary uppercase tracking-[0.2em] mb-2">Destination_Email_Target</label>
                      <input 
                         type="email" 
                         placeholder="user@example.com"
                         className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-6 text-white font-mono focus:border-primary transition-all outline-none"
                         value={externalChannelId}
                         onChange={(e) => setExternalChannelId(e.target.value)}
                      />
                   </div>
                 ) : ['discord', 'slack', 'teams'].includes(selectedPlatform) ? (
                   <>
                      <div>
                        <label className="block text-[10px] font-tech text-text-secondary uppercase tracking-[0.2em] mb-2">Bot_Secret_Token</label>
                        <input 
                           type="password" 
                           placeholder="XOXB-..."
                           className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-6 text-white font-mono focus:border-primary transition-all outline-none"
                           value={botToken}
                           onChange={(e) => setBotToken(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-tech text-text-secondary uppercase tracking-[0.2em] mb-2">
                          {selectedPlatform === 'discord' ? 'Discord_Server_ID' : selectedPlatform === 'slack' ? 'Slack_Channel_ID' : 'Channel_Uplink_ID'}
                        </label>
                        <input 
                           type="text" 
                           placeholder={selectedPlatform === 'discord' ? "1234567890..." : "C12345678"}
                           className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-6 text-white font-mono focus:border-primary transition-all outline-none"
                           value={externalChannelId}
                           onChange={(e) => setExternalChannelId(e.target.value)}
                        />
                      </div>
                   </>
                 ) : (
                   <div>
                      <label className="block text-[10px] font-tech text-text-secondary uppercase tracking-[0.2em] mb-2">Service_API_Key</label>
                      <input 
                         type="password" 
                         placeholder="sk_live_..."
                         className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-6 text-white font-mono focus:border-primary transition-all outline-none"
                         value={apiKey}
                         onChange={(e) => setApiKey(e.target.value)}
                      />
                   </div>
                 )}

                 <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 animate-pulse" />
                    <p className="text-[10px] text-text-secondary leading-relaxed uppercase tracking-tighter">
                       All secrets are AES-256 encrypted before orchestration persistence.
                    </p>
                 </div>

                 <Button 
                   variant="primary" 
                   size="lg" 
                   className="w-full py-4 rounded-xl shadow-neon-primary" 
                   onClick={handleSaveCredentials}
                   disabled={isRegistering}
                 >
                    {isRegistering ? 'Establishing Uplink...' : 'Secure Connection'}
                 </Button>
              </div>
           </GlassCard>
        </div>
      )}

    </div>
  );
};


export default Integrations;
