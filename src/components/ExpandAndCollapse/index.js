import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

import "./index.css";

import CardPlus from "../card";
const initialNodes = [
  {
    id: "1",
    name: "a",
    children: [
      {
        id: "2",
        name: "left 1",
        parent: "1",
        children: [
          {
            id: "2.1",
            name: "c",
            parent: "2",
            children: [
              {
                id: "2.1.1",
                parent: "2.1",
                name: "d",
              },
              {
                id: "2.1.2",
                parent: "2.1",
                name: "d",
              }
            ],
          },
          {
            id: "2.2",
            name: "c",
            parent: "2",
            children: [
              {
                id: "2.2.1",
                parent: "2.2",
                name: "d",
              },
              {
                id: "2.2.2",
                parent: "2.2",
                name: "d",
              }
            ],
          },
        ],
      },
      {
        id: "3",
        name: "right 1",
        parent: "1",
        children: [
          {
            id: "3.1",
            name: "c",
            parent: "3",
            children: [
              {
                id: "3.1.1",
                parent: "3.1",
                name: "d",
              },
              {
                id: "3.1.2",
                parent: "3.1",
                name: "d",
              }
            ],
          },
          {
            id: "3.2",
            name: "c",
            parent: "3",
            children: [
              {
                id: "3.2.1",
                parent: "3.2",
                name: "d",
              },
              {
                id: "3.2.2",
                parent: "3.2",
                name: "d",
              }
            ],
          },
        ],
      },
    ],
  },
];

const initialEdges = [
  {
    id: "edges-e5-7",
    source: "0",
    target: "1",
    animated: true,
    label: "+",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#FFCC00", color: "#fff", fillOpacity: 0.7 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

let id = 1;
const getId = () => `${id++}`;

const fitViewOptions = {
  padding: 1,
};

const ExpandAndCollapse = (props) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  useEffect(() => {
    setNodes([
      ...initialNodes.map((item) => {
        return {
          id: item.id,
          type: "card",//item?.children?.length ? "input" : "output",
          data: { label: item.name, children: item.children },
          position: { x: 0, y: 0 },
          sourcePosition: "bottom",
          targetPosition: "top",
          animated: true,
        };
      }),
    ]);
  }, []);

  const handleNodeClick = (e, data) => {
    const findChildren = nodes.filter((item) => item?.data?.parent === data.id);
    if (!findChildren.length) {
      const itemChildren = [
        ...data.data.children.map((item, i) => {
          return {
            id: item.id,
            type: "card",//item?.children?.length ? "default" : "output",
            data: {
              label: item.name,
              children: item.children,
              parent: item.parent,
            },
            position: {
              x: i === 0 ? data.position.x - 200 : data.position.x + 200,
              y: i === 0 ? data.position.y + 100 : data.position.y + 100,
            },
            sourcePosition: "bottom",
            targetPosition: i === 0 ? "right" : "left",
          };
        }),
      ];
      setEdges([
        ...edges,
        ...itemChildren.map((item) => {
          return {
            id: String(parseInt(Math.random(100000000) * 1000000)),
            source: item?.data?.parent,
            target: item?.id,
            animated: true,
            type: "smoothstep",
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          };
        }),
      ]);
      setNodes(nodes.concat(itemChildren));
    } else {
      setNodes([...nodes.filter((item) => item?.data?.parent !== data.id)]);
      setEdges([...edges.filter((item) => data.id !== item.source)]);
    }
  };
  const nodeTypes = {
    card: CardPlus,
  };
  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
      />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <ExpandAndCollapse />
  </ReactFlowProvider>
);

 
  