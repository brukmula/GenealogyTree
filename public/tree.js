// Initialize ECharts instance by specifying the container id
var myChart = echarts.init(document.getElementById('familyTree'));

const selectedPerson = document.getElementById('selectedPerson');

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

//Wait for user to select person for genealogy
selectedPerson.addEventListener('change', () => {
    person = selectedPerson.value;

    console.log(person);
    //Clear previous tree
    myChart.clear();

    //Call the function to load tree and create tree structure of selected person
    loadTreeDataAndCreateChart(person);
})

function selectPerson(person){
    person = selectedPerson.value;

    console.log(person);

    //Clear previous tree
    myChart.clear();

    //Load new tree in using the selected person
    loadTreeDataAndCreateChart(person);
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
    fetch('data.json')
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

//Call the function to load tree and create tree structure of selected person
loadTreeDataAndCreateChart(person);

// Debugging: Log to console to confirm option is set
console.log("Family Tree Chart Option Set");

