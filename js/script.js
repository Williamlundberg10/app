window.onload = function() {
    document.getElementById("dee").className = "asq"
    const today = new Date().getDay();
    console.log(today)
    kk(today);

    if(localStorage.getItem("class_code") == null){
        logout()
    }
};

function logout() {
    localStorage.clear();
    window.location.href = "s.html";
    console.log("Logged out and localStorage cleared!");
}

function get(dataq) {
    return get11().then(vv => {
        if (!vv) {
            console.error("Could not load class codes!");
            return null;
        }

        console.log(vv);

        // Find the saved class code
        const found = vv.find(item => item.code === localStorage.getItem("class_code"));

        if (!found) {
            console.warn("Class code not found!");
            return null;
        }

        console.log(found.data_url);
        localStorage.setItem("data_name",found.class_name)

        // Fetch the schedule data
        return fetch(found.data_url)
            .then(response => {
                if (!response.ok) throw new Error("Failed to load " + found.data_url);
                return response.json();
            })
            .then(data => {
                // Return the specific day's data
                return data[dataq] || null;
            })
            .catch(error => {
                console.error("Error loading JSON:", error);
                return null;
            });
    });
}

function get11() {
    return fetch("/app/data/class_codes.json")
        .then(response => {
            if (!response.ok) throw new Error("Failed to load class_codes.json");
            return response.json();
        })
        .catch(error => {
            console.error("Error loading JSON:", error);
            return null;
        });
}





async function kk(dd) {

    const r1 = document.getElementById("df");
    const r11 = document.getElementById("df1");
    const r111 = document.getElementById("aa_1");
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
    const currentTime1 = `02:40`;
    const currentTime = `${hours}:${minutes - 1}`;

    console.log(currentTime);
    r1.innerHTML = ""
    r11.innerHTML = ""

    r1.innerHTML += "<div class='nn1'></div>"

    r2.forEach(item => {
        var tid_1 = item.tid.slice(0, 5);
        var tid_2 = item.tid.slice(6, 11);
        console.log(r2.length)
        console.log(currentTime ,  item.tid)
        console.log(tid_1 ,  tid_2)

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

    r111.textContent = localStorage.getItem("data_name")
    console.log(localStorage.getItem("data_name"))

    r1.className = "rr ee"
    r11.className = "r1r ee"
}
