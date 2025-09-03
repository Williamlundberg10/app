function bb() {
    var v = document.getElementById("hhh");
    var inputValue = v.value.trim(); // Get input value safely

    get1().then(vv => {
        if (!vv) {
            console.error("Could not load class codes!");
            return;
        }

        console.log(vv);

        // Check if code exists in the JSON
        const found = vv.find(item => item.code === inputValue);

        if (found) {
            localStorage.setItem("class_code", inputValue);
            console.log("Class code saved:", inputValue);
            window.location.href = "/app/html/home.html";
        } else {
            v.value = ""
            v.placeholder = "Class not found!"
            console.warn("Class code not found!");
        }
    });
}

function get1() {
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
