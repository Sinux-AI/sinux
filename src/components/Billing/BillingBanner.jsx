import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../authentication/authStore';
import { AlertCircle, Lock, ArrowRight, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

const BillingBanner = () => {
  const { isLocked, walletBalance, organizationId } = useAuthStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!organizationId) return; // Never show for guests

    const lastDismissed = localStorage.getItem('sinux_billing_dismissed');
    const cooldownActive = lastDismissed && (Date.now() - parseInt(lastDismissed) < 600000); // 10 mins

    if (isLocked) {
      setVisible(true);
    } else if (walletBalance < 50 && !cooldownActive) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isLocked, walletBalance, organizationId]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('sinux_billing_dismissed', Date.now().toString());
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 z-[200] animate-in slide-in-from-bottom-5">
      <div className={`p-5 rounded-3xl border backdrop-blur-3xl ${isLocked ? 'bg-error/10 border-error/30' : 'bg-amber-500/10 border-amber-500/20'}`}>
        <div className="flex gap-3">
          <div className={`p-2 h-fit rounded-lg ${isLocked ? 'bg-error/20 text-error' : 'bg-amber-500/20 text-amber-500'}`}>
            {isLocked ? <Lock size={16} /> : <AlertCircle size={16} />}
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-[9px] font-bold uppercase text-white tracking-widest">{isLocked ? 'Restricted' : 'Low Credit'}</span>
              <button onClick={handleDismiss} className="text-white/30 hover:text-white"><X size={14} /></button>
            </div>
            <p className="text-[11px] text-text-secondary leading-snug mb-3">
              {isLocked ? 'Organization locked. Top up to resume.' : `Balance: R${walletBalance.toFixed(2)}`}
            </p>
            <Link to="/wallet"><Button variant="primary" size="sm" className="w-full h-8 text-[9px]">Replenish Balance</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingBanner;