# 01_speed

#### q

```
gemini i want to create a program that check internet speed with html css js front end in local network or internet
```

------


To measure internet or local network speed using an HTML, CSS, and JS frontend, you need to calculate how long it takes to transfer a known amount of data.

Because browser security rules (CORS) block JavaScript from downloading arbitrary files from random websites without permission, you have two main architectural choices depending on whether you are testing **local network speed (LAN)** or **public internet speed**.

---

### Option 1: Local Network (LAN) Speed Test (Best & Most Accurate)

To test the speed between your device and another computer/router on your local network (or a server you own), you host a tiny backend alongside your frontend. This bypasses all CORS restrictions and avoids external internet bottlenecks.

#### 1. Backend (`server.js` using Node.js)

Create a folder, run `npm init -y && npm install express`, and save this as `server.js`. It serves your frontend and provides endpoints for Ping, Download, and Upload.

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

// Serve static HTML/CSS/JS from a 'public' folder
app.use(express.static('public'));

// 1. Ping Endpoint
app.get('/ping', (req, res) => {
    res.send('pong');
});

// 2. Download Endpoint (Generates random data on the fly)
// Default: 25 MB
const downloadBuffer = crypto.randomBytes(25 * 1024 * 1024); 
app.get('/download', (req, res) => {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.send(downloadBuffer);
});

// 3. Upload Endpoint (Receives data and discards it)
app.post('/upload', express.raw({ type: '*/*', limit: '100mb' }), (req, res) => {
    res.json({ receivedBytes: req.body.length });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Speed test server running at http://localhost:${PORT}`);
});

```

#### 2. Frontend (`public/index.html`)

Place this inside a `public` folder next to `server.js`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Network Speed Test</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .card {
            background: #1e293b;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            text-align: center;
            width: 350px;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin: 2rem 0;
        }
        .metric-box {
            background: #0f172a;
            padding: 1rem 0.5rem;
            border-radius: 8px;
        }
        .value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #38bdf8;
        }
        .label {
            font-size: 0.75rem;
            color: #94a3b8;
            text-transform: uppercase;
            margin-top: 0.25rem;
        }
        button {
            background: #38bdf8;
            color: #0f172a;
            border: none;
            padding: 0.75rem 2rem;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
            width: 100%;
        }
        button:hover { background: #7dd3fc; }
        button:disabled { background: #475569; cursor: not-allowed; }
        #status { margin-top: 1rem; font-size: 0.875rem; color: #94a3b8; }
    </style>
</head>
<body>

<div class="card">
    <h2>Speed Test</h2>
    <div class="metrics">
        <div class="metric-box">
            <div class="value" id="ping">--</div>
            <div class="label">Ping (ms)</div>
        </div>
        <div class="metric-box">
            <div class="value" id="download">--</div>
            <div class="label">Down (Mbps)</div>
        </div>
        <div class="metric-box">
            <div class="value" id="upload">--</div>
            <div class="label">Up (Mbps)</div>
        </div>
    </div>
    <button id="startBtn" onclick="runSpeedTest()">Start Test</button>
    <div id="status">Ready</div>
</div>

<script>
    const statusEl = document.getElementById('status');
    const startBtn = document.getElementById('startBtn');

    async function measurePing() {
        statusEl.textContent = 'Testing Ping...';
        let totalPing = 0;
        const attempts = 5;

        for (let i = 0; i < attempts; i++) {
            const start = performance.now();
            await fetch('/ping?t=' + Date.now(), { cache: 'no-store' });
            const end = performance.now();
            totalPing += (end - start);
        }
        return (totalPing / attempts).toFixed(1);
    }

    async function measureDownload() {
        statusEl.textContent = 'Testing Download...';
        const start = performance.now();
        const response = await fetch('/download?t=' + Date.now(), { cache: 'no-store' });
        const blob = await response.blob();
        const end = performance.now();

        const durationInSeconds = (end - start) / 1000;
        const bitsLoaded = blob.size * 8;
        const speedMbps = (bitsLoaded / durationInSeconds) / (1024 * 1024);
        return speedMbps.toFixed(2);
    }

    async function measureUpload() {
        statusEl.textContent = 'Testing Upload...';
        // Generate 10MB of dummy data in browser
        const sizeInBytes = 10 * 1024 * 1024;
        const dummyData = new Uint8Array(sizeInBytes);

        const start = performance.now();
        await fetch('/upload', {
            method: 'POST',
            body: dummyData,
            headers: { 'Content-Type': 'application/octet-stream' }
        });
        const end = performance.now();

        const durationInSeconds = (end - start) / 1000;
        const bitsUploaded = sizeInBytes * 8;
        const speedMbps = (bitsUploaded / durationInSeconds) / (1024 * 1024);
        return speedMbps.toFixed(2);
    }

    async function runSpeedTest() {
        startBtn.disabled = true;
        document.getElementById('ping').textContent = '--';
        document.getElementById('download').textContent = '--';
        document.getElementById('upload').textContent = '--';

        try {
            const ping = await measurePing();
            document.getElementById('ping').textContent = ping;

            const download = await measureDownload();
            document.getElementById('download').textContent = download;

            const upload = await measureUpload();
            document.getElementById('upload').textContent = upload;

            statusEl.textContent = 'Test Complete';
        } catch (err) {
            statusEl.textContent = 'Error: Ensure backend server is running.';
            console.error(err);
        } finally {
            startBtn.disabled = false;
        }
    }
</script>
</body>
</html>

```

**How to run it:**

1. Run `node server.js` on your host computer.
2. Open `http://localhost:3000` on that computer, or open `http://<YOUR_LOCAL_IP>:3000` (e.g., `[http://192.168.1.50:3000](http://192.168.1.50:3000)`) from your phone or another laptop on the same Wi-Fi to measure your local router/LAN speed.

---

### Option 2: Pure Frontend (Public Internet Speed Only)

If you **cannot** run a backend server and want a single `.html` file that runs purely in the browser to test your public internet connection, you can point `fetch()` at public CDNs that allow CORS (such as Cloudflare's speed test endpoints or Wikimedia Commons).

Replace the three `measure*` functions in the HTML above with these:

```javascript
async function measurePing() {
    statusEl.textContent = 'Testing Ping...';
    const start = performance.now();
    await fetch('https://speed.cloudflare.com/__down?bytes=0', { cache: 'no-store' });
    return (performance.now() - start).toFixed(1);
}

async function measureDownload() {
    statusEl.textContent = 'Testing Download...';
    const bytes = 25000000; // 25 MB
    const start = performance.now();
    const res = await fetch(`https://speed.cloudflare.com/__down?bytes=${bytes}`, { cache: 'no-store' });
    await res.blob();
    const duration = (performance.now() - start) / 1000;
    return ((bytes * 8) / duration / 1e6).toFixed(2);
}

async function measureUpload() {
    statusEl.textContent = 'Testing Upload...';
    const bytes = 10000000; // 10 MB
    const data = new Uint8Array(bytes);
    const start = performance.now();
    await fetch('https://speed.cloudflare.com/__up', {
        method: 'POST',
        body: data
    });
    const duration = (performance.now() - start) / 1000;
    return ((bytes * 8) / duration / 1e6).toFixed(2);
}

```

### Key Technical Details to Keep in Mind

* **Cache Busting (`?t=' + Date.now()`):** Browsers aggressively cache downloaded files. Appending a timestamp query parameter and setting `cache: 'no-store'` forces the browser to actually download the data over the network every time.
* **Bits vs. Bytes:** Network speeds are measured in **Megabits per second (Mbps)**, while file sizes are in **Bytes**. Always multiply bytes by `8` before dividing by time.
* **Parallel Connections:** Commercial speed tests (like Ookla) open 4 to 8 simultaneous `fetch` streams (`Promise.all`) to saturate high-speed fiber connections (500+ Mbps). If you have gigabit internet, a single `fetch` stream may cap out below your true maximum speed.

Would you like to expand this with real-time progress gauges (like an animated speedometer) or multi-stream parallel testing for gigabit connections?
