import {createAuthorLink, createPublicationLink} from '../utilities/links_creators'; 

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

function cacheableGraphPreparation(graphPreparingFunction) {
  let memoizedResult = undefined;
  let cachedData = {};

  return (result, nodesShowingMode) => {
    if (memoizedResult != result) {
      memoizedResult = result
      cachedData = {
        [nodesShowingMode]: graphPreparingFunction(result, nodesShowingMode)
      };
    } else if (!cachedData.hasOwnProperty(nodesShowingMode)) {
      cachedData[nodesShowingMode] = graphPreparingFunction(result, nodesShowingMode);
    }
    return cachedData[nodesShowingMode];
  }
}

function prepareAuthorGraph(result, referencesShowingMode) {
  const NODE_SIZE = 500;
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

      switch (referencesShowingMode) {
        case "showPublicationThemes":
          publicationsNodes = {
            ...paintNodes(entry["themes"].nodes, "gray"),
            ...publicationsNodes
          };
          publicationsRelationships = {
            ...entry["themes"].relationships,
            ...publicationsRelationships
          };
          break;
        case "showIncomingReferencesPublications":
          {
            referencesNodes = {
              ...paintNodes(
                  entry["references"]["incoming"].nodes, 
                  "lightblue", 
                  n => ({href: createPublicationLink(n["identity"])})
                  ),
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
              ...paintNodes(
                entry["references"]["outcoming"].nodes, 
                "lightblue",
                n => ({href: createPublicationLink(n["identity"])})
                ),
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
              ...paintNodes(
                entry["references"]["incoming"]["authors"].nodes, 
                "pink",
                n => ({href: createAuthorLink(n["identity"])})
                ),
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
              ...paintNodes(
                entry["references"]["outcoming"]["authors"].nodes,
                "pink",
                n => ({href: createAuthorLink(n["identity"])})
                ),
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

function preparePublicationGraph(result, referencesShowingMode) {
  const NODE_SIZE = 500;

  const authorNode = {
    color: "red",
    size: NODE_SIZE * 3,
    href: createAuthorLink(result["author"]["id"]),
    ...result["author"]
  };

  const publicationNode = {
    color: "green",
    size: NODE_SIZE * 5,
    cx: 20,
    cy: 2,
    ...result["publication"]
  }

  const themesNodes = paintNodes(result["publication_themes"].nodes, "gray");
  
  let referencesNodes = {};
  let referencesRelationships = {};

  switch(referencesShowingMode)
  {
    case "showIncomingReferencesPublications":
      referencesNodes = {
        ...paintNodes(
          result["publication_referenses"]["incoming"].nodes, 
          "lightblue", 
          n => ({href: createPublicationLink(n["identity"])})
        ),
        ...referencesNodes
      };
      referencesRelationships = {
        ...result["publication_referenses"]["incoming"].relationships,
        ...referencesRelationships
      }; 
      break;
    case "showOutcomingReferencesPublications":
      referencesNodes = {
        ...paintNodes(
          result["publication_referenses"]["outcoming"].nodes, 
          "lightblue", 
          n => ({href: createPublicationLink(n["identity"])})
        ),
        ...referencesNodes
      };
      referencesRelationships = {
        ...result["publication_referenses"]["outcoming"].relationships,
        ...referencesRelationships
      };
      break;
    default:
      break;
  }

  const nodes = {
    [authorNode["identity"]]: authorNode,
    [publicationNode["identity"]]: publicationNode,
    ...themesNodes,
    ...referencesNodes
  };

  const links = {
    ...result["author_publication"].relationships,
    ...result["publication_themes"].relationships,
    ...referencesRelationships
  };

  return {
    nodes: nodes,
    links: links,
  };
}

export {
  paintNodes,
  prepareAuthorGraph,
  cacheableGraphPreparation,
  preparePublicationGraph
};

