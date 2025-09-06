class TimeDiff {
    /**
     * Calculate the difference between two times or dates.
     * @param {string} start - Start time (HH:MM or YYYY-MM-DD HH:MM).
     * @param {string} end - End time (HH:MM or YYYY-MM-DD HH:MM).
     * @returns {{ days: number, hours: number, minutes: number, totalMinutes: number, formatted: string }}
     */
    static getDifference(start, end) {
        const today = new Date().toISOString().split("T")[0];

        // Add today's date if only time is provided
        if (/^\d{2}:\d{2}$/.test(start)) start = `${today}T${start}`;
        else start = start.replace(" ", "T");

        if (/^\d{2}:\d{2}$/.test(end)) end = `${today}T${end}`;
        else end = end.replace(" ", "T");

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate)) throw new Error(`Invalid start date: ${start}`);
        if (isNaN(endDate)) throw new Error(`Invalid end date: ${end}`);

        let diffMs = Math.abs(endDate - startDate); // Handles cross-day differences

        const totalMinutes = Math.floor(diffMs / 60000);
        const days = Math.floor(totalMinutes / (24 * 60));
        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
        const minutes = totalMinutes % 60;

        return {
            days,
            hours,
            minutes,
            totalMinutes,
            formatted: `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${hours !== 1 ? "s" : ""}, ${minutes} minute${minutes !== 1 ? "s" : ""}`
        };
    }

    /**
     * Check if a given time or date string is valid.
     * @param {string} value - Time (HH:MM) or date-time (YYYY-MM-DD HH:MM).
     * @returns {boolean}
     */
    static isValid(value) {
        if (/^\d{2}:\d{2}$/.test(value)) {
            const [h, m] = value.split(":").map(Number);
            return h >= 0 && h < 24 && m >= 0 && m < 60;
        }
        return !isNaN(Date.parse(value.replace(" ", "T")));
    }
}

export default TimeDiff;
