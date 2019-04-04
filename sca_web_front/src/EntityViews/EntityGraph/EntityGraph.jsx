import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';

import NodeHint from './NodeHint';

import './EntityGraph.css';
// this.props.graphData
// this.props.nodeHint
// this.props.onNodeClick
// this.props.graphDataDict
// this.props.hintExtractor(Node n)


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
    if (typeof(this.props.hintExtractor) === "function") {
      return this.props.hintExtractor(node)
    }
    return <span>this.props.node["id"]</span>
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

  onNodeClick = (nodeId) => {
    console.log("click");
    if (typeof(this.props.onNodeClick) === "function") {
      this.props.onNodeClick(this.props.graphObject.nodes[nodeId]);
    }
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
          onClickNode={this.onNodeClick}
        />
      </div>
    );
  }
}

export default EntityGraph;