import React, { useState } from 'react';
import { Briefcase, Calendar, User, Users, CheckCircle2, Shield, Zap, Phone, Mail, Building, ClipboardList, Truck, AlertTriangle, UserCheck, FileText, Sparkles, Navigation, HeartPulse } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';
import { FieldNotesSection } from './FieldNotesSection';
import { SignatureCanvas } from './SignatureCanvas';
import { printBlankWorksheet } from '../utils/printHelpers';
import { FieldInstructionBlock } from './FieldInstructionBlock';

export const JobBriefing: React.FC = () => {
  const { siteData, updateSiteData } = useSiteContext();

  // Environmental Parameters
  const [weather, setWeather] = useState(siteData.weather || 'Sunny / Clear');
  const [windSpeed, setWindSpeed] = useState('5-10 mph');
  const [groundConditions, setGroundConditions] = useState(siteData.siteConditions || 'Dry / Firm');

  // Emergency Action Plan (EAP) - ANSI Z133 Mandate
  const [eapHospitalName, setEapHospitalName] = useState('Providence Regional Medical Trauma Center');
  const [eapHospitalAddress, setEapHospitalAddress] = useState('916 Pacific Ave, Trauma Emergency Dept');
  const [eapHospitalPhone, setEapHospitalPhone] = useState('(555) 019-2831');
  const [eapCrossStreets, setEapCrossStreets] = useState(siteData.location || '');
  const [eapRescueClimber, setEapRescueClimber] = useState(siteData.crewLeader || '');
  const [eapEmergencyDriver, setEapEmergencyDriver] = useState('');
  const [eapFirstAidKitLocation, setEapFirstAidKitLocation] = useState('Truck #4 Cab (Behind Driver Seat)');

  // Electrical Hazard - ANSI Z133 Table 1
  const [conductorVoltage, setConductorVoltage] = useState('13.2 kV (Distribution)');
  const [minimumApproachDist, setMinimumApproachDist] = useState('10 ft 4 in (Qualified Line Clearance)');
  const [utilityOperator, setUtilityOperator] = useState('City Power & Light - Dispatch # 555-0144');
  const [electricalStatus, setElectricalStatus] = useState('Visual observation confirmed; lines active, maintaining standard MAD');

  // Felling & Rigging Specifications
  const [fellingNotchType, setFellingNotchType] = useState('Open Face (70° - 90°) with Humboldt flat bottom');
  const [hingeThickness, setHingeThickness] = useState('10% DBH (approx 3.2 in) with intentional steering');
  const [riggingAnchorSpecs, setRiggingAnchorSpecs] = useState('High central crotch, 5/8" Stable Braid bull rope, Port-a-Wrap at base');
  const [escapeRouteDescription, setEscapeRouteDescription] = useState('45 degrees back and to the northwest; cleared of brush and obstacles');

  // Operational Notification State
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSmartFill = () => {
    if (siteData) {
      updateSiteData({
        date: siteData.date || new Date().toISOString().split('T')[0],
        location: siteData.location || '',
        clientName: siteData.clientName || '',
        scope: siteData.scope || `Tree Species: ${siteData.treeSpecies?.join(', ') || 'N/A'}.\nSite Conditions: ${siteData.siteConditions || 'N/A'}.\nHazards: ${siteData.hazards?.join(', ') || 'N/A'}.`
      });
      if (siteData.location) setEapCrossStreets(siteData.location);
      if (siteData.crewLeader) setEapRescueClimber(siteData.crewLeader);
    }
  };

  const handleTaskToggle = (task: string) => {
    const currentTasks = siteData.tasks || [];
    const newTasks = currentTasks.includes(task)
      ? currentTasks.filter(t => t !== task)
      : [...currentTasks, task];
    updateSiteData({ tasks: newTasks });
  };

  const handleEquipmentToggle = (item: string) => {
    const currentEquipment = siteData.equipment || [];
    const newEquipment = currentEquipment.includes(item)
      ? currentEquipment.filter(e => e !== item)
      : [...currentEquipment, item];
    updateSiteData({ equipment: newEquipment });
  };

  const handleSaveBriefing = () => {
    const now = new Date().toLocaleString();
    updateSiteData({
      briefingSignedDate: now,
      weather,
      siteConditions: groundConditions,
      briefingNotes: `EAP: Hospital: ${eapHospitalName} (${eapHospitalPhone}) | Rescue: ${eapRescueClimber} | Driver: ${eapEmergencyDriver} | 911 Streets: ${eapCrossStreets}\nElectrical: ${conductorVoltage} | MAD: ${minimumApproachDist} | Utility: ${utilityOperator}\nRigging: ${riggingAnchorSpecs} | Notch: ${fellingNotchType} | Hinge: ${hingeThickness}\n\n${siteData.briefingNotes || ''}`
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
            <Briefcase size={24} className="sm:w-7 sm:h-7" />
            Job Briefing & Safety Work Order
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ANSI Z133 & OSHA 1910.269 Safety Operations & Tailboard Protocol
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => printBlankWorksheet('briefing')}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            title="Print blank job safety briefing & tailboard meeting worksheet"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            Print Blank Form
          </button>
          {siteData && (siteData.location || siteData.clientName || siteData.treeSpecies) && (
            <button 
              type="button"
              onClick={handleSmartFill}
              className="btn-secondary text-xs py-1.5 bg-brand-vibrant/10 border-brand-vibrant text-brand-vibrant hover:bg-brand-vibrant hover:text-white"
            >
              <Sparkles size={14} />
              Smart Fill from Project Data
            </button>
          )}
          <div className="text-[10px] sm:text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
            Ref: GTA-SOP-01
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Tailboard Safety Briefing & Emergency Action Plan recorded and signed off for dispatch.</span>
        </div>
      )}

      <div className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Company Name */}
        <section>
          <label className="text-xs font-bold uppercase text-brand-green flex items-center gap-2 mb-1">
            Operating Entity / Arborist Contractor
          </label>
          <input 
            type="text" 
            className="input-field border-brand-green/20" 
            value={siteData.companyName || ''} 
            onChange={(e) => updateSiteData({ companyName: e.target.value })} 
            placeholder="e.g. GreenTree Arboriculture" 
          />
        </section>

        {/* Customer & Info */}
        <section>
          <div className="section-header text-brand-green">
            <User size={18} />
            Customer & Job Site Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                <User size={14} /> Client Full Name
              </label>
              <input type="text" className="input-field" value={siteData.clientName || ''} onChange={(e) => updateSiteData({ clientName: e.target.value })} placeholder="e.g. Eleanor Vance" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                <Building size={14} /> Property Physical Address
              </label>
              <input type="text" className="input-field" value={siteData.location || ''} onChange={(e) => updateSiteData({ location: e.target.value })} placeholder="e.g. 742 Evergreen Terrace" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                <Phone size={14} /> Contact Phone
              </label>
              <input type="tel" className="input-field" value={siteData.phone || ''} onChange={(e) => updateSiteData({ phone: e.target.value })} placeholder="e.g. (555) 234-5678" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                <Mail size={14} /> Email Address
              </label>
              <input type="email" className="input-field" value={siteData.email || ''} onChange={(e) => updateSiteData({ email: e.target.value })} placeholder="e.g. client@example.com" />
            </div>
          </div>
        </section>
        
        {/* Basic Info */}
        <section>
          <div className="section-header text-brand-green">
            <Calendar size={18} />
            Schedule & Supervision
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Scheduled Date</label>
              <input type="date" className="input-field" value={siteData.date || ''} onChange={(e) => updateSiteData({ date: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Crew Leader / Field Supervisor</label>
              <input type="text" className="input-field" value={siteData.crewLeader || ''} onChange={(e) => updateSiteData({ crewLeader: e.target.value })} placeholder="e.g. Mike Ross, Certified Arborist" />
            </div>
          </div>
        </section>

        {/* SECTION 1: EMERGENCY ACTION PLAN (EAP) - MANDATORY ANSI Z133 */}
        <section className="bg-emerald-950/5 p-4 rounded-xl border border-black/15 space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-300 text-black font-bold text-sm">
            <HeartPulse className="w-4 h-4 text-red-600" />
            1. Emergency Action Plan (EAP) - Mandatory ANSI Z133 Section 3
          </div>

          {/* Clickable Field Attainment Protocol */}
          <FieldInstructionBlock 
            instructionId="eap-dispatch" 
            onApplyTemplate={(tmpl) => {
              setEapHospitalName('Regional Trauma Medical Center');
              setEapHospitalPhone('(555) 019-2831');
            }}
          />

          <p className="text-[11px] text-gray-600">
            Emergency dispatch protocols must be verified with all site personnel prior to engaging equipment or ascending trees.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Exact 911 Physical Location / Nearest Cross Streets
              </label>
              <input 
                type="text" 
                className="input-field font-semibold"
                value={eapCrossStreets}
                onChange={(e) => setEapCrossStreets(e.target.value)}
                placeholder="e.g. 742 Evergreen Terrace (Cross: Elm St & Maple Ave)"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Designated First Aider / CPR
              </label>
              <input 
                type="text" 
                className="input-field"
                value={siteData.crewLeader || ''}
                onChange={(e) => updateSiteData({ crewLeader: e.target.value })}
                placeholder="e.g. Lead Arborist"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Nearest Level 1/2 Trauma Center
              </label>
              <input 
                type="text" 
                className="input-field"
                value={eapHospitalName}
                onChange={(e) => setEapHospitalName(e.target.value)}
                placeholder="e.g. Regional Trauma Medical Center"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Trauma ER Direct Phone Line
              </label>
              <input 
                type="text" 
                className="input-field"
                value={eapHospitalPhone}
                onChange={(e) => setEapHospitalPhone(e.target.value)}
                placeholder="e.g. (555) 019-2831"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Designated Aerial Rescue Climber
              </label>
              <input 
                type="text" 
                className="input-field"
                value={eapRescueClimber}
                onChange={(e) => setEapRescueClimber(e.target.value)}
                placeholder="e.g. Certified Climber"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Designated Emergency Transport Vehicle & Driver
              </label>
              <input 
                type="text" 
                className="input-field"
                value={eapEmergencyDriver}
                onChange={(e) => setEapEmergencyDriver(e.target.value)}
                placeholder="e.g. Truck #2 (Keys on dashboard, driver: Sam Ortiz)"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                First Aid & Trauma Kit Location
              </label>
              <input 
                type="text" 
                className="input-field"
                value={eapFirstAidKitLocation}
                onChange={(e) => setEapFirstAidKitLocation(e.target.value)}
                placeholder="e.g. Truck #4 Cab Behind Driver Seat"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: ELECTRICAL HAZARDS & MINIMUM APPROACH DISTANCE */}
        <section className="bg-amber-50/40 p-4 rounded-xl border border-amber-300/40 space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-amber-200 text-amber-900 font-bold text-sm">
            <Zap className="w-4 h-4 text-amber-600" />
            2. Electrical Hazard Verification & ANSI Z133 Table 1 Minimum Approach Distance (MAD)
          </div>

          {/* Clickable Field Attainment Protocol */}
          <FieldInstructionBlock 
            instructionId="electrical-mad" 
            onApplyTemplate={(tmpl) => {
              setConductorVoltage('13.2 kV Distribution');
              setMinimumApproachDist('10 ft 4 in (Qualified Line Clearance)');
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Conductor Nominal Voltage</label>
              <input 
                type="text" 
                className="input-field"
                value={conductorVoltage}
                onChange={(e) => setConductorVoltage(e.target.value)}
                placeholder="e.g. 13.2 kV (Three-Phase Distribution)"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Minimum Approach Distance (MAD)</label>
              <input 
                type="text" 
                className="input-field font-semibold text-gray-900"
                value={minimumApproachDist}
                onChange={(e) => setMinimumApproachDist(e.target.value)}
                placeholder="e.g. 10 ft 4 in (Qualified Line Clearance)"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Utility Operator & Dispatch</label>
              <input 
                type="text" 
                className="input-field"
                value={utilityOperator}
                onChange={(e) => setUtilityOperator(e.target.value)}
                placeholder="e.g. Pacific Electric Dispatch: 555-0144"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Conductor Isolation / Status & Ground Cover Verification
              </label>
              <input 
                type="text" 
                className="input-field"
                value={electricalStatus}
                onChange={(e) => setElectricalStatus(e.target.value)}
                placeholder="e.g. Lines confirmed energized; maintaining certified line-clearance distances and using non-conductive tools."
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: SCOPE, FELLING & RIGGING SPECIFICATIONS */}
        <section className="space-y-4">
          <div className="section-header text-brand-green">
            <ClipboardList size={18} />
            3. Task Scope, Tree Felling & Rigging Plan
          </div>

          {/* Clickable Field Attainment Protocol */}
          <FieldInstructionBlock 
            instructionId="felling-hinge-mechanics" 
            onApplyTemplate={(tmpl) => {
              setFellingNotchType('Open Face 75° (Apex level)');
              setHingeThickness('10% DBH (3.0 in)');
            }}
          />

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-700 block">Detailed Scope of Work</label>
            <textarea 
              className="input-field min-h-[90px] text-xs" 
              placeholder="Detail specific operations (e.g., Sectional dismantle of 65ft Red Oak over service wires)..."
              value={siteData.scope || ''}
              onChange={(e) => updateSiteData({ scope: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {['ANSI A300 Pruning', 'Sectional Removal', 'Crane Extraction', 'Stump Grinding', 'Site Cleanup'].map((task) => (
              <label key={task} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-brand-vibrant" 
                  checked={(siteData.tasks || []).includes(task)}
                  onChange={() => handleTaskToggle(task)}
                />
                <span className="text-xs font-semibold text-gray-700">{task}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Felling Notch & Hinge Specifications
              </label>
              <input 
                type="text" 
                className="input-field"
                value={fellingNotchType}
                onChange={(e) => setFellingNotchType(e.target.value)}
                placeholder="e.g. Open Face 70° with 10% DBH hinge thickness"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Rigging Anchor Points & Friction Device
              </label>
              <input 
                type="text" 
                className="input-field"
                value={riggingAnchorSpecs}
                onChange={(e) => setRiggingAnchorSpecs(e.target.value)}
                placeholder="e.g. 5/8 Stable Braid through 3/4 arborist block; Port-a-Wrap at base"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Designated Escape Routes (45° angle back & away) & Command-and-Response Audio Signal
              </label>
              <input 
                type="text" 
                className="input-field"
                value={escapeRouteDescription}
                onChange={(e) => setEscapeRouteDescription(e.target.value)}
                placeholder="e.g. Route cleared 45° to northwest; audible horn blast before final backcut release"
              />
            </div>
          </div>
        </section>

        {/* SECTION 4: EQUIPMENT & PPE VERIFICATION */}
        <section className="bg-gray-50/60 p-4 rounded-xl border border-gray-200 space-y-3">
          <div className="section-header text-brand-green border-brand-green/20 pb-1">
            <Truck size={18} />
            4. Machinery, Rigging Resources & Mandatory PPE Verification
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Aerial Lift (Bucket)', 'Wood Chipper', 'Rigging Winch Kit', 'Stump Grinder', 'Ground Protection Mats', 'Chainsaws & Pole Saws', 'Traffic Cones & Signs', 'Drone Unit'].map(item => (
              <label key={item} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-brand-green" 
                  checked={(siteData.equipment || []).includes(item)}
                  onChange={() => handleEquipmentToggle(item)}
                />
                <span className="text-[11px] font-bold text-gray-700">{item}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Weather Conditions</label>
              <select 
                className="input-field" 
                value={weather} 
                onChange={(e) => {
                  setWeather(e.target.value);
                  updateSiteData({ weather: e.target.value });
                }}
              >
                <option>Sunny / Clear</option>
                <option>Overcast</option>
                <option>Light Rain</option>
                <option>Heavy Rain</option>
                <option>Windy (&gt;15 mph)</option>
                <option>Storm Alert</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Estimated Wind Speed</label>
              <input 
                type="text" 
                className="input-field" 
                value={windSpeed}
                onChange={(e) => setWindSpeed(e.target.value)}
                placeholder="e.g. 5-10 mph" 
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Ground Stability</label>
              <select 
                className="input-field" 
                value={groundConditions} 
                onChange={(e) => {
                  setGroundConditions(e.target.value);
                  updateSiteData({ siteConditions: e.target.value });
                }}
              >
                <option>Dry / Firm</option>
                <option>Wet / Soft</option>
                <option>Muddy</option>
                <option>Frozen</option>
                <option>Uneven / Sloped</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notes / Blank Spaces Section */}
        <FieldNotesSection 
          value={siteData.briefingNotes || ''} 
          onChange={(val) => updateSiteData({ briefingNotes: val })} 
          placeholder="Enter arborist dispatch notes, special site directions, or morning briefing comments..."
          instruction="Record any additional toolbox briefing requirements, crew assignments, weather alerts, or site conditions identified during dispatch."
        />

        {/* Crew Leader Safety Briefing Sign-Off */}
        <section className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200 space-y-4">
          <div className="section-header text-brand-green border-brand-green/20">
            <UserCheck size={18} />
            Crew Leader Pre-Work Briefing Sign-off
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Crew Leader Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Mike Ross, Certified Arborist" 
                value={siteData.briefingSignedBy || siteData.crewLeader || ''}
                onChange={(e) => updateSiteData({ 
                  briefingSignedBy: e.target.value,
                  crewLeader: e.target.value 
                })}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Briefing Date & Time</label>
              <input 
                type="text" 
                className="input-field" 
                value={siteData.briefingSignedDate || `${siteData.date || new Date().toISOString().split('T')[0]} 07:30 AM`}
                onChange={(e) => updateSiteData({ briefingSignedDate: e.target.value })}
              />
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-brand-green/5 border border-brand-green/10 rounded-lg p-3">
            <strong>Safety Certification:</strong> By signing below, the crew leader confirms that all climbers, operators, and ground personnel have been briefed on emergency communication channels, drop zones, aerial power line setbacks (minimum approach distances), and that all mandatory PPE is in active use.
          </div>

          <SignatureCanvas
            id="job-briefing-crew-signature"
            label="Crew Leader / Field Supervisor Signature"
            subtitle="Touch or stylus sign on the line below to authenticate daily tailgate safety briefing"
            signerName={siteData.briefingSignedBy || siteData.crewLeader}
            date={siteData.briefingSignedDate || siteData.date}
            initialSignature={siteData.briefingSignatureImage}
            onSave={(dataUrl) => updateSiteData({ briefingSignatureImage: dataUrl || '' })}
            onClear={() => updateSiteData({ briefingSignatureImage: '' })}
            height={140}
          />
        </section>

        {/* Action Button */}
        <section className="pt-2">
          <button 
            type="button"
            onClick={handleSaveBriefing}
            className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={22} />
            Authenticate & Dispatch Job Briefing
          </button>
        </section>
      </div>
    </div>
  );
};
