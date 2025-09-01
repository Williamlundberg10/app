window.onload = function() {
    kk(Number(localStorage.getItem("dd") || 1));
};



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
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        alert("You need to allow notifications!");
        return;
    }
    const r1 = document.getElementById("df");
    const r11 = document.getElementById("df1");
    r1.className = "rr"
    r11.className = "r1r"

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

    localStorage.setItem("dd", dd)

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

    const today = new Date();
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const currentTime = `02:40`;
    const currentTime1 = `${hours}:${minutes - 1}`;

    console.log(currentTime);
    r1.innerHTML = ""
    r11.innerHTML = ""

    r2.forEach(item => {
        console.log(r2.length)

        if(currentTime < item.tid){
            r1.innerHTML += `
                <div style="background-color: ${item.color}; color: ${item.color2};" class="aa">
                    <h1>${item.n}</h1>
                    <h2>${item.tid}</h2>
                </div>`
        }else{
            r11.innerHTML += `
                <div style="background-color: #b9b9b9; color: #ffffffff;" class="aaa">
                    <h1>${item.n}</h1>
                </div>`
        }
    });

    r11.innerHTML += "<div class='nn'></div>"


    r1.className = "rr ee"
    r11.className = "r1r ee"
}



async function subscribeUser() {
    if (!("serviceWorker" in navigator)) {
        console.error("❌ Service workers not supported");
        return;
    }

    if (!("PushManager" in window)) {
        console.error("❌ Push API not supported");
        return;
    }

    const registration = await navigator.serviceWorker.register("/app/service-worker.js");
    console.log("✅ Service Worker Registered");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        alert("You need to allow notifications!");
        return;
    }

    const publicVapidKey = "BF1anOjivoN0_qYPAg1IPhqEK3GRN_TgNsjuOpvJaMN5d-e7T_HHACgEhrRl1fbYw77tDPuyDjHsRnQgQr1T6Es"; // removed '='
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    console.log("🔑 Subscription:", JSON.stringify(subscription));

    // Send subscription to your Python backend
    await fetch("https://192.168.1.62:5540/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription)
    });

}

subscribeUser();

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


