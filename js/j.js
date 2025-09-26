import { GitHubJSON } from '../Library/github-json.js';

const ghJSON = new GitHubJSON(
    "Williamlundberg10",
    "hhd",
    "Z2hwXzM5VllDZnFqcWtYcFhBQ1JiQXlYcTdMbHpHS1BXYzBxekx4Wg==" // your Base64 token
);

function bb() {
    var v = document.getElementById("hhh");
    var inputValue = v.value.trim(); // Get input value safely

    get1().then(classCodes => {
        if (!classCodes) {
            console.error("Could not load class codes!");
            return;
        }


        const found1 = classCodes.find(item => {
            const data = JSON.parse(item.data); // parse the data string
            return data.code == inputValue
        });

        const found = JSON.parse(found1.data)

        if (found) {
            localStorage.setItem("class_code", inputValue);
            console.log("Class code saved:", inputValue);
            window.location.href = "../html/home.html";
        } else {
            v.value = ""
            v.placeholder = "Class not found!"
            console.warn("Class code not found!");
        }
    });
}

document.getElementById("hgf").addEventListener("click", bb)

async function get1() {
    const classCodes = await ghJSON.getAll("class_codes.json");
    console.log(classCodes)
    return classCodes
}

// Example usage:
get1().then(classCodes => console.log(classCodes));

