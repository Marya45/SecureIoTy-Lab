import React from "react";

const Toolbar = ({ onDropElement, toggleEraseMode, isEraseMode }) => {
  const tools = [
    { src: "images/test1.png" },
    { src: "images/test2.png" },
    { src: "images/test3.png" },
    { src: "images/test4.png" },
  ];

  const handleDragStart = (e, tool) => {
    e.dataTransfer.setData("tool", JSON.stringify(tool));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "110px",
        backgroundColor: "rgb(240, 240, 240)",
        borderRight: "1px solid #ccc",
        overflowY: "auto",
        marginTop: "0px",
        border: "1px solid lightgrey",
      }}
    >
      {tools.map((tool, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => handleDragStart(e, tool)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70px", // Set a consistent height for the tool icons
            padding: "10px",
            margin: "5px",
            backgroundColor: "rgb(240, 240, 240)",
            textAlign: "center",
            border: "1px solid lightgrey",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          <img
            src={tool.src}
            alt={`Tool ${index + 1}`}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70px", // Same height as the tool icons
          padding: "10px",
          margin: "5px",
          backgroundColor: isEraseMode ? "red" : "grey",
          color: "white",
          textAlign: "center",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onClick={toggleEraseMode}
      >
        {isEraseMode ? "Erase Mode On" : "Erase Mode Off"}
      </div>
    </div>
  );
};

export default Toolbar;
