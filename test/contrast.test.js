import test from "node:test";
import assert from "node:assert/strict";
import { assessContrast, contrastRatio, hexToRgb, mostReadableText, normalizeHex } from "../src/contrast.js";

test("normalizes short and full hexadecimal values", () => {
  assert.equal(normalizeHex("#abc"), "#AABBCC");
  assert.equal(normalizeHex("172033"), "#172033");
  assert.throws(() => normalizeHex("blue"), /invalid hex/);
});

test("converts a colour to RGB channels", () => {
  assert.deepEqual(hexToRgb("#FF8000"), { red: 255, green: 128, blue: 0 });
});

test("calculates known WCAG contrast boundaries", () => {
  assert.equal(contrastRatio("#000", "#FFF"), 21);
  const result = assessContrast("#767676", "#FFFFFF");
  assert.equal(result.aaNormal, true);
  assert.equal(result.aaaNormal, false);
});

test("selects the more readable black or white text", () => {
  assert.equal(mostReadableText("#F7F5EF").colour, "#000000");
  assert.equal(mostReadableText("#172033").colour, "#FFFFFF");
});
