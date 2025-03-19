const net = require("net");

let targetHost = "";
let speed = "-T3";
let startPort = 1;
let endPort = 1000;
let specificPorts = [];

const speeds = {
  "-T1": 2000,
  "-T2": 1000,
  "-T3": 500,
  "-T4": 200,
  "-T5": 50,
};

if (process.argv.length < 3) {
  console.log(
    "Usage: node scan.js -h <target-ip> [Options] {target specification}"
  );
  process.exit(1);
}

for (let args = 2; args < process.argv.length; args++) {
  if (process.argv[args][0] == "-") {
    if (process.argv[args][1] == "h") {
      targetHost = process.argv[args + 1];
    }

    if (process.argv[args][1] == "T") {
      speed = process.argv[args];
    }

    if (process.argv[args][1] == "p" && process.argv[args][2] == "-") {
      endPort = 65535;
    } else if (process.argv[args][1] == "p") {
      let argStart = args + 1;
      while (
        argStart < process.argv.length &&
        process.argv[argStart][0] != "-"
      ) {
        specificPorts.push(process.argv[argStart]);
        argStart++;
      }
    }
  }
}

console.log(specificPorts.length != 0);
console.log(specificPorts);

const timeout = speeds[speed] || 500;

console.log(
  `Scanning ${targetHost} Ports ${startPort}-${endPort} at speed ${speed}...\n`
);

let openPorts = [];
let activeConnections = 0;
const maxConnections = 100;

function scanPort(port) {
  const socket = new net.Socket();
  socket.setTimeout(timeout);

  socket.connect(port, targetHost, () => {
    console.log(`Port ${port} is OPEN`);
    openPorts.push(port);
    socket.destroy();
  });

  socket.on("error", () => socket.destroy());
  socket.on("timeout", () => socket.destroy());
}

async function scan() {
  const portsToScan =
    specificPorts.length > 0
      ? specificPorts
      : [...Array(endPort - startPort + 1).keys()].map((i) => startPort + i);

  for (let port of portsToScan) {
    if (activeConnections >= maxConnections) {
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }

    activeConnections++;
    scanPort(port);
    activeConnections--;
  }

  setTimeout(() => {
    console.log("\n Scan complete!");
    if (openPorts.length > 0) {
      console.log(`Open Ports: ${openPorts.join(", ")}`);
    } else {
      console.log("No open ports found.");
    }
  }, timeout);
}

scan();
