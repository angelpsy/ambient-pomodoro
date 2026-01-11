/**
 * Formats milliseconds into M:SS or -M:SS
 */
export const formatTime = (ms: number): string => {
    const absoluteMs = Math.abs(ms);
    const totalSeconds = Math.floor(absoluteMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const sign = ms < 0 ? '-' : '';

    return `${sign}${minutes}:${formattedSeconds}`;
};
