import React, { Component } from 'react';
import queryString from 'query-string';


import Spinner from '../ReusableComponents/Spinner';
import LinkLikeButton from '../ReusableComponents/LinkLikeButton/LinkLikeButton';
import EntityTitle from './EntityTitle/EntityTitle';
import EntityInfo from './EntityInfo/EntityInfo';
import EntityInfoItem from './EntityInfo/EntityInfoItem';
import EntityGraph from './EntityGraph/EntityGraph';
import LegendBlock from './EntityInfo/LegendBlock';
import RadioLegendBlock from './EntityInfo/RadioLegendBlock';
import BeautifulPopOver from '../ReusableComponents/BeautifulPopOver/BeautifulPopOver';
import SimpleNodesLinksList from '../ReusableComponents/SimpleNodesLinksList';
import { preparePublicationGraph, cacheableGraphPreparation } from './utilities';

import {
  createAuthorLink,
  createPublicationLink,
  createAuthoritiesInDomainsLink,
  createDomainLink,
} from '../utilities/links_creators';

import { getPublicationGraph } from '../utilities/verbose_loaders';
import ErrorAlert from '../ReusableComponents/ErrorAlert';

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
      referencesShowingMode: null,
      displayOutcomingReferencesList: false,
      displayIncomingReferencesList: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const currentQueryParams = queryString.parse(this.props.location.search);
    const nextQueryParams = queryString.parse(nextProps.location.search);

    if (nextQueryParams.publication != currentQueryParams.publication) {
     
      this.loadGraphData(nextQueryParams.publication);
    }
  }

  componentDidMount() {
    
    const queryParams = queryString.parse(this.props.location.search);
    this.loadGraphData(queryParams.publication);
  }

  loadGraphData = publication => {
    this.setState({ loading: true, result: undefined, error: undefined, hasError: false });
    const token = window.sessionStorage.getItem("token");
    let status = 0;

    getPublicationGraph(publication, token)
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

  prepareGraph = cacheableGraphPreparation(preparePublicationGraph);

  onRadioLegendBlockStateChanged = e => {
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

  toggleReferencesList = referencesType => {
    this.setState({[referencesType]: !this.state[referencesType]});
  }


  render() {
    const { 
      result, 
      error, 
      hasError, 
      loading, 
      referencesShowingMode,
      displayIncomingReferencesList,
      displayOutcomingReferencesList
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
    console.log(result);
    const publication = result["publication"];
    const author = result["author"];
    const themes = result["publication_themes"].nodes;
    const outcomingReferencesCount = Object.keys(result["publication_referenses"]["outcoming"].nodes).length;
    const incomingReferencesCount = Object.keys(result["publication_referenses"]["incoming"].nodes).length;
    
    if (displayIncomingReferencesList) {
      return <BeautifulPopOver onSideClick={()=>this.toggleReferencesList("displayIncomingReferencesList")}>
                <SimpleNodesLinksList linksCreator={createPublicationLink}>
                  {Object.values(result["publication_referenses"]["incoming"].nodes)}
                </SimpleNodesLinksList>
              </BeautifulPopOver>;
    }
    if (displayOutcomingReferencesList) {
      return <BeautifulPopOver onSideClick={()=>this.toggleReferencesList("displayOutcomingReferencesList")}>
                <SimpleNodesLinksList linksCreator={createPublicationLink}>
                  {Object.values(result["publication_referenses"]["outcoming"].nodes)}
                </SimpleNodesLinksList>
              </BeautifulPopOver>;
    }

    const data = this.prepareGraph(result, referencesShowingMode);
    
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
                  <LegendBlock color="gray">
                    Themes
                  </LegendBlock>
                </li>
                {incomingReferencesCount  > 0 && 
                <li>
                  <RadioLegendBlock 
                    color="lightBlue" 
                    name="graph"
                    id="showIncomingReferencesPublications" 
                    value={referencesShowingMode == "showIncomingReferencesPublications"} 
                    onChange={this.onRadioLegendBlockStateChanged}
                  >
                    Incoming references  
                    <LinkLikeButton onClick={()=>this.toggleReferencesList("displayIncomingReferencesList")}>
                        View list
                    </LinkLikeButton>
                  </RadioLegendBlock>
                </li>
                }
                {outcomingReferencesCount > 0 && 
                <li>
                  <RadioLegendBlock 
                    color="lightBlue" 
                    name="graph"
                    id="showOutcomingReferencesPublications" 
                    value={referencesShowingMode== "showOutcomingReferencesPublications"} 
                    onChange={this.onRadioLegendBlockStateChanged}
                  >
                    Outcoming references
                    <LinkLikeButton onClick={()=>this.toggleReferencesList("displayOutcomingReferencesList")}>
                        View list
                    </LinkLikeButton>
                  </RadioLegendBlock>
                </li>
                }
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