// import React, { useState, useEffect, useRef } from "react";
// import Toolbar from "./components/Toolbar";
// import Workspace from "./components/Workspace";
// import Summary from "./components/Summary";

// function App() {

//   const [elements, setElements] = useState([]);
//   const [connections, setConnections] = useState([]);
//   const [isEraseMode, setIsEraseMode] = useState(false);

//   const addElement = (element) => {
//     setElements((prevElements) => [...prevElements, element]);
//   };

//   const addConnection = (connection) => {
//     setConnections((prevConnections) => [...prevConnections, connection]);
//   };

//   const deleteConnection = (index) => {
//     setConnections((prevConnections) => {
//       const updatedConnections = prevConnections.filter((_, i) => i !== index);

//       // Get the elements that have connections
//       const elementsWithConnections = updatedConnections.flatMap(
//         (connection) => [connection.start.element.id, connection.end.element.id]
//       );
//       const uniqueElementsWithConnections = [
//         ...new Set(elementsWithConnections),
//       ];

//       // Filter out elements that have no connections
//       const updatedElements = elements.filter((element) =>
//         uniqueElementsWithConnections.includes(element.id)
//       );

//       setElements(updatedElements);

//       return updatedConnections;
//     });
//   };

//   const toggleEraseMode = () => {
//     setIsEraseMode((prevMode) => !prevMode);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100vh",
//         fontFamily: "Arial, sans-serif",
//         position: "relative",
//       }}
//     >
//       <div
//         style={{
//           padding: "10px",
//           backgroundColor: "#e0e0e0",
//           borderBottom: "1px solid #ccc",
//           fontSize: "14px",
//           color: "#333",
//           position: "absolute",
//           top: "0",
//           left: "0",
//           width: "100%",
//           height: "20px",
//           zIndex: "10",
//           textAlign: "left",
//         }}
//       >
//         <b>SecureIoTy Lab</b>
//       </div>
//       <div
//         style={{
//           display: "flex",
//           width: "100%",
//           height: "calc(100vh - 40px)",
//           marginTop: "40px",
//         }}
//       >
//         <Toolbar
//           onDropElement={addElement}
//           toggleEraseMode={toggleEraseMode}
//           isEraseMode={isEraseMode}
//         />
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             flex: 1,
//             overflow: "auto",
//           }}
//         >
//           <Workspace
//             elements={elements}
//             connections={connections}
//             addConnection={addConnection}
//             deleteConnection={deleteConnection}
//             isEraseMode={isEraseMode}
//             setElements={setElements} // Pass setElements here
//           />
//         </div>
//         <Summary />
//       </div>
//     </div>
//   );
// }

// export default App;





import React, { useState } from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Mitm from './components/mitm';
import Bruteforce from './components/bruteforce';
import Custompage from './components/custompage'

// function MainPage() {
//   const [showPredefinedOptions, setShowPredefinedOptions] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Welcome to the Network Simulator</h1>
//       <div style={{ marginTop: '20px' }}>
//         <button 
//           style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
//           onClick={() => navigate('/custompage')}
//         >
//           Custom Network
//         </button>
        
//         <button 
//           style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
//           onClick={() => setShowPredefinedOptions(true)}
//         >
//           Predefined Network
//         </button>
//       </div>

//       {showPredefinedOptions && (
//         <div style={{ marginTop: '20px' }}>
//           <button 
//             style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
//             onClick={() => navigate('/mitm')}
//           >
//             MITM
//           </button>
          
//           <button 
//             style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
//             onClick={() => navigate('/bruteforce')}
//           >
//             Brute Force
//           </button>
          
//           <button 
//             style={{ marginTop: '20px', padding: '5px 15px', fontSize: '14px' }}
//             onClick={() => setShowPredefinedOptions(false)}
//           >
//             Go Back
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function CustomNetwork() {
//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h2>Custom Network Page</h2>
//       <Link to="/" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', fontSize: '16px', textDecoration: 'none', backgroundColor: '#ddd' }}>
//         Go Back to Main Page
//       </Link>
//     </div>
//   );
// }

// function PredefinedNetwork({ type }) {
//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h2>{type === 'mitm' ? 'MITM' : 'Brute Force'} Network Page</h2>
//       <Link to="/" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', fontSize: '16px', textDecoration: 'none', backgroundColor: '#ddd' }}>
//         Go Back to Main Page
//       </Link>
//     </div>
//   );
// }

function MainPage() {
  const [showPredefinedOptions, setShowPredefinedOptions] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <div className="container">
        <h1>Welcome to SecureIoTy Lab</h1>
        <h3>A virtual lab designed to help you learn and practice security attacks.</h3>
        <div>
          <button onClick={() => navigate('/custompage')}>
            Custom Network
          </button>
          
          <button onClick={() => setShowPredefinedOptions(true)}>
            Predefined Network
          </button>
        </div>

        {showPredefinedOptions && (
          <div>
            <button onClick={() => navigate('/mitm')}>
              MITM
            </button>
            
            <button onClick={() => navigate('/bruteforce')}>
              Brute Force
            </button>
            
            <button className="back-button" onClick={() => setShowPredefinedOptions(false)}>
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/custompage" element={<Custompage />} />
        <Route path="/mitm" element={<Mitm />} />
        <Route path="/bruteforce" element={<Bruteforce />} />
      </Routes>
    </Router>
  );
}

export default App;
