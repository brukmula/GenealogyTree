const textFilePath = 'all_notes_combined.txt';
const jsonFilePath = 'notesWithNames.json';

fetch(textFilePath)
    .then(response => response.text())
    .then(text => {
        const lines = text.split('\n');
        const leftPanel = document.getElementById('leftPanel');
        lines.forEach((line, index) => {
            const div = document.createElement('div');
            div.textContent = line;
            div.onclick = () => displayObjectsForKey(line);
            leftPanel.appendChild(div);
        })
    });

let jsonData = {};
fetch(jsonFilePath)
    .then(response => response.json())
    .then(json => {
        jsonData = json;
    });

function displayObjectsForKey(key) {
    const objects = jsonData[key];
    const rightPanel = document.getElementById('rightPanel');
    rightPanel.innerHTML = ''; // Clear previous content
    if (objects) {
        objects.forEach((obj, index) => {
            const div = document.createElement('div');
            div.textContent = `${JSON.stringify(obj)}`;
            div.onclick = () => selectPerson(obj);
            rightPanel.appendChild(div);
        });
    } else {
        rightPanel.textContent = 'No data found for this key.';
    }

    // Assuming this is in the file where selectPerson is defined
     function selectPerson(person) {
         const detailsDiv = document.getElementById('selectedPerson');
         // Format the person details as you like. This is a simple example.
         detailsDiv.innerHTML = `<strong>Selected Person:</strong> ${JSON.stringify(person, null, 2)}`;
    }
}

