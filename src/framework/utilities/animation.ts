// reworked https://javascript.info/js-animation

export function animate(
  timing: (timeFraction: number) => number,
  draw: (progress: number) => void,
  duration: number,
  isRunning?: () => boolean
): Promise<boolean> {
  const start = performance.now();

  return new Promise((res) => {
    requestAnimationFrame(function render(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      if (isRunning && !isRunning()) return res(false);

      draw(timing(timeFraction));
      if (timeFraction >= 1) return res(true);

      if (timeFraction < 1 && (!isRunning || isRunning()))
        requestAnimationFrame(render);
    });
  });
}
