import React, { Component } from 'react';
import queryString from 'query-string';


import Spinner from '../../ReusableComponents/Spinner';
import EntityTitle from '../EntityTitle/EntityTitle';
import EntityInfo from '../EntityInfo/EntityInfo';
import EntityInfoItem from '../EntityInfo/EntityInfoItem';
import EntityGraph from '../EntityGraph/EntityGraph';

import './PublicationGraphView.css';

import {
  createAuthorLink,
  createPublicationLink,
  createAuthoritiesInDomainsLink,
} from '../../utilities/links_creators';

import { getPublicationGraph } from '../../verbose_loaders';
import ErrorAlert from '../../ReusableComponents/ErrorAlert';

const GraphConfig = {
  node: {
    color: 'red',

    highlightStrokeColor: 'blue',
    labelProperty: n => {
      if (n.labels)
        return n.labels[0];
    }

  },
  link: {
    highlightColor: 'red'
  },
  nodeHighlightBehavior: true,
  highlightDegree: 0,
  directed: true,
  linkHighlightBehavior: true
};

class PublicationGraphView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: undefined,
      result: undefined,
      error: undefined,
      hasError: false,
      displayReferences: false,
      showingHintNodeId: null,
    };
  }

  componentDidMount() {
    this.setState({ loading: true, result: undefined, error: undefined, hasError: false });
    const token = window.sessionStorage.getItem("token");
    const queryParams = queryString.parse(this.props.location.search);
    let status = 0;
    getPublicationGraph(queryParams.publication, token)
      .then(
        result => {
          status = result.status;
          return result.response.json();
        },
        error => {
          status = error.status;
          return error.response.json();
        }
      )
      .then(
        response => {
          if (status != 200) {
            throw new Error(response.error);
          }
          this.setState({
            result: response,
            loading: false
          });
        },
      )
      .catch(
        e => {
          this.setState({ error: e, hasError: true, loading: false });
          console.log("ERROR:", e);
        }
      );
  }

  prepareGraph = result => {
    const NODE_SIZE = 500;

    const authorNode = {
      color: "red",
      size: NODE_SIZE * 3,
      ...result["author"]
    };

    const publicationNode = {
      color: "green",
      size: NODE_SIZE * 5,
      cx: 20,
      cy: 2,
      ...result["publication"]
    }

    const themeNodes = {};
    Object.keys(result["publication_themes"].nodes).forEach(
      (k) => {
         themeNodes[k] = {...result["publication_themes"].nodes[k], color: "gray"};
      }
    );

    const referencesNodes = {};
    Object.keys(result["publication_referenses"].nodes).forEach(
      (k) => {
        referencesNodes[k] = {...result["publication_referenses"].nodes[k], color: "lightblue"};
      }
    );

    let nodes = {
      [authorNode["identity"]]: authorNode,
      [publicationNode["identity"]]: publicationNode,
      ...themeNodes,
      ...referencesNodes
    };

    let links = {
      ...result["author_publication"].relationships,
      ...result["publication_themes"].relationships,
      ...result["publication_referenses"].relationships
    };

    return {
      nodes: nodes,
      links: links,
    };
  }

  // prepareGraphData = (result, displayReferences = false) => {
    

  //   const authorNode = {
  //     id: result["author"]["identity"],
  //     label: "Author",
  //     color: "red",
  //     size: NODE_SIZE * 3,
  //     ...result["author"]
  //   };

  //   const publicationNode = {
  //     id: result["publication"]["identity"],
  //     label: "Publication",
  //     color: "green",
  //     size: NODE_SIZE * 5,
  //     cx: 20,
  //     cy: 2
  //   };

  //   const themesNodes = [];
  //   const themesLinks = [];

  //   for (let i = 0; i < result["themes_and_theme_relations"].length; i++) {
  //     const entry = result["themes_and_theme_relations"][i];
  //     themesNodes.push({
  //       id: entry["theme"]["identity"],
  //       label: entry["theme"]["name"],
  //       color: "gray",
  //       size: NODE_SIZE * 2,
  //     });
  //     themesLinks.push(entry["theme_relation"]);

  //   }

  //   const referencesNodes = [];
  //   const referencesLinks = [];

  //   if (displayReferences)
  //     for (let i = 0; i < result["referensed_publications"].length; i++) {
  //       const entry = result["referensed_publications"][i];
  //       referencesNodes.push({
  //         id: entry["publication"]["identity"],
  //         label: entry["publication"]["name"],
  //         color: "lightblue"
  //       });
  //       referencesLinks.push(entry["links_to_relation"]);
  //     }


  //   return {
  //     nodes: [authorNode, publicationNode, ...themesNodes, ...referencesNodes],
  //     links: [result["author_publication"].link , ...themesLinks, ...referencesLinks]
  //   };
  // }

  onDisplayCheckboxChanged = e => {
    const checked = this.state[e.target.name];
    this.setState({[e.target.name]: !checked});
  }

  onMouseOverGraphNode = nodeId => {
    
    this.setState({showingHintNodeId: nodeId});
  }

  onMouseOutGraphNode = () => {
    
    this.setState({showingHintNodeId: null});
  }

  render() {
    console.log("rerender");
    const { result, error, hasError, loading, displayReferences, showingHintNodeId } = this.state;

    if (hasError) {
      return <ErrorAlert errorName={error.name} errorMessage={error.message} />;
    }

    if (loading) {
      return <Spinner />;
    }

    if (!result) {
      return <ErrorAlert errorName="404 - Not found" errorMessage="Sorry, didn't found that page" />;
    }

    const publication = result["publication"];
    const author = result["author"];

    const data = this.prepareGraph(result);
    
    GraphConfig.height = window.innerHeight * 0.8;
    GraphConfig.width = window.innerWidth;
    return (
      <section style={{ position: "relative", padding: "1% 10%" }}>
        <EntityTitle title={publication["name"]} />
        <EntityInfo>
          <EntityInfoItem>
            <details open>
            <summary>
              Publication:
            </summary>

            <ul>
              <li>
                by <a href={createAuthorLink(author["identity"])}>{author["name"]}</a>
              </li>
              <li>
                year: <b>{publication["year"]}</b>
              </li>
              <li>
                language: <b>{publication["language"]}</b>
              </li>
              <li>
                ISBN: <b>{publication["ISBN"]}</b>
              </li>
              <li>
                <b>{publication["pages"]}</b> pages
            </li>
            </ul>
          </details>
          </EntityInfoItem>
          <EntityInfoItem>
            <details>
            <summary>
              Display nodes:
              </summary>

              <input type="checkbox" id="displayReferences" name="displayReferences" value={displayReferences} onChange={this.onDisplayCheckboxChanged} />
              <label htmlFor="displayReferences"> Display references</label>

          </details>
          </EntityInfoItem>
        </EntityInfo>


        <EntityGraph 
          graphConfig={GraphConfig}
          graphObject={data} 
        
          nodeHint={showingHintNodeId}
          />
      </section>
    );
  }
}

export default PublicationGraphView;