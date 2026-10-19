import React, { useState } from 'react';
import { 
  TreePine, 
  ClipboardCheck, 
  Menu, 
  X, 
  Printer, 
  Download, 
  Camera, 
  Leaf, 
  ClipboardList, 
  CloudLightning, 
  FileText, 
  Table, 
  WifiOff, 
  Wifi, 
  Users, 
  Trees, 
  CheckSquare, 
  Award, 
  Plane,
  Cloud,
  FolderOpen,
  RefreshCw,
  LogOut,
  ChevronDown,
  Calculator,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContext } from '../context/SiteContext';
import { useFirebase } from '../context/FirebaseContext';
import { WorkspaceSyncPanel } from './WorkspaceSyncPanel';
import { CloudWorksheetsModal } from './CloudWorksheetsModal';
import { FieldGuideModal } from './FieldGuideModal';
import { printBlankWorksheet, printCurrentWorksheet } from '../utils/printHelpers';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { 
    siteData, 
    updateSiteData, 
    isOnline, 
    setIsOnline, 
    isSavingLocal, 
    lastSavedLocal,
    activeJobTitle,
    syncStatus,
    lastSyncedAt,
    savedJobs,
    forceSyncWithCloud
  } = useSiteContext();

  const { user, signIn, logout } = useFirebase();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isFieldGuideOpen, setIsFieldGuideOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSyncingManual, setIsSyncingManual] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const activeLabel = navItems.find(i => i.id === activeTab)?.label || 'Worksheet';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `GreenTree_${activeLabel.replace(/\s+/g, '_')}_${timestamp}.csv`;
      
      const csvContent = "data:text/csv;charset=utf-8,Field,Value\n" + 
        "Report Type," + activeLabel + "\n" +
        "Export Date," + new Date().toLocaleString() + "\n" +
        "Status,Draft\n";
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 1500);
  };

  const handlePrintCurrent = () => {
    printCurrentWorksheet();
  };

  const handlePrintBlankCurrent = () => {
    printBlankWorksheet(activeTab as any);
  };

  const handlePrintAllBlank = () => {
    printBlankWorksheet('all');
  };

  const handleManualSync = async () => {
    setIsSyncingManual(true);
    try {
      await forceSyncWithCloud();
    } catch (e) {
      console.warn('Manual sync triggered:', e);
    } finally {
      setIsSyncingManual(false);
    }
  };

  const navItems = [
    { id: 'estimate', label: 'Cost Estimate', icon: Calculator },
    { id: 'tree-risk', label: 'Tree Risk Assessment', icon: AlertTriangle },
    { id: 'briefing', label: 'Job Briefing', icon: ClipboardCheck },
    { id: 'health', label: 'Health Assessment', icon: TreePine },
    { id: 'inventory', label: 'Tree Inventory', icon: Trees },
    { id: 'drone', label: 'Drone Flight Plan', icon: Plane },
    { id: 'storm', label: 'Storm Damage', icon: CloudLightning },
    { id: 'postwork', label: 'Post-Work Verify', icon: CheckSquare },
    { id: 'safety', label: 'Weekly Safety', icon: Users },
    { id: 'equipment', label: 'Equipment Log', icon: ClipboardList },
    { id: 'media', label: 'Media & Docs', icon: Camera },
  ];

  return (
    <div className="min-h-screen flex flex-col print:hidden bg-gray-50/50">
      {/* Cloud & Device Sync Sub-Banner */}
      <AnimatePresence>
        {!isOnline ? (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-600 text-white text-xs sm:text-sm font-semibold text-center py-2 px-4 shadow-md z-50 relative flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-b border-amber-500/40"
          >
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-ping shrink-0" />
              <WifiOff className="w-4 h-4 text-amber-200" />
              Offline Mode Active
            </span>
            <span className="bg-amber-700/80 text-amber-100 font-mono text-[11px] sm:text-xs px-2 py-0.5 rounded border border-amber-500/20">
              {isSavingLocal ? (
                <span className="text-yellow-200 font-bold animate-pulse">● Saving to device cache...</span>
              ) : (
                <>✓ Work saved safely to device cache {lastSavedLocal ? `(${lastSavedLocal})` : ''}</>
              )}
            </span>
            <button 
              type="button"
              onClick={() => setIsOnline(true)}
              className="text-[10px] bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded font-mono uppercase tracking-wider transition-colors ml-2"
            >
              Reconnect
            </button>
          </motion.div>
        ) : (
          <div className="bg-emerald-900 text-white text-[11px] py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/80">
            {/* Left: Active Worksheet Notice */}
            <div className="flex items-center gap-2">
              <span className="text-emerald-300 font-medium hidden sm:inline">Active Sheet:</span>
              <button 
                type="button"
                onClick={() => setIsCloudModalOpen(true)}
                className="font-bold text-white hover:text-emerald-200 flex items-center gap-1.5 underline decoration-emerald-500/50 underline-offset-2 hover:decoration-emerald-300 transition-colors"
                title="Switch or manage cloud worksheets"
              >
                <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[200px] sm:max-w-md truncate">{activeJobTitle}</span>
              </button>
            </div>

            {/* Right: Cloud Sync State & Device Access */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <div 
                    onClick={() => setIsCloudModalOpen(true)}
                    className="flex items-center gap-1.5 text-emerald-200 hover:text-white cursor-pointer transition-colors"
                    title="Worksheets automatically sync to your Google Cloud Firestore account"
                  >
                    <span className={`w-2 h-2 rounded-full ${syncStatus === 'syncing' ? 'bg-blue-400 animate-ping' : syncStatus === 'synced' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="font-semibold">
                      {syncStatus === 'syncing' ? 'Syncing to Cloud...' : 'Cloud Synced'}
                    </span>
                    {lastSyncedAt && (
                      <span className="text-emerald-400/80 font-mono text-[10px] hidden md:inline">
                        ({lastSyncedAt})
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={isSyncingManual}
                    className="p-1 text-emerald-300 hover:text-white rounded hover:bg-emerald-800 transition-colors"
                    title="Force sync now with cloud"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncingManual ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={signIn}
                  className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors"
                >
                  <Cloud className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Sign in to sync across devices</span>
                </button>
              )}

              <div className="h-3 w-[1px] bg-emerald-700 hidden sm:block" />

              <button 
                type="button"
                onClick={() => setIsOnline(false)}
                className="text-[10px] text-emerald-300/80 hover:text-emerald-100 font-mono uppercase tracking-wider px-1.5 py-0.5 rounded hover:bg-emerald-800/60 transition-colors"
                title="Simulate offline field conditions"
              >
                Simulate Offline
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <header className="bg-brand-green text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="bg-white p-2 rounded-xl shadow-inner transform group-hover:rotate-12 transition-transform duration-300">
                  <div className="relative">
                    <TreePine className="text-brand-green w-7 h-7" />
                    <Leaf className="absolute -top-1 -right-1 text-brand-vibrant w-3 h-3 animate-pulse" />
                  </div>
                </div>
                <div className="absolute -inset-1 bg-white/20 rounded-xl blur-sm -z-10 group-hover:bg-white/40 transition-colors"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-black leading-none tracking-tight flex items-center gap-1">
                  Green<span className="text-brand-vibrant">Tree</span>
                </h1>
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-4 bg-white/40"></div>
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.3em] text-white/90">Arboriculture</p>
                </div>
              </div>
              
              {/* Desktop Partner Branding Input */}
              <div className="hidden lg:flex flex-col border-l border-white/20 pl-4 ml-4">
                <span className="text-[9px] uppercase tracking-wider text-white/60 font-black flex items-center gap-1">
                  <Award size={10} className="text-brand-vibrant" /> Partner Brand / Company Label
                </span>
                <input 
                  type="text" 
                  className="bg-transparent text-xs font-bold text-white border-b border-transparent hover:border-white/30 focus:border-white focus:outline-none placeholder-white/40 p-0 w-48 transition-all"
                  placeholder="Enter Company Name..."
                  value={siteData.companyName || ''}
                  onChange={(e) => updateSiteData({ companyName: e.target.value })}
                />
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === item.id
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}

              {/* More dropdown / remaining tabs */}
              <div className="relative group">
                <button className="px-2.5 py-1.5 rounded-md text-xs lg:text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1">
                  <span>More</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 py-1 hidden group-hover:block z-50 animate-in fade-in duration-150">
                  {navItems.slice(5).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 hover:bg-gray-100 ${
                        activeTab === item.id ? 'text-brand-green font-bold bg-emerald-50' : 'text-gray-700'
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5 text-brand-green" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-6 w-[1px] bg-white/20 mx-1"></div>

              {/* Cloud Worksheets Button */}
              <button
                type="button"
                onClick={() => setIsCloudModalOpen(true)}
                className="bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-all shadow-2xs"
                title="View all saved worksheets across devices"
              >
                <Cloud className="w-3.5 h-3.5 text-brand-vibrant" />
                <span>Worksheets</span>
                {savedJobs.length > 0 && (
                  <span className="bg-brand-vibrant text-brand-green text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                    {savedJobs.length}
                  </span>
                )}
              </button>

              {/* User Profile / Auth Button */}
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
                  >
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-6 h-6 rounded-full border border-white/40"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-brand-vibrant text-brand-green font-bold text-xs flex items-center justify-center">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-medium max-w-[90px] truncate">
                      {user.displayName?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-white/60" />
                  </button>

                  {isUserMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">{user.displayName || 'Arborist'}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCloudModalOpen(true)}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-brand-green" />
                        My Saved Worksheets ({savedJobs.length})
                      </button>
                      <button
                        type="button"
                        onClick={handleManualSync}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-brand-green" />
                        Sync Now to Cloud
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={signIn}
                  className="bg-brand-vibrant hover:bg-emerald-400 text-brand-green font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCloudModalOpen(true)}
                className="bg-white/15 text-white p-2 rounded-lg text-xs font-bold flex items-center gap-1"
                title="Worksheets"
              >
                <Cloud className="w-4 h-4 text-brand-vibrant" />
                <span className="text-[11px]">{savedJobs.length}</span>
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-white/10 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand-green border-t border-white/10"
            >
              {/* Partner Brand */}
              <div className="px-4 py-3 bg-brand-green/50 border-b border-white/10 space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-white/50 font-black flex items-center gap-1">
                  <Award size={10} className="text-brand-vibrant" /> Partner Brand / Company Label
                </span>
                <input 
                  type="text" 
                  className="bg-transparent text-sm font-bold text-white border-b border-white/20 focus:border-brand-vibrant focus:outline-none placeholder-white/40 p-1 w-full"
                  placeholder="Enter Company Name..."
                  value={siteData.companyName || ''}
                  onChange={(e) => updateSiteData({ companyName: e.target.value })}
                />
              </div>

              {/* Cloud Account Row in Mobile */}
              <div className="p-3 bg-emerald-950/40 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-brand-vibrant" />
                  <span className="text-xs font-medium">
                    {user ? `Signed in as ${user.displayName || user.email}` : 'Sync across devices'}
                  </span>
                </div>
                {user ? (
                  <button
                    onClick={logout}
                    className="text-xs text-red-300 hover:text-white bg-red-900/40 px-2 py-1 rounded"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={signIn}
                    className="text-xs bg-brand-vibrant text-brand-green font-bold px-2.5 py-1 rounded"
                  >
                    Sign In
                  </button>
                )}
              </div>

              {/* Navigation list */}
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => {
                    setIsCloudModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-bold text-brand-vibrant bg-white/10 flex items-center gap-3"
                >
                  <FolderOpen className="w-4 h-4" />
                  Manage Saved Cloud Worksheets ({savedJobs.length})
                </button>

                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${
                      activeTab === item.id
                        ? 'bg-white/20 text-white font-bold'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Title and Top Action Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              {navItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Working on: <span className="font-semibold text-gray-700">{activeJobTitle}</span>
              {' • '}
              <button 
                type="button"
                onClick={() => setIsCloudModalOpen(true)}
                className="text-brand-green hover:underline font-medium"
              >
                Switch Worksheet
              </button>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button 
              type="button"
              onClick={() => setIsFieldGuideOpen(true)}
              className="btn-secondary text-xs sm:text-sm py-1.5 flex-1 sm:flex-none bg-emerald-800 text-white hover:bg-emerald-900 border-emerald-800 shadow-xs"
              title="Open clickable Field Measurement Protocols & Standards Guide"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 h-4 text-emerald-200" />
              <span>Field Standards Guide</span>
            </button>
            <button 
              type="button"
              onClick={() => setIsCloudModalOpen(true)}
              className="btn-secondary text-xs sm:text-sm py-1.5 flex-1 sm:flex-none border-emerald-300 text-brand-green hover:bg-emerald-50"
              title="Open Cloud Worksheets manager"
            >
              <Cloud className="w-3.5 h-3.5 sm:w-4 h-4 text-brand-green" />
              Cloud Sheets
            </button>
            <button 
              type="button" 
              className="btn-secondary text-xs sm:text-sm py-1.5 flex-1 sm:flex-none" 
              onClick={handlePrintCurrent}
              title="Print active worksheet with your entered data"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 h-4" />
              <span>Print Filled</span>
            </button>
            <button 
              type="button" 
              className="btn-secondary text-xs sm:text-sm py-1.5 flex-1 sm:flex-none border-gray-300 text-gray-700 hover:text-black hover:border-black" 
              onClick={handlePrintBlankCurrent}
              title="Print a clean, pen-ready blank form with handwriting lines and checkboxes"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 h-4 text-emerald-700" />
              <span>Print Blank Form</span>
            </button>
            <button 
              type="button" 
              className="btn-secondary text-xs sm:text-sm py-1.5 flex-1 sm:flex-none border-gray-300 text-gray-700 hover:text-black hover:border-black" 
              onClick={handlePrintAllBlank}
              title="Print complete 11-worksheet clipboard binder of all blank forms"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 h-4 text-amber-700" />
              <span>Print All Blank</span>
            </button>
            <button 
              onClick={handleExportCSV}
              disabled={isExporting}
              className="btn-secondary text-xs sm:text-sm py-1.5 flex-1 sm:flex-none disabled:opacity-50"
            >
              {isExporting ? (
                <div className="w-3.5 h-3.5 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Table className="w-3.5 h-3.5 sm:w-4 h-4" />
              )}
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary text-xs sm:text-sm py-1.5 flex-1 sm:flex-none disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Download className="w-3.5 h-3.5 sm:w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save PDF'}
            </button>
          </div>
        </div>
        
        <WorkspaceSyncPanel />
        {children}
      </main>

      {/* Cloud Worksheets & Multi-Device Sync Modal */}
      <CloudWorksheetsModal 
        isOpen={isCloudModalOpen} 
        onClose={() => setIsCloudModalOpen(false)} 
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-75 hover:opacity-100 transition-all">
            <div className="bg-brand-green p-1.5 rounded-lg">
              <TreePine className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-sm tracking-tight">Green<span className="text-brand-vibrant">Tree</span></span>
            <span className="text-xs text-gray-400">| Cross-Device Cloud Sync Enabled</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} GreenTree Arboriculture {siteData.companyName ? `co-branded with ${siteData.companyName}` : ''}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Monkey Mascot Floating Tip */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <div className="relative">
          <div className="absolute -inset-2 bg-brand-green/20 rounded-full blur-md group-hover:bg-brand-vibrant/20 transition-colors animate-pulse"></div>
          <button className="relative w-14 h-14 bg-white rounded-full shadow-2xl border-2 border-brand-green flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:border-brand-vibrant transition-all duration-300">
            <span className="text-2xl transform group-hover:-rotate-12 transition-transform">🐒</span>
          </button>
          
          <div className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center text-lg">💡</div>
              <div>
                <p className="text-xs font-bold text-brand-green uppercase tracking-wider mb-1">Arborist Tip</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  "Worksheets automatically sync to your cloud account so you can start on your phone in the bucket truck and review on your desktop at the office!"
                </p>
              </div>
            </div>
            <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Field Operations & Standards Knowledge Modal */}
      <FieldGuideModal 
        isOpen={isFieldGuideOpen} 
        onClose={() => setIsFieldGuideOpen(false)} 
      />
    </div>
  );
}
