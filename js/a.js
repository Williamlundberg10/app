import Lang from '../Library/lang.js';

window.onload = async () => {
    await Lang.init();

    const savedLang = localStorage.getItem("ll1") || "sv";
    Lang.set(savedLang);
    localStorage.setItem("ll1", savedLang);

    // Highlight selected language button
    document.querySelectorAll('.aaq123').forEach(el => el.className = 'aaq123');
    const langButton = document.getElementById("faa_" + savedLang);
    if (langButton) langButton.className = "aaq123 rr";

    // Set class name display
    const dataNameEl = document.getElementById("aa_1");
    if (dataNameEl) dataNameEl.textContent = localStorage.getItem("data_name");

    document.getElementById("dee").className = "asq qq";

    updateData("", true);
};

// Clear all caches and reload page
async function pq() {
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    window.location.reload(true);
}

// Force close app: unregister service workers + clear caches
async function forceCloseApp() {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) await reg.unregister();
        console.log("🛑 Service Worker stopped");
    }

    if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log("🧹 All caches cleared");
    }

    window.location.reload();
}

document.getElementById("ffc").addEventListener("click", forceCloseApp);

// Navigate to settings page
function aq() {
    window.location.href = "../html/settings.html";
}

// Logout: clear localStorage and redirect
function logout() {
    localStorage.clear();
    console.log("Logged out and localStorage cleared!");
    window.location.href = "../html/s.html";
}
document.getElementById("logout_id").addEventListener("click", logout);

// Change language
window.lla = async (lang) => {
    Lang.set(lang);
    localStorage.setItem("ll1", lang);

    document.querySelectorAll('.aaq123').forEach(el => el.className = 'aaq123');
    const selectedButton = document.getElementById("faa_" + lang);
    if (selectedButton) selectedButton.className = "aaq123 rr";
};

// Update or load checkbox states
function updateData(id, isLoad = false) {
    if (!isLoad) {
        const checkbox = document.getElementById(id);
        if (checkbox) localStorage.setItem("ss_data_" + id, checkbox.checked);
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key.startsWith("ss_data_")) continue;

            const checkboxId = key.replace("ss_data_", "");
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) checkbox.checked = localStorage.getItem(key) === "true";
        }
    }
}

document.getElementById("ccccc").addEventListener("change", () => updateData("ccccc"));
