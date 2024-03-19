/// Не используйте интервал менее 5 мс, поскольку веб-агенты не могут обеспечить задержку менее 4 мс из-за оптимизации во вложенных вызовах setTimeout
/// Но как показывает практика, 5 мс — это нижняя граница для этого таймера, потому что он учитывает ошибки и оценивает исправленный интервал. Вот почему 5 мс — самый низкий интервал этого таймера.
function timer(callback, interval, duration, ...args) {
    if (typeof callback !== "function") return;

    const toNumberPositive = (value) => {
        const n = Number(value);
        return (n !== n || n < 0) ? 0 : n
    };

    interval = (interval = toNumberPositive(interval)) >= 5 ? interval : 5;
    duration = duration !== undefined ? toNumberPositive(duration) : Infinity;

    const startTime = performance.now();
    let endInterval = startTime;
    let timerId = null;

    const step = () => {
        const currentInterval = endInterval - startTime;
        if (callback({ currentInterval, interval, duration, args })) return;
        if (interval > duration || currentInterval >= duration) return;
        if (performance.now() >= (startTime + duration)) return;
        const err = performance.now() - endInterval;
        endInterval += interval;
        timerId = setTimeout(step, interval - err);
    }

    step();

    return timerId !== null ? () => clearTimeout(timerId) : undefined;
}