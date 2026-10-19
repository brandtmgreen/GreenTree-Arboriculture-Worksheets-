import React, { useState } from 'react';
import { 
  Cloud, 
  CloudCheck, 
  RefreshCw, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Search, 
  X, 
  Smartphone, 
  Laptop, 
  Calendar, 
  MapPin, 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { useSiteContext, SavedJobSummary } from '../context/SiteContext';
import { useFirebase } from '../context/FirebaseContext';

interface CloudWorksheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudWorksheetsModal: React.FC<CloudWorksheetsModalProps> = ({ isOpen, onClose }) => {
  const { 
    siteData,
    activeJobId, 
    activeJobTitle,
    syncStatus, 
    lastSyncedAt, 
    savedJobs, 
    isLoadingJobs,
    switchJob, 
    createNewJob, 
    saveCurrentJobAs, 
    deleteJob, 
    forceSyncWithCloud 
  } = useSiteContext();

  const { user, signIn } = useFirebase();

  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isSavingAs, setIsSavingAs] = useState(false);
  const [saveAsTitle, setSaveAsTitle] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const filteredJobs = savedJobs.filter(job => {
    const q = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      (job.clientName && job.clientName.toLowerCase().includes(q)) ||
      (job.location && job.location.toLowerCase().includes(q))
    );
  });

  const handleSwitch = async (jobId: string) => {
    setActionLoading(`switch-${jobId}`);
    try {
      await switchJob(jobId);
      setStatusMessage({ type: 'success', text: 'Worksheet loaded onto this device.' });
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to switch worksheet.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setActionLoading('create');
    try {
      await createNewJob(newTitle.trim());
      setNewTitle('');
      setIsCreating(false);
      setStatusMessage({ type: 'success', text: 'New blank worksheet created and synced to cloud.' });
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to create worksheet.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveCurrentAs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveAsTitle.trim()) return;
    setActionLoading('saveas');
    try {
      await saveCurrentJobAs(saveAsTitle.trim());
      setSaveAsTitle('');
      setIsSavingAs(false);
      setStatusMessage({ type: 'success', text: 'Worksheet copy saved to cloud.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save worksheet.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (jobId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      setActionLoading(`delete-${jobId}`);
      try {
        await deleteJob(jobId);
        setStatusMessage({ type: 'success', text: 'Worksheet deleted from cloud.' });
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: err.message || 'Failed to delete worksheet.' });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleForceSync = async () => {
    setActionLoading('sync');
    try {
      await forceSyncWithCloud();
      setStatusMessage({ type: 'success', text: 'Synchronized successfully with Firestore cloud!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Sync failed.' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-brand-green text-white p-5 sm:p-6 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <Cloud className="w-6 h-6 text-brand-vibrant" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                Cloud Worksheets & Multi-Device Sync
              </h3>
              <p className="text-xs text-white/80">
                Access, edit, and resume your arborist field sheets seamlessly across phone, tablet, and PC.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Status Subheader */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
              <span className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500' : syncStatus === 'syncing' ? 'bg-blue-500 animate-ping' : 'bg-amber-500'}`} />
              {syncStatus === 'synced' && 'Cloud Sync: Connected & Up to Date'}
              {syncStatus === 'syncing' && 'Cloud Sync: Syncing changes...'}
              {syncStatus === 'offline' && 'Cloud Sync: Offline (Saved to local cache)'}
              {syncStatus === 'local-only' && 'Cloud Sync: Local Storage Only (Sign in to sync)'}
            </div>
            {lastSyncedAt && (
              <span className="text-gray-500 font-mono text-[11px]">
                (Last saved: {lastSyncedAt})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] text-gray-500 bg-white px-2.5 py-1 rounded-md border border-gray-200">
              <Smartphone className="w-3.5 h-3.5 text-gray-400" />
              <Laptop className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-medium text-gray-700">Multi-Device Ready</span>
            </div>
            {user && (
              <button
                type="button"
                onClick={handleForceSync}
                disabled={actionLoading === 'sync'}
                className="flex items-center gap-1 text-[11px] font-semibold text-brand-green bg-white hover:bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors shadow-2xs"
              >
                <RefreshCw className={`w-3 h-3 ${actionLoading === 'sync' ? 'animate-spin' : ''}`} />
                {actionLoading === 'sync' ? 'Syncing...' : 'Sync Now'}
              </button>
            )}
          </div>
        </div>

        {/* Alert Feedback */}
        {statusMessage && (
          <div className={`px-6 py-2 text-xs flex items-center gap-2 ${
            statusMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {statusMessage.text}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {!user ? (
            /* Sign-in Callout */
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                <Cloud className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Sign In with Google to Sync Across Devices</h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Currently, your worksheet is saved locally in this browser. Sign in to your Google Account to securely sync your worksheets with Google Cloud Firestore, allowing you to start a job briefing in the truck on your phone and finish it on your office laptop!
              </p>
              <button
                onClick={signIn}
                className="btn-primary text-sm px-5 py-2.5 mx-auto flex items-center gap-2 shadow-md"
              >
                <CloudCheck className="w-4 h-4" />
                Sign In with Google
              </button>
            </div>
          ) : (
            <>
              {/* Active Worksheet Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      Active on this Device
                    </span>
                    <span className="text-xs text-gray-500 font-mono">ID: {activeJobId}</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900">{activeJobTitle}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    {siteData.clientName && (
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-3 h-3 text-gray-400" /> {siteData.clientName}
                      </span>
                    )}
                    {siteData.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" /> {siteData.location}
                      </span>
                    )}
                    {siteData.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" /> {siteData.date}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSavingAs(true)}
                    className="btn-secondary text-xs py-1.5 px-3 whitespace-nowrap"
                  >
                    Save Copy As...
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreating(true)}
                    className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Blank Worksheet
                  </button>
                </div>
              </div>

              {/* Save As Form */}
              {isSavingAs && (
                <form onSubmit={handleSaveCurrentAs} className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-blue-950 uppercase tracking-wide">Save Current Worksheet as New Job</h5>
                    <button 
                      type="button" 
                      onClick={() => setIsSavingAs(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input-field text-xs py-1.5 flex-1 bg-white"
                      placeholder="e.g., Oak Tree Hazard Assessment - 452 Elm St"
                      value={saveAsTitle}
                      onChange={(e) => setSaveAsTitle(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!saveAsTitle.trim() || actionLoading === 'saveas'}
                      className="btn-primary text-xs py-1.5 px-4"
                    >
                      {actionLoading === 'saveas' ? 'Saving...' : 'Save to Cloud'}
                    </button>
                  </div>
                </form>
              )}

              {/* Create New Form */}
              {isCreating && (
                <form onSubmit={handleCreateNew} className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">Start a New Blank Worksheet</h5>
                    <button 
                      type="button" 
                      onClick={() => setIsCreating(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input-field text-xs py-1.5 flex-1 bg-white"
                      placeholder="Enter job or client name (e.g., Smith Tree Pruning)"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!newTitle.trim() || actionLoading === 'create'}
                      className="btn-primary text-xs py-1.5 px-4"
                    >
                      {actionLoading === 'create' ? 'Creating...' : 'Create & Open'}
                    </button>
                  </div>
                </form>
              )}

              {/* Worksheets List */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-brand-green" />
                    All Saved Worksheets in Cloud ({savedJobs.length})
                  </h4>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green w-full sm:w-56"
                      placeholder="Search jobs, clients, sites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {isLoadingJobs ? (
                  <div className="text-center py-8 text-xs text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-green" />
                    Loading your cloud worksheets...
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl p-6 text-gray-500 space-y-2">
                    <FolderOpen className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-xs font-medium">No worksheets found matching your search.</p>
                    <p className="text-[11px] text-gray-400">Any worksheet you edit is automatically synced to your cloud account.</p>
                  </div>
                ) : (
                  <div className="grid gap-2.5">
                    {filteredJobs.map((job) => {
                      const isActive = job.id === activeJobId;
                      return (
                        <div
                          key={job.id}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isActive 
                              ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/30' 
                              : 'bg-white hover:bg-gray-50/80 border-gray-200'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs sm:text-sm font-bold text-gray-900">{job.title}</h5>
                              {isActive && (
                                <span className="bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
                              {job.clientName && (
                                <span className="flex items-center gap-1">
                                  <UserIcon className="w-3 h-3 text-gray-400" /> {job.clientName}
                                </span>
                              )}
                              {job.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" /> {job.location}
                                </span>
                              )}
                              <span className="text-gray-400">
                                Updated: {job.updatedAt || 'Recent'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {isActive ? (
                              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 px-3 py-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Active
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSwitch(job.id)}
                                disabled={actionLoading === `switch-${job.id}`}
                                className="btn-secondary text-xs py-1 px-3 text-brand-green border-brand-green/30 hover:bg-brand-green/5"
                              >
                                {actionLoading === `switch-${job.id}` ? 'Loading...' : 'Open Sheet'}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {job.id !== 'current-job' && (
                              <button
                                type="button"
                                onClick={() => handleDelete(job.id, job.title)}
                                disabled={actionLoading === `delete-${job.id}`}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete worksheet"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 px-6 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-brand-green" />
            <span>Google Cloud Firestore real-time synchronization</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs py-1.5 px-4"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
