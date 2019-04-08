import React, { Component } from 'react';
import queryString from 'query-string';


import Spinner from '../../ReusableComponents/Spinner';
import EntityTitle from '../EntityTitle/EntityTitle';
import EntityInfo from '../EntityInfo/EntityInfo';
import EntityInfoItem from '../EntityInfo/EntityInfoItem';
import EntityGraph from '../EntityGraph/EntityGraph';
import LegendBlock from '../EntityInfo/LegendBlock';
import CheckableLegendBlock from '../EntityInfo/CheckableLegendBlock';


import {
  createAuthorLink,
  createPublicationLink,
  createAuthoritiesInDomainsLink,
  createDomainLink,
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
      displayIncomingReferences: false,
      displayOutcomingReferences: false,
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

  prepareGraph = (result, showIncomingReferences, showOutcomingReferences) => {
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

    const themeNodes = {};
    Object.keys(result["publication_themes"].nodes).forEach(
      (k) => {
         themeNodes[k] = {
            color: "gray",
            href: createDomainLink(result["publication_themes"].nodes[k]["id"]),
            ...result["publication_themes"].nodes[k] 
          };
      }
    );
    

    const referencesNodes = {};
    let referencesRelationships = {};
    if (showIncomingReferences) {
      Object.keys(result["publication_referenses"]["incoming"].nodes).forEach( 
        k => {
          const node = result["publication_referenses"]["incoming"].nodes[k];
          referencesNodes[k] = { 
            color: "lightblue",
            href: createPublicationLink(node["identity"]),
            ...node
          };
      });
      referencesRelationships = Object.assign(referencesRelationships, result["publication_referenses"]["incoming"].relationships);
    }

    if (showOutcomingReferences) {
      Object.keys(result["publication_referenses"]["outcoming"].nodes).forEach(
        k => {
          const node = result["publication_referenses"]["outcoming"].nodes[k];
          referencesNodes[k] = { 
            color: "lightblue",
            href: createPublicationLink(node["identity"]),
            ...node
          };
      });
      referencesRelationships = Object.assign(referencesRelationships, result["publication_referenses"]["outcoming"].relationships);
    }
    

    const nodes = {
      [authorNode["identity"]]: authorNode,
      [publicationNode["identity"]]: publicationNode,
      ...themeNodes,
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

  onDisplayCheckboxChanged = e => {
    const checked = this.state[e.target.name];
    this.setState({[e.target.name]: !checked});
  }

  onNodeClick = node => {
    if (node["href"]) {
      this.props.history.replace(node["href"]);
    }
  }

  nodeHintGenerator = node => {
    let nodeHint = "";
    if (node["name"]) {
      nodeHint = `${node["labels"][0]}: ${node["name"]}`;
    } else {
      nodeHint = node["labels"];
    }

    if (node["href"]) {
      return <span>
        {nodeHint} 
         <br/>
         <i>click node for more info</i>
        </span>
    } else {
      return <span>{nodeHint}</span>
    }
  }

  render() {
    console.log("rerender");
    const { result, error, hasError, loading, displayIncomingReferences, displayOutcomingReferences} = this.state;

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
    const themes = result["publication_themes"].nodes;
    const outcomingReferencesCount = Object.keys(result["publication_referenses"]["outcoming"].nodes).length;
    const incomingReferencesCount = Object.keys(result["publication_referenses"]["incoming"].nodes).length;
    

    const data = this.prepareGraph(result, displayIncomingReferences, displayOutcomingReferences);
    console.log(data);
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
              Publication Domains:
            </summary>

            <ul>
             {Object.values(themes).map(t => <li key={t["identity"]}> {t["name"]} </li>)}
            </ul>

            {/* <a href={createAuthoritiesInDomainsLink()} */}
          </details>
          </EntityInfoItem>

          <EntityInfoItem>
            <details>
            <summary>
              Graph:
              </summary>

              <ul style={{listStyle: "none"}}>
                <li>
                  <LegendBlock color="red">
                    Author
                  </LegendBlock>
                </li>
                <li>
                  <LegendBlock color="green">
                    Publication
                  </LegendBlock>
                </li>
                <li>
                  <CheckableLegendBlock color="lightBlue" id="displayIncomingReferences" name="displayIncomingReferences" value={displayIncomingReferences} onChange={this.onDisplayCheckboxChanged}>
                   Incoming references ({incomingReferencesCount})
                  </CheckableLegendBlock>
                </li>
                <li>
                  <CheckableLegendBlock color="lightBlue" id="displayOutcomingReferences" name="displayOutcomingReferences" value={displayOutcomingReferences} onChange={this.onDisplayCheckboxChanged}>
                    Outcoming references ({outcomingReferencesCount})
                  </CheckableLegendBlock>
                </li>
              </ul>
          </details>
          </EntityInfoItem>
        </EntityInfo>


        <EntityGraph 
          graphConfig={GraphConfig}
          graphObject={data} 
          onNodeClick={this.onNodeClick}
          hintExtractor={this.nodeHintGenerator}
          />
      </section>
    );
  }
}

export default PublicationGraphView;