export function normalizeHex(value) {
  if (typeof value !== "string") throw new TypeError("colour must be a string");
  const input = value.trim().replace(/^#/, "");
  const expanded = input.length === 3 ? [...input].map((character) => character.repeat(2)).join("") : input;
  if (!/^[0-9a-f]{6}$/i.test(expanded)) throw new TypeError(`invalid hex colour: ${value}`);
  return `#${expanded.toUpperCase()}`;
}

export function hexToRgb(value) {
  const hex = normalizeHex(value).slice(1);
  return {
    red: Number.parseInt(hex.slice(0, 2), 16),
    green: Number.parseInt(hex.slice(2, 4), 16),
    blue: Number.parseInt(hex.slice(4, 6), 16),
  };
}

export function relativeLuminance(value) {
  const channels = Object.values(hexToRgb(value)).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

export function contrastRatio(first, second) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

export function assessContrast(foreground, background) {
  const ratio = contrastRatio(foreground, background);
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}

export function mostReadableText(background) {
  const blackRatio = contrastRatio("#000000", background);
  const whiteRatio = contrastRatio("#FFFFFF", background);
  return blackRatio >= whiteRatio
    ? { colour: "#000000", ratio: blackRatio }
    : { colour: "#FFFFFF", ratio: whiteRatio };
}
