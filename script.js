function get(dataq) {
    return fetch("data.json")
        .then(response => response.json())
        .then(data => {
            if (dataq === "mån") return data.mån;
            if (dataq === "tis") return data.tis;
            if (dataq === "ons") return data.ons;
            if (dataq === "tor") return data.tor;
            if (dataq === "fre") return data.fre;
            return null;
        })
        .catch(error => {
            console.error("Error loading JSON:", error);
            return null;
        });
}



async function kk(dd) {

    loadScheduleAndNotify();

    const r1 = document.getElementById("df");

    let key;
    switch(dd) {
        case 1: key = "mån"; break;
        case 2: key = "tis"; break;
        case 3: key = "ons"; break;
        case 4: key = "tor"; break;
        case 5: key = "fre"; break;
        default: key = null;
    }

    if (!key) return;

    const r2 = await get(key);
    const r3 = document.getElementById("qq_" + dd);
    document.getElementById("qq_1").className = " c q"
    document.getElementById("qq_2").className = " c q"
    document.getElementById("qq_3").className = " c q"
    document.getElementById("qq_4").className = " c q"
    document.getElementById("qq_5").className = " c q"
    r3.className = " c"

    if (!r2) {
        r1.innerHTML = "<p>No data found for this day.</p>";
        return;
    }

    console.log(r2);

    // Render content
    r1.innerHTML = r2.map(item => 
        `<div class="aa"><h1>${item.n}</h1><h2>${item.tid}</h2></div>`
    ).join("") + "<div class='nn'></div>";
}




async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        alert("Din webbläsare stöder inte notiser.");
        return false;
    }

    let permission = Notification.permission;
    if (permission === "default") {
        permission = await Notification.requestPermission();
    }

    return permission === "granted";
}

async function loadScheduleAndNotify() {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
        console.log("❌ Notiser blockeras av användaren");
        return;
    }

    const response = await fetch("data.json");
    const data = await response.json();

    // Kolla dagens datum
    const today = new Date();
    const weekday = today.getDay(); // 0=sön, 1=mån, 2=ti...
    const map = ["sö", "må", "ti", "on", "to", "fr", "lö"];
    const schedule = data[map[weekday]] || [];

    schedule.forEach(item => {
        const [start] = item.tid.split("-");
        const [hour, minute] = start.split(":");

        const jobTime = new Date();
        jobTime.setHours(parseInt(hour));
        jobTime.setMinutes(parseInt(minute));
        jobTime.setSeconds(0);

        const now = new Date();
        const timeout = jobTime.getTime() - now.getTime();

        if (timeout > 0) {
            console.log(`🔔 Jobb-notis schemalagd: ${item.n} kl ${item.tid}`);

            setTimeout(() => {
                navigator.serviceWorker.ready.then(sw => {
                    sw.showNotification("⏰ Jobbdags!", {
                        body: `Dags för ${item.n} kl ${item.tid}`,
                        icon: "icons/s3.png"
                    });
                });
            }, timeout);
        }
        
    });
}
