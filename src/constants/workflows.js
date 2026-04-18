import { 
  Bot, 
  Cpu, 
  Database, 
  Mail, 
  MessageSquare, 
  Zap 
} from "lucide-react";

/**
 * Workflow Status UI Configuration
 */
export const STATUS_CONFIG = {
  Active:    { variant: "success", label: "Active"    },
  Paused:    { variant: "warning", label: "Paused"    },
  Archived:  { variant: "ghost",   label: "Archived"  },
};

/**
 * Workflow Node UI Configuration
 * 
 * Maps backend node types to frontend Lucide icons and colors.
 */
export const NODE_UI_CONFIG = {
  AgentInference:       { icon: Bot,            color: 'primary'   },
  ManagerOrchestration: { icon: Cpu,            color: 'secondary' },
  KnowledgeSearch:      { icon: Database,       color: 'accent'    },
  SendEmail:            { icon: Mail,           color: 'info'      },
  SlackNotify:          { icon: MessageSquare,  color: 'success'   },
  ScheduledTrigger:     { icon: Zap,            color: 'warning'   },
};

export const getNodeIcon = (type) => NODE_UI_CONFIG[type]?.icon || Bot;
export const getNodeColor = (type) => NODE_UI_CONFIG[type]?.color || 'primary';

// NODE_TYPES is now partially redundant but we keep it for defaultConfig and UI metadata mapping
// In a full dynamic setup, defaultConfig would also come from the backend.
export const NODE_TYPES = {
  AgentInference:       { icon: Bot,            label: 'AI Inference',    color: 'primary',   description: 'Run an AI agent to process input.',            defaultConfig: { model: 'gpt-4o', temperature: '0.7' } },
  ManagerOrchestration: { icon: Cpu,            label: 'Manager Node',    color: 'secondary', description: 'Orchestrate and delegate to sub-agents.',      defaultConfig: { strategy: 'round-robin' } },
  KnowledgeSearch:      { icon: Database,       label: 'Data Retrieval',  color: 'accent',    description: 'Search a knowledge base or vector store.',     defaultConfig: { topK: '5', index: '' } },
  SendEmail:            { icon: Mail,           label: 'Email Trigger',   color: 'info',      description: 'Send an email notification.',                   defaultConfig: { to: '', subject: '' } },
  SlackNotify:          { icon: MessageSquare,  label: 'Slack Alert',     color: 'success',   description: 'Post a message to a Slack channel.',           defaultConfig: { channel: '', message: '' } },
  ScheduledTrigger:     { icon: Zap,            label: 'Scheduled',       color: 'warning',   description: 'Trigger on a schedule (cron expression).',     defaultConfig: { cron: '0 9 * * 1-5' } },
};
