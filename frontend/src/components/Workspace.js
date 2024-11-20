import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line , Circle, Text, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import Draggable from "react-draggable";
import "./custompage.css";

const piAddresses = [
  { id: 0, ip: "192.168.56.101", name: "Raspberry Pi 1" },
  { id: 1, ip: "192.168.56.102", name: "Raspberry Pi 2" },
];

const Workspace = ({
  elements,
  setElements,
  connections,
  addConnection,
  deleteConnection,
  isEraseMode,
}) => {

  const [isConnecting, setIsConnecting] = useState(false);
  const [startConnection, setStartConnection] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null); // State to store the selected device

  const [activePis, setActivePis] = useState([]); // Store multiple active Pis
  const terminalRefs = useRef({}); // Store terminal instances by Pi id
  const fitAddons = useRef({}); // Store FitAddon instances by Pi id
  const stageRef = useRef(null);
  const [wsConnections, setWsConnections] = useState({}); // Store WebSocket instances


  const handleConnectionStart = (element, pointIndex) => {
    setStartConnection({ element, pointIndex });
    setIsConnecting(true);
  };

  const handleConnectionEnd = (element, pointIndex) => {
    if (isConnecting && startConnection) {
      const startElement = startConnection.element;
      const startPoint =
        getConnectionPoints(startElement)[startConnection.pointIndex];
      const endPoint = getConnectionPoints(element)[pointIndex];

      const points = [startPoint, { x: startPoint.x, y: endPoint.y }, endPoint];

      addConnection({
        start: startConnection,
        points: points,
        end: { element, pointIndex },
      });

      setStartConnection(null);
      setIsConnecting(false);
    }
  };

  const getConnectionPoints = (element) => [
    { x: element.x + 25, y: element.y },
    { x: element.x + 50, y: element.y + 25 },
    { x: element.x + 25, y: element.y + 50 },
    { x: element.x, y: element.y + 25 },
  ];

  const updateElementPosition = (id, newPosition) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, ...newPosition } : el))
    );
  };

  const handleLineClick = (index) => {
    if (isEraseMode) {
      deleteConnection(index);
    }
  };

const handleDoubleClick = (element) => {
    const piDevice = piAddresses.find((pi) => pi.id === element.id);
    if (piDevice) {
        setActivePis((prev) => [...prev, piDevice]); // Set active Raspberry Pi
      const terminalId = `terminal-${element.id}`; // Create a unique terminal ID
      // Connect to the backend with the terminalId
      fetch("http://localhost:3001/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ip: piDevice.ip, terminalId }),
      });
    }
  };
  

const closeTerminal = (piId) => {
    setActivePis((prev) => prev.filter((pi) => pi.id !== piId));
  
    if (wsConnections[piId]) {
      wsConnections[piId].close();
      setWsConnections((prev) => {
        const updatedConnections = { ...prev };
        delete updatedConnections[piId];
        return updatedConnections;
      });
    }
  };


    // Effect to manage WebSocket and terminal instances for activePis
useEffect(() => {
    activePis.forEach((piDevice) => {
      if (!wsConnections[piDevice.id]) {
        // const term = new Terminal();
        // // term.loadAddon(new FitAddon());
        // // term.open(document.getElementById(`terminal-${piDevice.id}`));
        // const fitAddon = new FitAddon();
        // term.loadAddon(fitAddon);
        // term.open(document.getElementById(`terminal-${piDevice.id}`));
        // fitAddon.fit();

        const term = new Terminal();
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        const terminalElement = document.getElementById(`terminal-${piDevice.id}`);
        term.open(terminalElement);
        fitAddon.fit();
  
        fetch("http://localhost:3001/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ip: piDevice.ip }),
        })
          .then((response) => {
            if (!response.ok) throw new Error("Failed to connect via SSH");
  
            const socket = new WebSocket("ws://localhost:3001");
            setWsConnections((prev) => ({ ...prev, [piDevice.id]: socket }));
  
            socket.onopen = () => term.writeln(`Connected to ${piDevice.name}`);
            // socket.onmessage = (event) => term.write(event.data);
            // term.onData((input) => socket.send(input));
            socket.onmessage = (event) => {
              // Debugging: Log the received data to ensure it's not doubled
              console.log('Received:', event.data);
              term.write(event.data);
              fitAddon.fit();
            };
  
            // Ensure onData is only bound once
            term.onData((input) => {
              // Log the input to see if it's being triggered twice
              console.log('Input sent:', input);
              socket.send(input);
            });
            socket.onclose = () => term.writeln("Connection closed.");
          })
          .catch((error) => term.writeln(`Error: ${error.message}`));
      }
    });
  
    return () => {
      Object.values(wsConnections).forEach((socket) => socket.close());
    };
  }, [activePis]);

  const handleDrop = (e) => {
    e.preventDefault();
    
    // Verify stageRef and pointerPosition before proceeding
    if (!stageRef.current) {
      console.error("Stage reference is null");
      return;
    }
    
    const stage = stageRef.current.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (!pointerPosition) {
      console.error("Pointer position is not available");
      return;
    }

    const tool = JSON.parse(e.dataTransfer.getData("tool"));
    const name = prompt("Enter device name:");
    
    if (!tool || !name) {
      return;
    }

    setElements((prevElements) => [
      ...prevElements,
      {
        ...tool,
        x: pointerPosition.x,
        y: pointerPosition.y,
        id: prevElements.length,
        name: name,
      },
    ]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(240, 240, 240)",
        overflow: "auto",
        position: "relative",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
        <Layer>
          {elements.map((element) => (
            <URLImage
              key={element.id}
              element={element}
              onDoubleClick={() => handleDoubleClick(element)}
              connectionPoints={getConnectionPoints(element)}
              onConnectionStart={(pointIndex) =>
                handleConnectionStart(element, pointIndex)
              }
              onConnectionEnd={(pointIndex) =>
                handleConnectionEnd(element, pointIndex)
              }
              onDragMove={(e) => {
                updateElementPosition(element.id, {
                  x: e.target.x(),
                  y: e.target.y(),
                });
              }}
            />
          ))}
          {connections.map((connection, index) => (
            <Line
              key={index}
              points={connection.points.flatMap(({ x, y }) => [x, y])}
              stroke="black"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
              onClick={() => handleLineClick(index)}
            />
          ))}
        </Layer>
      </Stage>

      {activePis.map((activePi) => (
        <Draggable key={activePi.id}>
          <div
            className="terminal-overlay"
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              width: "600px",
              height: "400px",
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0 }}>Terminal for {activePi.name}</h2>
              <button
                onClick={() => closeTerminal(activePi.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>
            <div
              id={`terminal-${activePi.id}`}
              className="terminal-container"
              style={{
                width: "100%",
                height: "calc(100% - 30px)",
                // height: "350px",
                overflow: "hidden",
              }}
            ></div>
          </div>
        </Draggable>
      ))}
    </div>
  );
};

// Image component with double-click event handler
const URLImage = ({ element, onDoubleClick,
  connectionPoints,
  onConnectionStart,
  onConnectionEnd,
  onDragMove,
 }) => {
  const [image] = useImage(element.src);

  return (
    <React.Fragment>
      <KonvaImage
        image={image}
        x={element.x}
        y={element.y}
        width={50}
        height={50}
        draggable
        onDragMove={onDragMove}
        onDblClick={onDoubleClick} // Add double-click event
      />
      {connectionPoints.map((point, index) => (
        <Circle
          key={index}
          x={point.x}
          y={point.y}
          radius={5}
          fill="red"
          draggable={false}
          onMouseDown={() => onConnectionStart(index)}
          onMouseUp={() => onConnectionEnd(index)}
        />
      ))}
      <Text
        text={element.name || ""}
        x={element.x}
        y={element.y + 50}
        width={50}
        align="center"
        fontSize={12}
        fill="black"
      />
    </React.Fragment>
  );
};

export default Workspace;
