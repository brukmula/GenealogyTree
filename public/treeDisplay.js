const textFilePath = 'all_notes_combined.txt';
const jsonFilePath = 'notesWithNames.json';

// Initialize ECharts instance by specifying the container id
var myChart = echarts.init(document.getElementById('familyTree'));


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
        const detailsDiv = document.getElementById('label');
        const tree = document.getElementById('familyTree');
        // Format the person details as you like. This is a simple example.
        detailsDiv.innerHTML = `<strong>Genaology of :</strong> ${JSON.stringify(person, null, 2)}`;
        myChart.clear();

        console.log(person);
        loadTreeDataAndCreateChart(person);
        tree.style.visibility = 'visible';
    }
}

//CODE FOR TREES

// Debugging: Log to console to ensure script is running
console.log("Initializing Family Tree Chart");

//Default is set to Abraham
let person = 'Abraham';

//See how deep the tree is
function calculateTreeDepth(node) {
    if (!node.children || node.children.length === 0) {
        return 1;
    }
    let maxChildDepth = 0;
    node.children.forEach(child => {
        maxChildDepth = Math.max(maxChildDepth, calculateTreeDepth(child));
    });
    return 1 + maxChildDepth;
}

//This is to help determine how large the window should be
function adjustContainerSize(depth) {
    const baseHeightPerLevel = 100; // Adjust based on your needs
    const minHeight = 400; // Minimum height to ensure the container is not too small
    const newHeight = Math.max(minHeight, depth * baseHeightPerLevel);
    document.getElementById('familyTree').style.height = `${newHeight}px`;
    // Adjust width similarly if needed
}

//Function to find and return a new tree rooted at the specific node name
function reRootTree(currentNode,name){
    //Search for node by name
    function searchNode(node, targetName){
        if(node.name === targetName){
            return node;
        }
        if(node.children){
            for(let child of node.children){
                const result = searchNode(child, targetName);
                if(result) return result;
            }
        }
        return null;
    }
    return searchNode(currentNode, name);
}

function loadTreeDataAndCreateChart(targetNodeName){
    fetch('smallerData.json')
        .then(response => response.json())
        .then(originalData =>{

            //Re-root the tree if a name is provided
            const data = targetNodeName ? reRootTree(originalData, targetNodeName) : originalData;

            //Calculate window size based on amount of data
            const depth = calculateTreeDepth(data);
            adjustContainerSize(depth);

            var myChart = echarts.init(document.getElementById('familyTree'));

            //Chart configuration
            var option = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove',
                    formatter: function (params) {
                        return params.data.name;
                    }
                },
                series: [{
                    type: 'tree',
                    orient: 'TB',
                    data: [data],
                    top: '10%',
                    left: '1%',
                    bottom: '15%',
                    right: '5%',
                    symbolSize: 7,
                    label: {
                        position: 'left',
                        verticalAlign: 'bottom',
                        align: 'middle',
                        fontSize: 20 // Increase font size here
                    },
                    leaves: {
                        label: {
                            padding: [20,1],
                            position: 'right',
                            verticalAlign: 'bottom',
                            align: 'middle',
                            fontSize: 20 // Increase font size here for leaf nodes
                        }
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                }]
            };
            // Use the configuration specified to show the chart
            myChart.setOption(option);
        })
        .catch(error => console.log('Error loading tree data: ', error));
}


loadTreeDataAndCreateChart(person);
// Debugging: Log to console to confirm option is set
console.log("Family Tree Chart Option Set");



