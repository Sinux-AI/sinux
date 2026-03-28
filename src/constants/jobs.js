import { Clock, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export const JOB_STATUS = {
  Pending: "Pending",
  Processing: "Processing",
  Completed: "Completed",
  Failed: "Failed",
  Cancelled: "Cancelled",
};

export const JOB_STATUS_CFG = {
  Pending:    { variant: "warning", icon: Clock,        pulse: false },
  Processing: { variant: "info",    icon: RefreshCw,    pulse: true  },
  Completed:  { variant: "success", icon: CheckCircle2, pulse: false },
  Failed:     { variant: "error",   icon: AlertCircle,  pulse: false },
  Cancelled:  { variant: "ghost",   icon: Clock,        pulse: false },
};

export const EXEC_STATUS = {
  Running:   { variant: "info",    icon: RefreshCw,    pulse: true  },
  Completed: { variant: "success", icon: CheckCircle2, pulse: false },
  Failed:    { variant: "error",   icon: AlertCircle,  pulse: false },
  Pending:   { variant: "warning", icon: Clock,        pulse: false },
};
