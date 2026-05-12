import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates a PDF from a DOM element
 * @param {string} elementId - The ID of the element to capture
 * @param {string} filename - The output filename
 * @param {object} options - Optional config { orientation: 'p'|'l', unit: 'mm', format: 'a4' }
 */
export const generatePDF = async (elementId, filename = 'document.pdf', options = {}) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }

  try {
    // Hide non-print elements temporarily if needed
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    
    const { orientation = 'p', unit = 'mm', format = 'a4' } = options;
    const pdf = new jsPDF(orientation, unit, format);
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
