/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Calendar, 
  Compass, 
  DollarSign, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ArrowRight,
  Utensils,
  Palmtree,
  Landmark,
  ShoppingBag,
  Volume2,
  Send,
  Loader2,
  X,
  ExternalLink,
  Map as MapIcon
} from 'lucide-react';
import { generateItinerary, refineItinerary, type Itinerary, type Day, type Location } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const INTERESTS = [
  { id: 'culture', label: 'Culture & History', icon: Landmark },
  { id: 'food', label: 'Gastronomy', icon: Utensils },
  { id: 'nature', label: 'Nature & Outdoors', icon: Palmtree },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'nightlife', label: 'Nightlife', icon: Sparkles },
  { id: 'relaxation', label: 'Relaxation', icon: Compass },
];

const BUDGETS = [
  { id: 'budget', label: 'Budget', icon: DollarSign, count: 1 },
  { id: 'mid', label: 'Mid-range', icon: DollarSign, count: 2 },
  { id: 'luxury', label: 'Luxury', icon: DollarSign, count: 3 },
];

export default function App() {
  const [step, setStep] = useState<'landing' | 'input' | 'loading' | 'result'>('landing');
  const [destination, setDestination] = useState('');
  const [tripLength, setTripLength] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('mid');
  const [preferences, setPreferences] = useState('');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [isRefining, setIsRefining] = useState(false);
  const [refinementText, setRefinementText] = useState('');
  const [playingNarration, setPlayingNarration] = useState<string | null>(null);

  const handleGenerate = async () => {
    setStep('loading');
    try {
      const result = await generateItinerary({
        destination,
        tripLength,
        interests: selectedInterests,
        budget,
        preferences
      });
      setItinerary(result);
      setStep('result');
    } catch (error) {
      console.error(error);
      setStep('input');
    }
  };

  const handleRefine = async () => {
    if (!itinerary || !refinementText.trim()) return;
    setIsRefining(true);
    try {
      const result = await refineItinerary(itinerary, refinementText);
      setItinerary(result);
      setRefinementText('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefining(false);
    }
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-bg text-white selection:bg-accent/30">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover opacity-40 grayscale"
                alt="Travel background"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/60 to-bg" />
            </div>

            <div className="relative z-10 text-center px-6 max-w-4xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-accent uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
                  The Future of Exploration
                </span>
                <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight tracking-tighter">
                  Vivid<span className="italic">Path</span>
                </h1>
                <p className="text-lg md:text-xl text-white/60 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                  Experience travel designed for you. Our AI architect crafts geographically coherent, 
                  vividly narrated journeys that transform destinations into stories.
                </p>
                <button
                  onClick={() => setStep('input')}
                  className="group relative px-12 py-5 bg-accent text-bg font-semibold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Begin Your Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.main>
        )}

        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <div className="w-full max-w-2xl space-y-12">
              <header className="text-center">
                <h2 className="text-4xl font-serif mb-2">Design Your Escape</h2>
                <p className="text-white/40">Tell us where you want to go and what moves you.</p>
              </header>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest text-accent font-semibold">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                      type="text"
                      placeholder="e.g. Kyoto, Japan"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent/50 transition-colors text-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-widest text-accent font-semibold">Duration (Days)</label>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2">
                      <button 
                        onClick={() => setTripLength(Math.max(1, tripLength - 1))}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="flex-1 text-center text-xl font-medium">{tripLength}</span>
                      <button 
                        onClick={() => setTripLength(Math.min(14, tripLength + 1))}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-widest text-accent font-semibold">Budget</label>
                    <div className="flex gap-2">
                      {BUDGETS.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setBudget(b.id)}
                          className={cn(
                            "flex-1 py-3 rounded-2xl border transition-all flex flex-col items-center gap-1",
                            budget === b.id 
                              ? "bg-accent border-accent text-bg" 
                              : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                          )}
                        >
                          <div className="flex">
                            {Array.from({ length: b.count }).map((_, i) => (
                              <DollarSign key={i} className="w-3 h-3" />
                            ))}
                          </div>
                          <span className="text-[10px] uppercase font-bold">{b.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest text-accent font-semibold">Interests</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {INTERESTS.map((interest) => {
                      const Icon = interest.icon;
                      const isSelected = selectedInterests.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          onClick={() => toggleInterest(interest.id)}
                          className={cn(
                            "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 text-center",
                            isSelected 
                              ? "bg-accent/10 border-accent text-accent" 
                              : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-medium">{interest.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest text-accent font-semibold">Additional Preferences</label>
                  <textarea
                    placeholder="e.g. Slow mornings, vegetarian food, hidden gems only..."
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-accent/50 transition-colors h-32 resize-none"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!destination}
                  className="w-full py-5 bg-accent text-bg font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Generate Itinerary
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col items-center justify-center space-y-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-t-2 border-accent rounded-full"
              />
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-accent animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-serif">Architecting Your Path</h3>
              <p className="text-white/40 animate-pulse">Consulting maps, local secrets, and vivid stories...</p>
            </div>
          </motion.div>
        )}

        {step === 'result' && itinerary && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col md:flex-row"
          >
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-80 bg-white/[0.02] border-r border-white/10 p-6 flex flex-col gap-8">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Destination</span>
                <h2 className="text-3xl font-serif">{itinerary.destination}</h2>
              </div>

              <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                {itinerary.days.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDay(idx)}
                    className={cn(
                      "w-full p-4 rounded-2xl text-left transition-all group",
                      activeDay === idx 
                        ? "bg-accent text-bg shadow-lg shadow-accent/20" 
                        : "hover:bg-white/5 text-white/60"
                    )}
                  >
                    <div className="text-[10px] uppercase font-bold mb-1 opacity-60">Day {day.dayNumber}</div>
                    <div className="font-serif text-lg leading-tight">{day.title}</div>
                  </button>
                ))}
              </nav>

              <div className="pt-6 border-t border-white/10">
                <button 
                  onClick={() => setStep('input')}
                  className="flex items-center gap-2 text-white/40 hover:text-accent transition-colors text-sm"
                >
                  <X className="w-4 h-4" /> Reset Trip
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen p-6 md:p-12 space-y-12">
              <motion.section
                key={activeDay}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                <header className="space-y-4">
                  <div className="flex items-center gap-3 text-accent">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-widest font-bold">Day {itinerary.days[activeDay].dayNumber}</span>
                  </div>
                  <h3 className="text-5xl font-serif leading-tight">{itinerary.days[activeDay].title}</h3>
                  <p className="text-xl text-white/60 font-light leading-relaxed italic">
                    "{itinerary.days[activeDay].summary}"
                  </p>
                </header>

                <div className="space-y-8 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-accent/50 via-accent/20 to-transparent hidden md:block" />

                  {itinerary.days[activeDay].locations.map((loc, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative md:pl-16 group"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-5 top-8 w-3 h-3 rounded-full bg-accent border-4 border-bg -translate-x-1/2 hidden md:block group-hover:scale-150 transition-transform" />

                      <div className="glass rounded-3xl p-8 space-y-6 hover:border-accent/30 transition-all">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-accent/60 text-[10px] uppercase font-bold tracking-widest">
                              <Clock className="w-3 h-3" /> {loc.suggestedTime}
                              <span className="mx-2">•</span>
                              <MapPin className="w-3 h-3" /> {loc.category}
                            </div>
                            <h4 className="text-2xl font-serif">{loc.name}</h4>
                          </div>
                          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-accent">
                            {loc.costLevel}
                          </div>
                        </div>

                        <p className="text-white/70 leading-relaxed">{loc.description}</p>

                        <div className="flex flex-wrap gap-4">
                          {loc.websiteUrl && (
                            <a 
                              href={loc.websiteUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs font-bold text-accent hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" /> Official Website
                            </a>
                          )}
                          {loc.mapsUrl && (
                            <a 
                              href={loc.mapsUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs font-bold text-accent hover:underline"
                            >
                              <MapIcon className="w-3 h-3" /> View on Google Maps
                            </a>
                          )}
                        </div>

                        {/* Map Embed */}
                        <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/10 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={`https://maps.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}&z=15&output=embed`}
                          />
                        </div>

                        <div className="bg-bg/50 rounded-2xl p-6 border border-white/5 relative overflow-hidden group/narration">
                          <div className="absolute top-0 left-0 w-1 h-full bg-accent/30" />
                          <div className="flex items-start gap-4">
                            <button 
                              onClick={() => setPlayingNarration(playingNarration === loc.narration ? null : loc.narration)}
                              className={cn(
                                "p-3 rounded-full transition-all",
                                playingNarration === loc.narration ? "bg-accent text-bg" : "bg-white/5 text-accent hover:bg-white/10"
                              )}
                            >
                              <Volume2 className={cn("w-5 h-5", playingNarration === loc.narration && "animate-pulse")} />
                            </button>
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Vivid Narration</span>
                              <p className="text-sm italic font-serif text-white/80 leading-relaxed">
                                {loc.narration}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </main>

            {/* Refinement Chat */}
            <div className="fixed bottom-8 right-8 z-50">
              <div className="flex flex-col items-end gap-4">
                <AnimatePresence>
                  {isRefining && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-accent text-bg px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl"
                    >
                      <Loader2 className="w-3 h-3 animate-spin" /> Refining Itinerary...
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="glass rounded-3xl p-2 flex items-center gap-2 w-[320px] md:w-[400px] shadow-2xl">
                  <input
                    type="text"
                    placeholder="Refine trip (e.g. 'more food stops')"
                    value={refinementText}
                    onChange={(e) => setRefinementText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2"
                  />
                  <button
                    onClick={handleRefine}
                    disabled={isRefining || !refinementText.trim()}
                    className="p-3 bg-accent text-bg rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
