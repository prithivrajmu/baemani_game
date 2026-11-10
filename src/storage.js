// localStorage can throw (private mode, blocked cookies); never let that break the game.
export const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem('baemani.' + key)) ?? fallback; } catch { return fallback; }
};
export const save = (key, value) => {
  try { localStorage.setItem('baemani.' + key, JSON.stringify(value)); } catch { /* ignore */ }
};
