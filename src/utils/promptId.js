let lastTime = 0;
let counter = 0;

const fallbackId = () => {
  const now = Date.now();
  if (now === lastTime) {
    counter += 1;
  } else {
    lastTime = now;
    counter = 0;
  }
  return `${now}-${counter}`;
};

export const getNextPromptId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return fallbackId();
};
