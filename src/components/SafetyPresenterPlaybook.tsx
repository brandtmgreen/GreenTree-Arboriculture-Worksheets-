import React, { useState } from 'react';
import { 
  BookOpen, 
  Smile, 
  HeartPulse, 
  Volume2, 
  Users, 
  Shield, 
  Clock, 
  ExternalLink, 
  Check, 
  Copy, 
  Printer, 
  Sparkles, 
  ChevronRight, 
  Filter, 
  AlertTriangle,
  Lightbulb,
  Mic,
  BookmarkCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { 
  SAFETY_SCRIPTS, 
  SafetyScript, 
  NERVOUS_SPEAKER_COACH 
} from '../data/safetyPresenterScripts';

interface SafetyPresenterPlaybookProps {
  onSelectScript?: (script: SafetyScript) => void;
  onClose?: () => void;
  embedded?: boolean;
}

export const SafetyPresenterPlaybook: React.FC<SafetyPresenterPlaybookProps> = ({
  onSelectScript,
  onClose,
  embedded = false
}) => {
  const [activeTab, setActiveTab] = useState<'scripts' | 'coach'>('scripts');
  const [selectedScriptId, setSelectedScriptId] = useState<string>(SAFETY_SCRIPTS[0].id);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [loadedScriptId, setLoadedScriptId] = useState<string | null>(null);

  const selectedScript = SAFETY_SCRIPTS.find(s => s.id === selectedScriptId) || SAFETY_SCRIPTS[0];

  const categories = [
    'all',
    'Machinery & Tools',
    'Electrical Hazards',
    'Climbing & Rigging',
    'Felling & Drop Zones',
    'Health & Environmental'
  ];

  const filteredScripts = SAFETY_SCRIPTS.filter(s => 
    categoryFilter === 'all' || s.category === categoryFilter
  );

  const handleCopyText = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleLoadScript = (script: SafetyScript) => {
    if (onSelectScript) {
      onSelectScript(script);
      setLoadedScriptId(script.id);
      setTimeout(() => setLoadedScriptId(null), 3000);
    }
  };

  const handlePrintCueCard = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Presenter Cue Card: ${selectedScript.title}</title>
          <style>
            @page { size: letter portrait; margin: 12mm 15mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111; line-height: 1.35; padding: 10px; }
            .header { border-bottom: 3px solid #000; padding-bottom: 8px; margin-bottom: 14px; }
            .title { font-size: 18px; font-weight: 900; text-transform: uppercase; margin: 0; }
            .ref { font-size: 11px; font-family: monospace; color: #555; }
            .section { margin-bottom: 12px; border: 1px solid #ccc; padding: 10px; border-radius: 4px; }
            .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; color: #333; }
            .stage-direction { font-size: 10px; font-style: italic; color: #047857; margin-top: 4px; font-weight: 600; }
            .quote { font-size: 13px; font-weight: 600; color: #000; }
            .story { font-size: 12px; color: #222; }
            .rule { font-size: 12px; font-weight: bold; }
            .joke { font-size: 12px; background: #f9f9f9; padding: 6px; border-left: 3px solid #d97706; }
            .huddle { font-size: 13px; font-weight: 900; background: #ecfdf5; padding: 8px; border-left: 3px solid #059669; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="ref">${selectedScript.ansiReference} • Approx. ${selectedScript.durationMinutes} Minutes</div>
            <h1 class="title">${selectedScript.title}</h1>
          </div>
          <div class="section">
            <div class="section-title">1. Call to Attention (Hook)</div>
            <div class="quote">"${selectedScript.callToAttention.script}"</div>
            <div class="stage-direction">Stage note: ${selectedScript.callToAttention.stageDirection}</div>
          </div>
          <div class="section">
            <div class="section-title">2. Real Event Story: ${selectedScript.realEventStory.headline}</div>
            <div class="story">${selectedScript.realEventStory.narrative}</div>
            <div style="font-size: 11px; color: #b91c1c; font-weight: bold; margin-top: 4px;">Outcome: ${selectedScript.realEventStory.consequence}</div>
            <div class="stage-direction">Stage note: ${selectedScript.realEventStory.stageDirection}</div>
          </div>
          <div class="section">
            <div class="section-title">3. The Safety Rule: ${selectedScript.theSafetyRule.ruleTitle}</div>
            <div class="rule">${selectedScript.theSafetyRule.ruleText}</div>
            <div style="font-size: 11px; color: #444; margin-top: 4px;">Demo: ${selectedScript.theSafetyRule.practicalDemonstration}</div>
            <div class="stage-direction">Stage note: ${selectedScript.theSafetyRule.stageDirection}</div>
          </div>
          <div class="section joke">
            <div class="section-title" style="color: #b45309;">4. Humor / The Joke</div>
            <div><strong>Setup:</strong> "${selectedScript.theJoke.setup}"</div>
            <div><strong>Punchline:</strong> "${selectedScript.theJoke.punchline}"</div>
            <div class="stage-direction">Stage note: ${selectedScript.theJoke.stageDirection}</div>
          </div>
          <div class="section huddle">
            <div class="section-title" style="color: #047857;">5. Hands-In Huddle Breakdown</div>
            <div><strong>Call:</strong> "${selectedScript.handsInHuddle.call}"</div>
            <div><strong>Response:</strong> "${selectedScript.handsInHuddle.response}"</div>
            <div class="stage-direction">Stage note: ${selectedScript.handsInHuddle.stageDirection}</div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden text-left ${embedded ? 'shadow-sm' : 'shadow-xl'}`}>
      {/* Top Header */}
      <div className="bg-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Mic className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              Weekly Safety Meeting Presenter Playbook
            </h3>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              Word-for-word tailboard scripts with attention hooks, true event stories, safety rules, jokes & huddles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Playbook"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 pt-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('scripts')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold border-b-2 transition-all ${
              activeTab === 'scripts'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Safety Meeting Scripts ({SAFETY_SCRIPTS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold border-b-2 transition-all ${
              activeTab === 'coach'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-red-600" />
            <span>Delivery Coach for Nervous Speakers</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 pr-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Each talk is 3–5 minutes</span>
        </div>
      </div>

      {/* TAB 1: SCRIPT BROWSER & PRESENTER DESK */}
      {activeTab === 'scripts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Script Selection Column */}
          <div className="lg:col-span-4 border-r border-gray-200 bg-gray-50/50 flex flex-col">
            {/* Category Filter */}
            <div className="p-3 border-b border-gray-200 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category Filter:
              </span>
              <div className="flex flex-wrap gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      categoryFilter === cat
                        ? 'bg-emerald-800 text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Script List Items */}
            <div className="divide-y divide-gray-200 overflow-y-auto max-h-[500px] flex-grow">
              {filteredScripts.map((script) => {
                const isSelected = script.id === selectedScriptId;
                return (
                  <button
                    key={script.id}
                    type="button"
                    onClick={() => setSelectedScriptId(script.id)}
                    className={`w-full p-3.5 text-left transition-all flex items-start justify-between gap-2 ${
                      isSelected 
                        ? 'bg-white border-l-4 border-emerald-800 shadow-xs' 
                        : 'hover:bg-gray-100/70'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-gray-500">
                          #{script.topicNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-1.5 rounded">
                          {script.category}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 mt-1 line-clamp-1">
                        {script.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {script.realEventStory.headline}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-emerald-800' : 'text-gray-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Script Reader & Action Desk */}
          <div className="lg:col-span-8 p-4 sm:p-6 overflow-y-auto max-h-[640px] space-y-4">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                  {selectedScript.ansiReference} • ~{selectedScript.durationMinutes} Minutes
                </span>
                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  {selectedScript.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handlePrintCueCard}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  title="Print clipboard presenter cue card with stage directions"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Print Cue Card</span>
                </button>

                {onSelectScript && (
                  <button
                    type="button"
                    onClick={() => handleLoadScript(selectedScript)}
                    className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5"
                  >
                    {loadedScriptId === selectedScript.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Loaded into Meeting!</span>
                      </>
                    ) : (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        <span>Use This Talk for Today</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* PART 1: CALL TO ATTENTION */}
            <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  1. Call to Attention (Word-for-Word Opening Hook)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(selectedScript.callToAttention.script, 'cta')}
                  className="text-gray-400 hover:text-emerald-800 transition-colors p-1"
                  title="Copy opening hook"
                >
                  {copiedSection === 'cta' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-sm font-semibold text-gray-900 italic leading-relaxed">
                "{selectedScript.callToAttention.script}"
              </p>
              <div className="text-[11px] text-emerald-800 font-medium bg-emerald-100/50 p-2 rounded border border-emerald-200/60 mt-1">
                <strong>Stage Direction for Speaker:</strong> {selectedScript.callToAttention.stageDirection}
              </div>
            </div>

            {/* PART 2: REAL EVENT STORY */}
            <div className="border border-red-200 rounded-xl p-3.5 bg-red-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                  2. Story of Real Event: {selectedScript.realEventStory.headline}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(selectedScript.realEventStory.narrative, 'story')}
                  className="text-gray-400 hover:text-red-800 transition-colors p-1"
                  title="Copy incident narrative"
                >
                  {copiedSection === 'story' ? <Check className="w-3.5 h-3.5 text-red-700" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-gray-800 leading-relaxed">
                {selectedScript.realEventStory.narrative}
              </p>
              <div className="p-2 rounded bg-white border border-red-200 text-red-900 font-bold text-xs">
                ⚠️ Outcome: {selectedScript.realEventStory.consequence}
              </div>
              <div className="text-[11px] text-gray-600 italic">
                <strong>Speaker Coaching:</strong> {selectedScript.realEventStory.stageDirection}
              </div>
            </div>

            {/* PART 3: THE SAFETY RULE */}
            <div className="border border-emerald-600/30 rounded-xl p-3.5 bg-emerald-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-800" />
                  3. The Safety Rule: {selectedScript.theSafetyRule.ruleTitle}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(selectedScript.theSafetyRule.ruleText, 'rule')}
                  className="text-gray-400 hover:text-emerald-800 transition-colors p-1"
                  title="Copy safety rule"
                >
                  {copiedSection === 'rule' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs font-bold text-gray-900 leading-relaxed bg-white p-2.5 rounded-lg border border-emerald-200">
                {selectedScript.theSafetyRule.ruleText}
              </p>
              <p className="text-xs text-gray-700">
                <strong>Practical Demonstration:</strong> {selectedScript.theSafetyRule.practicalDemonstration}
              </p>
              <div className="text-[11px] text-emerald-900 italic">
                <strong>Physical Motion:</strong> {selectedScript.theSafetyRule.stageDirection}
              </div>
            </div>

            {/* PART 4: THE JOKE */}
            <div className="border border-amber-300 rounded-xl p-3.5 bg-amber-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-amber-700" />
                  4. The Tension-Breaker Joke (Arborist Humor)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(`${selectedScript.theJoke.setup} ${selectedScript.theJoke.punchline}`, 'joke')}
                  className="text-gray-400 hover:text-amber-800 transition-colors p-1"
                  title="Copy joke"
                >
                  {copiedSection === 'joke' ? <Check className="w-3.5 h-3.5 text-amber-700" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-gray-800">
                  <span className="font-bold text-amber-950">Setup:</span> "{selectedScript.theJoke.setup}"
                </p>
                <p className="text-gray-950 font-bold bg-white p-2 rounded border border-amber-200 text-sm">
                  👉 Punchline: "{selectedScript.theJoke.punchline}"
                </p>
              </div>
              <div className="text-[11px] text-amber-900 italic">
                <strong>Delivery Advice:</strong> {selectedScript.theJoke.stageDirection}
              </div>
            </div>

            {/* PART 5: HANDS-IN HUDDLE */}
            <div className="border-2 border-emerald-800 rounded-xl p-3.5 bg-emerald-950/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-800" />
                  5. Hands-In Crew Huddle Breakdown
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(`${selectedScript.handsInHuddle.call} ${selectedScript.handsInHuddle.response}`, 'huddle')}
                  className="text-gray-400 hover:text-emerald-800 transition-colors p-1"
                  title="Copy huddle chant"
                >
                  {copiedSection === 'huddle' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="text-gray-800">
                  <strong className="text-emerald-900 uppercase text-[10px]">Leader Calls Out:</strong> "{selectedScript.handsInHuddle.call}"
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-800 text-white font-mono font-black text-sm tracking-wide text-center">
                  "{selectedScript.handsInHuddle.response}"
                </div>
              </div>
              <div className="text-[11px] text-gray-600 italic">
                <strong>Physical Lead:</strong> {selectedScript.handsInHuddle.stageDirection}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NERVOUS PUBLIC SPEAKER COACH */}
      {activeTab === 'coach' && (
        <div className="p-4 sm:p-6 space-y-6 max-h-[640px] overflow-y-auto">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2 text-xs text-emerald-950">
            <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-emerald-900">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              The Tailboard Mindset Shift: You Are Not Giving a TED Talk
            </h4>
            <p className="leading-relaxed">
              Most crew leaders hate speaking in public because they think they need to look like an actor or a charismatic motivational speaker. <strong>You don't.</strong> Your crew does not care about smooth transitions or fancy vocabulary. They care that you are honest, that you know the job, and that you care enough about them to make sure every single person goes home with all ten fingers and ten toes tonight.
            </p>
          </div>

          <div className="space-y-6">
            {NERVOUS_SPEAKER_COACH.map((section, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h4 className="text-sm font-black uppercase tracking-tight text-gray-900">
                    {section.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {section.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {section.tactics.map((tactic, tIdx) => (
                    <div key={tIdx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2 text-xs flex flex-col justify-between">
                      <div>
                        <h5 className="font-bold text-gray-900 text-xs mb-1">
                          {tactic.heading}
                        </h5>
                        <p className="text-gray-600 leading-relaxed text-[11px]">
                          {tactic.explanation}
                        </p>
                      </div>
                      <div className="p-2 bg-emerald-50/80 rounded border border-emerald-200 text-emerald-950 text-[10.5px] mt-2">
                        <strong>Actionable Drill:</strong> {tactic.actionableDrill}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">
              Ready to Lead Today's Meeting?
            </h4>
            <p className="text-xs text-gray-500 max-w-lg mx-auto">
              Choose a script from the collection, take your 4-second box breath, and step into the circle. Your crew is listening.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('scripts')}
              className="btn-primary text-xs py-2 px-4"
            >
              Browse Safety Meeting Scripts
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyPresenterPlaybook;
