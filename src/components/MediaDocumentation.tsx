import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Video, Plus, Trash2, ExternalLink, Play, Layers, Download, Sparkles, Youtube, BookOpen, FileText } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';
import { analyzeMedia } from '../services/geminiService';
import { printBlankWorksheet } from '../utils/printHelpers';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'drone';
  title: string;
  url: string;
  description: string;
  timestamp: string;
}

export const MediaDocumentation: React.FC = () => {
  const { updateSiteData, isAnalyzing, setIsAnalyzing, siteData } = useSiteContext();
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [analysisFocus, setAnalysisFocus] = useState<string>('General Analysis');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const [beforeImage, setBeforeImage] = useState<string>("https://picsum.photos/seed/before/400/400");
  const [afterImage, setAfterImage] = useState<string | null>(null);

  const focusOptions = [
    'General Analysis',
    'Identify Pests',
    'Assess Structural Integrity',
    'Detect Disease Signs',
    'Evaluate Hazard Potential'
  ];

  const [media, setMedia] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'image',
      title: 'Before Shot - Front Yard Oak',
      url: 'https://picsum.photos/seed/tree1/800/600',
      description: 'Initial state before pruning. Note the deadwood in the upper canopy.',
      timestamp: '2026-03-25 08:30',
    },
    {
      id: '2',
      type: 'drone',
      title: 'Drone Survey - Canopy View',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Aerial inspection of structural integrity and power line proximity.',
      timestamp: '2026-03-25 09:15',
    }
  ]);

  const handleAIScan = async () => {
    setIsAnalyzing(true);
    try {
      const urls = media.map(m => m.url);
      const descriptions = media.map(m => `${m.title}: ${m.description}`);
      const data = await analyzeMedia(urls, descriptions, analysisFocus);
      updateSiteData(data);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const newItem: MediaItem = {
        id: Math.random().toString(36).substr(2, 9),
        type: file.type.startsWith('video') ? 'video' : 'image',
        title: file.name || 'Site Photo',
        url: result,
        description: 'Captured via field application.',
        timestamp: new Date().toLocaleString(),
      };
      setMedia(prev => [newItem, ...prev]);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };

  const handleBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setBeforeImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setAfterImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDownloadAll = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      // In a real app, this would bundle media into a ZIP file
      alert('Media bundle (ZIP) generation started. Your download will begin shortly.');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
          <Camera size={24} className="sm:w-7 sm:h-7" />
          Media & Documentation
        </h2>
        <div className="flex flex-wrap gap-2 self-start sm:self-auto items-center">
          <select
            value={analysisFocus}
            onChange={(e) => setAnalysisFocus(e.target.value)}
            className="text-xs sm:text-sm border border-brand-green/20 rounded-md bg-white text-gray-700 py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-vibrant"
            disabled={isAnalyzing}
          >
            {focusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button 
            onClick={handleAIScan}
            disabled={isAnalyzing}
            className="btn-secondary text-sm py-1.5 flex items-center gap-2 disabled:opacity-50 bg-brand-vibrant/10 border-brand-vibrant text-brand-vibrant hover:bg-brand-vibrant hover:text-white"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-brand-vibrant border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Sparkles size={16} />
            )}
            {isAnalyzing ? 'Analyzing...' : 'AI Site Scan'}
          </button>
          <button 
            onClick={handleDownloadAll}
            disabled={isDownloading}
            className="btn-secondary text-sm py-1.5 flex items-center gap-2 disabled:opacity-50"
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download size={16} />
            )}
            {isDownloading ? 'Bundling...' : 'Download All'}
          </button>
          
          <button
            type="button"
            onClick={() => printBlankWorksheet('media')}
            className="btn-secondary text-sm py-1.5 flex items-center gap-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            title="Print blank photo & diagram field sketch log sheet"
          >
            <FileText size={16} className="text-emerald-700" />
            Print Blank Form
          </button>
          
          <input 
            type="file" 
            accept="image/*,video/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={cameraInputRef} 
            onChange={handleFileChange} 
          />
          
          <button 
            onClick={() => cameraInputRef.current?.click()}
            disabled={isUploading}
            className="btn-secondary text-sm py-1.5 flex items-center gap-2 disabled:opacity-50 bg-white"
          >
            <Camera size={16} />
            Take Photo
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn-primary text-sm py-1.5 flex items-center gap-2 disabled:opacity-50"
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Plus size={16} />
            )}
            {isUploading ? 'Uploading...' : 'Add Media'}
          </button>
        </div>
      </div>

      {siteData && Object.keys(siteData).length > 0 && (
        <div className="bg-brand-vibrant/5 border border-brand-vibrant/20 rounded-xl p-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 text-brand-vibrant font-bold text-sm mb-2">
            <Sparkles size={14} />
            AI ANALYSIS SUMMARY
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {siteData.location && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Location</p>
                <p className="text-xs font-medium text-gray-700 truncate">{siteData.location}</p>
              </div>
            )}
            {siteData.treeSpecies && siteData.treeSpecies.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Species</p>
                <p className="text-xs font-medium text-gray-700">{siteData.treeSpecies.join(", ")}</p>
              </div>
            )}
            {siteData.hazards && siteData.hazards.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Hazards</p>
                <p className="text-xs font-medium text-red-600">{siteData.hazards.length} Identified</p>
              </div>
            )}
            {siteData.date && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Inferred Date</p>
                <p className="text-xs font-medium text-gray-700">{siteData.date}</p>
              </div>
            )}
          </div>

          {siteData.recommendations && siteData.recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-brand-vibrant/20">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-3">Recommended Resources</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {siteData.recommendations.map((rec, idx) => (
                  <a key={idx} href={rec.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-3 bg-white rounded-lg border border-brand-vibrant/20 hover:border-brand-vibrant transition-colors group">
                    <div className={`p-2 rounded-lg shrink-0 ${rec.type === 'video' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                      {rec.type === 'video' ? <Youtube size={16} /> : <BookOpen size={16} />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-brand-vibrant transition-colors line-clamp-1">{rec.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{rec.reason}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gallery Grid */}
        <div className="space-y-4">
          <div className="section-header text-brand-green">
            <ImageIcon size={20} />
            Site Gallery
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {media.map((item) => (
              <div key={item.id} className="worksheet-card overflow-hidden group">
                <div className="relative aspect-video bg-gray-100">
                  {item.type === 'image' ? (
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          {item.type === 'drone' ? <Layers size={24} /> : <Video size={24} />}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">
                          {item.type === 'drone' ? 'Drone Footage' : 'Video Clip'}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="p-2 bg-white rounded-full text-brand-green hover:scale-110 transition-transform">
                      <ExternalLink size={20} />
                    </button>
                    <button className="p-2 bg-red-500 rounded-full text-white hover:scale-110 transition-transform">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <span className="text-[10px] font-mono text-gray-400">{item.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before & After Comparison */}
        <div className="space-y-4">
          <div className="section-header text-brand-vibrant">
            <Layers size={20} />
            Before & After Comparison
          </div>
          
          <div className="worksheet-card p-4 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                  <img 
                    src={beforeImage} 
                    alt="Before" 
                    className="w-full h-full object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Before</div>
                </div>
                <input type="file" accept="image/*" className="hidden" ref={beforeInputRef} onChange={handleBeforeChange} />
                <button onClick={() => beforeInputRef.current?.click()} className="btn-secondary w-full text-xs py-1">Replace</button>
              </div>
              <div className="space-y-2">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative border-2 border-brand-vibrant">
                  {afterImage ? (
                    <img src={afterImage} alt="After" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 italic text-xs p-4 text-center">
                      Upload after shot...
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-brand-vibrant text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">After</div>
                </div>
                <input type="file" accept="image/*" className="hidden" ref={afterInputRef} onChange={handleAfterChange} />
                <button onClick={() => afterInputRef.current?.click()} className="btn-primary w-full text-xs py-1">{afterImage ? 'Replace' : 'Upload'}</button>
              </div>
            </div>
            
            <div className="p-3 bg-brand-green/5 rounded-lg border border-brand-green/10">
              <h4 className="text-xs font-bold text-brand-green uppercase mb-1">Comparison Notes</h4>
              <p className="text-xs text-gray-600 italic">
                "Significant improvement in canopy light penetration. All deadwood removed safely."
              </p>
            </div>
          </div>

          {/* External Links */}
          <div className="section-header text-brand-green mt-8">
            <Video size={20} />
            External Media Links
          </div>
          <div className="space-y-2">
            {[
              { label: 'Drone Inspection Video', url: 'https://vimeo.com/...' },
              { label: 'Site Survey Map', url: 'https://google.com/maps/...' },
              { label: 'Client Approval Video', url: 'https://youtube.com/...' },
            ].map((link) => (
              <div key={link.label} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:border-brand-green transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded text-gray-400 group-hover:bg-brand-green group-hover:text-white transition-colors">
                    <Play size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{link.label}</span>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
