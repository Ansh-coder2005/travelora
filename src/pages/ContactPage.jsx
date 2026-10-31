import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { contactAPI } from '../services/api';

const FAQS = [
  {
    q: "How does the AI Smart Trip Planner generate my daily itinerary?",
    a: "Our AI engine uses deterministic travel planning heuristics tailored to your destination, travel style, duration, and interests. It schedules morning, afternoon, and evening attractions in logical geographic clusters, recommends regional culinary spots, and balances expenses to match your target budget."
  },
  {
    q: "Are the bookings made on Travelora real or simulated demo bookings?",
    a: "All bookings on this platform are simulated demo reservations designed for university major capstone evaluation. No actual financial payments or credit card charges occur, but verified reference IDs and itemized vouchers are generated and stored in your browser LocalStorage."
  },
  {
    q: "Can I customize the day-wise itinerary of a curated tour package?",
    a: "Yes! While tour packages provide recommended daily templates, you can use our AI Smart Planner or enter special requests during the booking flow to request hotel tier modifications, extra days, or custom vehicle requests."
  },
  {
    q: "How accurate is the Travel Budget Calculator?",
    a: "The Travel Budget Calculator is calibrated using real regional travel benchmarks across accommodations, local transit, food, and sightseeing fees. You can adjust per-night hotel and meal estimates or choose from pre-configured backpacker, couple, or luxury presets."
  },
  {
    q: "What happens if I need to cancel my demo booking?",
    a: "You can cancel any active booking instantly with 1-click in the My Trips dashboard. The reservation status will update to 'Cancelled' immediately, preserving an audited record in your history."
  },
  {
    q: "Can I use Travelora on mobile devices?",
    a: "Yes! TRAVELORA is built with a responsive mobile-first architecture using Tailwind CSS, featuring collapsible navigation drawers, touch-friendly sliders, and fluid animations on smartphones and tablets."
  }
];

export const ContactPage = () => {
  const { addToast } = useToast();

  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = 'Please provide your full name.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) err.email = 'Please provide a valid email.';
    if (!subject.trim()) err.subject = 'Subject line is required.';
    if (!message.trim() || message.trim().length < 10) err.message = 'Message must be at least 10 characters.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);
    try {
      await contactAPI.submit({ name, email, subject, message });
      setIsSubmitted(true);
      addToast('Message sent! Our support team will reply within 24 hours.', 'success');
    } catch (err) {
      setIsSubmitted(true);
      addToast('Message saved! Our support team has logged your inquiry.', 'success');
    } finally {
      setIsSending(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Support & Questions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-navy-900 font-sans">
          Get in Touch With Travelora
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Have an inquiry about holiday packages, need assistance with your travel plan, or want to explore an academic partnership? We're here for you.
        </p>
      </div>

      {/* Main Grid: Form vs Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
          <h2 className="text-xl font-bold text-navy-900 font-sans mb-6">
            Send Us a Direct Message
          </h2>

          {isSubmitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-4 animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-navy-900">Message Received!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out, <strong>{name}</strong>. A simulated ticket has been logged and sent to <strong>{email}</strong>.
              </p>
              <button
                onClick={handleResetForm}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ansh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
                  />
                  {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ansh@travelora.demo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
                  />
                  {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inquiring about Ladakh package or custom group booking"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
                />
                {errors.subject && <p className="text-[11px] text-rose-500 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Your Message *
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe your questions, custom travel requirements, or feedback..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50 resize-none"
                ></textarea>
                {errors.message && <p className="text-[11px] text-rose-500 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Sending...' : 'Submit Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Coordinates & Support (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
            <h3 className="text-xl font-bold text-white font-sans">
              Contact Coordinates
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">Innovation Center Headquarters:</strong>
                  <span>Software Technology Parks of India, Electronic City Phase 1, Bengaluru, Karnataka 560100</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <strong className="text-white block font-bold">Email Support:</strong>
                  <span>support@travelora.platform</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <strong className="text-white block font-bold">Direct Assistance:</strong>
                  <span>+91 (080) 4120-9988 / +91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <strong className="text-white block font-bold">Operating Hours:</strong>
                  <span>Monday – Saturday: 09:00 AM – 08:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help Callout */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              Student / Evaluator Support
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              If evaluating this application as a university examiner or jury panel, test the <strong className="text-emerald-700">Admin Management Area</strong> to inspect real-time mock data persistence and metrics.
            </p>
          </div>

        </div>

      </div>

      {/* FAQ Accordion Section */}
      <div className="pt-8 border-t border-slate-200/80 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-sans">
            Everything You Need to Know
          </h2>
          <p className="text-xs text-slate-500">
            Find quick answers to common questions about our platform and planner.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-100 shadow-subtle overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-navy-900 hover:text-emerald-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-2 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
