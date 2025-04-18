export function convertHexToRGB(hex: string, colorRef = { r: 0, g: 0, b: 0 }) {
  // Remove the hash if present
  hex = hex.replace(/^#/, "");

  // Parse different formats: #RGB, #RRGGBB
  if (hex.length === 3) {
    colorRef.r = parseInt(hex[0] + hex[0], 16);
    colorRef.g = parseInt(hex[1] + hex[1], 16);
    colorRef.b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    colorRef.r = parseInt(hex.substring(0, 2), 16);
    colorRef.g = parseInt(hex.substring(2, 4), 16);
    colorRef.b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error("Invalid hex color format");
  }

  return colorRef;
}

const toHex = (value: number) => value.toString(16).padStart(2, "0");
export function convertRGBToHex(colorRef: {
  r: number;
  g: number;
  b: number;
}): string {
  return `#${toHex(colorRef.r)}${toHex(colorRef.g)}${toHex(colorRef.b)}`;
}
