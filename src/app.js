import { assessContrast, mostReadableText, normalizeHex } from "./contrast.js";

const elements = Object.fromEntries([
  "foreground", "foreground-text", "background", "background-text", "preview",
  "ratio", "rating", "aa-normal", "aa-large", "aaa-normal", "aaa-large",
  "swap", "recommend", "copy", "status",
].map((id) => [id, document.getElementById(id)]));

const checks = ["aa-normal", "aa-large", "aaa-normal", "aaa-large"];

function valueFor(name) {
  return elements[`${name}-text`].value;
}

function setValue(name, value) {
  const normalized = normalizeHex(value);
  elements[name].value = normalized;
  elements[`${name}-text`].value = normalized;
}

function ratingFor(ratio) {
  if (ratio >= 7) return "AAA for normal text";
  if (ratio >= 4.5) return "AA for normal text";
  if (ratio >= 3) return "AA for large text only";
  return "Needs stronger contrast";
}

function render({ updateUrl = true } = {}) {
  try {
    const foreground = normalizeHex(valueFor("foreground"));
    const background = normalizeHex(valueFor("background"));
    const result = assessContrast(foreground, background);
    elements.preview.style.color = foreground;
    elements.preview.style.backgroundColor = background;
    elements.ratio.textContent = `${result.ratio.toFixed(2)}:1`;
    elements.rating.textContent = ratingFor(result.ratio);
    const values = [result.aaNormal, result.aaLarge, result.aaaNormal, result.aaaLarge];
    checks.forEach((id, index) => {
      const item = elements[id];
      item.dataset.pass = String(values[index]);
      item.querySelector("strong").textContent = values[index] ? "Pass" : "Fail";
    });
    elements.status.textContent = "";
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("fg", foreground.slice(1));
      url.searchParams.set("bg", background.slice(1));
      history.replaceState(null, "", url);
    }
  } catch {
    elements.status.textContent = "Enter a three- or six-digit hexadecimal colour.";
  }
}

function bindColour(name) {
  elements[name].addEventListener("input", () => {
    elements[`${name}-text`].value = elements[name].value.toUpperCase();
    render();
  });
  elements[`${name}-text`].addEventListener("change", () => {
    try { setValue(name, valueFor(name)); } catch { /* render provides feedback */ }
    render();
  });
}

bindColour("foreground");
bindColour("background");

elements.swap.addEventListener("click", () => {
  const foreground = valueFor("foreground");
  setValue("foreground", valueFor("background"));
  setValue("background", foreground);
  render();
});

elements.recommend.addEventListener("click", () => {
  const recommendation = mostReadableText(valueFor("background"));
  setValue("foreground", recommendation.colour);
  render();
  elements.status.textContent = `Selected ${recommendation.colour} at ${recommendation.ratio.toFixed(2)}:1.`;
});

elements.copy.addEventListener("click", async () => {
  const css = `color: ${normalizeHex(valueFor("foreground"))};\nbackground-color: ${normalizeHex(valueFor("background"))};`;
  try {
    await navigator.clipboard.writeText(css);
    elements.status.textContent = "CSS copied to the clipboard.";
  } catch {
    elements.status.textContent = "Clipboard access is unavailable in this browser.";
  }
});

document.querySelectorAll("[data-foreground]").forEach((button) => {
  button.addEventListener("click", () => {
    setValue("foreground", button.dataset.foreground);
    setValue("background", button.dataset.background);
    render();
  });
});

const params = new URLSearchParams(window.location.search);
try {
  setValue("foreground", params.get("fg") ?? "172033");
  setValue("background", params.get("bg") ?? "F7F5EF");
} catch {
  setValue("foreground", "172033");
  setValue("background", "F7F5EF");
}
render({ updateUrl: false });
