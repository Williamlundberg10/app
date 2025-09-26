import TimeDiff from '../Library/time.js';
import Lang from '../Library/lang.js';
import { GitHubJSON } from '../Library/github-json.js';

const rawToken = "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";
const encodedToken = GitHubJSON.encodeBase64(rawToken);

console.log("Base64 Encoded Token:", encodedToken);

const ghJSON = new GitHubJSON(
    "Williamlundberg10",
    "hhd",
    "Z2hwXzM5VllDZnFqcWtYcFhBQ1JiQXlYcTdMbHpHS1BXYzBxekx4Wg==" // your Base64 token
);

const today = new Date();
const todayDay = today.getDay();

let bugMode = false;
let bugTime = null;

// Aktivera bug mode och sätt en testtid (format "HH:MM")
function setBugTime(time) {
    bugMode = true;
    bugTime = time;
    console.log("Bug mode ON → currentTime = " + bugTime);
}

// Stäng av bug mode
function disableBugTime() {
    bugMode = false;
    bugTime = null;
    console.log("Bug mode OFF → using real time");
}

window.onload = async () => {
    await Lang.init();

    const savedLang = localStorage.getItem("ll1") || "sv";
    Lang.set(savedLang);
    localStorage.setItem("ll1", savedLang);

    document.getElementById("dee").className = "asq";

    if (!localStorage.getItem("class_code")) logout();

    kk(todayDay);
};

function logout() {
    localStorage.clear();
    console.log("Logged out and localStorage cleared!");
    window.location.href = "s.html";
}

async function fetchJson(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load ${url}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function getDayData(dayKey) {
    const classCodes = await ghJSON.getAll("class_codes.json");
    if (!classCodes) return logout();

    const currentClass1 = classCodes.find(item => {
        const data = JSON.parse(item.data); // parse the data string
        console.log(data)
        return data.code == localStorage.getItem("class_code");
    });

    const currentClass = JSON.parse(currentClass1.data)
    console.log(currentClass)

    if (!currentClass) {
        console.warn("Class code not found!");
        return null;
    }

    localStorage.setItem("data_name", currentClass.class_name);
    document.getElementById("aa_1").textContent = currentClass.class_name;

    const data = await fetchJson(currentClass.data_url);
    return data?.[dayKey] || null;
}

function getDayKey(day) {
    switch(day) {
        case 1: case 6: case 7: return "mån";
        case 2: return "tis";
        case 3: return "ons";
        case 4: return "tor";
        case 5: return "fre";
        default: return null;
    }
}

// Convert a date string "YYYY-MM-DD" to weekday key: "mån", "tis", ...
function getWeekdayKey(dateStr) {
    const date = new Date(dateStr);
    const weekdays = ["sön","mån","tis","ons","tor","fre","lör"];
    return weekdays[date.getDay()];
}

async function kk(day) {
    const r1 = document.getElementById("df");
    const r11 = document.getElementById("df1");

    r1.className = "rr";
    r11.className = "r1r";

    const key = getDayKey(day);
    if (!key) return;

    localStorage.setItem("dd", day);

    // Reset day highlights
    ["mån", "tis", "ons", "tor", "fre"].forEach(d => {
        document.getElementById("qq_" + d).className = " c q";
    });
    const currentDayEl = document.getElementById("qq_" + key);
    currentDayEl.className = " c";
    if (day === todayDay) currentDayEl.style.backgroundColor = "#e0e0e0ff";

    const dayData = await getDayData(key);
    if (!dayData) {
        r1.innerHTML = "<p>No data found for this day.</p>";
        return;
    }

    const currentTime = bugMode && bugTime ? bugTime : today.toTimeString().slice(0, 5);
    r1.innerHTML = "<div class='nn1'></div>";
    r11.innerHTML = "";

    // Load custom events
    const data = await ghJSON.getAll("data.json");

    // Merge lessons + events that match the displayed weekday
    const mergedData = [
        ...dayData.map(item => ({ ...item, type: "lesson" })),
        ...data
            .map(item_3 => {
                const ii = JSON.parse(item_3.data); // { tid, n, dag }
                return { ...ii, type: "event" };
            })
            .filter(ev => getWeekdayKey(ev.dag) === key && ev.code == localStorage.getItem("class_code")) // only events for this weekday
    ];

    // Sort by start time
    mergedData.sort((a, b) => a.tid.slice(0,5).localeCompare(b.tid.slice(0,5)));

    let lastEndTime = null; // Track end of last rendered item

    mergedData.forEach((item) => {
        const [startTime, endTime] = [item.tid.slice(0,5), item.tid.slice(6,11)];

        // Skip lessons that overlap an event
        if (item.type === "lesson") {
            const overlaps = mergedData.some(ev => {
                if (ev.type !== "event") return false;
                const [evStart, evEnd] = [ev.tid.slice(0,5), ev.tid.slice(6,11)];
                return !(evEnd <= startTime || evStart >= endTime);
            });
            if (overlaps) return;
        }

        // Handle breaks
        if (lastEndTime) {
            const breakDiff = TimeDiff.getDifference(lastEndTime, startTime);
            if (
                breakDiff.totalMinutes != null &&
                lastEndTime > currentTime &&
                day === todayDay &&
                localStorage.getItem("ss_data_ccccc") !== "true"
            ) {
                const breakName = breakDiff.totalMinutes < 10 ? "Paus" : "Rast";
                r1.innerHTML += `
                    <div class="qqaaa">
                        <div class="qq1aaa">
                            <h1>${Lang.get("l_" + breakName) || breakName}</h1>
                            <div class="qqqqw">${breakDiff.totalMinutes + " " + Lang.get("a_m")}</div>
                        </div>
                    </div>`;
            }
        }

        const timeToStart = TimeDiff.getDifference(currentTime, startTime);
        const timeToEnd = TimeDiff.getDifference(currentTime, endTime);

        // Render item
        if (currentTime < endTime || day !== todayDay) {
            const countdownText = currentTime < startTime && day === todayDay
                ? `${Lang.get("a_lbo") + " " + timeToStart.totalMinutes + " " + Lang.get("a_m")}`
                : `${Lang.get("a_lso") + " " + timeToEnd.totalMinutes + " " + Lang.get("a_m")}`;

            r1.innerHTML += `
                <div style="background-color: ${item.color || "#0080ff"}; color: ${item.color2 || "#fff"};" class="aa">
                    <div style="color: ${item.color2 || "#fff"};" class="heeeq">
                        <h1>${item.type === "event" ? item.n : (Lang.get("l_" + item.n) || item.n)}</h1>
                        <div class="qqqqw">${item.tid}</div>
                    </div>
                    ${day === todayDay && currentTime >= startTime ? `<div class="qqqqwq">${countdownText}</div>` : ""}
                </div>`;
        } else {
            r11.innerHTML += `
                <div style="background-color: #b9b9b9; color: #fff;" class="aaa">
                    <h1>${item.type === "event" ? item.n : (Lang.get("l_" + item.n) || item.n)}</h1>
                </div>`;
        }

        // Update lastEndTime
        lastEndTime = endTime;
    });

    r11.innerHTML += "<div class='nn'></div>";

    r1.className = "rr ee";
    r11.className = "r1r ee";

    console.log(localStorage.getItem("data_name"));
}


window.kk = kk;


//setBugTime("01:15");
