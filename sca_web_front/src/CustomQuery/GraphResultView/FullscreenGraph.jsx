import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';

import EntityGraph from './EntityGraph/EntityGraph';


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
    const height = window.innerHeight*0.9;
    const width = window.innerWidth*0.9;
        
    GraphConfig.height = height*0.9;
    GraphConfig.width = width*0.9;
    
    return (
      <div onClick={this.onSideClick} style={OverlayDivStyle} title="click here to close">
        <div
           title="graph"
           onClick={this.onGraphClick} 
           style={{background: "white", height: "80%", width: "80%", margin: "5% 10%"}}
           >
          <EntityGraph 
                graphConfig={GraphConfig}
                graphObject={
                  {nodes: this.props.uniqueNodes,
                    links: this.props.uniqueLinks}
                }
                onNodeClick={this.onNodeClick}
                hintExtractor={this.nodeHintGenerator}
            />
        </div>
      </div>
    );
    
  }
}

export default FullscreenGraph;