import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "../authentication/authStore";
import { getDocumentsAsync, uploadDocumentAsync } from "../services/knowledgeService.js";
import { SOURCE_TYPES } from "../constants/integrations.js";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  Database, Upload, FileText, Link as LinkIcon, Trash2,
  ShieldCheck, CheckCircle2, Clock, AlertCircle, RefreshCw,
  Youtube, ExternalLink
} from "lucide-react";
import { toast } from "react-hot-toast";

const STATUS_CONFIG = {
  Pending:     { variant: "warning", label: "Pending",     icon: Clock,         pulse: false },
  In_Progress: { variant: "info",    label: "Processing",  icon: RefreshCw,     pulse: true  },
  Ready:       { variant: "success", label: "Ready",       icon: CheckCircle2,  pulse: false },
  Failed:      { variant: "error",   label: "Failed",      icon: AlertCircle,   pulse: false },
};

const SOURCE_ICONS = {
  LocalFile: FileText,
  Url:       LinkIcon,
  YouTube:   Youtube,
  Notion:    ExternalLink,
  Slack:     Database,
};

function UploadPanel({ organizationId, onUploaded }) {
  const fileInput = useRef(null);
  const [sourceType, setSourceType] = useState("LocalFile");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const needsFile = ["LocalFile"].includes(sourceType);
  const canSubmit = needsFile ? !!file : !!url.trim();

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("sourceType", sourceType);
      if (needsFile) fd.append("file", file);
      else { fd.append("sourceType", sourceType); fd.append("file", new Blob([url], { type: "text/plain" }), "url.txt"); }
      await uploadDocumentAsync(fd);
      toast.success("Document queued for processing.");
      setFile(null); setUrl("");
      onUploaded();
    } catch { toast.error("Upload failed."); }
    finally { setUploading(false); }
  };

  return (
    <GlassCard className="p-8 rounded-[2rem] border-white/5 mb-6">
      <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
        <Upload size={16} className="text-primary" /> Ingest New Source
      </h3>

      {/* Source type */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SOURCE_TYPES.map(s => (
          <button key={s.value} onClick={() => setSourceType(s.value)}
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${sourceType === s.value ? 'bg-primary/20 border-primary text-primary' : 'border-white/10 text-text-secondary hover:border-white/20'}`}>
            {s.value.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      {/* Drop zone or URL input */}
      {needsFile ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInput.current?.click()}
          className={`h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all mb-4 ${dragging ? 'border-primary bg-primary/5' : file ? 'border-primary/40 bg-primary/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}
        >
          <input ref={fileInput} type="file" className="hidden" accept=".pdf,.txt,.md,.docx"
            onChange={e => setFile(e.target.files?.[0] || null)} />
          <Upload size={24} className={`mb-2 ${file ? 'text-primary' : 'text-white/20'}`} />
          <p className="text-[11px] font-tech uppercase tracking-widest text-text-secondary">
            {file ? file.name : "Drop PDF, TXT, MD, DOCX or click to browse"}
          </p>
        </div>
      ) : (
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..."
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-all mb-4" />
      )}

      <Button variant="primary" className="w-full rounded-xl shadow-neon-primary" disabled={!canSubmit || uploading} onClick={handleSubmit}>
        {uploading ? "Processing..." : "Ingest Source"}
      </Button>
    </GlassCard>
  );
}

function DocumentRow({ doc }) {
  const cfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.Pending;
  const Icon = SOURCE_ICONS[doc.sourceType] || FileText;
  const StatusIcon = cfg.icon;

  return (
    <div className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors shrink-0">
          <Icon size={18} className="text-text-secondary group-hover:text-primary transition-colors" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{doc.fileName || doc.knowledgeDocumentId}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[9px] font-tech text-text-secondary uppercase">{doc.sourceType}</span>
            {doc.totalChunks > 0 && (
              <span className="text-[9px] font-tech text-text-secondary uppercase">{doc.totalChunks.toLocaleString()} chunks</span>
            )}
            <span className="text-[9px] text-text-secondary">{new Date(doc.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <Badge variant={cfg.variant} className={`flex items-center gap-1.5 ${cfg.pulse ? 'animate-pulse' : ''}`}>
        <StatusIcon size={10} />
        {cfg.label}
      </Badge>
    </div>
  );
}

const Knowledge = () => {
  const { organizationId } = useAuthStore();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const data = await getDocumentsAsync(organizationId);
      setDocuments(data || []);
      // Poll while any doc is still processing
      const processing = (data || []).some(d => d.status === "Pending" || d.status === "In_Progress");
      if (processing && !pollRef.current) {
        pollRef.current = setInterval(async () => {
          const fresh = await getDocumentsAsync(organizationId).catch(() => null);
          if (fresh) {
            setDocuments(fresh);
            if (!fresh.some(d => d.status === "Pending" || d.status === "In_Progress")) {
              clearInterval(pollRef.current); pollRef.current = null;
            }
          }
        }, 5000);
      }
    } catch { toast.error("Failed to load knowledge base."); }
    finally { setLoading(false); }
  }, [organizationId]);

  useEffect(() => { fetchDocuments(); return () => { if (pollRef.current) clearInterval(pollRef.current); }; }, [fetchDocuments]);

  const readyCount = documents.filter(d => d.status === "Ready").length;
  const processingCount = documents.filter(d => d.status === "Pending" || d.status === "In_Progress").length;

  return (
    <div className="bg-background pb-20 relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full animate-in fade-in duration-700">
      <div className="absolute top-[15%] -left-[5%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] -right-[5%] w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader
        title="Knowledge Base"
        subtitle="Ground your agents in real-world context. Upload documents, websites, and videos to the RAG vector store."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Upload + List */}
        <div className="xl:col-span-8">
          <UploadPanel organizationId={organizationId} onUploaded={fetchDocuments} />

          {/* Stats strip */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
              {loading ? "Loading..." : `${documents.length} documents — ${readyCount} ready`}
            </span>
            {processingCount > 0 && (
              <Badge variant="info" className="animate-pulse">{processingCount} processing</Badge>
            )}
            <button onClick={fetchDocuments} className="ml-auto p-2 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all">
              <RefreshCw size={14} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/[0.03] animate-pulse border border-white/5" />)}
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
              <Database size={40} className="mb-4" />
              <p className="text-sm font-tech uppercase tracking-widest font-bold">No documents ingested yet</p>
              <p className="text-xs text-text-secondary mt-2">Upload a PDF, paste a URL, or link a YouTube video.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map(doc => <DocumentRow key={doc.knowledgeDocumentId} doc={doc} />)}
            </div>
          )}
        </div>

        {/* Right: Security sidebar */}
        <div className="xl:col-span-4 space-y-6">
          <GlassCard className="p-8 border-primary/20 bg-primary/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={20} className="text-primary" />
              <h4 className="text-xs font-tech font-bold text-white uppercase tracking-widest">Vector Security</h4>
            </div>
            <div className="space-y-4">
              {[["AES-256 Encryption at Rest", true], ["Private Vector Cloud", true], ["Per-Org Namespace Isolation", true]].map(([label, ok]) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`p-1 rounded text-${ok ? 'success' : 'error'} bg-${ok ? 'success' : 'error'}/10`}>
                    {ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  </div>
                  <span className="text-[10px] text-text-secondary uppercase tracking-tight">{label}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-8 border-white/5">
            <h4 className="text-[10px] font-tech font-bold text-white uppercase tracking-widest mb-4">Supported Sources</h4>
            <div className="space-y-3">
              {SOURCE_TYPES.map(s => {
                const Icon = SOURCE_ICONS[s.value] || FileText;
                return (
                  <div key={s.value} className="flex items-center gap-3">
                    <Icon size={14} className="text-text-secondary shrink-0" />
                    <span className="text-[11px] text-text-secondary font-sans">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Knowledge;
