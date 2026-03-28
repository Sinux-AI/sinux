import React, { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "./Button";

// ── Internal Dialog Component ──────────────────────────────────────────────

function ConfirmDialogModal({ title, message, confirmLabel, variant, onConfirm, onCancel }) {
  const isDanger = variant === "danger";

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div className="bg-[#0a0a0f] border border-white/10 rounded-[2rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-7 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${isDanger ? "bg-error/10 border-error/20" : "bg-primary/10 border-primary/20"}`}>
              {isDanger
                ? <Trash2 size={18} className="text-error" />
                : <AlertTriangle size={18} className="text-primary" />
              }
            </div>
            <h3
              id="confirm-title"
              className="text-base font-bold text-white uppercase tracking-tight"
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-secondary hover:text-white transition-all"
            aria-label="Cancel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pb-7">
          <p
            id="confirm-message"
            className="text-sm text-text-secondary leading-relaxed mb-7"
          >
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 rounded-xl font-bold ${
                isDanger
                  ? "bg-error text-white hover:bg-error/90 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  : ""
              }`}
              variant={isDanger ? undefined : "primary"}
            >
              {confirmLabel ?? "Confirm"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useConfirmDialog()
 * Returns { confirmDialog, ConfirmDialogComponent }
 *
 * Usage:
 *   const { confirmDialog, ConfirmDialogComponent } = useConfirmDialog();
 *   // In JSX: <>{ConfirmDialogComponent}</>
 *   // To prompt: const ok = await confirmDialog({ title: "Delete?", message: "..." });
 */
export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState(null);

  const confirmDialog = useCallback(
    ({ title = "Are you sure?", message, confirmLabel = "Confirm", variant = "danger" }) => {
      return new Promise((resolve) => {
        setDialogState({
          title,
          message,
          confirmLabel,
          variant,
          resolve,
        });
      });
    },
    []
  );

  const handleConfirm = () => {
    dialogState?.resolve(true);
    setDialogState(null);
  };

  const handleCancel = () => {
    dialogState?.resolve(false);
    setDialogState(null);
  };

  const ConfirmDialogComponent = dialogState ? (
    <ConfirmDialogModal
      title={dialogState.title}
      message={dialogState.message}
      confirmLabel={dialogState.confirmLabel}
      variant={dialogState.variant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirmDialog, ConfirmDialogComponent };
}
