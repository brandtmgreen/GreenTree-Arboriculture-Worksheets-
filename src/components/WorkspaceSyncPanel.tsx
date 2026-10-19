import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useSiteContext } from '../context/SiteContext';
import { parseWorkspaceEmail } from '../services/geminiService';
import { 
  Mail, 
  Calendar as CalendarIcon, 
  ArrowDownToLine, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  ExternalLink,
  Lock,
  ChevronDown,
  ChevronUp,
  Inbox,
  UserCheck
} from 'lucide-react';

interface EmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
  body: string;
}

export const WorkspaceSyncPanel: React.FC = () => {
  const { user, accessToken, signIn } = useFirebase();
  const { siteData, updateSiteData } = useSiteContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'gmail' | 'calendar' | 'send'>('gmail');
  
  // Gmail State
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('arborist OR tree OR pruning OR removal');
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [isParsingEmail, setIsParsingEmail] = useState<string | null>(null);
  const [gmailError, setGmailError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Calendar State
  const [calTitle, setCalTitle] = useState('');
  const [calDate, setCalDate] = useState('');
  const [calTime, setCalTime] = useState('08:00');
  const [calDuration, setCalDuration] = useState('4'); // hours
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [calendarSuccess, setCalendarSuccess] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  // Email Send State
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('Here is the completed arborist worksheet and site documentation for our scheduled job.');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Prefill states when siteData changes
  useEffect(() => {
    if (siteData) {
      const client = siteData.clientName || 'General';
      const loc = siteData.location ? ` - ${siteData.location}` : '';
      setCalTitle(`Arborist Job: ${client}${loc}`);
      setCalDate(siteData.date || new Date().toISOString().split('T')[0]);
      
      setRecipientEmail(siteData.email || '');
      setEmailSubject(`GreenTree Worksite Report: ${client}`);
    }
  }, [siteData]);

  // Fetch Relevant Emails from Gmail API
  const fetchEmails = async () => {
    if (!accessToken) return;
    setIsLoadingEmails(true);
    setGmailError(null);
    setImportSuccess(null);
    try {
      const q = encodeURIComponent(searchQuery);
      const listRes = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages?q=${q}&maxResults=6`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (!listRes.ok) {
        throw new Error('Failed to retrieve list of messages from Gmail API');
      }

      const listData = await listRes.json();
      if (!listData.messages || listData.messages.length === 0) {
        setEmails([]);
        setIsLoadingEmails(false);
        return;
      }

      // Fetch full details of each message
      const fullMessages = await Promise.all(
        listData.messages.map(async (msg: { id: string }) => {
          const detailRes = await fetch(
            `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` }
            }
          );
          if (!detailRes.ok) return null;
          const detail = await detailRes.json();

          const headers = detail.payload.headers;
          const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === 'subject');
          const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from');
          const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date');

          // Extract text body
          let bodyText = '';
          if (detail.payload.parts) {
            const textPart = detail.payload.parts.find((p: any) => p.mimeType === 'text/plain');
            if (textPart && textPart.body && textPart.body.data) {
              bodyText = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            } else {
              // Try nested parts
              const alternativePart = detail.payload.parts.find((p: any) => p.mimeType === 'multipart/alternative');
              if (alternativePart && alternativePart.parts) {
                const nestedText = alternativePart.parts.find((p: any) => p.mimeType === 'text/plain');
                if (nestedText && nestedText.body && nestedText.body.data) {
                  bodyText = atob(nestedText.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                }
              }
            }
          } else if (detail.payload.body && detail.payload.body.data) {
            bodyText = atob(detail.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          }

          return {
            id: msg.id,
            threadId: detail.threadId,
            snippet: detail.snippet || '',
            subject: subjectHeader ? subjectHeader.value : 'No Subject',
            from: fromHeader ? fromHeader.value : 'Unknown Sender',
            date: dateHeader ? new Date(dateHeader.value).toLocaleDateString() : 'Unknown Date',
            body: bodyText
          };
        })
      );

      setEmails(fullMessages.filter((m): m is EmailMessage => m !== null));
    } catch (err: any) {
      console.error(err);
      setGmailError(err.message || 'Error communicating with Gmail service');
    } finally {
      setIsLoadingEmails(false);
    }
  };

  // Trigger loading emails when logged in and open
  useEffect(() => {
    if (accessToken && isOpen && emails.length === 0) {
      fetchEmails();
    }
  }, [accessToken, isOpen]);

  // Parse Selected Email using Gemini API
  const handleParseAndPopulate = async (email: EmailMessage) => {
    const confirmImport = window.confirm(
      `Are you sure you want to import this email from "${email.from}" and let Gemini extract the arborist site data? This will overwrite empty fields on your active worksheet.`
    );
    if (!confirmImport) return;

    setIsParsingEmail(email.id);
    setGmailError(null);
    setImportSuccess(null);
    try {
      const parsedData = await parseWorkspaceEmail(email.subject, email.body || email.snippet, email.snippet);
      
      // Clean up extracted fields to avoid empty overwrites
      const filteredData: any = {};
      Object.entries(parsedData).forEach(([key, val]) => {
        if (val && (Array.isArray(val) ? val.length > 0 : String(val).trim() !== '')) {
          filteredData[key] = val;
        }
      });

      if (Object.keys(filteredData).length === 0) {
        throw new Error('AI was unable to extract any structured arborist fields from this email body.');
      }

      updateSiteData(filteredData as Partial<typeof siteData>);
      
      const fieldsList = Object.keys(filteredData)
        .map(f => f.replace(/([A-Z])/g, ' $1').toLowerCase())
        .join(', ');
      
      setImportSuccess(`Successfully populated: ${fieldsList}!`);
    } catch (err: any) {
      console.error(err);
      setGmailError(err.message || 'Failed to parse and import email');
    } finally {
      setIsParsingEmail(null);
    }
  };

  // Schedule Event on Google Calendar API
  const handleCreateCalendarEvent = async () => {
    if (!accessToken) return;
    
    // Construct times
    const startDateTimeStr = `${calDate}T${calTime}:00`;
    const startDateObj = new Date(startDateTimeStr);
    if (isNaN(startDateObj.getTime())) {
      setCalendarError('Please supply a valid date and start time.');
      return;
    }
    const endDateObj = new Date(startDateObj.getTime() + parseFloat(calDuration) * 60 * 60 * 1000);
    
    // Explicit user confirmation dialog before updating user data!
    const confirmCreate = window.confirm(
      `Are you sure you want to schedule this arborist job event on your Google Calendar?\n\n` +
      `Event: ${calTitle}\n` +
      `Date: ${startDateObj.toLocaleDateString()}\n` +
      `Time: ${startDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n` +
      `Duration: ${calDuration} hours`
    );
    if (!confirmCreate) return;

    setIsCreatingEvent(true);
    setCalendarError(null);
    setCalendarSuccess(false);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary: calTitle,
            location: siteData.location || '',
            description: `GreenTree Arboricultural Work Order\n\n` +
              `Client: ${siteData.clientName || 'N/A'}\n` +
              `Contact Phone: ${siteData.phone || 'N/A'}\n` +
              `Contact Email: ${siteData.email || 'N/A'}\n` +
              `Scope of Work: ${siteData.scope || 'N/A'}\n` +
              `Crew Leader assigned: ${siteData.crewLeader || 'N/A'}\n` +
              `Tasks checklist: ${siteData.tasks?.join(', ') || 'N/A'}\n` +
              `Equipment reserved: ${siteData.equipment?.join(', ') || 'N/A'}\n\n` +
              (siteData.dronePilot ? 
                `[Drone Flight Mission Plan]\n` +
                `- Remote PIC: ${siteData.dronePilot}\n` +
                `- License: ${siteData.droneLicense || 'N/A'}\n` +
                `- UAS Airframe: ${siteData.droneModel || 'N/A'} (Reg: ${siteData.droneRegistration || 'N/A'})\n` +
                `- Altitude: ${siteData.droneAltitude || '120'} ft AGL (${siteData.droneAirspaceClass || 'Class G'})\n` +
                `- Objectives: ${siteData.droneObjectives || 'N/A'}\n` +
                `- Media Uploaded: ${siteData.droneMediaList?.length || 0} files\n\n` : '') +
              `Registered via GreenTree Arborist Field Forms app.`,
            start: {
              dateTime: startDateObj.toISOString(),
              timeZone: timezone
            },
            end: {
              dateTime: endDateObj.toISOString(),
              timeZone: timezone
            },
            reminders: {
              useDefault: true
            }
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Failed to create Google Calendar event');
      }

      setCalendarSuccess(true);
    } catch (err: any) {
      console.error(err);
      setCalendarError(err.message || 'Failed to create Google Calendar event');
    } finally {
      setIsCreatingEvent(false);
    }
  };

  // Send Report Email via Gmail API
  const handleSendGmailReport = async () => {
    if (!accessToken) return;
    if (!recipientEmail) {
      setSendError('Please enter a valid recipient email address.');
      return;
    }

    // Construct highly professional, beautifully formatted HTML report
    const client = siteData.clientName || 'General Client';
    const loc = siteData.location || 'N/A';
    const phoneNum = siteData.phone || 'N/A';
    const emailAddr = siteData.email || 'N/A';
    const dateVal = siteData.date || new Date().toLocaleDateString();
    const leader = siteData.crewLeader || 'N/A';
    const tasks = siteData.tasks?.join(', ') || 'N/A';
    const equip = siteData.equipment?.join(', ') || 'N/A';
    const notes = siteData.briefingNotes || 'N/A';
    const assessment = siteData.healthNotes || 'N/A';
    const hazardList = siteData.hazards?.join(', ') || 'N/A';
    const species = siteData.treeSpecies?.join(', ') || 'N/A';

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 650px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #15803d; padding: 24px; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em;">GreenTree Arboriculture</h2>
          <p style="margin: 4px 0 0 0; opacity: 0.8; font-size: 13px;">Official Worksite Summary & Safety Dispatch</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p style="font-size: 14px; color: #475569; margin-top: 0;">${emailMessage}</p>
          
          <h3 style="color: #15803d; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; font-size: 15px; margin-top: 24px;">CUSTOMER & SITE INFRASTRUCTURE</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 30%;">Client Name:</td><td style="padding: 6px 0;">${client}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Site Address:</td><td style="padding: 6px 0;">${loc}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td style="padding: 6px 0;">${phoneNum}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td style="padding: 6px 0;">${emailAddr}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Job Date:</td><td style="padding: 6px 0;">${dateVal}</td></tr>
          </table>

          <h3 style="color: #15803d; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; font-size: 15px; margin-top: 24px;">TASK SPECIFICATIONS & DISPATCH</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 30%;">Crew Leader:</td><td style="padding: 6px 0;">${leader}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Tasks:</td><td style="padding: 6px 0;">${tasks}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Equipment:</td><td style="padding: 6px 0;">${equip}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Scope Notes:</td><td style="padding: 6px 0;">${siteData.scope || 'N/A'}</td></tr>
          </table>

          <h3 style="color: #15803d; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; font-size: 15px; margin-top: 24px;">ARBORICULTURE & ARBORIST HAZARDS</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 30%;">Tree Species:</td><td style="padding: 6px 0;">${species}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Hazards Detected:</td><td style="padding: 6px 0; color: #b91c1c;">${hazardList}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Health Brief:</td><td style="padding: 6px 0;">${assessment}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Site Notes:</td><td style="padding: 6px 0;">${notes}</td></tr>
          </table>

          ${siteData.dronePilot ? `
          <h3 style="color: #15803d; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; font-size: 15px; margin-top: 24px;">DRONE FLIGHT PLAN & AVIATION</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 30%;">Pilot in Command:</td><td style="padding: 6px 0;">${siteData.dronePilot} (FAA #${siteData.droneLicense || 'N/A'})</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">UAS Registration:</td><td style="padding: 6px 0;">${siteData.droneModel || 'N/A'} [${siteData.droneRegistration || 'N/A'}]</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Altitude & Airspace:</td><td style="padding: 6px 0;">${siteData.droneAltitude || '120'} ft AGL &bull; ${siteData.droneAirspaceClass || 'Class G'} ${siteData.droneAirspaceApproved ? '(Approved)' : '(Pending)'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Weather Assessment:</td><td style="padding: 6px 0;">Wind Speed: ${siteData.droneWindSpeed || '0'} kts &bull; Visibility: ${siteData.droneVisibility || '5'} statute miles</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Mission Objectives:</td><td style="padding: 6px 0;">${siteData.droneObjectives || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Media Intake Count:</td><td style="padding: 6px 0;">${siteData.droneMediaList?.length || 0} files uploaded</td></tr>
          </table>
          ` : ''}
          
          <div style="margin-top: 32px; padding: 12px; background-color: #f8fafc; border-radius: 6px; text-align: center; font-size: 11px; color: #64748b;">
            This email was safely composed and dispatched using the official Google Workspace integration on GreenTree Arborist Forms.
          </div>
        </div>
      </div>
    `;

    // Explicit user confirmation dialog before updating user data / sending emails!
    const confirmSend = window.confirm(
      `Are you sure you want to send this arborist summary report via email?\n\n` +
      `Recipient: ${recipientEmail}\n` +
      `Subject: ${emailSubject}`
    );
    if (!confirmSend) return;

    setIsSendingEmail(true);
    setSendError(null);
    setSendSuccess(false);

    try {
      // Compose RFC 822 format raw message
      const emailLines = [
        `To: ${recipientEmail}`,
        `Subject: ${emailSubject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        htmlBody
      ];
      
      const rawString = emailLines.join('\n');
      
      // Base64url encode helper
      const encodedRaw = btoa(unescape(encodeURIComponent(rawString)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch(
        'https://www.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            raw: encodedRaw
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Failed to dispatch email via Gmail API');
      }

      setSendSuccess(true);
    } catch (err: any) {
      console.error(err);
      setSendError(err.message || 'Failed to dispatch report via Gmail API');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6 overflow-hidden">
      {/* Header Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-5 py-4 cursor-pointer bg-brand-green/5 hover:bg-brand-green/10 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-green/10 rounded-xl text-brand-green">
            <Mail size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Google Workspace Sync
              <span className={`w-2 h-2 rounded-full ${accessToken ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            </h3>
            <p className="text-xs text-gray-500">
              {accessToken 
                ? 'Authenticated • Calendar event creation and email sync active' 
                : 'Connect Google Calendar & Gmail to enable bi-directional populating'
              }
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 p-5 space-y-5">
          {!accessToken ? (
            <div className="text-center py-6 px-4 space-y-4">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <Lock size={24} />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h4 className="text-sm font-bold text-gray-900">Authorize Google Workspace Integration</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  To import work orders directly from client emails and automatically sync scheduled jobs with Google Calendar or email crew summaries, secure authorization is required.
                </p>
              </div>
              <button 
                onClick={signIn}
                className="gsi-material-button mx-auto flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="gsi-material-button-content-wrapper flex items-center gap-3">
                  <div className="gsi-material-button-icon w-5 h-5 flex items-center justify-center">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-gray-700">Sign in with Google Workspace</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Tab Buttons */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveSubTab('gmail')}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                    activeSubTab === 'gmail' 
                      ? 'border-brand-green text-brand-green' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Inbox size={14} />
                  📥 Import from Gmail
                </button>
                <button
                  onClick={() => setActiveSubTab('calendar')}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                    activeSubTab === 'calendar' 
                      ? 'border-brand-green text-brand-green' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <CalendarIcon size={14} />
                  📅 Schedule Calendar
                </button>
                <button
                  onClick={() => setActiveSubTab('send')}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                    activeSubTab === 'send' 
                      ? 'border-brand-green text-brand-green' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Send size={14} />
                  ✉️ Email crew report
                </button>
              </div>

              {/* Sub-tab 1: Import Gmail */}
              {activeSubTab === 'gmail' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="input-field text-xs sm:text-sm"
                      placeholder="Search Gmail (e.g. 'oak prune' or client name)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                      onClick={fetchEmails}
                      disabled={isLoadingEmails}
                      className="btn-primary text-xs py-2 px-3 flex items-center gap-2"
                    >
                      {isLoadingEmails ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                      )}
                      Search
                    </button>
                  </div>

                  {gmailError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle size={14} />
                      {gmailError}
                    </div>
                  )}

                  {importSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-700 flex items-center gap-2 font-medium">
                      <CheckCircle2 size={14} />
                      {importSuccess}
                    </div>
                  )}

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {emails.length === 0 ? (
                      <div className="text-center py-6 text-xs text-gray-400">
                        {isLoadingEmails ? 'Querying Gmail API...' : 'No matching arborist request emails found.'}
                      </div>
                    ) : (
                      emails.map((email) => (
                        <div 
                          key={email.id}
                          className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-left relative flex justify-between items-start gap-4"
                        >
                          <div className="space-y-1 flex-grow">
                            <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                              <span>From: {email.from}</span>
                              <span>{email.date}</span>
                            </div>
                            <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{email.subject}</h4>
                            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{email.snippet}</p>
                          </div>
                          <button
                            onClick={() => handleParseAndPopulate(email)}
                            disabled={isParsingEmail !== null}
                            className="btn-secondary text-[10px] font-bold uppercase tracking-wider py-1 px-2 shrink-0 flex items-center gap-1.5 self-center border-emerald-600/30 text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white"
                          >
                            {isParsingEmail === email.id ? (
                              <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                            ) : (
                              <ArrowDownToLine size={12} />
                            )}
                            {isParsingEmail === email.id ? 'Parsing...' : 'Import'}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Calendar Schedule */}
              {activeSubTab === 'calendar' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-500">Event Title</label>
                      <input 
                        type="text" 
                        className="input-field text-xs" 
                        value={calTitle}
                        onChange={(e) => setCalTitle(e.target.value)}
                        placeholder="e.g. Oak Tree Pruning"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Date</label>
                        <input 
                          type="date" 
                          className="input-field text-xs" 
                          value={calDate}
                          onChange={(e) => setCalDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Time</label>
                        <input 
                          type="time" 
                          className="input-field text-xs" 
                          value={calTime}
                          onChange={(e) => setCalTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left items-end">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-500">Duration (Hours)</label>
                      <select 
                        className="input-field text-xs"
                        value={calDuration}
                        onChange={(e) => setCalDuration(e.target.value)}
                      >
                        <option value="1">1 Hour</option>
                        <option value="2">2 Hours</option>
                        <option value="4">4 Hours (Half Day)</option>
                        <option value="8">8 Hours (Full Day)</option>
                      </select>
                    </div>
                    <button 
                      onClick={handleCreateCalendarEvent}
                      disabled={isCreatingEvent || !calDate || !calTitle}
                      className="btn-primary py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 w-full disabled:opacity-50"
                    >
                      {isCreatingEvent ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <CalendarIcon size={14} />
                      )}
                      {isCreatingEvent ? 'Scheduling...' : 'Schedule on Google Calendar'}
                    </button>
                  </div>

                  {calendarSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-700 flex items-center gap-2 font-medium">
                      <CheckCircle2 size={14} />
                      Successfully created Google Calendar event on your primary calendar!
                    </div>
                  )}

                  {calendarError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle size={14} />
                      {calendarError}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 3: Email Report */}
              {activeSubTab === 'send' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-500">Recipient Email</label>
                      <input 
                        type="email" 
                        className="input-field text-xs" 
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="crew@company.com or client@gmail.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-500">Subject</label>
                      <input 
                        type="text" 
                        className="input-field text-xs" 
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Subject"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold uppercase text-gray-500">Message Introduction</label>
                    <textarea 
                      className="input-field text-xs min-h-[60px]"
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                    />
                  </div>

                  <button 
                    onClick={handleSendGmailReport}
                    disabled={isSendingEmail || !recipientEmail || !emailSubject}
                    className="btn-primary py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 w-full disabled:opacity-50"
                  >
                    {isSendingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Send size={14} />
                    )}
                    {isSendingEmail ? 'Dispatching...' : 'Email Report via Gmail API'}
                  </button>

                  {sendSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-700 flex items-center gap-2 font-medium">
                      <CheckCircle2 size={14} />
                      Successfully compiled and dispatched work order report via Gmail!
                    </div>
                  )}

                  {sendError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle size={14} />
                      {sendError}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
