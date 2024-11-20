const express = require("express");
const cors = require("cors");
const { Client } = require("ssh2");
const WebSocket = require("ws");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const wss = new WebSocket.Server({ noServer: true });

// Dictionary to store WebSocket connections by IP address
const sshConnections = {};

app.post("/connect", (req, res) => {
  const { ip } = req.body;

  // If an SSH connection for this IP already exists, close it
  if (sshConnections[ip]) {
    sshConnections[ip].end();
    delete sshConnections[ip];
  }

  const conn = new Client();
  sshConnections[ip] = conn;

  conn
    .on("ready", () => {
      console.log(`SSH connection to ${ip} established.`);
      res.send("SSH connection established");

      // Listen for new WebSocket connections
      wss.once("connection", (ws) => {
        conn.shell((err, stream) => {
          if (err) {
            console.error(`Shell error: ${err.message}`);
            ws.send(`Shell error: ${err.message}`);
            return;
          }

          // Relay data from SSH stream to WebSocket
          stream.on("data", (data) => ws.send(data.toString()));

          // Send WebSocket messages to the SSH stream
          ws.on("message", (msg) => stream.write(msg));

          // Close connections when WebSocket closes
          ws.on("close", () => {
            console.log(`WebSocket connection closed for ${ip}`);
            stream.end();
          });

          // Close SSH connection when stream closes
          stream.on("close", () => {
            console.log(`SSH shell closed for ${ip}`);
            ws.close();
            delete sshConnections[ip];
          });
        });
      });
    })
    .on("error", (err) => {
      console.error(`SSH error: ${err.message}`);
      res.status(500).send(`SSH connection error: ${err.message}`);
    })
    .connect({
      host: ip,
      port: 22,
      username: "pi",
      password: "raspberry",
    });
});

// Upgrade HTTP connection to WebSocket
const server = app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
