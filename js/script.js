import TimeDiff from '../Library/time.js';
import Lang from '../Library/lang.js';

const today = new Date();
const todayDay = today.getDay();

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
    const classCodes = await fetchJson("../data/class_codes.json");
    if (!classCodes) return logout();

    const currentClass = classCodes.find(item => item.code === localStorage.getItem("class_code"));
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

    const currentTime = today.toTimeString().slice(0, 5);
    r1.innerHTML = "<div class='nn1'></div>";
    r11.innerHTML = "";

    dayData.forEach((item, index) => {
        const [startTime, endTime] = [item.tid.slice(0,5), item.tid.slice(6,11)];
        const timeToStart = TimeDiff.getDifference(currentTime, startTime);
        const timeToEnd = TimeDiff.getDifference(currentTime, endTime);

        // Handle breaks between lessons
        if (index > 0) {
            const prevEnd = dayData[index-1].tid.slice(6,11);
            const breakDiff = TimeDiff.getDifference(prevEnd, startTime);
            if (breakDiff.totalMinutes != null && prevEnd > currentTime && day === todayDay && localStorage.getItem("ss_data_ccccc") !== "true") {
                const breakName = breakDiff.totalMinutes < 10 ? "Paus" : "Rast";
                r1.innerHTML += `
                    <div class="qqaaa">
                        <div class="qq1aaa">
                            <h1>${Lang.get("l_" + breakName) || breakName}</h1>
                            <div class="qqqqw">${breakDiff.totalMinutes} minuter</div>
                        </div>
                    </div>`;
            }
        }

        if (currentTime < endTime || day !== todayDay) {
            const countdownText = currentTime < startTime && day === todayDay
                ? `Lektionen börjar om ${timeToStart.totalMinutes} minuter`
                : `Lektionen slutar om ${timeToEnd.totalMinutes} minuter`;

            r1.innerHTML += `
                <div style="background-color: ${item.color}; color: ${item.color2};" class="aa">
                    <div style="color: ${item.color2};" class="heeeq">
                        <h1>${Lang.get("l_" + item.n) || item.n}</h1>
                        <div class="qqqqw">${item.tid}</div>
                    </div>
                    ${day === todayDay && currentTime >= startTime ? `<div class="qqqqwq">${countdownText}</div>` : ""}
                </div>`;
        } else {
            r11.innerHTML += `
                <div style="background-color: #b9b9b9; color: #ffffffff;" class="aaa">
                    <h1>${Lang.get("l_" + item.n) || item.n}</h1>
                </div>`;
        }
    });

    r11.innerHTML += "<div class='nn'></div>";

    r1.className = "rr ee";
    r11.className = "r1r ee";

    console.log(localStorage.getItem("data_name"));
}

window.kk = kk;
