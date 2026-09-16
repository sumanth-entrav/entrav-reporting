// Agency fee / charge categories (as opposed to travel product spend like air,
// accommodation, transfers). Used to split "fee income" from "travel spend".
export const FEE_CATEGORIES = new Set<string>([
  "Service Fees",
  "Amex Swipe Fee",
  "Afterhours Fee",
  "Service Fee Adjustment Supplier Services Agreement",
  "General Charges",
]);

export function isFeeCategory(category: string): boolean {
  return FEE_CATEGORIES.has(category);
}

// Broad product groupings for the categories used in the dataset.
export function categoryGroup(category: string): "Air" | "Accommodation" | "Ground" | "Fees" | "Other" {
  if (isFeeCategory(category)) return "Fees";
  if (/Air Travel|Seating/i.test(category)) return "Air";
  if (/Accommodation/i.test(category)) return "Accommodation";
  if (/Transfer|Parking/i.test(category)) return "Ground";
  return "Other";
}
