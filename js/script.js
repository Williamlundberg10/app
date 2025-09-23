import TimeDiff from '../Library/time.js';

var dddd = 0
var today1 = new Date().getDay();
window.onload = function() {
    document.getElementById("dee").className = "asq"
    console.log(today1)
    kk(today1);

    if(localStorage.getItem("class_code") == null){
        logout()
    }

    get21().then(vv => {
        dddd = vv.v
        if(getCookie("app_version") == null){
            setCookie("app_version", dddd);
        }else{
            if(dddd > getCookie("app_version")){
                document.getElementById("ggrr").className = "aaq1 qq"
            }
        }
        console.log(dddd)
    });
};

function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split("=");
    if (key === name) return value;
  }
  return null;
}

function pqrr(){

    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          caches.delete(cache);
        })
      )
    )
    setCookie("app_version", dddd);
    window.location.reload(true);
}



function logout() {
    localStorage.clear();
    window.location.href = "s.html";
    console.log("Logged out and localStorage cleared!");
}

function get(dataq) {
    return get11().then(vv => {
        if (!vv) {
            console.error("Could not load class codes!");
            logout()
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
        document.getElementById("aa_1").textContent = found.class_name

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
    return fetch("../data/class_codes.json")
        .then(response => {
            if (!response.ok) throw new Error("Failed to load class_codes.json");
            return response.json();
        })
        .catch(error => {
            console.error("Error loading JSON:", error);
            return null;
        });
}

function get21() {
    return fetch("../v.json")
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
    r1.className = "rr"
    r11.className = "r1r"

    let key;
    switch(dd) {
        case 1: key = "mån"; break;
        case 2: key = "tis"; break;
        case 3: key = "ons"; break;
        case 4: key = "tor"; break;
        case 5: key = "fre"; break;
        case 6: key = "mån"; break;
        case 7: key = "mån"; break;
        default: key = null;
    }

    if (!key) return;

    localStorage.setItem("dd", dd)

    const r2 = await get(key);
    const r3 = document.getElementById("qq_" + key);
    document.getElementById("qq_mån").className = " c q"
    document.getElementById("qq_tis").className = " c q"
    document.getElementById("qq_ons").className = " c q"
    document.getElementById("qq_tor").className = " c q"
    document.getElementById("qq_fre").className = " c q"
    r3.className = " c"
    if(dd == today1){
        r3.style.backgroundColor = "#e0e0e0ff" 
    }

    if (!r2) {
        r1.innerHTML = "<p>No data found for this day.</p>";
        return;
    }

    const today = new Date();
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const currentTime = `07:05`;
    const currentTime1 = `${hours}:${minutes}`;

    console.log(currentTime);
    r1.innerHTML = ""
    r11.innerHTML = ""

    r1.innerHTML += "<div class='nn1'></div>"
    var unnn = -2
    var unnn1 = -1
    r2.forEach(item => {
        unnn ++
        unnn1 ++
        var tid_1 = item.tid.slice(0, 5);
        var tid_2 = item.tid.slice(6, 11);
        var time_11 = TimeDiff.getDifference(currentTime, tid_1)
        var time_12 = TimeDiff.getDifference(currentTime, tid_2)
        var time_13 = {};
        if (r2[unnn] && r2[unnn].tid) {
            time_13 = TimeDiff.getDifference(r2[unnn].tid.slice(6, 11),tid_1);
        }
        var time_14 = "";
        if (r2[unnn] && r2[unnn].tid) {
            time_14 = r2[unnn1].tid.slice(0, 5)
        }

        console.log(tid_1, time_13);

        if(time_13.totalMinutes != null && time_14 > currentTime && dd == today1 && localStorage.getItem("ss_data_ccccc") != "true"){
            if(time_13.totalMinutes < 10 ){
                r1.innerHTML += `
                    <div class="qqaaa">
                        <div class="qq1aaa">
                            <h1>Paus</h1>
                            <div class="qqqqw">${time_13.totalMinutes} minuter</div>
                        </div>
                    </div>`
            }else{
                r1.innerHTML += `
                    <div class="qqaaa">
                        <div class="qq1aaa">
                            <h1>Rast</h1>
                            <div class="qqqqw">${time_13.totalMinutes} minuter</div>
                        </div>
                    </div>`
            }
        }

        if(currentTime < tid_2 || dd !== today1){
            if(currentTime < tid_1 && dd == today1){
                r1.innerHTML += `
                    <div style="background-color: ${item.color}; color: ${item.color2};" class="aa">
                        <div style="color: ${item.color2};" class="heeeq">
                            <h1>${item.n}</h1>
                            <div class="qqqqw">${item.tid}</div>
                        </div>
                        <div class="qqqqwq">Lektionen börjar om ${time_11.totalMinutes} minuter</div>
                    </div>`
            }else if(dd !== today1){
                r1.innerHTML += `
                    <div style="background-color: ${item.color}; color: ${item.color2};" class="aa">
                        <div style="color: ${item.color2};" class="heeeq">
                            <h1>${item.n}</h1>
                            <div class="qqqqw">${item.tid}</div>
                        </div>
                    </div>`
            }else{
                r1.innerHTML += `
                    <div style="background-color: ${item.color}; color: ${item.color2};" class="aa">
                        <div style="color: ${item.color2};" class="heeeq">
                            <h1>${item.n}</h1>
                            <div class="qqqqw">${item.tid}</div>
                        </div>
                        <div class="qqqqwq">Lektionen slutar om ${time_12.totalMinutes} minuter</div>
                    </div>`
            }
        }else{
            r11.innerHTML += `
                <div style="background-color: #b9b9b9; color: #ffffffff;" class="aaa">
                    <h1>${item.n}</h1>
                </div>`
        }
    });

    r11.innerHTML += "<div class='nn'></div>"

    console.log(localStorage.getItem("data_name"))

    r1.className = "rr ee"
    r11.className = "r1r ee"
}


window.kk = kk;  // now the inline onclick can access it
