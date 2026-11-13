/**
 * Generates an invoice number in the format: INV-YYYY-RANDOM
 */
export const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}-${randomNum}`;
};

export default generateInvoiceNumber;

