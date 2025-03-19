const net = require("net");

let targetHost = "";
let speed = "-T3";
let startPort = 1;
let endPort = 1000;
let specificPorts = [];

const speedSettings = {
  "-T1": { timeout: 2000, concurrency: 10 },
  "-T2": { timeout: 1000, concurrency: 20 },
  "-T3": { timeout: 500, concurrency: 50 },
  "-T4": { timeout: 200, concurrency: 100 },
  "-T5": { timeout: 50, concurrency: 200 },
};

if (process.argv.length < 3) {
  console.log(
    "Usage: node scan.js -h <target-ip> [Options]\n\nOptions:\n  -h <host>    Target host\n  -p <ports>   Specific port(s) or range (e.g., 80,443,1-100)\n  -p-          Scan all ports (1-65535)\n  -T<1-5>      Speed template (fastest: T5)"
  );
  process.exit(1);
}

for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === "-h") {
    targetHost = process.argv[++i];
  } else if (arg === "-p-") {
    startPort = 1;
    endPort = 65535;
  } else if (arg === "-p") {
    const ports = process.argv[++i];
    if (ports.includes(",")) {
      specificPorts.push(...ports.split(",").map((p) => parseInt(p)));
    } else if (ports.includes("-")) {
      const [start, end] = ports.split("-").map((p) => parseInt(p));
      specificPorts.push(
        ...Array.from({ length: end - start + 1 }, (_, i) => start + i)
      );
    } else {
      specificPorts.push(parseInt(ports));
    }
  } else if (arg.startsWith("-T")) {
    speed = arg in speedSettings ? arg : "-T3";
  }
}

const portsToScan =
  specificPorts.length > 0
    ? specificPorts.filter((p) => p >= 1 && p <= 65535)
    : Array.from({ length: endPort - startPort + 1 }, (_, i) => startPort + i);

if (!targetHost) {
  console.log("Error: Target host (-h) is required");
  process.exit(1);
}

const { timeout, concurrency } = speedSettings[speed] || speedSettings["-T3"];
let openPorts = [];
let currentIndex = 0;
let completed = 0;

function scanNextPort() {
  if (currentIndex >= portsToScan.length) return;

  const port = portsToScan[currentIndex++];
  const socket = new net.Socket().setTimeout(timeout);

  socket.connect(port, targetHost, () => {
    console.log(`Port ${port} is OPEN`);
    openPorts.push(port);
    socket.destroy();
    checkCompletion();
    scheduleNext();
  });

  socket.on("error", () => {
    socket.destroy();
    checkCompletion();
    scheduleNext();
  });

  socket.on("timeout", () => {
    socket.destroy();
    checkCompletion();
    scheduleNext();
  });
}

function scheduleNext() {
  if (currentIndex < portsToScan.length) {
    process.nextTick(scanNextPort);
  }
}

function checkCompletion() {
  if (++completed === portsToScan.length) {
    console.log("\nScan complete!");
    console.log(
      openPorts.length > 0
        ? `Open ports: ${openPorts.join(", ")}`
        : "No open ports found"
    );
  }
}

console.log(
  `Scanning ${targetHost} (${portsToScan.length} ports) at ${speed} speed...\n`
);
for (let i = 0; i < Math.min(concurrency, portsToScan.length); i++) {
  scanNextPort();
}
