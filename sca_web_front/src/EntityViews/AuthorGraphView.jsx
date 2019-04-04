import React, { Component } from 'react';
import queryString from 'query-string';


import Spinner from '../ReusableComponents/Spinner';
import EntityTitle from './EntityTitle/EntityTitle';
import EntityInfo from './EntityInfo/EntityInfo';
import EntityInfoItem from './EntityInfo/EntityInfoItem';
import EntityGraph from './EntityGraph/EntityGraph';


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

class AuthorGraphView extends Component {
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
    console.log(result);

    const authorNode = {
      color: "red",
      size: NODE_SIZE*2,
      cx: 20,
      cy: 2,
      ...result["author"]
    };

    const publications = {};
    const authorPublicationsRelationships = [];
    const linkedPublications = {};
    const linkedPublicationsAuthors = {};
    let linkedPublicationsRelationships = [];
    const distinctAuthorPublicationsRelationships = {};

    result["publications_relations_themes"].forEach(
      entry => {
        publications[entry["publication"]["id"]] = {
          color: "green",
          href: createPublicationLink(entry["publication"]["id"]),
          ...entry["publication"],
        };
        authorPublicationsRelationships.push(entry["author_publication_relationship"]);

        entry["linked_publications"].forEach(
          item => {
            linkedPublications[item["id"]] = {
              color: "lightblue",
              href: createPublicationLink(item["id"]),
              ...item
            };
          }
        );

        entry["linked_publication_authors"].forEach(
          item => {
            linkedPublicationsAuthors[item["id"]] = {
              color: "pink",
              href: createAuthorLink(item["id"]),
              ...item
            };
          }
        );

        linkedPublicationsRelationships = [
          ...linkedPublicationsRelationships,
          ...entry["references_relations"],
        ];

        entry["linked_publications_author_relations"].forEach(
          item => {
            distinctAuthorPublicationsRelationships[item["id"]] = item;
          }
        )
      }
    );
   
    console.log(linkedPublicationsRelationships);

    return {
      nodes: {
        [authorNode["id"]]: authorNode,
        ...publications,
        ...linkedPublications,
        ...linkedPublicationsAuthors
      },
      links: [
        ...authorPublicationsRelationships,
        ...linkedPublicationsRelationships,
        ...Object.values(distinctAuthorPublicationsRelationships)
      ],
    };
  }

  onDisplayCheckboxChanged = e => {
    const checked = this.state[e.target.name];
    this.setState({[e.target.name]: !checked});
  }


  render() {
    console.log("rerender");
    const { result, error, hasError, loading, displayReferences } = this.state;

    if (hasError) {
      return <ErrorAlert errorName={error.name} errorMessage={error.message} />;
    }

    if (loading) {
      return <Spinner />;
    }

    if (!result) {
      return <ErrorAlert errorName="404 - Not found" errorMessage="Sorry, didn't found that page" />;
    }

    const publicationsCount = result["publications_count"];
    const author = result["author"];


    const data = this.prepareGraph(result);
    console.log(data);
    GraphConfig.height = window.innerHeight * 0.8;
    GraphConfig.width = window.innerWidth;
    return (
      <section style={{ position: "relative", padding: "1% 10%" }}>
        <EntityTitle title={author["name"]} />
        <EntityInfo>
          <EntityInfoItem>
            <ul>
              <li>
                <b>{publicationsCount}</b> publications
              </li>
            </ul>
          </EntityInfoItem>
        </EntityInfo>


        <EntityGraph 
          graphConfig={GraphConfig}
          graphObject={data} 
          />
      </section>
    );
  }
}

export default AuthorGraphView;