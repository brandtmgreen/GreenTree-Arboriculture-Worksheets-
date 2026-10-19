# Dedicated Blank Printable Worksheets & Pen-Ready Field Forms

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your confirmed preferences from Phase 1, the printable system will transition from relying on CSS overrides of interactive web inputs to a dedicated set of pen-optimized, publication-grade printable templates.

- **Confirmed Decision 1 (Handwriting Layout)**: Replace simulated web inputs with spacious ruled handwriting lines (8mm / ~32px line height with subtle guide baselines) and high-contrast `[  ]` check-boxes formatted specifically for clipboards and pens.
- **Confirmed Decision 2 (Print Controls)**: Provide both a global "Print All Blank Forms" action in the main header and a dedicated "Print Blank Form" button on every worksheet tab, allowing arborists to print either the entire binder or a single replacement sheet.
- **Confirmed Decision 3 (Header & Branding)**: Retain the clean arborist company header, license/qualification banner, and blank field entry lines (`Date: ________`, `Job / Client: ____________________`, `Site Address: ____________________`, `Inspector / Assessor: ____________________`).
- **Elimination of Digital Artifacts**: All interactive buttons ("Quick Add", "AI Scan", "Upload Photo", sliders, canvas pads, dropdown arrows) are completely omitted from the printed output.

---

## 1. Overview & Core Concept

When arborists, crew leaders, and certified risk assessors head into remote sites or off-grid field environments, physical paper clipboards with pens remain an indispensable tool. 

The current print implementation mounts live interactive React components and attempts to hide text using CSS `color: transparent`, which leaves behind digital button clutter, awkward table boundaries, and pre-existing sample data. 

This enhancement replaces that mechanism with dedicated, high-resolution vector print layouts:
- **Zero Mock / Placeholder Leakage**: Clean blank fields with zero pre-filled sample descriptions, fake prices, or default values.
- **True Pen-Ready Formatting**: Generous line spacing for handwriting notes, structured empty table grids for cost estimates and inventory, and standard ISA TRAQ matrix boxes with empty check squares.
- **Dual Printing Mode**: Print an individual worksheet as a standalone physical form or batch-print the entire 10-worksheet arborist operations binder with automatic page breaks.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Printing an Individual Blank Form**:
   - The user navigates to any worksheet tab (e.g., *Cost Estimate*, *Tree Risk Assessment*, *Job Briefing*, or *Tree Inventory*).
   - In the worksheet action bar, a secondary action **"Print Blank Form"** sits alongside the standard "Print / Export" button.
   - Clicking it opens the browser print preview showing exclusively that clean, blank, pen-optimized template with generous writing lines.

2. **Printing the Complete Operations Binder**:
   - The user clicks **"Print Blank Forms"** in the top navigation or file menu.
   - The browser print preview renders all 10 standard operating procedure forms in sequence, each cleanly separated by CSS page-break rules.
   - When printed double-sided or single-sided, each form is self-contained with its own header and sign-off block.

### Visual & Typographic Styling for Print

- **Palette**: Pure high-contrast monochrome (rich black `#111827` and slate gray `#6B7280` lines) for crisp printing on monochrome laser and inkjet printers; subtle forest green accent only on the top branding rule if color printing is enabled.
- **Ruled Lines**: 32px height writing rules with subtle dotted or thin solid baselines (`border-b border-gray-400`) providing ample vertical clearance for natural handwriting with pens and markers.
- **Checkboxes**: Explicit $14\text{px} \times 14\text{px}$ square outline boxes (`border border-black bg-white rounded-none`) with comfortable tap/pen target padding.
- **Table Grids**: Empty ruled tables with 8–12 blank rows per sheet (e.g. Estimate Items, Tree Inventory, Equipment Checklist) with pre-printed column headers and blank write-in cells.
- **Sign-off Blocks**: Dedicated legal signature, printed name, arborist license number, and date lines with proper pen clearance.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dedicated Print Templates vs. CSS Input Hiding**:
  - *Chosen Approach*: Build a dedicated set of clean `BlankTemplate` components specifically structured for paper printing, decoupled from the interactive form state.
  - *Why*: CSS hacks (`color: transparent` on inputs) cause misalignments, clip multi-line text, show scrollbars, and render only as many rows as are currently in state. Dedicated print components provide consistent blank rows, perfect line heights, and guaranteed page breaks.
  - *Trade-off*: Slightly more component code, but 100% reliable print output with zero data leakage.

- **Decision 2: Print Media Isolation**:
  - *Chosen Approach*: Use `@media print` and dedicated print container IDs (`#printable-blank-container`) that automatically swap in when print mode is triggered.
  - *Why*: Guarantees that interactive web buttons, quick-add bars, AI banners, navigation menus, and footers never appear on paper.

- **Decision 3: Configurable Company Header**:
  - *Chosen Approach*: Pull the active company name and phone/license if configured in user settings, but leave the client name, job title, site address, and date as blank fillable lines.
  - *Why*: Allows companies to have branded paperwork ready to go into the field without having pre-committed to a specific job or client.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                          User Interface                         │
│                                                                 │
│   [Header: Print Blank Forms]    [Tab: Print Blank Form]        │
└───────────────┬───────────────────────────────┬─────────────────┘
                │                               │
                ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Print Trigger Manager                        │
│   window.printBlank('all' | currentTabId)                       │
│   Sets document.body.dataset.printTarget = 'all' | targetId     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                Dedicated Blank Print Components                 │
│                                                                 │
│  ┌───────────────────────┐         ┌─────────────────────────┐  │
│  │ BlankEstimateSheet    │         │ BlankTreeRiskSheet      │  │
│  │ (Spacious rows/lines) │         │ (TRAQ matrix & lines)   │  │
│  └───────────────────────┘         └─────────────────────────┘  │
│  ┌───────────────────────┐         ┌─────────────────────────┐  │
│  │ BlankJobBriefingSheet │         │ BlankInventorySheet     │  │
│  │ (Hazards, PPE, Crew)  │         │ (DBH, Species, Defects) │  │
│  └───────────────────────┘         └─────────────────────────┘  │
│  ┌───────────────────────┐         ┌─────────────────────────┐  │
│  │ BlankSafetySheet      │         │ BlankHealthSheet        │  │
│  │ (Signatures, Minutes) │         │ (Canopy, Roots, Notes)  │  │
│  └───────────────────────┘         └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CSS @media print Engine                      │
│   - Hides #root screen DOM entirely                             │
│   - Renders selected blank template container                   │
│   - Enforces page breaks, high-contrast borders & 32px lines    │
└─────────────────────────────────────────────────────────────────┘
```

### Component Structure Plan

1. **`src/components/blank-templates/`**:
   - `BlankHeader.tsx`: Reusable standard company header with blank fields (`Job #`, `Date`, `Client`, `Site Address`, `Crew Lead / Assessor`).
   - `BlankEstimateTemplate.tsx`: Header, client info lines, 10 empty itemized rows (Qty, Description, Unit, Price, Total), terms & condition lines, client acceptance signature block.
   - `BlankTreeRiskTemplate.tsx`: Tree ID, botanical/common species, DBH/height, crown spread, defect checkboxes (Crown, Trunk, Roots), ISA TRAQ Matrix table, mitigation write-in lines, assessor signature line.
   - `BlankJobBriefingTemplate.tsx`: Daily safety check, hazards check matrix, PPE checkboxes, work scope lines, emergency response info, crew sign-in lines.
   - `BlankHealthTemplate.tsx`: Tree health rating, vigor assessment, pests/diseases, soil condition, recommendations lines.
   - `BlankInventoryTemplate.tsx`: Multi-tree grid (Tree #, Species, DBH, Condition, Risk, Action Required, Notes).
   - `BlankSafetyMeetingTemplate.tsx`: Weekly toolbox talk topics, safety incident review, attendee name & signature list (12 lines).
   - `BlankEquipmentTemplate.tsx`: Daily chain saw, chipper, rigging, and aerial lift inspection checklist with pass/fail squares.
   - `BlankStormDamageTemplate.tsx`: Emergency storm response triage sheet with hazard priorities.
   - `BlankPostWorkTemplate.tsx`: Cleanup, target clearance, client walk-through sign-off.

2. **Integration into Navigation & Tabs**:
   - Add "Print Blank" button with a document/printer icon on each worksheet header.
   - Enhance the global "Print Blank Forms" action in `Layout.tsx` to print either the entire set or open a modal allowing the user to select which blank forms to print.
