import { resolve } from "upath";

function paintNodes(nodes_object, color, attributesGenerator) {
  const paintedNodes = {};
  Object.values(nodes_object).forEach(
    n => {

      let painted = undefined;
      if (typeof (attributesGenerator) === "function") {
        painted = {
          color: color,
          ...attributesGenerator(n),
          ...n
        }
      } else {
        painted = {
          color: color,
          ...n
        }
      }
      paintedNodes[n.identity] = painted;
    }
  );
  return paintedNodes;
}

function prepareAuthorGraph(result, referencesShowingMode, showPublicationThemes) {
  const NODE_SIZE = 500;
  console.log(result);

  const authorNode = {
    color: "red",
    size: NODE_SIZE * 2,
    cx: 20,
    cy: 2,
    ...result["author"]
  };

  let publicationsNodes = {};
  let publicationsRelationships = {};
  let referencesNodes = {};
  let referencesRelationships = {};
  result["top_publications"].forEach(
    entry => {
      publicationsNodes[entry["publication"].identity] = {
        color: "green",
        ...entry["publication"]
      };
      publicationsRelationships[entry["author_publication_relationship"].identity] = entry["author_publication_relationship"];

      if (showPublicationThemes) {
        publicationsNodes = {
          ...paintNodes(entry["themes"].nodes, "gray"),
          ...publicationsNodes
        };
        publicationsRelationships = {
          ...entry["themes"].relationships,
          ...publicationsRelationships
        };
      }

      switch (referencesShowingMode) {
        case "showIncomingReferencesPublications":
          {
            referencesNodes = {
              ...paintNodes(entry["references"]["incoming"].nodes, "lightblue"),
              ...referencesNodes
            };
            referencesRelationships = {
              ...entry["references"]["incoming"].relationships,
              ...referencesRelationships
            };
            break;
          }
        case "showOutcomingReferencesPublications":
          {
            referencesNodes = {
              ...paintNodes(entry["references"]["outcoming"].nodes, "lightblue"),
              ...referencesNodes
            };
            referencesRelationships = {
              ...entry["references"]["outcoming"].relationships,
              ...referencesRelationships
            }
            break;
          }
        case "showIncomingReferencesAuthors":
          {
            referencesNodes = {
              ...paintNodes(entry["references"]["incoming"]["authors"].nodes, "pink"),
              ...referencesNodes
            };
            Object.values(entry["references"]["incoming"]["authors"].relationships).forEach(
              r => {
                const unique_id = `${r["source"]},${entry["publication"]["identity"]}`;
                referencesRelationships[unique_id] = {
                  source: r["source"],
                  target: entry["publication"]["identity"],
                };
              }
            );
            break;
          }
        case "showOutcomingReferencesAuthors":
          {
            console.log(referencesShowingMode);
            referencesNodes = {
              ...paintNodes(entry["references"]["outcoming"]["authors"].nodes, "pink"),
              ...referencesNodes
            };
            Object.values(entry["references"]["outcoming"]["authors"].relationships).forEach(
              r => {
                const unique_id = `${r["source"]},${entry["publication"]["identity"]}`;
                referencesRelationships[unique_id] = {
                  target: r["source"],
                  source: entry["publication"]["identity"],
                };
              }
            );
            break;
          }
        default:
          break;
      }

    }
  )
  return {
    nodes: {
      [authorNode["id"]]: authorNode,
      ...publicationsNodes,
      ...referencesNodes
    },
    links: {
      ...publicationsRelationships,
      ...referencesRelationships
    },
  };
}


function getPrepareAuthorGraphPromise (result, referencesShowingMode, showPublicationThemes) {
  return new Promise(
    (resolve, reject) => {
      let data = prepareAuthorGraph(result, referencesShowingMode, showPublicationThemes);
      resolve(data);
    }  
  );
}

export {
  paintNodes,
  getPrepareAuthorGraphPromise,
  prepareAuthorGraph
};

