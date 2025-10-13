export const delay = (ms: number) =>
  new Promise((resolve) => {
    if (ms === Infinity) {
      return;
    }
    setTimeout(resolve, ms);
  });
