````markdown
# Node.js Port Scanner

A lightweight TCP port scanner built with Node.js net module, featuring configurable scanning speeds and port ranges.

![Port Scanner Demo](https://via.placeholder.com/800x400.png?text=Port+Scanner+Demo)

## Features

- Multiple scanning speed templates (T1-T5)
- CIDR notation support for target specification
- Custom port ranges (e.g., 80-443)
- Comma-separated port lists
- Full port scanning (1-65535)
- Concurrent connection management
- Configurable timeouts

## Installation

1. Ensure you have Node.js (v14+) installed

```bash
node --version
```
````

2. Clone the repository

```bash
git clone https://github.com/yourusername/node-port-scanner.git
cd node-port-scanner
```

## Usage

### Basic Scan

```bash
node scan.js -h 192.168.1.1
```

### Scan Specific Ports

```bash
node scan.js -h 10.0.0.5 -p 80,443,8000-8100
```

### Full Port Scan

```bash
node scan.js -h 192.168.1.100 -p- -T5
```

### Custom Range Scan

```bash
node scan.js -h 172.16.0.10 -p 1-1024 -T4
```

## Options

| Option | Description                                |
| ------ | ------------------------------------------ |
| `-h`   | Target host (required)                     |
| `-p`   | Port(s) to scan (comma-separated or range) |
| `-p-`  | Scan all ports (1-65535)                   |
| `-T`   | Speed template (0-5, default: 3)           |

## Speed Templates

| Template | Timeout | Concurrent | Description        |
| -------- | ------- | ---------- | ------------------ |
| `-T1`    | 2000ms  | 10         | Paranoid (slowest) |
| `-T2`    | 1000ms  | 20         | Polite             |
| `-T3`    | 500ms   | 50         | Normal (default)   |
| `-T4`    | 200ms   | 100        | Aggressive         |
| `-T5`    | 50ms    | 200        | Insane (fastest)   |

## Technical Notes

- Scans TCP ports only
- Requires network access to target host
- Results may vary based on network conditions
- Not a full replacement for nmap/zmap
- Use `-T5` with caution on unstable networks

## Legal Disclaimer

Port scanning without proper authorization may be illegal in many jurisdictions. This tool is intended for:

- Educational purposes
- Authorized security audits
- Network diagnostics on owned systems

The developer assumes no liability for misuse of this software. Always obtain proper authorization before scanning any network.

## Acknowledgments

- Inspired by classic network utilities
- Uses Node.js native net module
- Speed templates concept adapted from nmap

## License

MIT License - See [LICENSE](LICENSE) file
