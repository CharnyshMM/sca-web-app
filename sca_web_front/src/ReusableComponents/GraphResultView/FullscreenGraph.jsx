import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';

import { buildSimpleGraph } from './graph_unilities';
import paperImage from './paper.jpg';


const GraphConfig = {
  node: {
      color: 'red',
      
      highlightStrokeColor: 'blue',
      labelProperty: n => {
          return n.label;
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

const OverlayDivStyle = {
  position: "absolute",
  top: "0%",
  left: "0%", 
  zIndex: 10,
  background: "rgba(1,1,1,0.5)",
  color: "white",
  height: "100%",
  width: "100%"
}


class FullscreenGraph extends Component {

  onSideClick = e => {
    this.props.onClick()
  }

  onNodeClick = nodeId => {
    //e.stopPropagation();
    console.log("on node click");
  }

  onGraphClick = e => {
    e.stopPropagation();
  }
  

  render() {
    
    const data = buildSimpleGraph(this.props.uniqueNodes, this.props.uniqueLinks);
    const height = window.innerHeight*0.9;
    const width = window.innerWidth*0.9;
        
    GraphConfig.height = height*0.9;
    GraphConfig.width = width*0.9;

    const graph = (
          <Graph
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            ref={this.graphRef}
            data={data}
            config={GraphConfig}
            onClickedNode={this.onNodeClick}
          />);
    
    return (
      <div onClick={this.onSideClick} style={OverlayDivStyle} title="click here to close">
        <div
           title="graph"
           onClick={this.onGraphClick} 
           style={{background: "white", height: "80%", width: "80%", margin: "5% 10%"}}
           >
          {graph}
        </div>
      </div>
    );
    
  }
}

export default FullscreenGraph;