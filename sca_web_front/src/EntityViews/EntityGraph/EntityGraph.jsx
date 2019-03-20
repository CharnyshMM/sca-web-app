import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';


import './EntityGraph.css';
// this.props.graphData
// this.props.nodeHint
// this.props.onNodeClick

class EntityGraph extends Component {
  mouseX = 0
  mouseY = 0
  mouseEventCounter = 0

  onMouseMove = e => {
    if (this.mouseEventCounter > 5) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY - 120;
      this.mouseEventCounter = 0;
    } else {
      this.mouseEventCounter++;
    }
  }

  onMouseOverNode = nodeId => {
    this.props.onMouseOverNode(nodeId);
  }

  onMouseOutNode = () => {
    this.props.onMouseOutNode();
  }

  render() {
    const { nodeHint, graphData, graphConfig } = this.props;
  
    return (
      <div className="entity_graph" onMouseMove={this.onMouseMove}>
        {nodeHint &&
          <div className="entity_graph__hint" style={{left: this.mouseX+10, top: this.mouseY}}>
            {nodeHint}
          </div>
        }
        <Graph 
          id="graph" 
          data={graphData} 
          config={graphConfig} 
          onMouseOverNode={this.onMouseOverNode} 
          onMouseOutNode={this.onMouseOutNode} 
        />
      </div>
    );
  }
}

export default EntityGraph;