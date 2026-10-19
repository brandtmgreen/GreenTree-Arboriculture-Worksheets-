import React, { useState, useRef } from 'react';
import { useSiteContext, DroneMediaItem } from '../context/SiteContext';
import { useFirebase } from '../context/FirebaseContext';
import { 
  Plane, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  CloudRain, 
  Wind, 
  Navigation, 
  Eye, 
  Radio, 
  Upload, 
  Camera, 
  Clock, 
  FileText, 
  Trash2, 
  ExternalLink,
  Sparkles,
  Info,
  Layers,
  MapPin,
  Compass
} from 'lucide-react';
import { printBlankWorksheet } from '../utils/printHelpers';

export const DroneOperationsWorksheet: React.FC = () => {
  const { siteData, updateSiteData } = useSiteContext();
  const { user } = useFirebase();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse safety variables based on input
  const windSpeedNum = parseFloat(siteData.droneWindSpeed || '0');
  const visibilityNum = parseFloat(siteData.droneVisibility || '5');
  
  const isWindHazard = windSpeedNum > 15; // 15 knots limit
  const isVisibilityHazard = visibilityNum < 3; // 3 miles FAA requirement
  const isWeatherSafe = !isWindHazard && !isVisibilityHazard;

  // Checklist computation
  const checklistItems = [
    { id: 'propellers', label: 'Propellers checked for chips, cracks, & secure lock', value: !!siteData.dronePreflightPropellers, key: 'dronePreflightPropellers' },
    { id: 'battery', label: 'Battery fully charged (>15.2V) & securely latched', value: !!siteData.dronePreflightBattery, key: 'dronePreflightBattery' },
    { id: 'gps', label: 'GPS Lock established with minimum 8 satellites', value: !!siteData.dronePreflightGPS, key: 'dronePreflightGPS' },
    { id: 'compass', label: 'Compass calibrated / IMU status green', value: !!siteData.dronePreflightCompass, key: 'dronePreflightCompass' },
    { id: 'sdcard', label: 'High-speed MicroSD card formatted & inserted', value: !!siteData.dronePreflightSDCard, key: 'dronePreflightSDCard' },
    { id: 'link', label: 'C2 Signal Link tested & RC battery verified', value: !!siteData.dronePreflightLink, key: 'dronePreflightLink' },
    { id: 'ppe', label: 'Pilot PPE worn (High-Vis vest, eye safety) & launch zone cleared', value: !!siteData.dronePreflightPPE, key: 'dronePreflightPPE' },
  ];

  const checkedCount = checklistItems.filter(item => item.value).length;
  const checklistPercent = Math.round((checkedCount / checklistItems.length) * 100);

  const handleCheckboxChange = (key: string, value: boolean) => {
    updateSiteData({ [key]: value });
  };

  const handleSelectAllChecklist = () => {
    updateSiteData({
      dronePreflightPropellers: true,
      dronePreflightBattery: true,
      dronePreflightGPS: true,
      dronePreflightCompass: true,
      dronePreflightSDCard: true,
      dronePreflightLink: true,
      dronePreflightPPE: true,
    });
  };

  // Drag and Drop media upload helpers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = (files: FileList) => {
    const newItems: DroneMediaItem[] = [];
    const existingList = siteData.droneMediaList || [];

    Array.from(files).forEach((file) => {
      // Validate file size (max 10MB for local sandbox representation)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const item: DroneMediaItem = {
          id: Math.random().toString(36).substr(2, 9),
          url: reader.result as string,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          type: file.type.startsWith('video') ? 'video/mp4' : 'image/jpeg',
          caption: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateSiteData({
          droneMediaList: [...existingList, item, ...newItems]
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const updateMediaCaption = (id: string, caption: string) => {
    const list = siteData.droneMediaList || [];
    const updated = list.map(item => item.id === id ? { ...item, caption } : item);
    updateSiteData({ droneMediaList: updated });
  };

  const deleteMediaItem = (id: string) => {
    const list = siteData.droneMediaList || [];
    const filtered = list.filter(item => item.id !== id);
    updateSiteData({ droneMediaList: filtered });
  };

  const handleSmartFillDrone = () => {
    updateSiteData({
      dronePilot: siteData.crewLeader || user?.displayName || 'Lead Pilot',
      droneRegistration: 'FA39NXK71',
      droneModel: 'DJI Mavic 3 Enterprise (RTK)',
      droneAltitude: '120',
      droneAirspaceClass: 'Class G',
      droneAirspaceApproved: true,
      droneObjectives: `Aerial multi-spectral canopy scan for ${siteData.clientName || 'tree site'}. Map hazard power line clearance and compile elevation profiles.`,
      droneWindSpeed: '8',
      droneVisibility: '10'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5">
            <span className="p-1.5 bg-brand-green/10 text-brand-green rounded-xl">
              <Plane size={24} className="animate-pulse" />
            </span>
            Drone Operations Worksheet
          </h2>
          <p className="text-xs text-gray-500">
            Exacting mission flight plans, safety validations, and imagery intake under FAA Part 107
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => printBlankWorksheet('drone')}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            title="Print blank FAA Part 107 flight worksheet with handwriting lines"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            Print Blank Form
          </button>
          <button 
            onClick={handleSmartFillDrone}
            className="btn-secondary text-xs py-1.5 bg-brand-vibrant/10 border-brand-vibrant text-brand-vibrant hover:bg-brand-vibrant hover:text-white"
          >
            <Sparkles size={14} />
            Smart Fill Pilot Info
          </button>
          <div className={`px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold font-mono border ${
            siteData.droneFlightCompleted 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : checkedCount === checklistItems.length 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
          }`}>
            {siteData.droneFlightCompleted 
              ? '✓ FLIGHT COMPLETED' 
              : checkedCount === checklistItems.length 
                ? '● READY TO LAUNCH' 
                : `⚠ CHECKLIST INCOMPLETE (${checkedCount}/${checklistItems.length})`
            }
          </div>
        </div>
      </div>

      {/* Target site connection notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Linked Target Worksite</h4>
            <p className="text-sm text-gray-800 font-medium">
              {siteData.clientName || 'General Client'} &bull; {siteData.location || 'No Location specified'}
            </p>
            {siteData.scope && (
              <p className="text-xs text-gray-500 line-clamp-1">
                Scope: {siteData.scope}
              </p>
            )}
          </div>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Session Date: {siteData.date || new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Grid Layout: Flight Plan & Pre-flight Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: FLIGHT PLAN REQUIREMENTS */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5 text-left shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Compass className="text-brand-green" size={18} />
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Flight Mission Planning</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Remote Pilot in Command (PIC)</label>
              <input 
                type="text" 
                className="input-field text-xs" 
                placeholder="Name of licensed pilot" 
                value={siteData.dronePilot || ''}
                onChange={(e) => updateSiteData({ dronePilot: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">FAA Remote Pilot License #</label>
              <input 
                type="text" 
                className="input-field text-xs" 
                placeholder="e.g. 4839201" 
                value={siteData.droneLicense || ''}
                onChange={(e) => updateSiteData({ droneLicense: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">UAS Airframe & Model</label>
              <input 
                type="text" 
                className="input-field text-xs" 
                placeholder="e.g. DJI Mavic 3E" 
                value={siteData.droneModel || ''}
                onChange={(e) => updateSiteData({ droneModel: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">UAS Registration #</label>
              <input 
                type="text" 
                className="input-field text-xs" 
                placeholder="e.g. FA39NXK71" 
                value={siteData.droneRegistration || ''}
                onChange={(e) => updateSiteData({ droneRegistration: e.target.value })}
              />
            </div>
          </div>

          {/* Airspace Profile & Flight Altitude */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Target Altitude (AGL)</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="input-field text-xs pr-10" 
                  placeholder="e.g. 120" 
                  value={siteData.droneAltitude || ''}
                  onChange={(e) => updateSiteData({ droneAltitude: e.target.value })}
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-bold text-gray-400">FEET</span>
              </div>
              <p className="text-[9px] text-gray-400">Strict maximum of 400 ft AGL under FAA Part 107</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Airspace Classification</label>
              <select 
                className="input-field text-xs"
                value={siteData.droneAirspaceClass || 'Class G'}
                onChange={(e) => updateSiteData({ droneAirspaceClass: e.target.value })}
              >
                <option value="Class G">Class G (Uncontrolled - Default)</option>
                <option value="Class E">Class E (Controlled Airport Area)</option>
                <option value="Class D">Class D (Medium Towred Airport)</option>
                <option value="Class C">Class C (Major Regional Airport)</option>
                <option value="Class B">Class B (High Density Airport)</option>
              </select>
            </div>
          </div>

          {/* Mission Flight Path Type & Airspace Checked */}
          <div className="p-3.5 bg-brand-green/5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase">Flight Objective Profile</span>
              <div className="flex gap-2">
                {['Grid Mapping', 'Canopy Orbit', 'Free Recon'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => updateSiteData({ droneFlightPath: mode })}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      siteData.droneFlightPath === mode 
                        ? 'bg-brand-green text-white shadow-sm' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 bg-white p-2.5 rounded border border-gray-150 cursor-pointer hover:bg-emerald-50/50 transition-all">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-brand-green accent-brand-green rounded"
                checked={!!siteData.droneAirspaceApproved}
                onChange={(e) => updateSiteData({ droneAirspaceApproved: e.target.checked })}
              />
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold text-gray-800 uppercase flex items-center gap-1.5">
                  LAANC Airspace Authorization Obtained 
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                </span>
                <p className="text-[10px] text-gray-500 leading-tight">Must obtain instant automated FAA clearance if operating in controlled Airspace.</p>
              </div>
            </label>
          </div>

          {/* Flight Plan Notes */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-500">Mission Objectives / Specific Focus Areas</label>
            <textarea 
              className="input-field text-xs min-h-[70px]"
              placeholder="e.g. Conduct Multi-spectral Canopy inspection of damaged Pines, compile 3D mapping file for arborist council review..."
              value={siteData.droneObjectives || ''}
              onChange={(e) => updateSiteData({ droneObjectives: e.target.value })}
            />
          </div>
        </section>

        {/* SECTION 2: PRE-FLIGHT CHECKLIST & WEATHER LIMITS */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5 text-left shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Shield className="text-amber-500" size={18} />
                <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Safety & Pre-Flight Check</h3>
              </div>
              <button 
                onClick={handleSelectAllChecklist}
                className="text-[10px] text-brand-green hover:text-emerald-700 font-bold uppercase font-mono tracking-wider cursor-pointer"
              >
                Pass All Checks
              </button>
            </div>

            {/* Weather safety limits - dynamic checking! */}
            <div className={`p-3.5 rounded-xl border ${
              isWeatherSafe 
                ? 'bg-emerald-50/50 border-emerald-100' 
                : 'bg-red-50 border-red-100'
            } space-y-3`}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                  Weather Limitation Check
                  {isWeatherSafe ? (
                    <span className="text-[10px] text-emerald-700 font-extrabold uppercase bg-emerald-100 px-1.5 py-0.5 rounded">Safe to Fly</span>
                  ) : (
                    <span className="text-[10px] text-red-700 font-extrabold uppercase bg-red-100 px-1.5 py-0.5 rounded animate-pulse">Flight Suspended</span>
                  )}
                </h4>
                <div className="text-[10px] text-gray-400 font-mono">Limits: Wind &lt; 15kts &bull; Vis &gt; 3mi</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-gray-500 flex items-center gap-1">
                    <Wind size={12} className={isWindHazard ? 'text-red-500' : 'text-gray-400'} /> 
                    Current Wind Speed (knots)
                  </label>
                  <input 
                    type="number" 
                    className={`input-field text-xs ${isWindHazard ? 'border-red-400 text-red-800 bg-red-50' : ''}`}
                    placeholder="e.g. 10" 
                    value={siteData.droneWindSpeed || ''}
                    onChange={(e) => updateSiteData({ droneWindSpeed: e.target.value })}
                  />
                  {isWindHazard && <p className="text-[9px] text-red-600 font-bold">⚠ Exceeds DJI/FAA safe envelope (15 kts)</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-gray-500 flex items-center gap-1">
                    <Eye size={12} className={isVisibilityHazard ? 'text-red-500' : 'text-gray-400'} /> 
                    Horizontal Visibility (miles)
                  </label>
                  <input 
                    type="number" 
                    className={`input-field text-xs ${isVisibilityHazard ? 'border-red-400 text-red-800 bg-red-50' : ''}`}
                    placeholder="e.g. 5" 
                    value={siteData.droneVisibility || ''}
                    onChange={(e) => updateSiteData({ droneVisibility: e.target.value })}
                  />
                  {isVisibilityHazard && <p className="text-[9px] text-red-600 font-bold">⚠ Under FAA 3-mile requirement</p>}
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                <span>System Readiness Verification</span>
                <span className="font-mono font-bold text-brand-green">{checklistPercent}% Complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brand-green h-1.5 rounded-full transition-all duration-500" style={{ width: `${checklistPercent}%` }}></div>
              </div>

              <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                {checklistItems.map((item) => (
                  <label 
                    key={item.id}
                    className="flex items-start gap-2.5 p-2 bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-lg cursor-pointer transition-colors"
                  >
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mt-0.5 rounded text-brand-green accent-brand-green"
                      checked={item.value}
                      onChange={(e) => handleCheckboxChange(item.key, e.target.checked)}
                    />
                    <span className={`text-xs font-medium ${item.value ? 'text-gray-800 line-through decoration-gray-300' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between gap-3 bg-brand-green/5 -mx-5 -mb-5 p-4 rounded-b-2xl">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-gray-700 uppercase">Aviation Mission Status</span>
              <p className="text-[10px] text-gray-500">Lock once pre-flight checks are passed and data is uploaded</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-xl">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-brand-green accent-brand-green rounded"
                checked={!!siteData.droneFlightCompleted}
                onChange={(e) => updateSiteData({ droneFlightCompleted: e.target.checked })}
              />
              <span className="text-xs font-bold text-gray-800 uppercase">Lock Flight Completed</span>
            </label>
          </div>
        </section>
      </div>

      {/* COMPREHENSIVE FLIGHT PLAN REQUIREMENTS & INSTRUCTIONS SECTION */}
      <section className="bg-slate-900 text-slate-100 rounded-2xl p-5 text-left space-y-4 shadow-lg border border-slate-800">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Info className="text-brand-vibrant" size={18} />
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-brand-vibrant">FAA Part 107 Mission Flight Plan Requirements</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-2 bg-slate-850 p-3.5 rounded-xl border border-slate-800/40">
            <h4 className="font-bold text-white flex items-center gap-1.5 uppercase text-[11px] tracking-wider text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              1. Spatial & Height Clearances
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
              <li>Never exceed the strict <strong className="text-white">400 feet AGL</strong> ceiling, or designated LAANC altitude grid ceilings.</li>
              <li>Keep aircraft within <strong className="text-white">Visual Line of Sight (VLOS)</strong> of the pilot at all times. Do not fly behind buildings/heavy dense canopy.</li>
              <li>Maintain safe lateral safety buffer of <strong className="text-white">100 feet</strong> from power lines, guy wires, towers, and tree structures.</li>
            </ul>
          </div>

          <div className="space-y-2 bg-slate-850 p-3.5 rounded-xl border border-slate-800/40">
            <h4 className="font-bold text-white flex items-center gap-1.5 uppercase text-[11px] tracking-wider text-amber-400">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              2. Weather & Environment Limits
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
              <li>Cancel flights if <strong className="text-white">wind gusts exceed 15 knots</strong> (approx 17 mph) or air turbulence threatens stability.</li>
              <li>Maintain minimum horizontal visibility of <strong className="text-white">3 statute miles</strong>. Avoid foggy canopy scans.</li>
              <li>Immediately cease flight and return to launch if mist, rain, or precipitation develops, protecting critical high-res cameras.</li>
            </ul>
          </div>

          <div className="space-y-2 bg-slate-850 p-3.5 rounded-xl border border-slate-800/40">
            <h4 className="font-bold text-white flex items-center gap-1.5 uppercase text-[11px] tracking-wider text-brand-vibrant">
              <span className="w-1.5 h-1.5 bg-brand-vibrant rounded-full" />
              3. Media Submission Pipeline
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
              <li>Capture high-resolution <strong className="text-white">JPEG images</strong> for canopy health mapping, and 4K MP4 videos of structural damage.</li>
              <li>Upload files directly using the intake form below upon landing.</li>
              <li>Annotate each upload with precise details (e.g. tree ID, hazard location) to compile comprehensive worksite safety reports.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: MEDIA UPLOAD & COLLECTION PORTAL */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 text-left shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Camera className="text-brand-green" size={18} />
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Mission Media Collection Intake</h3>
          </div>
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {(siteData.droneMediaList || []).length} Collected Media Files
          </span>
        </div>

        {/* Drag and Drop Box */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-brand-green bg-brand-green/5 scale-[0.99]' 
              : 'border-gray-300 hover:border-brand-green hover:bg-gray-50/50'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileInput}
            multiple 
            accept="image/*,video/*"
            className="hidden" 
          />
          <div className="space-y-2 max-w-sm mx-auto">
            <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto text-brand-green">
              <Upload size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Drag & Drop Drone Media</p>
              <p className="text-xs text-gray-500 mt-1 leading-normal">
                Drop high-res aerial photos, structural closeups, or flight canopy scans. Supports JPEGs, PNGs, MP4s. (Max 10MB per file)
              </p>
            </div>
            <button className="btn-secondary text-[10px] py-1 px-3 border-gray-300 mx-auto">
              Select files from device
            </button>
          </div>
        </div>

        {/* List of uploaded drone media */}
        {(siteData.droneMediaList || []).length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Intake Queue Checklist</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(siteData.droneMediaList || []).map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100/50 transition-colors"
                >
                  {/* Miniature Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0 relative border border-gray-200">
                    {file.type.startsWith('video') ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white text-[9px] font-bold font-mono">
                        VIDEO
                      </div>
                    ) : (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    )}
                  </div>

                  {/* Metadata and Caption Input */}
                  <div className="flex-grow space-y-1.5 text-left min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate" title={file.name}>{file.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">Size: {file.size} &bull; Received: {file.timestamp}</p>
                      </div>
                      <button 
                        onClick={() => deleteMediaItem(file.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                        title="Delete file"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <input 
                      type="text" 
                      className="input-field text-xs py-1 px-2.5" 
                      placeholder="Add arborist notes (e.g. Oak canopy structural damage)" 
                      value={file.caption || ''}
                      onChange={(e) => updateMediaCaption(file.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Sync to workspace guide */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
        <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
          <Radio size={14} className="text-slate-500" />
          Cross-Workspace Automation Sync
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          Any fields configured in this worksheet are automatically synced with your core GreenTree worksite session. When you utilize the <strong>Google Workspace Sync</strong> panel at the top, scheduling a Calendar event will automatically include this Drone Pilot briefing, target altitude, pre-flight clearance status, and media count in the event description. Likewise, emailing the crew report will securely package this entire aviation flight plan to dispatches and field crew leaders!
        </p>
      </div>
    </div>
  );
};
