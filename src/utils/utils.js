
export function formatTime(seconds) {
  let min = Math.floor(seconds / 60);
  let secs = seconds % 60;
  if (secs < 10) {
    return min + ':0' + secs;
  }
  return min + ':' + secs;
}
