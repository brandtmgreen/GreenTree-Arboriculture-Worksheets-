/**
 * Utility functions for triggering high-fidelity printing of both
 * active worksheets and dedicated, pen-ready blank forms.
 */

export type PrintableSheetId =
  | 'all'
  | 'estimate'
  | 'tree-risk'
  | 'risk'
  | 'briefing'
  | 'health'
  | 'inventory'
  | 'drone'
  | 'storm'
  | 'postwork'
  | 'safety'
  | 'equipment'
  | 'media';

/**
 * Triggers printing of a dedicated pen-ready blank worksheet,
 * or all blank worksheets if sheetId is 'all'.
 */
export function printBlankWorksheet(sheetId: PrintableSheetId = 'all'): void {
  // Normalize alias
  const normalizedSheet = sheetId === 'risk' ? 'tree-risk' : sheetId;

  if (normalizedSheet === 'all') {
    document.body.setAttribute('data-print-mode', 'all-blank');
    document.body.classList.add('print-all-blank');
  } else {
    document.body.setAttribute('data-print-mode', 'single-blank');
    document.body.setAttribute('data-print-sheet', normalizedSheet);
    document.body.classList.add('print-single-blank');
  }

  const cleanup = () => {
    document.body.removeAttribute('data-print-mode');
    document.body.removeAttribute('data-print-sheet');
    document.body.classList.remove('print-all-blank', 'print-single-blank');
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);

  // Small microtask delay ensures DOM attributes apply before browser rasterizes print preview
  setTimeout(() => {
    window.print();
    // Safety fallback cleanup in case afterprint does not fire in some browsers/iframes
    setTimeout(cleanup, 1200);
  }, 50);
}

/**
 * Triggers standard print of the currently active filled worksheet.
 */
export function printCurrentWorksheet(): void {
  document.body.removeAttribute('data-print-mode');
  document.body.removeAttribute('data-print-sheet');
  document.body.classList.remove('print-all-blank', 'print-single-blank');
  window.print();
}
