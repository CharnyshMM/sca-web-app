import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';

import NodeHint from './NodeHint';

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
    mouseOverNode: false,
    mouseOverHint: false,
  }

  createOnMouseMoveHandler = () => {
      let mouseEventCounter = 0;
      return e => {
      if (mouseEventCounter > 2) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY - 120;
        this.mouseEventCounter = 0;
      } else {
        mouseEventCounter++;
      }
    }
  }

  getNodeHintText = node => {
    let nodeHint = "";

    if (node["name"]) {
      nodeHint = `${node["labels"][0]}: ${node["name"]}`;
    } else {
      nodeHint = node["labels"];
    }

    if (node["href"]) {
      return <span>
        {nodeHint} 
        <br />
        <a href={node["href"]}>More</a>
        </span>
    } else {
      return <span>{nodeHint}</span>
    }
  }

  onMouseOverNode = nodeId => {
    const node = this.props.graphObject.nodes[nodeId];
    this.setState({
      nodeHint: this.getNodeHintText(node),
      mouseOverNode: true
    });
  }

  onMouseOverHint = () => {
    console.log("OVERHINT");
    this.setState({mouseOverHint: true});
  }

  onMouseLeaveHint = () => {
    this.setState({mouseOverHint: false});
  }

  onMouseOutNode = () => {
    this.setState({
      mouseOverNode: false
    });
  }

  getGraphData = getGraphDataMemoizable.call(this)

  render() {
    const { graphConfig } = this.props;
    const { nodeHint, mouseOverHint, mouseOverNode } = this.state;
    const hintIsVisible = mouseOverHint || mouseOverNode;
    const hintX = this.mouseX;
    const hintY = this.mouseY;

    return (
      <div className="entity_graph" onMouseMove={this.createOnMouseMoveHandler()}>
        {hintIsVisible &&
          <NodeHint 
            left={hintX} 
            top={hintY}
            onMouseEnter={this.onMouseOverHint}
            onMouseLeave={this.onMouseLeaveHint}
            >
            {nodeHint}
          </NodeHint>
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