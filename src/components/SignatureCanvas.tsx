import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Check, PenTool, Download, Eraser, Eye } from 'lucide-react';

export interface SignatureCanvasProps {
  id?: string;
  label?: string;
  subtitle?: string;
  initialSignature?: string; // base64 data URL
  onSave?: (dataUrl: string) => void;
  onClear?: () => void;
  readOnly?: boolean;
  required?: boolean;
  signerName?: string;
  date?: string;
  height?: number; // canvas height in px, default 160
  strokeColor?: string;
  className?: string;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  id = 'signature-canvas',
  label = 'Signature',
  subtitle = 'Sign within the frame using your fingertip, stylus, or mouse',
  initialSignature,
  onSave,
  onClear,
  readOnly = false,
  required = false,
  signerName,
  date,
  height = 160,
  strokeColor = '#0f392b', // brand dark forest green
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState<boolean>(Boolean(initialSignature));
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [savedDataUrl, setSavedDataUrl] = useState<string | undefined>(initialSignature);

  // Sync internal savedDataUrl if prop changes
  useEffect(() => {
    if (initialSignature) {
      setSavedDataUrl(initialSignature);
      setHasSignature(true);
      drawImageToCanvas(initialSignature);
    }
  }, [initialSignature]);

  const drawImageToCanvas = useCallback((dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw preserving aspect ratio inside canvas
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio, 1);
      const centerShiftX = (canvas.width - img.width * ratio) / 2;
      const centerShiftY = (canvas.height - img.height * ratio) / 2;
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShiftX,
        centerShiftY,
        img.width * ratio,
        img.height * ratio
      );
    };
    img.src = dataUrl;
  }, []);

  // Initialize and resize canvas with high DPI support
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const displayWidth = Math.max(rect.width, 240);
    const displayHeight = height;

    const dpr = window.devicePixelRatio || 1;
    
    // Save current content if any
    let currentContent: string | null = null;
    if (hasSignature && canvas.width > 0 && canvas.height > 0) {
      try {
        currentContent = canvas.toDataURL('image/png');
      } catch (e) {
        // ignore
      }
    }

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = strokeColor;
    }

    // Restore content or initial image
    const sourceUrl = currentContent || savedDataUrl;
    if (sourceUrl) {
      drawImageToCanvas(sourceUrl);
    }
  }, [height, strokeColor, hasSignature, savedDataUrl, drawImageToCanvas]);

  useEffect(() => {
    resizeCanvas();
    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas]);

  // Coordinate retrieval helper handling touch and mouse offsets correctly
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (readOnly) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    // Prevent scrolling when drawing on touch screens
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }

    setIsDrawing(true);
    setLastPoint(coords);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
      }
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || readOnly) return;
    const coords = getCoordinates(e);
    if (!coords || !lastPoint) return;

    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Smooth quadratic curve drawing
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    setLastPoint(coords);
    if (!hasSignature) {
      setHasSignature(true);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLastPoint(null);

    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        setSavedDataUrl(dataUrl);
        if (onSave) {
          onSave(dataUrl);
        }
      } catch (err) {
        console.error('Error generating signature data URL', err);
      }
    }
  };

  const handleClear = () => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setSavedDataUrl(undefined);
    if (onClear) {
      onClear();
    }
    if (onSave) {
      onSave('');
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const dataUrl = savedDataUrl || canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `signature-${(signerName || 'arborist').toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div id={id} className={`signature-component space-y-2 ${className}`}>
      {/* Header / Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <PenTool className="w-4 h-4 text-brand-green" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {hasSignature && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Check className="w-3 h-3" /> Signed
            </span>
          )}
        </div>

        {/* Action buttons */}
        {!readOnly && (
          <div className="flex items-center gap-1.5">
            {hasSignature && (
              <button
                type="button"
                onClick={handleDownload}
                title="Download signature as PNG"
                className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded text-xs flex items-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Save PNG</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasSignature}
              title="Clear pad to re-sign"
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent rounded text-xs flex items-center gap-1 transition-colors"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span className="text-[11px]">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Subtitle / Instructions */}
      {subtitle && (
        <p className="text-[11px] text-gray-500 leading-snug">
          {subtitle}
        </p>
      )}

      {/* Canvas Drawing Area */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-xl border transition-all overflow-hidden bg-white select-none ${
          hasSignature
            ? 'border-emerald-300 ring-1 ring-emerald-100'
            : 'border-dashed border-gray-300 hover:border-brand-green/50'
        } ${readOnly ? 'bg-gray-50/50 cursor-not-allowed' : 'cursor-crosshair'}`}
        style={{ touchAction: 'none' }}
      >
        {/* Baseline signing guide rule */}
        <div className="absolute inset-x-6 bottom-8 border-b border-gray-200 pointer-events-none flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest pl-1">
            X __________________________________________________
          </span>
          <span className="text-[10px] text-gray-300 uppercase tracking-wider pr-1">
            Sign on line
          </span>
        </div>

        {/* The interactive Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          className="w-full block relative z-10"
        />

        {/* Empty state hint */}
        {!hasSignature && !isDrawing && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-gray-300 gap-1 z-0">
            <PenTool className="w-6 h-6 opacity-40" />
            <span className="text-xs font-medium text-gray-400">Touch or click here to sign</span>
          </div>
        )}
      </div>

      {/* Signer & Date metadata footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-gray-500">
        <div>
          {signerName ? (
            <span>
              Signatory: <strong className="text-gray-800">{signerName}</strong>
            </span>
          ) : (
            <span className="italic text-gray-400">Signatory name not specified</span>
          )}
        </div>
        <div>
          {date ? (
            <span>
              Date: <strong className="text-gray-800">{date}</strong>
            </span>
          ) : (
            <span>Date: {new Date().toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignatureCanvas;
