import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  DollarSign, 
  Printer, 
  Download, 
  FileText, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Calendar, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useSiteContext, EstimateItem, EstimateData } from '../context/SiteContext';
import { SignatureCanvas } from './SignatureCanvas';
import { printBlankWorksheet } from '../utils/printHelpers';
import { FieldInstructionBlock } from './FieldInstructionBlock';

const DEFAULT_PRESETS: { category: string; description: string; quantity: number; unit: string; unitPrice: number }[] = [
  {
    category: 'Tree Removal',
    description: 'Hazardous tree dismantle and removal utilizing rigging gear; cut flush to grade.',
    quantity: 1,
    unit: 'Tree',
    unitPrice: 1850
  },
  {
    category: 'Pruning',
    description: 'Crown clean and elevate canopy over roof; prune deadwood > 2" diameter and structural crossing limbs.',
    quantity: 1,
    unit: 'Tree',
    unitPrice: 650
  },
  {
    category: 'Cabling & Support',
    description: 'Installation of 4-ton Cobra dynamic cabling system in upper canopy to stabilize co-dominant stems.',
    quantity: 1,
    unit: 'EA',
    unitPrice: 480
  },
  {
    category: 'Stump Grinding',
    description: 'Grind stump and surface roots 8-12 inches below grade; backfill grindings into cavity.',
    quantity: 1,
    unit: 'Stump',
    unitPrice: 320
  },
  {
    category: 'Debris Hauling',
    description: 'Brush chipping and haul-off of all branch debris; rake and blow work area clean.',
    quantity: 1,
    unit: 'Load',
    unitPrice: 280
  },
  {
    category: 'Emergency Service',
    description: 'Emergency storm response; remove fallen canopy limb from roof and secure damaged structure.',
    quantity: 1,
    unit: 'Hour',
    unitPrice: 450
  }
];

export const EstimateForm: React.FC = () => {
  const { siteData, updateSiteData } = useSiteContext();

  const currentEstimate = siteData.estimateData || {};

  // Form States
  const [estimateNumber, setEstimateNumber] = useState(
    currentEstimate.estimateNumber || `EST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [estimateDate, setEstimateDate] = useState(
    currentEstimate.estimateDate || (siteData.date || new Date().toISOString().split('T')[0])
  );
  
  // Default expiration is 30 days after estimate date
  const [expirationDate, setExpirationDate] = useState(
    currentEstimate.expirationDate || (() => {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().split('T')[0];
    })()
  );

  const [status, setStatus] = useState<'Draft' | 'Sent' | 'Approved' | 'Declined'>(
    currentEstimate.status || 'Draft'
  );

  // Client Details
  const [clientName, setClientName] = useState(currentEstimate.clientName || siteData.clientName || '');
  const [clientPhone, setClientPhone] = useState(currentEstimate.clientPhone || siteData.phone || '');
  const [clientEmail, setClientEmail] = useState(currentEstimate.clientEmail || siteData.email || '');
  const [siteAddress, setSiteAddress] = useState(currentEstimate.siteAddress || siteData.location || '');
  const [billingAddress, setBillingAddress] = useState(currentEstimate.billingAddress || siteAddress || '');

  // Line Items - default to empty array (no simulated placeholder rows)
  const [items, setItems] = useState<EstimateItem[]>(
    currentEstimate.items && currentEstimate.items.length > 0
      ? currentEstimate.items
      : []
  );

  // Equipment selection - default to empty array
  const [equipmentNeeded, setEquipmentNeeded] = useState<string[]>(
    currentEstimate.equipmentNeeded || []
  );

  // Financials
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>(
    currentEstimate.discountType || 'fixed'
  );
  const [discountValue, setDiscountValue] = useState<number>(currentEstimate.discountValue || 0);
  const [taxRate, setTaxRate] = useState<number>(currentEstimate.taxRate ?? 0); // 0% default for arboricultural services in many jurisdictions
  const [depositPercent, setDepositPercent] = useState<number>(currentEstimate.depositPercent || 25);
  const [specialInstructions, setSpecialInstructions] = useState(
    currentEstimate.specialInstructions || ''
  );

  // Terms & Signoff
  const [termsAccepted, setTermsAccepted] = useState<boolean>(currentEstimate.termsAccepted || false);
  const [clientSignatureName, setClientSignatureName] = useState(currentEstimate.clientSignatureName || '');
  const [clientSignatureImage, setClientSignatureImage] = useState<string>(
    currentEstimate.clientSignatureImage || ''
  );
  const [signedDate, setSignedDate] = useState(currentEstimate.signedDate || '');

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  
  const discountAmount = discountType === 'percent'
    ? (subtotal * (discountValue || 0)) / 100
    : (discountValue || 0);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * (taxRate || 0)) / 100;
  const grandTotal = taxableAmount + taxAmount;
  const depositAmount = (grandTotal * (depositPercent || 0)) / 100;
  const balanceDue = grandTotal - depositAmount;

  // Auto-sync back to SiteContext
  const saveToContext = (overrides?: Partial<EstimateData>) => {
    const updated: EstimateData = {
      estimateNumber,
      estimateDate,
      expirationDate,
      status,
      clientName,
      clientPhone,
      clientEmail,
      siteAddress,
      billingAddress,
      items,
      equipmentNeeded,
      subtotal,
      discountType,
      discountValue,
      taxRate,
      taxAmount,
      grandTotal,
      depositPercent,
      depositAmount,
      specialInstructions,
      termsAccepted,
      clientSignatureName,
      clientSignatureImage: clientSignatureImage || '',
      signedDate,
      ...overrides
    };

    updateSiteData({
      estimateData: updated,
      clientName: clientName || siteData.clientName,
      location: siteAddress || siteData.location,
      phone: clientPhone || siteData.phone,
      email: clientEmail || siteData.email
    });
  };

  useEffect(() => {
    saveToContext();
  }, [
    estimateNumber,
    estimateDate,
    expirationDate,
    status,
    clientName,
    clientPhone,
    clientEmail,
    siteAddress,
    billingAddress,
    items,
    equipmentNeeded,
    subtotal,
    discountType,
    discountValue,
    taxRate,
    taxAmount,
    grandTotal,
    depositPercent,
    depositAmount,
    specialInstructions,
    termsAccepted,
    clientSignatureName,
    clientSignatureImage,
    signedDate
  ]);

  // Line item handlers
  const addItem = () => {
    const newItem: EstimateItem = {
      id: `item-${Date.now()}`,
      category: 'Pruning',
      description: 'New service item description...',
      quantity: 1,
      unit: 'Tree',
      unitPrice: 350,
      total: 350
    };
    setItems([...items, newItem]);
  };

  const addPreset = (preset: typeof DEFAULT_PRESETS[0]) => {
    const newItem: EstimateItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      category: preset.category,
      description: preset.description,
      quantity: preset.quantity,
      unit: preset.unit,
      unitPrice: preset.unitPrice,
      total: preset.quantity * preset.unitPrice
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<EstimateItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const merged = { ...item, ...updates };
        merged.total = (merged.quantity || 0) * (merged.unitPrice || 0);
        return merged;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Category', 'Description', 'Quantity', 'Unit', 'Unit Price', 'Total'];
    const rows = items.map(it => [
      `"${it.category}"`,
      `"${it.description.replace(/"/g, '""')}"`,
      it.quantity,
      `"${it.unit}"`,
      it.unitPrice.toFixed(2),
      it.total.toFixed(2)
    ]);
    const csvContent = [
      `"GreenTree Arboriculture - Service Estimate ${estimateNumber}"`,
      `"Client: ${clientName}", "Date: ${estimateDate}"`,
      `"Site: ${siteAddress}"`,
      '',
      headers.join(','),
      ...rows.map(r => r.join(',')),
      '',
      `"Subtotal",,,,,${subtotal.toFixed(2)}`,
      `"Discount",,,,,${discountAmount.toFixed(2)}`,
      `"Tax (${taxRate}%)",,,,,${taxAmount.toFixed(2)}`,
      `"Grand Total",,,,,${grandTotal.toFixed(2)}`,
      `"Deposit Required (${depositPercent}%)",,,,,${depositAmount.toFixed(2)}`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Estimate_${estimateNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Sent':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Declined':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-brand-green/10 text-brand-green rounded-lg">
            <Calculator className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Arboricultural Service Estimate & Proposal
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Itemized Tree Care Scope, Equipment Logistics, and Formal Pricing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider ${getStatusColor(status)}`}
          >
            <option value="Draft">Draft</option>
            <option value="Sent">Sent to Client</option>
            <option value="Approved">Approved & Signed</option>
            <option value="Declined">Declined</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 bg-gray-800 text-white hover:bg-gray-900 border-gray-800"
            title="Print this estimate with your entered values"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Estimate
          </button>

          <button
            type="button"
            onClick={() => printBlankWorksheet('estimate')}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            title="Print clean blank estimate worksheet with handwriting lines for pen use"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            Print Blank Form
          </button>
        </div>
      </div>

      {/* SECTION 1: Proposal Header & Client Information */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-100">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Company / Contractor</label>
            <input
              type="text"
              className="input-field font-semibold text-brand-green"
              value={siteData.companyName || 'GreenTree Arboriculture LLC'}
              onChange={(e) => updateSiteData({ companyName: e.target.value })}
              placeholder="Your Tree Service Business Name"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Estimate Number</label>
            <input
              type="text"
              className="input-field font-mono text-gray-800"
              value={estimateNumber}
              onChange={(e) => setEstimateNumber(e.target.value)}
              placeholder="e.g. EST-2026-1048"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Estimate Date</label>
              <input
                type="date"
                className="input-field"
                value={estimateDate}
                onChange={(e) => setEstimateDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Valid Until (30 Days)</label>
              <input
                type="date"
                className="input-field"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Client & Property Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-1">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1 mb-1">
              <User className="w-3.5 h-3.5 text-gray-400" />
              Client Full Name
            </label>
            <input
              type="text"
              className="input-field"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Eleanor Vance"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1 mb-1">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              Phone Number
            </label>
            <input
              type="text"
              className="input-field"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="e.g. (555) 382-9011"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1 mb-1">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              Email Address
            </label>
            <input
              type="email"
              className="input-field"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="e.g. client@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              Job Site Address
            </label>
            <input
              type="text"
              className="input-field"
              value={siteAddress}
              onChange={(e) => setSiteAddress(e.target.value)}
              placeholder="e.g. 742 Evergreen Terrace"
            />
          </div>
        </div>
      </section>

      {/* Quick Add Presets Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-vibrant" />
            Quick Add Common Service Presets
          </label>
          <span className="text-[11px] text-gray-400">Click to append to estimate line items</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {DEFAULT_PRESETS.map((preset) => (
            <button
              key={preset.category}
              type="button"
              onClick={() => addPreset(preset)}
              className="p-2.5 text-left rounded-lg border border-gray-200 hover:border-brand-green hover:bg-brand-green/5 text-xs transition-all group"
            >
              <div className="font-bold text-gray-800 group-hover:text-brand-green">{preset.category}</div>
              <div className="text-[10px] text-gray-500 font-mono">${preset.unitPrice} / {preset.unit}</div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: Itemized Scope of Work Table */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-brand-green font-bold text-base">
            <FileText className="w-5 h-5" />
            Scope of Work & Itemized Pricing
          </div>
          <button
            type="button"
            onClick={addItem}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Line Item
          </button>
        </div>

        {/* Clickable Field Attainment Protocol */}
        <FieldInstructionBlock 
          instructionId="ansi-a300-pruning" 
          onApplyTemplate={(tmpl) => {
            const newItem: EstimateItem = {
              id: `item-${Date.now()}`,
              category: 'Pruning (ANSI A300)',
              description: tmpl,
              quantity: 1,
              unit: 'Tree',
              unitPrice: 650,
              total: 650
            };
            setItems(prev => [...prev, newItem]);
          }}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-10">#</th>
                <th className="py-2.5 px-3 w-40">Category</th>
                <th className="py-2.5 px-3">Service Scope & Description</th>
                <th className="py-2.5 px-3 w-20 text-center">Qty</th>
                <th className="py-2.5 px-3 w-24">Unit</th>
                <th className="py-2.5 px-3 w-28 text-right">Unit Rate ($)</th>
                <th className="py-2.5 px-3 w-28 text-right">Total ($)</th>
                <th className="py-2.5 px-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500 bg-gray-50/40">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="font-semibold text-gray-700">No line items added yet</span>
                      <span className="text-[11px] text-gray-400">Click &ldquo;Add Custom Line Item&rdquo; above or click a preset service to begin.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-gray-400 font-bold">{idx + 1}</td>
                  
                  <td className="py-3 px-3">
                    <select
                      className="input-field py-1.5 text-xs font-semibold"
                      value={item.category}
                      onChange={(e) => updateItem(item.id, { category: e.target.value })}
                    >
                      <option value="Tree Removal">Tree Removal</option>
                      <option value="Pruning">Crown Pruning</option>
                      <option value="Deadwooding">Deadwooding</option>
                      <option value="Stump Grinding">Stump Grinding</option>
                      <option value="Cabling & Support">Cabling & Bracing</option>
                      <option value="Plant Health Care">Plant Health Care</option>
                      <option value="Debris Hauling">Debris Hauling</option>
                      <option value="Emergency Service">Emergency Service</option>
                      <option value="Crane Operation">Crane Operation</option>
                      <option value="Other">Other Service</option>
                    </select>
                  </td>

                  <td className="py-3 px-3">
                    <textarea
                      rows={2}
                      className="input-field py-1 text-xs leading-relaxed"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="Specify location, tree species, DBH, cutting parameters, and safety measures..."
                    />
                  </td>

                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="1"
                      className="input-field py-1.5 text-center text-xs font-bold"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: Math.max(1, Number(e.target.value)) })}
                    />
                  </td>

                  <td className="py-3 px-3">
                    <select
                      className="input-field py-1.5 text-xs"
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                    >
                      <option value="Tree">Tree</option>
                      <option value="Hour">Hour</option>
                      <option value="Stump">Stump</option>
                      <option value="Load">Load</option>
                      <option value="EA">EA (Each)</option>
                      <option value="Day">Day</option>
                      <option value="Flat">Flat Fee</option>
                    </select>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-gray-400 font-mono">$</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        className="input-field py-1.5 pl-6 text-right text-xs font-mono font-bold"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                      />
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-gray-900 text-sm">
                    ${(item.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                      className="text-gray-300 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: Logistics, Equipment & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Equipment Committed */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-brand-green font-bold text-sm">
            <Truck className="w-4 h-4" />
            Equipment & Logistics Committed
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              '75ft Aerial Bucket Truck',
              '40-Ton Mobile Crane',
              'Heavy Duty Wood Chipper & Dump Truck',
              'Self-Propelled Tracked Stump Grinder',
              'Ground Protection Lawn Mats (AlturnaMATS)',
              'Traffic Control, Cones & Signage',
              'High-Capacity Log Winch & Rigging',
              'Zero-Emissions Battery Climbing Saws'
            ].map((equip) => (
              <label
                key={equip}
                className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-brand-green"
                  checked={equipmentNeeded.includes(equip)}
                  onChange={(e) => {
                    if (e.target.checked) setEquipmentNeeded([...equipmentNeeded, equip]);
                    else setEquipmentNeeded(equipmentNeeded.filter(eq => eq !== equip));
                  }}
                />
                <span className="text-gray-700">{equip}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Special Instructions & Logistics Notes */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-brand-green font-bold text-sm">
            <FileText className="w-4 h-4" />
            Special Site Instructions & Access Notes
          </div>
          <textarea
            rows={4}
            className="input-field text-xs leading-relaxed"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Document gate access codes, dog warnings, sprinkler shutoffs, firewood stacking locations..."
          />
        </section>
      </div>

      {/* SECTION 4: Financial Calculation Summary */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Terms & Conditions preview */}
          <div className="flex-1 space-y-2 text-xs text-gray-600">
            <h4 className="font-bold text-gray-900 uppercase text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              Standard Arborist Contractual Terms
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed text-gray-500">
              <li><strong>Underground Utilities:</strong> Client confirms private utilities (irrigation, low-voltage wiring, dog fences) are clearly flagged. Contractor contacts 811 Dig Safe before stump grinding.</li>
              <li><strong>Property Lines:</strong> Client warrants tree ownership and authorizes crew & equipment access.</li>
              <li><strong>Lawn & Turf Impact:</strong> Turf mats are deployed; minor soil compaction and tire markings are normal and excluded from restoration.</li>
              <li><strong>Inclement Weather:</strong> High winds (&gt;25 mph) or lightning may postpone operations for life safety.</li>
              <li><strong>Validity:</strong> Pricing is guaranteed for thirty (30) calendar days from the date of issuance.</li>
            </ul>
          </div>

          {/* Pricing Math Box */}
          <div className="w-full md:w-80 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2.5">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            {/* Discount */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Discount:</span>
                <select
                  className="bg-white border rounded px-1 py-0.5 text-[10px]"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                >
                  <option value="fixed">$</option>
                  <option value="percent">%</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  className="w-16 input-field py-0.5 px-1 text-right text-xs font-mono"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                />
                <span className="font-mono text-gray-500 text-[11px]">
                  (-${discountAmount.toFixed(2)})
                </span>
              </div>
            </div>

            {/* Tax */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Sales Tax Rate:</span>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="20"
                  className="w-14 input-field py-0.5 px-1 text-right text-xs font-mono"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                />
                <span className="text-gray-500 text-[11px]">%</span>
              </div>
              <span className="font-mono text-gray-700">${taxAmount.toFixed(2)}</span>
            </div>

            <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
              <span className="font-black text-gray-900 text-sm">Grand Total:</span>
              <span className="font-mono font-black text-brand-green text-xl">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Deposit Section */}
            <div className="border-t border-dashed border-gray-200 pt-2 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Required Deposit:</span>
                <div className="flex items-center gap-1">
                  <select
                    className="bg-white border rounded px-1.5 py-0.5 text-xs font-bold"
                    value={depositPercent}
                    onChange={(e) => setDepositPercent(Number(e.target.value))}
                  >
                    <option value={0}>No Deposit</option>
                    <option value={20}>20%</option>
                    <option value={25}>25%</option>
                    <option value={33}>33% (1/3)</option>
                    <option value={50}>50%</option>
                  </select>
                  <span className="font-mono font-bold text-gray-800">${depositAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>Balance Due at Completion:</span>
                <span className="font-mono">${balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Client Acceptance & Authorization */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-brand-green font-bold text-base">
          <CheckCircle2 className="w-5 h-5" />
          Client Proposal Acceptance & Authorization
        </div>

        <div className="p-3 bg-brand-green/5 border border-brand-green/20 rounded-lg text-xs text-gray-700 leading-relaxed">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-brand-green mt-0.5 shrink-0"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span>
              <strong>Acceptance of Scope and Terms:</strong> I have reviewed the itemized tree care services, logistics, and pricing described above. I authorize GreenTree Arboriculture to perform the work according to the standard arboricultural terms and schedule outlined in this estimate.
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
              Authorized Signature (Print Name)
            </label>
            <input
              type="text"
              className="input-field font-semibold"
              value={clientSignatureName}
              onChange={(e) => setClientSignatureName(e.target.value)}
              placeholder="e.g. Eleanor Vance"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
              Date Signed / Accepted
            </label>
            <input
              type="date"
              className="input-field"
              value={signedDate}
              onChange={(e) => setSignedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Digital Signature Pad */}
        <div className="pt-2">
          <SignatureCanvas
            id="estimate-client-signature"
            label="Client Digital Signature Pad"
            subtitle="Customer or authorized agent sign on screen using finger or stylus to formalize contract"
            signerName={clientSignatureName || clientName}
            date={signedDate || new Date().toISOString().split('T')[0]}
            initialSignature={clientSignatureImage}
            onSave={(dataUrl) => {
              setClientSignatureImage(dataUrl);
              saveToContext({ clientSignatureImage: dataUrl });
            }}
            onClear={() => {
              setClientSignatureImage('');
              saveToContext({ clientSignatureImage: '' });
            }}
            height={140}
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => saveToContext()}
            className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-bold"
          >
            <CheckCircle2 className="w-5 h-5" />
            Save & Finalize Arborist Estimate
          </button>
        </div>
      </section>
    </div>
  );
};

export default EstimateForm;
