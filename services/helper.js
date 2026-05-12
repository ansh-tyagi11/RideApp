export default function fmtTime(time) {
    const h = Math.floor(time / 60);
    const m = time % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
}