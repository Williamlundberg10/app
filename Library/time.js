/**
 * TimeDiff.js - A tiny JavaScript library for calculating differences between dates & times.
 * Author: Laura + GPT
 * Version: 2.0.0
 */

class TimeDiff {
    /**
     * Calculate the difference between two date-time values.
     * @param {string} start - Start time or datetime (e.g., "2025-09-04 08:15" or "08:15")
     * @param {string} end - End time or datetime (e.g., "2025-09-06 09:30" or "09:30")
     * @returns {object} - { days, hours, minutes, formatted }
     */
    static getDifference(start, end) {
        // If only times are provided, assume today
        const today = new Date().toISOString().split("T")[0];

        if (/^\d{2}:\d{2}$/.test(start)) start = `${today} ${start}`;
        if (/^\d{2}:\d{2}$/.test(end)) end = `${today} ${end}`;

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate) || isNaN(endDate)) {
            throw new Error("Invalid date or time format. Use 'YYYY-MM-DD HH:MM' or 'HH:MM'.");
        }

        let diffMs = endDate - startDate;

        // If end date is before start date, assume next day
        if (diffMs < 0) {
            diffMs += 24 * 60 * 60 * 1000;
        }

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
     * Check if a given time or datetime string is valid.
     * @param {string} value - Time ("HH:MM") or datetime ("YYYY-MM-DD HH:MM")
     * @returns {boolean}
     */
    static isValid(value) {
        if (/^\d{2}:\d{2}$/.test(value)) {
            const [h, m] = value.split(":").map(Number);
            return h >= 0 && h < 24 && m >= 0 && m < 60;
        }
        return !isNaN(new Date(value).getTime());
    }
}

// Export as ES module
export default TimeDiff;
