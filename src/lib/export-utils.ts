export function escapeCSVField(field: any): string {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
export function formatCSVHeaders(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
export function exportToCSV(data: any[], filename: string): boolean {
  try {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return false;
    }
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.map(formatCSVHeaders).join(',');
    const csvRows = data.map(row =>
      headers.map(header => escapeCSVField(row[header])).join(',')
    );
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    downloadFile(csvContent, filename, 'text/csv');
    return true;
  } catch (error) {
    console.error('CSV export error:', error);
    return false;
  }
}
export function exportToJSON(data: any, filename: string): boolean {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, 'application/json');
    return true;
  } catch (error) {
    console.error('JSON export error:', error);
    return false;
  }
}
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}