import React, {Component} from 'react';
import {Graph, Node, Link, } from 'react-d3-graph';
import {buildSimpleGraph} from '../ReusableComponents/GraphResultView/graph_unilities';

const p = {
  id: "p",
  label:"Mathematical models in biology. An introduction",
  "extension": "pdf",
  "pages": 385,
  "sha256": "057F92698B4A58A298667F470936D4E4358F2DD923C543F9B7105BB6244549A7",
  "ISBN": 1,
  "year": 2003,
  "name": "Mathematical models in biology. An introduction",
  "publisher": "Cambridge University Press",
  "language": "English",
  "tags": [
    ""
  ]
};

const a = {
  id: "a",
  cx: 20,
  cy: 0,
  size: "2000",
  color: "green",
  label: "Elizabeth",
  "name": "Elizabeth S. Allman, John A. Rhodes",
  "quote": -1.0097665327249443
};

const themes = [
  {
    "id": "1",
    "label": "Clinics",
    "name": "Clinics"
  }
  ,
  {
    "id": "2",
    "label": "Intelligence",
    "name": "Intelligence"
  }
  ,
  {
    id: "3",
    "label": "Molecular",
    "name": "Molecular analysis"
  }
  ,
  {
    id: "4",
    "label": "Molecular",
    "name": "Biology"
  }
  ,
  {
    id: "5",
    "name": "Programming"
  }
  ,
  {
    id: "6",
    "name": "Statistical learning"
  }
  ,
  {
    id: "7",
    "name": "Computer science"
  }
  ];

const relations = [
  {
    source: "a",
    target: "p"
  },
  {
    source: "p",
    target: "1",
  },
  {
    source: "p",
    target: "2",
  },
  {
    source: "p",
    target: "3",
  },
  {
    source: "p",
    target: "4",
  }
];

const GraphConfig = {
    
  node: {
      color: 'red',
      
      highlightStrokeColor: 'blue',
      labelProperty: n => {
        if (n.label)
          return n.label;
        else
          return n.name;
      }

  },
  link: {
      highlightColor: 'red'
  },
  nodeHighlightBehavior: true,
  
  height: 400,
  width: 620,
  highlightDegree: 0,
  directed: true,
  linkHighlightBehavior:true
};

class Test extends Component {
  // test component to test some new things before adding to working pages
  render() {
    
    

    const data = {
      nodes: [a, p, ...themes],
      links: relations
    };
    const graph  = <Graph id="er" data={data} config={GraphConfig}/>;

    
  
    //const myGraph = buildGraph({node1: myNode, config: {id: "g1"}});
    
    return (
      <section>
        {graph}
        
      </section>
    );
  }
};

export default Test;