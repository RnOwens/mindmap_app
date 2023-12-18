import React, { useEffect, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import './App.css';

function MindMap() {
  const [network, setNetwork] = useState(null);
  const [nodes, setNodes] = useState(new DataSet([
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
  ]));
  const [edges, setEdges] = useState(new DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
  ]));
  const [selectedNode, setSelectedNode] = useState(null);
  const [newLabel, setNewLabel] = useState('');
  const [isTree, setIsTree] = useState(false); // Add this line

  useEffect(() => {
    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      physics: {
        stabilization: {
          enabled:true,
          iterations:500
        },
        barnesHut: {
          gravitationalConstant: -300,
          centralGravity: 0.2,
          springLength: 75,
          springConstant: 0.04,
          damping: 0.3,
          avoidOverlap: 0
        }
      },
      edges: {
        smooth: false
      },
      layout: {
        hierarchical: {
          enabled: false,
          direction: 'UD', // Up-Down direction
          sortMethod: 'directed' // Directed sorting method
        }
      }
    };
    var networkInstance = new Network(container, data, options);
    setNetwork(networkInstance);

    // add event listener for selectNode event
    networkInstance.on('selectNode', function(params) {
      setSelectedNode(params.nodes[0]);
    });
  }, []);

  const handleAddNode = () => {
    const id = nodes.length + 1;
    nodes.add({id, label: `Node ${id}`});
  };

  const handleEditNode = () => {
    nodes.update({id: selectedNode, label: newLabel});
    setNewLabel('');
    setSelectedNode(null);
  };

  const handleDeleteNode = () => {
    nodes.remove(selectedNode);
    setSelectedNode(null);
  };

  const handleAddEdge = () => {
    network.addEdgeMode();
  };

  const toggleTreeMode = () => {
    setIsTree(!isTree);
    network.setOptions({
      physics: {
        enabled: !isTree,
        hierarchicalRepulsion: {
          nodeDistance: 120
        },
        solver: isTree ? 'barnesHut' : 'hierarchicalRepulsion'
      },
      layout: {
        hierarchical: {
          enabled: isTree,
          direction: 'UD',
          sortMethod: 'directed'
        }
      }
    });
  };

  const [nodeShape, setNodeShape] = useState('ellipse');

  const handleChangeShape = (event) => {
    const newShape = event.target.value;
    setNodeShape(newShape);
    nodes.update({id: selectedNode, shape: newShape});
  };

  const [nodeColor, setNodeColor] = useState('white');

  const handleChangeColor = (event) => {
    const newColor = event.target.value;
    const borderColor = 'black'; // set border color to black
    setNodeColor(newColor);
    nodes.update({
      id: selectedNode,
      color: {
        border: borderColor,
        background: newColor,
        highlight: {
          border: borderColor,
          background: newColor
        },
        hover: {
          border: borderColor,
          background: newColor
        }
      }
    });
  };

  return (
    <div>
      <div id="mynetwork"></div>
      <div>
        <button onClick={handleAddNode}>Add Node</button>
        <input className="label1" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="New label" />
        <button onClick={handleEditNode} disabled={!selectedNode}>Edit Node</button>
        <button onClick={handleDeleteNode} disabled={!selectedNode}>Delete Node</button>
        <button onClick={handleAddEdge}>Add Edge</button>
        <button onClick={toggleTreeMode}>{isTree ? 'Loose Map Mode' : 'Tree Mode'}</button>
        <select value={nodeShape} onChange={handleChangeShape} disabled={!selectedNode}>
          <option value="ellipse">Ellipse</option>
          <option value="circle">Circle</option>
          <option value="box">Box</option>
          <option value="diamond">Diamond</option>
          <option value="star">Star</option>
          <option value="triangle">Triangle</option>
          <option value="triangleDown">Triangle Down</option>
          <option value="hexagon">Hexagon</option>
          <option value="square">Square</option>
          <option value="database">Database</option>
        </select>
        <select value={nodeColor} onChange={handleChangeColor} disabled={!selectedNode}>
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="indigo">Indigo</option>
          <option value="violet">Violet</option>
        </select>
      </div>
    </div>
  );
}

export default MindMap;