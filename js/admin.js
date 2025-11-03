import { GitHubJSON } from '../Library/github-json.js';

const ghJSON = new GitHubJSON(
    "Williamlundberg10",
    "hhd",
    "Z2eRpht6JjEptEYdoprqjmf4y9it6Q3S7ghT" // your Base64 token
);

// Append data
document.getElementById('buu1').addEventListener('click', async () => {
    const dataText = `
        {
        "n": "${document.getElementById("text1").value}",
        "tid": "${document.getElementById("sst").value + "-" + document.getElementById("st").value}",
        "dag": "${document.getElementById("dag1").value}",
        "code": "${document.getElementById("number1").value}",
        "color": "#59d0ffff",
        "color2": "#FFFFFF"
        }
        `;

    try {
        await ghJSON.append("data.json", dataText);
    } catch (err) {
        alert("Failed: " + err.message);
    }
});


document.getElementById('buu2').addEventListener('click', async () => {
    const dataText = `
        {
        "n": "${document.getElementById("text1").value}",
        "tid": "${document.getElementById("sst").value + "-" + document.getElementById("st").value}",
        "dag": "${document.getElementById("dag1").value}",
        "code": "${document.getElementById("number1").value}",
        "color": "#59d0ffff",
        "color2": "#FFFFFF"
        }
        `;

    try {
        await ghJSON.saveFile("h", "kk", "");
    } catch (err) {
        alert("Failed: " + err.message);
    }
});



// Delete data by ID
document.getElementById('deleteBtn').addEventListener('click', async () => {
    const file = document.getElementById('fileInput').value.trim();
    const id = document.getElementById('deleteIdInput').value.trim();
    if (!file || !id) return alert("Enter file name and ID!");
    try {
        await ghJSON.deleteById(file, id);
        alert("Data deleted from " + file);
    } catch (err) {
        alert("Failed: " + err.message);
    }
});

// Get all data
document.getElementById('getAllBtn').addEventListener('click', async () => {
    const file = document.getElementById('fileInput').value.trim();
    if (!file) return alert("Enter file name!");
    try {
        const data = await ghJSON.getAll(file);
        const list = document.getElementById('dataList');
        list.innerHTML = "";
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `ID: ${item.id} | Timestamp: ${item.timestamp} | Data: ${item.data}`;
            list.appendChild(li);
        });
    } catch (err) {
        alert("Failed: " + err.message);
    }
});

// Check if ID exists
document.getElementById('checkBtn').addEventListener('click', async () => {
    const file = document.getElementById('fileInput').value.trim();
    const id = document.getElementById('checkIdInput').value.trim();
    if (!file || !id) return alert("Enter file name and ID!");
    try {
        const exists = await ghJSON.exists(file, id);
        alert(exists ? "ID exists!" : "ID does not exist!");
    } catch (err) {
        alert("Failed: " + err.message);
    }
});