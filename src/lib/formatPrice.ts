export const formatPrice = (price: string): string => {
  if (!price) return "$0.00";
  
  // Remove any existing $ symbol and whitespace
  const cleanPrice = price.replace(/[$\s]/g, "");
  
  // If it's already formatted with $, return as is
  if (price.startsWith("$")) {
    return price;
  }
  
  // Add $ symbol
  return `$${cleanPrice}`;
};