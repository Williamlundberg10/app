window.onload = function() {
    const r111 = document.getElementById("aa_1");
    r111.textContent = localStorage.getItem("data_name")
    document.getElementById("dee").className = "asq qq"
    update_data("",1)

};



function pq(){

    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          caches.delete(cache);
        })
      )
    )
}

function aq(){
    
    window.location.href = "/app/html/settings.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "/app/html/s.html";
    console.log("Logged out and localStorage cleared!");
}

function update_data(data,g){
    if(g != 1){
        var qwe = document.getElementById(data)
        localStorage.setItem("ss_data_" + data, qwe.checked)
    }else{
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            // Check if the key starts with "ss_data_"
            if (key.startsWith("ss_data_")) {
                const id = key.replace("ss_data_", ""); // Extract ID
                const value = localStorage.getItem(key) === "true"; // Convert to boolean

                // Check if the element exists before accessing
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = value;
                }

            }
        }
    }
}