export const transToMinutesAndSeconds = (currentTime: number) => {
    const m = Math.floor(currentTime / 60);
    const s = Math.floor(currentTime % 60);

    const minutes = m.toString().length > 1 ? m.toString() : '0' + m.toString();
    const seconds = s.toString().length > 1 ? s.toString() : '0' + s.toString();

    return minutes + ':' + seconds;
};
