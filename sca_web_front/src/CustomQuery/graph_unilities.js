const nodesFillColors = ["red", "green", "lightblue", "yellow"]


function getStringLabelForNode(neo_node) {
    if ("Author" in neo_node.labels || "Publication" in neo_node.labels || "Domain" in neo_node.labels) {
        return neo_node.name;
    } else if ("KeywordPhrase") {
        return neo_node["phrase"];
    }
}

function getUniqueNodesAndLinks(data) {
    let unique_nodes = {};
    let unique_links = {};
    let others = {};
    for(let i = 0; i < data.length; i++) {
        for (let j in data[i]) {
            const entity = data[i][j];
            const id = String(entity["identity"])+entity["type"];
            if (entity["type"] === "Node" && !unique_nodes.hasOwnProperty(id)) {
                unique_nodes[id] = entity;
            } else if (entity["type"] != "Other" && entity["type"] != "Node" && !unique_links.hasOwnProperty(id)) {
               unique_links[id] = entity;
            } else {
                others[j] = entity;
            }
        }
    }
    return [unique_nodes, unique_links, others];
}

function buildSimpleGraph(unique_nodes, unique_links) {  
   
    let data = {
        nodes: [],
        links: [],
    }

    let labelColorMappings = {};
    let nextColor = 0;
    const getColorForNode = (label) => {
        if (labelColorMappings.hasOwnProperty(label)) {
            return labelColorMappings[label];
        }

        if (nextColor >= nodesFillColors.length) {
            nextColor = 0;
        }
        labelColorMappings[label] = nodesFillColors[nextColor];
        nextColor++;
        return labelColorMappings[label];
    }

    for (let i = 0; i< Object.values(unique_nodes).length; i++) {
        const node = Object.values(unique_nodes)[i];
        const label = node.labels[0];

        const id = String(node["identity"])+node["type"];
        data.nodes.push({id: id, label: node["labels"][0], color: getColorForNode(label)});
    }
    for (let i = 0; i< Object.values(unique_links).length; i++) {
        const link = Object.values(unique_links)[i];
        const id = String(link["identity"])+link["type"];
        data.links.push({id: id, source: String(link["source"]+"Node"), target: String(link["target"]+"Node")});
    }
    return data;
} 

export {
    buildSimpleGraph,
    getUniqueNodesAndLinks,
}