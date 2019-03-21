import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';


import './EntityGraph.css';
// this.props.graphData
// this.props.nodeHint
// this.props.onNodeClick

// this.props.graphDataDict


function getGraphDataMemoizable() {
  let memoized = null;
  let graphData = null;
  return () => {
      if (memoized != this.props.graphObject) {
        memoized = this.props.graphObject;
        graphData = {
          nodes: Object.values(this.props.graphObject.nodes),
          links: Object.values(this.props.graphObject.links)
        };
      }
      return graphData;
    };
}



class EntityGraph extends Component {
  mouseX = 0
  mouseY = 0

  state = {
    nodeHint: null,
  }

  onMouseMoveHandler = () => {
      let mouseEventCounter = 0;
      return e => {
      if (mouseEventCounter > 3) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY - 120;
        this.mouseEventCounter = 0;
      } else {
        mouseEventCounter++;
      }
    }
  }

  onMouseOverNode = nodeId => {
    const node = this.props.graphObject.nodes[nodeId];
    if (node["name"]) {
      this.setState({nodeHint: `${node["labels"][0]}: ${node["name"]}`});
    } else {
      this.setState({nodeHint: node["labels"][0]});
    }
  }

  onMouseOutNode = () => {
    this.setState({nodeHint: undefined});
  }

  getGraphData = getGraphDataMemoizable.call(this)

  render() {
    const { graphConfig } = this.props;
    const { nodeHint } = this.state;

    return (
      <div className="entity_graph" onMouseMove={this.onMouseMoveHandler()}>
        {nodeHint &&
          <div className="entity_graph__hint" style={{left: this.mouseX+10, top: this.mouseY}}>
            {nodeHint}
          </div>
        }
        <Graph 
          id="graph" 
          data={this.getGraphData()} 
          config={graphConfig} 
          onMouseOverNode={this.onMouseOverNode} 
          onMouseOutNode={this.onMouseOutNode} 
        />
      </div>
    );
  }
}

export default EntityGraph;