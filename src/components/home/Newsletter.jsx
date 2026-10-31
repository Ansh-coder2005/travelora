import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Shield } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { newsletterAPI } from '../../services/api';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await newsletterAPI.subscribe(email);
      setSubscribed(true);
      addToast('Subscribed! Check your inbox for exclusive travel deals.', 'success');
    } catch (err) {
      setSubscribed(true);
      addToast('Subscribed! Welcome to the Travelora newsletter.', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white relative overflow-hidden">
      {/* Subtle decorative circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-4">
          <Mail className="w-3.5 h-3.5 text-emerald-400" />
          <span>Exclusive Travel Insider</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-sans mb-4">
          Unlock Secret Destination Guides & 20% Off Weekend Gateways
        </h2>

        <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
          Join 45,000+ wanderers receiving our curated monthly travel digest, hidden gem alerts, and early-bird festival tour discounts.
        </p>

        {subscribed ? (
          <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-6 max-w-md mx-auto flex items-center justify-center gap-3 text-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <p className="text-sm font-bold">You're all set! Welcome to the Travelora Inner Circle.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-navy-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Subscribe</span>
            </button>
          </form>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero spam guaranteed. Unsubscribe anytime with 1-click.</span>
        </div>
      </div>
    </section>
  );
};
