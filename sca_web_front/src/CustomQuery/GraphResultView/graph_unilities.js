const nodesFillColors = ["red", "green", "lightblue", "yellow", "hotpink ", "lavender"]


function getStringLabelForNode(neo_node) {
    if ("Author" in neo_node.labels || "Publication" in neo_node.labels || "Domain" in neo_node.labels) {
        return neo_node.name;
    } else if ("KeywordPhrase") {
        return neo_node["phrase"];
    }
}

function getUniqueNodesAndLinks(data) {
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

    const uniqueNodes = {};
    const uniqueLinks = {};
    const others = {};

    for(let i = 0; i < data.length; i++) {
        for (let j in data[i]) {
            const entity = data[i][j];
            console.log(entity);
            const id = String(entity["identity"]);
            if (entity["type"] === "Node" && !uniqueNodes.hasOwnProperty(id)) {
                const label = entity.labels[0];
                console.log("node_color", getColorForNode(label))
                uniqueNodes[id] = {...entity, id: id, label: label, color: getColorForNode(label)};
            } else if (entity["type"] && entity["type"] != "Node" && !uniqueLinks.hasOwnProperty(id)) {
                uniqueLinks[id] = {id: id, source: String(entity["source"]), target: String(entity["target"])};;
            } else {
                others[j] = entity;
            }
        }
    }
    console.log([uniqueNodes, uniqueLinks]);
    return [uniqueNodes, uniqueLinks, others];
}

function checkIfGraphIsValid(unique_links, unique_nodes) {
    if (Object.keys(unique_nodes).length === 0 && unique_nodes.constructor === Object) {
        return false;
    }
    for(const key in unique_links) {
        const node1 = unique_links[key].source;
        const node2 = unique_links[key].target;
        if (!unique_nodes.hasOwnProperty(node1) || !unique_nodes.hasOwnProperty(node2)) {
            return false;
        }
    }
    return true;
}


export {
    getUniqueNodesAndLinks,
    checkIfGraphIsValid,
    getStringLabelForNode,
}