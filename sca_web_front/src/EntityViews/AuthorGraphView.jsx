import React, { Component } from 'react';
import queryString from 'query-string';


import Spinner from '../ReusableComponents/Spinner';
import EntityTitle from './EntityTitle/EntityTitle';
import EntityInfo from './EntityInfo/EntityInfo';
import EntityInfoItem from './EntityInfo/EntityInfoItem';
import EntityGraph from './EntityGraph/EntityGraph';
import LegendBlock from './EntityInfo/LegendBlock';
import RadioLegendBlock from './EntityInfo/RadioLegendBlock';
import CheckableLegendBlock from './EntityInfo/CheckableLegendBlock';
import {prepareAuthorGraph, cacheableGraphPreparation} from './utilities';

import {
  createAuthorLink,
  createPublicationLink,
  createAuthoritiesInDomainsLink,
} from '../utilities/links_creators';

import { getAuthorGraph } from '../verbose_loaders';
import ErrorAlert from '../ReusableComponents/ErrorAlert';

const GraphConfig = {
  node: {
    color: 'red',

    highlightStrokeColor: 'blue',
    labelProperty: n => {
        return n.id;
    }

  },
  link: {
    renderLabel: true,
    labelProperty: true,
    highlightColor: 'red'
  },
  nodeHighlightBehavior: true,
  highlightDegree: 0,
  directed: true,
  linkHighlightBehavior: true
};

class AuthorGraphView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: undefined,
      result: undefined,
      error: undefined,
      hasError: false,
      loadingGraph: false,
      referencesShowingMode: ""
    };
  }

  componentDidMount() {
    this.setState({ loading: true, result: undefined, error: undefined, hasError: false });
    const token = window.sessionStorage.getItem("token");
    const queryParams = queryString.parse(this.props.location.search);
    let status = 0;
    getAuthorGraph(queryParams["author"], token)
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
          console.log(response);
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

  onNodeClick = node => {
    if (node["href"]) {
      this.props.history.push(node["href"]);
    }
  }

  onReferencesRadioLegendChanged = e => {
    // the strange code below makes graph lib clear graph before changing graph data,
    // because it used to have problems with links dublicating
    const mode = e.target.id;
    if (this.state.referencesShowingMode == e.target.id) {
      this.setState({referencesShowingMode: null});
    } else {
      setTimeout(() => {
        this.setState({referencesShowingMode: mode});
      }, 15);
      this.setState({referencesShowingMode: null});
    }
  }

  onDisplayCheckboxChanged = e => {
    const checked = this.state[e.target.id];
    this.setState({[e.target.id]: !checked});
  }

  buildGraph = cacheableGraphPreparation(prepareAuthorGraph);

  render() {
    const { 
      result, 
      error, 
      hasError, 
      loading, 
      referencesShowingMode
    } = this.state;

    if (hasError) {
      return <ErrorAlert errorName={error.name} errorMessage={error.message} />;
    }

    if (loading) {
      return <Spinner />;
    }

    if (!result) {
      return <ErrorAlert errorName="404 - Not found" errorMessage="Sorry, didn't found that page" />;
    }

    
    const data = this.buildGraph(result, referencesShowingMode);
    const publicationsCount = result["publications_count"];
    const author = result["author"];
    const mostCitedPublications = result["top_publications"].map(
      v => {
        return <li key={v["publication"]["id"]}>
          <a href={createPublicationLink(v["publication"]["id"])}>{v["publication"]["name"]}</a>
        </li>;
      }
    );

    GraphConfig.height = window.innerHeight * 0.7;
    GraphConfig.width = window.innerWidth;
    return (
      <section style={{ position: "relative", padding: "1% 10%" }}>
        <EntityTitle title={author["name"]} />
        <EntityInfo>
          <EntityInfoItem>
            <details>
              <summary>
                Author details:
              </summary>
            
              <ul>
                <li>
                  <b>{publicationsCount}</b> publication(s)
                </li>
                <li>
                  Belarusian State University of Informatics and RadioElectronics
                </li>
              </ul>
            </details>
          </EntityInfoItem>
          <EntityInfoItem>
            <details>
              <summary>
                Most cited publications
              </summary>
              <ul>
                {mostCitedPublications}
              </ul>
            </details>
          </EntityInfoItem>
          <EntityInfoItem>
            <details>
              <summary>Graph</summary>
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
                  <RadioLegendBlock 
                    color="gray" 
                    id="showPublicationThemes"
                    name="graph"
                    value={referencesShowingMode == "showPublicationThemes"} 
                    onChange={this.onReferencesRadioLegendChanged}>
                    Themes
                  </RadioLegendBlock>
                </li>
                <li>
                  <RadioLegendBlock 
                    color="pink" 
                    id="showIncomingReferencesAuthors"
                    name="graph"
                    value={referencesShowingMode == "showIncomingReferencesAuthors"} 
                    onChange={this.onReferencesRadioLegendChanged}>
                    Authors who referenced to author's publications
                  </RadioLegendBlock>
                </li>
                <li>
                  <RadioLegendBlock 
                    color="pink" 
                    id="showOutcomingReferencesAuthors"
                    name="graph"
                    value={referencesShowingMode == "showOutcomingReferencesAuthors"} 
                    onChange={this.onReferencesRadioLegendChanged}>
                    Authors whose publications where referenced by current author
                  </RadioLegendBlock>
                </li>
                <li>
                  <RadioLegendBlock 
                    color="lightblue" 
                    id="showIncomingReferencesPublications"
                    name="graph"
                    value={referencesShowingMode == "showIncomingReferencesPublications"} 
                    onChange={this.onReferencesRadioLegendChanged}>
                    Incoming references publications
                  </RadioLegendBlock>
                </li>
                <li>
                  <RadioLegendBlock 
                    color="lightblue" 
                    id="showOutcomingReferencesPublications"
                    value={referencesShowingMode == "showOutcomingReferencesPublications"} 
                    onChange={this.onReferencesRadioLegendChanged}>
                    Outcoming references publications
                  </RadioLegendBlock>
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

export default AuthorGraphView;