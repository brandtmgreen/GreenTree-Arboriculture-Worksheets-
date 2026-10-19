import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  db, 
  auth, 
  handleFirestoreError, 
  OperationType 
} from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  getDocFromServer 
} from 'firebase/firestore';

export interface ResourceRecommendation {
  title: string;
  url: string;
  type: 'video' | 'notebook';
  reason: string;
}

export interface DroneMediaItem {
  id: string;
  url: string;
  name: string;
  size: string;
  type: string;
  caption: string;
  timestamp: string;
}

export interface EstimateItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface EstimateData {
  estimateNumber?: string;
  estimateDate?: string;
  expirationDate?: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  siteAddress?: string;
  billingAddress?: string;
  items?: EstimateItem[];
  equipmentNeeded?: string[];
  subtotal?: number;
  discountType?: 'fixed' | 'percent';
  discountValue?: number;
  taxRate?: number;
  taxAmount?: number;
  grandTotal?: number;
  depositPercent?: number;
  depositAmount?: number;
  specialInstructions?: string;
  termsAccepted?: boolean;
  clientSignatureName?: string;
  clientSignatureImage?: string; // canvas signature data URL
  signedDate?: string;
  status?: 'Draft' | 'Sent' | 'Approved' | 'Declined';
}

export interface TreeRiskTarget {
  id: string;
  description: string;
  targetZone: string;
  occupancy: 'Constant' | 'Frequent' | 'Occasional' | 'Rare';
  isMoveable: boolean;
  isRestricted: boolean;
}

export interface TreeRiskAssessmentData {
  // Tree Subject
  treeId?: string;
  speciesCommon?: string;
  speciesBotanical?: string;
  dbh?: string;
  height?: string;
  crownSpread?: string;
  ageClass?: 'Young' | 'Semi-mature' | 'Mature' | 'Over-mature';
  vitality?: 'Good' | 'Fair' | 'Poor' | 'Dead';
  leanAngle?: string;
  leanDirection?: string;
  hasCorrectiveGrowth?: boolean;
  treeLocationDescription?: string;

  // Target Evaluation
  targets?: TreeRiskTarget[];

  // Defects and Conditions
  crownDefects?: string[];
  trunkDefects?: string[];
  rootDefects?: string[];
  defectNotes?: string;

  // ISA TRAQ Risk Analysis
  partEvaluated?: string;
  failureLikelihood?: 'Improbable' | 'Possible' | 'Probable' | 'Imminent';
  targetImpactLikelihood?: 'Very Low' | 'Low' | 'Medium' | 'High';
  failureImpactCombined?: 'Unlikely' | 'Somewhat Likely' | 'Likely' | 'Very Likely';
  consequencesOfFailure?: 'Negligible' | 'Minor' | 'Significant' | 'Severe';
  overallRiskRating?: 'Low' | 'Moderate' | 'High' | 'Extreme';

  // Risk Explanation & Failure Scenario
  riskExplanation?: string;
  targetFailureScenario?: string;

  // Mitigation & Recommendations
  mitigationActions?: string[];
  mitigationNotes?: string;
  residualRisk?: 'Low' | 'Moderate' | 'High' | 'Extreme';
  reinspectionInterval?: string;

  // Assessor Credentials & Canvas Signature
  assessorName?: string;
  assessorQualification?: string;
  assessorSignatureImage?: string; // canvas signature data URL
  inspectionDate?: string;
}

export interface SiteData {
  companyName?: string;
  // Crew Safety Briefing Sign-off
  briefingSignedBy?: string;
  briefingSignatureImage?: string; // canvas signature data URL
  briefingSignedDate?: string;
  briefingNotes?: string;
  healthNotes?: string;
  inventoryNotes?: string;
  stormNotes?: string;
  postworkNotes?: string;
  safetyNotes?: string;
  equipmentNotes?: string;
  riskNotes?: string;
  mediaNotes?: string;
  date?: string;
  location?: string;
  clientName?: string;
  phone?: string;
  email?: string;
  crewLeader?: string;
  scope?: string;
  tasks?: string[];
  equipment?: string[];
  treeSpecies?: string[];
  hazards?: string[];
  siteConditions?: string;
  weather?: string;
  droneNotes?: string;
  canopyHealth?: string;
  structuralIntegrity?: string;
  recommendations?: ResourceRecommendation[];
  dronePilot?: string;
  droneLicense?: string;
  droneModel?: string;
  droneRegistration?: string;
  droneAltitude?: string;
  droneFlightPath?: string;
  droneAirspaceClass?: string;
  droneAirspaceApproved?: boolean;
  droneWindSpeed?: string;
  droneVisibility?: string;
  dronePreflightPropellers?: boolean;
  dronePreflightBattery?: boolean;
  dronePreflightGPS?: boolean;
  dronePreflightCompass?: boolean;
  dronePreflightSDCard?: boolean;
  dronePreflightLink?: boolean;
  dronePreflightPPE?: boolean;
  droneObjectives?: string;
  droneFlightCompleted?: boolean;
  droneMediaList?: DroneMediaItem[];
  // Estimate Form Data
  estimateData?: EstimateData;
  // Tree Risk Assessment Data
  treeRiskData?: TreeRiskAssessmentData;
}

export interface SavedJobSummary {
  id: string;
  title: string;
  clientName?: string;
  location?: string;
  date?: string;
  updatedAt?: string;
  updatedAtMillis?: number;
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'local-only' | 'error';

interface SiteContextType {
  siteData: SiteData;
  updateSiteData: (data: Partial<SiteData>) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
  isLoading: boolean;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  isSavingLocal: boolean;
  lastSavedLocal: string | null;

  // Cloud synchronization state
  activeJobId: string;
  activeJobTitle: string;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  savedJobs: SavedJobSummary[];
  isLoadingJobs: boolean;
  syncError: string | null;

  // Multi-device cloud operations
  switchJob: (jobId: string) => Promise<void>;
  createNewJob: (title?: string) => Promise<string>;
  saveCurrentJobAs: (title: string) => Promise<string>;
  deleteJob: (jobId: string) => Promise<void>;
  forceSyncWithCloud: () => Promise<void>;
  restoreFromCloud: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Helper to calculate friendly worksheet title
function computeJobTitle(data: SiteData, fallbackId: string): string {
  if (data.clientName && data.location) {
    return `${data.clientName} - ${data.location}`;
  }
  if (data.clientName) {
    return `${data.clientName} Worksheet`;
  }
  if (data.location) {
    return `Site: ${data.location}`;
  }
  if (fallbackId === 'current-job') {
    return 'Default Field Worksheet';
  }
  return `Worksheet #${fallbackId.slice(-4)}`;
}

/**
 * Recursively sanitizes any payload destined for Firestore.
 * Firestore strictly disallows `undefined` anywhere in document trees.
 * This removes all keys with undefined values from objects and arrays,
 * while safely preserving Firestore FieldValues (serverTimestamp, deleteField),
 * Timestamps, Dates, numbers, booleans, and strings.
 */
export function sanitizeForFirestore<T>(val: T): T {
  if (val === undefined) {
    return null as unknown as T;
  }
  if (val === null || typeof val !== 'object') {
    return val;
  }
  // Preserve Date instances, Firestore Timestamps and FieldValues
  if (
    val instanceof Date ||
    typeof (val as any).toMillis === 'function' ||
    (val as any)._methodName !== undefined ||
    (val as any).nanoseconds !== undefined
  ) {
    return val;
  }
  if (Array.isArray(val)) {
    return val
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(val as Record<string, any>)) {
    if (value === undefined) {
      continue; // completely strip undefined fields
    }
    cleaned[key] = sanitizeForFirestore(value);
  }
  return cleaned as T;
}

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read active job ID from localStorage (default: 'current-job')
  const [activeJobId, setActiveJobId] = useState<string>(() => {
    try {
      return localStorage.getItem('greentree-active-job-id') || 'current-job';
    } catch {
      return 'current-job';
    }
  });

  // Synchronously initialize siteData from localStorage for instantaneous rendering
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const activeId = localStorage.getItem('greentree-active-job-id') || 'current-job';
      const savedForJob = localStorage.getItem(`greentree-job-${activeId}`);
      if (savedForJob) {
        return JSON.parse(savedForJob);
      }
      const savedLegacy = localStorage.getItem('greentree-current-job');
      if (savedLegacy) {
        return JSON.parse(savedLegacy);
      }
    } catch (e) {
      console.error('Error reading localStorage site data:', e);
    }
    return {};
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const [lastSavedLocal, setLastSavedLocal] = useState<string | null>(() => {
    return localStorage.getItem('greentree-current-job-time') || null;
  });

  // Cloud Sync State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local-only');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<SavedJobSummary[]>(() => {
    try {
      const cached = localStorage.getItem('greentree-cached-jobs');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Active Job Title
  const activeJobTitle = computeJobTitle(siteData, activeJobId);

  // Ref to track latest local changes timestamp to prevent cloud onSnapshot loops
  const localSaveTimeRef = useRef<number>(Date.now());
  const isCloudPushingRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (auth.currentUser) {
        setSyncStatus('syncing');
        // Trigger quick sync on reconnect
        forceSyncWithCloud();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [activeJobId]);

  // Firestore Real-Time Synchronizer across Devices
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        setSyncStatus('local-only');
        setIsLoading(false);
        return;
      }

      setSyncStatus('syncing');
      setIsLoadingJobs(true);

      // 1. Subscribe to the collection of user's saved jobs to show across devices
      const jobsCollectionRef = collection(db, 'users', currentUser.uid, 'jobs');
      const unsubscribeJobsList = onSnapshot(
        jobsCollectionRef,
        (snapshot) => {
          const list: SavedJobSummary[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            const dateObj = d.updatedAt?.toDate ? d.updatedAt.toDate() : null;
            return {
              id: docSnap.id,
              title: d.title || computeJobTitle(d.data || {}, docSnap.id),
              clientName: d.clientName || d.data?.clientName || '',
              location: d.location || d.data?.location || '',
              date: d.data?.date || '',
              updatedAt: dateObj 
                ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
                : 'Recently',
              updatedAtMillis: dateObj ? dateObj.getTime() : 0,
            };
          });

          // Sort descending by last updated
          list.sort((a, b) => (b.updatedAtMillis || 0) - (a.updatedAtMillis || 0));

          setSavedJobs(list);
          setIsLoadingJobs(false);
          localStorage.setItem('greentree-cached-jobs', JSON.stringify(list));
        },
        (err) => {
          console.warn('Jobs list snapshot error:', err);
          setIsLoadingJobs(false);
        }
      );

      // 2. Subscribe to active worksheet document in Firestore for real-time bidirectional sync
      const activeDocRef = doc(db, 'users', currentUser.uid, 'jobs', activeJobId);

      const unsubscribeActiveDoc = onSnapshot(
        activeDocRef,
        async (docSnap) => {
          if (isCloudPushingRef.current) {
            // Write was originated by this device, ignore echo
            return;
          }

          if (docSnap.exists()) {
            const cloudPayload = docSnap.data();
            const cloudData: SiteData = cloudPayload.data || {};
            const cloudTimestamp = cloudPayload.updatedAt?.toMillis ? cloudPayload.updatedAt.toMillis() : Date.now();

            // Check if cloud document is genuinely newer than this device's last local change
            const localSavedTimestamp = Number(localStorage.getItem(`greentree-job-modified-${activeJobId}`) || '0');
            const localHasContent = Object.keys(siteData).some(k => (siteData as any)[k]);

            if (!localHasContent || cloudTimestamp > localSavedTimestamp) {
              setSiteData(cloudData);
              localStorage.setItem(`greentree-job-${activeJobId}`, JSON.stringify(cloudData));
              localStorage.setItem('greentree-current-job', JSON.stringify(cloudData));
              
              const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              setLastSyncedAt(nowStr);
              setSyncStatus('synced');
            }
          } else {
            // Document doesn't exist yet in Firestore cloud (e.g. brand new job created locally).
            // Sync initial local state up to Firestore so it exists on all other devices!
            const localHasContent = Object.keys(siteData).some(k => (siteData as any)[k]);
            if (localHasContent) {
              try {
                isCloudPushingRef.current = true;
                const title = computeJobTitle(siteData, activeJobId);
                const payload = sanitizeForFirestore({
                  id: activeJobId,
                  ownerId: currentUser.uid,
                  title: title,
                  clientName: siteData.clientName || '',
                  location: siteData.location || '',
                  data: siteData,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                });
                await setDoc(activeDocRef, payload, { merge: true });
                setSyncStatus('synced');
                setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
              } catch (e) {
                console.warn('Initial cloud document seed caught:', e);
              } finally {
                isCloudPushingRef.current = false;
              }
            } else {
              setSyncStatus('synced');
            }
          }
          setIsLoading(false);
        },
        (error) => {
          if (error.message && error.message.includes('offline')) {
            setSyncStatus('offline');
          } else if (error.code === 'permission-denied') {
            handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}/jobs/${activeJobId}`);
          } else {
            console.error('Active job snapshot error:', error);
            setSyncStatus('error');
          }
          setIsLoading(false);
        }
      );

      return () => {
        unsubscribeJobsList();
        unsubscribeActiveDoc();
      };
    });

    return () => unsubscribeAuth();
  }, [activeJobId]);

  // Push local changes to Firestore with debounce
  const pushToCloud = useCallback(async (jobId: string, data: SiteData) => {
    if (!auth.currentUser || !navigator.onLine) {
      setSyncStatus(navigator.onLine ? 'local-only' : 'offline');
      return;
    }

    setSyncStatus('syncing');
    setSyncError(null);
    isCloudPushingRef.current = true;

    try {
      const title = computeJobTitle(data, jobId);
      const activeDocRef = doc(db, 'users', auth.currentUser.uid, 'jobs', jobId);
      
      const payload = sanitizeForFirestore({
        id: jobId,
        ownerId: auth.currentUser.uid,
        title: title,
        clientName: data.clientName || '',
        location: data.location || '',
        data: data,
        updatedAt: serverTimestamp(),
      });

      await setDoc(activeDocRef, payload, { merge: true });

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedAt(nowTime);
      setSyncStatus('synced');
    } catch (e: any) {
      if (e instanceof Error && e.message.includes('offline')) {
        setSyncStatus('offline');
      } else if (e?.code === 'permission-denied') {
        handleFirestoreError(e, OperationType.WRITE, `users/${auth.currentUser?.uid}/jobs/${jobId}`);
      } else {
        console.error('Error syncing to Firestore cloud:', e);
        setSyncError(e.message || 'Sync failed');
        setSyncStatus('error');
      }
    } finally {
      // Delay releasing flag slightly to let local snapshot settle
      setTimeout(() => {
        isCloudPushingRef.current = false;
      }, 400);
    }
  }, []);

  // Update site data (Immediate local storage + debounced cloud sync)
  const updateSiteData = useCallback((data: Partial<SiteData>) => {
    setIsSavingLocal(true);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedLocal(nowStr);
    localStorage.setItem('greentree-current-job-time', nowStr);

    const modifiedTime = Date.now();
    localSaveTimeRef.current = modifiedTime;

    setSiteData((prev) => {
      const newData = { ...prev, ...data };

      // Instant local persistence
      localStorage.setItem(`greentree-job-${activeJobId}`, JSON.stringify(newData));
      localStorage.setItem('greentree-current-job', JSON.stringify(newData));
      localStorage.setItem(`greentree-job-modified-${activeJobId}`, modifiedTime.toString());

      // Debounce Firestore network push
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        pushToCloud(activeJobId, newData);
      }, 800);

      return newData;
    });

    setTimeout(() => {
      setIsSavingLocal(false);
    }, 400);
  }, [activeJobId, pushToCloud]);

  // Switch active worksheet across devices
  const switchJob = async (newJobId: string) => {
    if (newJobId === activeJobId) return;

    setIsLoading(true);
    setActiveJobId(newJobId);
    localStorage.setItem('greentree-active-job-id', newJobId);

    // 1. Try local storage cache for instantaneous render
    const cached = localStorage.getItem(`greentree-job-${newJobId}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setSiteData(parsed);
      } catch (e) {
        console.error('Error parsing cached job data:', e);
      }
    }

    // 2. Fetch fresh document from Firestore if logged in
    if (auth.currentUser && navigator.onLine) {
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'jobs', newJobId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const freshData = docSnap.data().data || {};
          setSiteData(freshData);
          localStorage.setItem(`greentree-job-${newJobId}`, JSON.stringify(freshData));
          localStorage.setItem('greentree-current-job', JSON.stringify(freshData));
          setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setSyncStatus('synced');
        }
      } catch (err) {
        console.warn('Switch job remote fetch error:', err);
      }
    }

    setIsLoading(false);
  };

  // Create new blank worksheet
  const createNewJob = async (title?: string): Promise<string> => {
    const newId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const initialData: SiteData = {
      date: new Date().toISOString().split('T')[0],
      clientName: title || '',
      scope: 'Standard arborist site assessment and tree evaluation.',
      tasks: ['Tree health evaluation', 'Risk inspection', 'Site briefing'],
      equipment: ['Chainsaw', 'PPE / Hard Hats', 'Rigging ropes', 'First aid kit'],
      hazards: ['Overhead powerlines', 'Trip hazards / uneven ground'],
      treeSpecies: [],
    };

    setActiveJobId(newId);
    setSiteData(initialData);

    localStorage.setItem('greentree-active-job-id', newId);
    localStorage.setItem(`greentree-job-${newId}`, JSON.stringify(initialData));
    localStorage.setItem('greentree-current-job', JSON.stringify(initialData));
    localStorage.setItem(`greentree-job-modified-${newId}`, Date.now().toString());

    if (auth.currentUser && navigator.onLine) {
      try {
        setSyncStatus('syncing');
        const docRef = doc(db, 'users', auth.currentUser.uid, 'jobs', newId);
        const payload = sanitizeForFirestore({
          id: newId,
          ownerId: auth.currentUser.uid,
          title: title || 'New Arborist Worksheet',
          clientName: title || '',
          location: '',
          data: initialData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        await setDoc(docRef, payload);
        setSyncStatus('synced');
        setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err: any) {
        if (err.code === 'permission-denied') {
          handleFirestoreError(err, OperationType.CREATE, `users/${auth.currentUser.uid}/jobs/${newId}`);
        } else {
          console.error('Error creating new cloud worksheet:', err);
        }
      }
    }

    return newId;
  };

  // Save current worksheet as a new named copy in cloud
  const saveCurrentJobAs = async (title: string): Promise<string> => {
    const newId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const copyData: SiteData = { ...siteData };

    localStorage.setItem(`greentree-job-${newId}`, JSON.stringify(copyData));
    localStorage.setItem(`greentree-job-modified-${newId}`, Date.now().toString());

    if (auth.currentUser && navigator.onLine) {
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'jobs', newId);
        const payload = sanitizeForFirestore({
          id: newId,
          ownerId: auth.currentUser.uid,
          title: title,
          clientName: copyData.clientName || '',
          location: copyData.location || '',
          data: copyData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        await setDoc(docRef, payload);
      } catch (err: any) {
        if (err.code === 'permission-denied') {
          handleFirestoreError(err, OperationType.CREATE, `users/${auth.currentUser.uid}/jobs/${newId}`);
        } else {
          console.error('Error saving copy to cloud:', err);
          throw err;
        }
      }
    }

    // Switch to this new job
    setActiveJobId(newId);
    localStorage.setItem('greentree-active-job-id', newId);
    return newId;
  };

  // Delete a worksheet
  const deleteJob = async (jobId: string): Promise<void> => {
    // Remove local caches
    localStorage.removeItem(`greentree-job-${jobId}`);
    localStorage.removeItem(`greentree-job-modified-${jobId}`);

    if (auth.currentUser && navigator.onLine) {
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'jobs', jobId);
        await deleteDoc(docRef);
      } catch (err: any) {
        if (err.code === 'permission-denied') {
          handleFirestoreError(err, OperationType.DELETE, `users/${auth.currentUser.uid}/jobs/${jobId}`);
        } else {
          console.error('Error deleting cloud worksheet:', err);
          throw err;
        }
      }
    }

    // If deleting active job, switch back to 'current-job' or first available
    if (jobId === activeJobId) {
      await switchJob('current-job');
    }
  };

  // Manual Force Cloud Synchronization (Pulls latest from Firestore server)
  const forceSyncWithCloud = async (): Promise<void> => {
    if (!auth.currentUser || !navigator.onLine) {
      setSyncStatus(navigator.onLine ? 'local-only' : 'offline');
      return;
    }

    setSyncStatus('syncing');
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid, 'jobs', activeJobId);
      let snap;
      try {
        snap = await getDocFromServer(docRef);
      } catch (serverErr: any) {
        // Fallback to cache / default getDoc if getDocFromServer is not available
        snap = await getDoc(docRef);
      }

      if (snap.exists()) {
        const cloudData = snap.data().data || {};
        setSiteData(cloudData);
        localStorage.setItem(`greentree-job-${activeJobId}`, JSON.stringify(cloudData));
        localStorage.setItem('greentree-current-job', JSON.stringify(cloudData));
      } else {
        // Cloud has nothing, push our local storage up
        await pushToCloud(activeJobId, siteData);
      }

      setSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      if (err.message && err.message.includes('offline')) {
        setSyncStatus('offline');
      } else {
        console.error('Force sync error:', err);
        setSyncStatus('error');
      }
    }
  };

  // Restore worksheet from cloud
  const restoreFromCloud = async (): Promise<void> => {
    await forceSyncWithCloud();
  };

  return (
    <SiteContext.Provider value={{ 
      siteData, 
      updateSiteData, 
      isAnalyzing, 
      setIsAnalyzing, 
      isLoading,
      isOnline,
      setIsOnline,
      isSavingLocal,
      lastSavedLocal,
      activeJobId,
      activeJobTitle,
      syncStatus,
      lastSyncedAt,
      savedJobs,
      isLoadingJobs,
      syncError,
      switchJob,
      createNewJob,
      saveCurrentJobAs,
      deleteJob,
      forceSyncWithCloud,
      restoreFromCloud
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};
