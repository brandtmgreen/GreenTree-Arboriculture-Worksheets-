import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Sparkles, 
  CheckSquare, 
  Plus, 
  Trash2, 
  UserCheck, 
  Printer, 
  Mic, 
  BookOpen, 
  Lightbulb, 
  HeartPulse, 
  CheckCircle2, 
  Smile 
} from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';
import { FieldNotesSection } from './FieldNotesSection';
import { SignatureCanvas } from './SignatureCanvas';
import { printBlankWorksheet } from '../utils/printHelpers';
import { SafetyPresenterPlaybook } from './SafetyPresenterPlaybook';
import { SafetyScript, SAFETY_SCRIPTS } from '../data/safetyPresenterScripts';

export const WeeklySafetyMeeting: React.FC = () => {
  const { siteData, updateSiteData } = useSiteContext();
  const [presenterScript, setPresenterScript] = useState('');
  const [showPlaybook, setShowPlaybook] = useState(false);
  const [activeScriptName, setActiveScriptName] = useState<string | null>(null);

  const [attendees, setAttendees] = useState<string[]>(
    siteData.crewLeader ? [siteData.crewLeader] : []
  );
  const [newAttendee, setNewAttendee] = useState('');

  const addAttendee = () => {
    if (newAttendee && !attendees.includes(newAttendee)) {
      setAttendees([...attendees, newAttendee]);
      setNewAttendee('');
    }
  };

  const handleRemoveAttendee = (name: string) => {
    setAttendees(attendees.filter(x => x !== name));
  };

  const handleSelectScriptFromPlaybook = (script: SafetyScript) => {
    const formattedScript = `[WEEKLY SAFETY MEETING TALK: ${script.title.toUpperCase()}]
Reference: ${script.ansiReference} • Est. Duration: ${script.durationMinutes} Minutes

1. CALL TO ATTENTION (OPENING HOOK):
"${script.callToAttention.script}"
[Speaker note: ${script.callToAttention.stageDirection}]

2. STORY OF REAL INCIDENT (${script.realEventStory.headline}):
${script.realEventStory.narrative}
Outcome: ${script.realEventStory.consequence}
[Speaker note: ${script.realEventStory.stageDirection}]

3. THE SAFETY RULE (${script.theSafetyRule.ruleTitle}):
${script.theSafetyRule.ruleText}
Practical Demo: ${script.theSafetyRule.practicalDemonstration}
[Speaker note: ${script.theSafetyRule.stageDirection}]

4. THE JOKE (TENSION BREAKER):
Setup: "${script.theJoke.setup}"
Punchline: "${script.theJoke.punchline}"
[Speaker note: ${script.theJoke.stageDirection}]

5. HANDS-IN CREW HUDDLE:
Leader Call: "${script.handsInHuddle.call}"
Crew Response: "${script.handsInHuddle.response}"
[Speaker note: ${script.handsInHuddle.stageDirection}]`;

    setPresenterScript(formattedScript);
    setActiveScriptName(script.title);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
            <Users size={24} className="sm:w-7 sm:h-7" />
            Weekly Safety Meeting & Tailboard Training
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            OSHA 1910 & ANSI Z133 Tailboard Education, Incident Debrief & Crew Sign-Off
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowPlaybook(!showPlaybook)}
            className={`btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 transition-all ${
              showPlaybook 
                ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs' 
                : 'bg-emerald-800 text-white hover:bg-emerald-900 border-emerald-800'
            }`}
            title="Open the complete Presenter Playbook with word-for-word scripts, jokes, huddles, and delivery coaching"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-200" />
            <span>{showPlaybook ? 'Close Script Book' : `Presenter Script Book (${SAFETY_SCRIPTS.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => printBlankWorksheet('safety')}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            title="Print blank weekly safety training sheet with ruled handwriting lines"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            Print Blank Form
          </button>
          <div className="text-[10px] sm:text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
            Ref: GTA-SAF-02
          </div>
        </div>
      </div>

      {/* Embedded Presenter Playbook Drawer */}
      {showPlaybook && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <SafetyPresenterPlaybook
            embedded={true}
            onSelectScript={(script) => {
              handleSelectScriptFromPlaybook(script);
            }}
            onClose={() => setShowPlaybook(false)}
          />
        </div>
      )}

      {/* Main Worksheet Card */}
      <div className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Company Name */}
        <section>
          <label className="text-xs font-bold uppercase text-brand-green flex items-center gap-2 mb-1">
            Operating Entity / Partner Company
          </label>
          <input 
            type="text" 
            className="input-field border-brand-green/20" 
            value={siteData.companyName || ''} 
            onChange={(e) => updateSiteData({ companyName: e.target.value })} 
            placeholder="e.g. GreenTree Arboriculture" 
          />
        </section>

        {/* Talk Notes & Script Book Integration */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
            <div className="section-header text-brand-green border-none pb-0 mb-0">
              <FileText size={18} />
              Presenter Script & Safety Discussion Material
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPlaybook(true)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300/60 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>Browse {SAFETY_SCRIPTS.length} Scripted Talks</span>
              </button>
            </div>
          </div>

          {activeScriptName && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Active Talk: <strong>{activeScriptName}</strong> (loaded from Presenter Playbook)</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveScriptName(null)}
                className="text-emerald-700 hover:text-emerald-900 text-[11px] underline"
              >
                Clear
              </button>
            </div>
          )}

          {/* Quick Script Pill Presets */}
          <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-700" /> Quick-Load Common Tailboard Scripts:
              </span>
              <span className="text-[10px] text-gray-400">Click to load into editor</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAFETY_SCRIPTS.map((script) => (
                <button
                  key={script.id}
                  type="button"
                  onClick={() => handleSelectScriptFromPlaybook(script)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all text-left ${
                    activeScriptName === script.title
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-600 hover:text-emerald-900'
                  }`}
                >
                  <span className="font-mono text-[10px] text-gray-400 mr-1">#{script.topicNumber}</span>
                  {script.title}
                </button>
              ))}
            </div>
          </div>

          <textarea 
            className="input-field min-h-[200px] font-mono text-xs leading-relaxed"
            value={presenterScript}
            onChange={(e) => setPresenterScript(e.target.value)}
            placeholder="Type your meeting notes or click 'Presenter Script Book' above to select a scripted talk with attention hook, true event story, safety rule, joke, and hands-in huddle..."
          />
        </section>

        {/* Attendance List */}
        <section className="space-y-3">
          <div className="section-header text-brand-green">
            <Users size={18} />
            Crew Attendance & Training Sign-In Roster
          </div>
          <p className="text-[11px] text-gray-500 italic block">
            Record all field personnel who attended the morning safety briefing and confirmed understanding.
          </p>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="input-field text-sm"
              placeholder="Enter crew member name..."
              value={newAttendee}
              onChange={(e) => setNewAttendee(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addAttendee()}
            />
            <button 
              type="button"
              onClick={addAttendee} 
              className="btn-primary py-2 px-4 text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-1"
            >
              <Plus size={14} /> Add Attendee
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {attendees.length === 0 ? (
              <div className="col-span-2 text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400 text-xs">
                No crew members signed in yet. Add attendees above or sign in with crew leader.
              </div>
            ) : (
              attendees.map(name => (
                <div key={name} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <CheckSquare size={16} className="text-brand-green shrink-0" />
                    <span className="text-xs font-bold text-gray-800">{name}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveAttendee(name)} 
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                    title="Remove Attendee"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Meeting Discussion, Near-Misses & Action Items */}
        <FieldNotesSection 
          value={siteData.safetyNotes || ''} 
          onChange={(val) => updateSiteData({ safetyNotes: val })} 
          placeholder="Record near-miss investigations, crew feedback, machine calibration issues, or weather protocols discussed..."
          instruction="Log key safety questions asked by the crew, jobsite near-miss incidents, or corrective actions agreed upon during the huddle."
          title="Near-Miss Debrief & Meeting Minutes"
        />

        {/* Safety Meeting Leader Sign-Off */}
        <section className="bg-gray-50/80 rounded-xl p-4 border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 text-brand-green font-bold text-sm">
            <UserCheck size={18} />
            Safety Meeting Leader & Presenter Sign-Off
          </div>
          <SignatureCanvas
            id="weekly-safety-presenter-signature"
            label="Meeting Presenter Signature"
            subtitle="Sign here to certify weekly safety training delivery and crew attendance confirmation"
            signerName={siteData.crewLeader || 'Safety Officer'}
            date={siteData.date || new Date().toISOString().split('T')[0]}
            height={130}
          />
        </section>
      </div>
    </div>
  );
};

export default WeeklySafetyMeeting;
