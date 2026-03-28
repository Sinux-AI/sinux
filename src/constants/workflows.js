import { 
  Bot, 
  Cpu, 
  Database, 
  Mail, 
  MessageSquare, 
  Zap 
} from "lucide-react";

export const STATUS_CONFIG = {
  Active:    { variant: "success", label: "Active"    },
  Paused:    { variant: "warning", label: "Paused"    },
  Archived:  { variant: "ghost",   label: "Archived"  },
};

export const NODE_TYPES = {
  AgentInference:       { icon: Bot,            label: 'AI Inference',    color: 'primary',   description: 'Run an AI agent to process input.',            defaultConfig: { model: 'gpt-4o', temperature: '0.7' } },
  ManagerOrchestration: { icon: Cpu,            label: 'Manager Node',    color: 'secondary', description: 'Orchestrate and delegate to sub-agents.',      defaultConfig: { strategy: 'round-robin' } },
  KnowledgeSearch:      { icon: Database,       label: 'Data Retrieval',  color: 'accent',    description: 'Search a knowledge base or vector store.',     defaultConfig: { topK: '5', index: '' } },
  SendEmail:            { icon: Mail,           label: 'Email Trigger',   color: 'info',      description: 'Send an email notification.',                   defaultConfig: { to: '', subject: '' } },
  SlackNotify:          { icon: MessageSquare,  label: 'Slack Alert',     color: 'success',   description: 'Post a message to a Slack channel.',           defaultConfig: { channel: '', message: '' } },
  ScheduledTrigger:     { icon: Zap,            label: 'Scheduled',       color: 'warning',   description: 'Trigger on a schedule (cron expression).',     defaultConfig: { cron: '0 9 * * 1-5' } },
};
