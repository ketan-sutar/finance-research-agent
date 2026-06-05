export function canonicalMerchant(name: string): string {
  if (!name) return "UNKNOWN";

  const n = name.toUpperCase().trim();

  // normalize separators first
  const clean = n
    .replace(/[^A-Z0-9]/g, " ")   // remove symbols like / . -
    .replace(/\s+/g, " ")        // collapse spaces
    .trim();

  // tokenize for better matching
  const tokens = clean.split(" ");

  // helper match
  const has = (x: string) => clean.includes(x);

  // -------------------------
  // HIGH CONFIDENCE GROUPS
  // -------------------------

  if (has("SWIGGY")) return "Swiggy";
  if (has("ZOMATO")) return "Zomato";

  if (has("UBER")) return "Uber";
  if (has("OLA")) return "Ola";

  if (has("AMAZON") || has("AMZ")) return "Amazon";

  if (has("FLIPKART") || has("FK")) return "Flipkart";

  if (has("NETFLIX")) return "Netflix";

  if (has("SPOTIFY")) return "Spotify";

  if (has("MYNTRA")) return "Myntra";

  if (has("STARBUCKS")) return "Starbucks";

  if (has("BIGBASKET") || has("BIG BASKET")) return "BigBasket";

  if (has("BOOKMYSHOW") || has("BMS")) return "BookMyShow";

  if (has("CULT FIT") || has("CULTFIT") || has("CULT.FIT")) return "Cult.fit";

  if (has("IRCTC")) return "IRCTC";

  if (has("INDIGO")) return "IndiGo";

  if (has("APOLLO")) return "Apollo Pharmacy";

  if (has("TATA")) return "Tata";

  if (has("HDFC")) return "HDFC";

  if (has("NEFT")) {
    // special case handling
    if (has("RENT")) return "Rent Transfer";
    if (has("SELF")) return "Internal Transfer";
    if (has("ICICI")) return "ICICI Transfer";
    return "Bank Transfer";
  }

  if (has("SELF")) return "Internal Transfer";

  if (has("AIR")) return "Airlines";

  if (has("ACT")) return "ACT Fibernet";

  if (has("ZEPTO")) return "Zepto";

  // fallback: first meaningful token
  return tokens[0] || "UNKNOWN";
}