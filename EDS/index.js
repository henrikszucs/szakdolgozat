const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const url = require('url');
const mimeTypes = {
      "html": "text/html",
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png",
      "svg": "image/svg+xml",
      "json": "application/json",
      "js": "text/javascript",
      "css": "text/css"
};

let server = null;

//Default values
let started = false;
let folder_path = path.join(__dirname, "addon_folder");
let port = 8000;
let key_path = path.join(__dirname, "server.key");
let cert_path = path.join(__dirname, "server.crt");

//Interactivity
let status = null;
let folder_select = null;
let folder_info = null;
let port_select = null;
let key_select = null;
let key_info = null;
let cert_select = null;
let cert_info = null;
let start_btn = null;

window.addEventListener('load', () => {
      status = document.getElementById("status");
      folder_select = document.getElementById("folder_select");
      folder_info = document.getElementById("folder_info");
      folder_info.innerHTML = folder_path;
      port_select = document.getElementById("port_select");
      port_select.value = port;
      key_select = document.getElementById("key_select");
      key_info = document.getElementById("key_info");
      key_info.innerHTML = key_path;
      cert_select = document.getElementById("cert_select");
      cert_info = document.getElementById("cert_info");
      cert_info.innerHTML = cert_path;
      start_btn = document.getElementById("start_btn");

      folder_select.addEventListener('click', async () => {
            if (!started) {
                  const { port1, port2 } = new MessageChannel()

                  ipcRenderer.postMessage('openFolder', {}, [port2]);
                  
                  port1.onmessage = (event) => {
                        if (event.data !== null) {
                              folder_path = event.data;
                              folder_info.innerHTML = folder_path;
                        }
                  }
            }
      });

      key_select.addEventListener('click', async () => {
            if (!started) {
                  const { port1, port2 } = new MessageChannel()

                  ipcRenderer.postMessage('openFile', {}, [port2]);

                  port1.onmessage = (event) => {
                        if (event.data !== null) {
                              key_path = event.data;
                              key_info.innerHTML = key_path;
                        }
                  }
            }
      });

      cert_select.addEventListener('click', async () => {
            if (!started) {
                  const { port1, port2 } = new MessageChannel()

                  ipcRenderer.postMessage('openFile', {}, [port2]);

                  port1.onmessage = (event) => {
                        if (event.data !== null) {
                              cert_path = event.data;
                              cert_info.innerHTML = cert_path;
                        }
                  }
            }
      });

      start_btn.addEventListener('click', async () => {
            if (!started) {
                  started = true;
                  status.innerHTML = "Online: https://localhost:" + port + "/addon.json";
                  start_btn.value = "Stop";
                  const options = {
                        key: fs.readFileSync(key_path),
                        cert: fs.readFileSync(cert_path)
                  };

                  server = https.createServer(options, (req, res) => {
                        //res.writeHead(200);
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.setHeader("Pragma", "no-cache");
                        res.setHeader("Cache-Control", "max-age=0, no-cache, no-store, must-revalidate");
                        res.setHeader("Expires", "Thu, 1 Jan 1970 00:00:00 GMT");
                        const req_path = path.join(folder_path, url.parse(req.url, true).pathname);
                        if (fs.existsSync(req_path)) {
                              const extension = req_path.split('.').pop();
                              let mimeType = mimeTypes[extension];
                              if (!mimeType) {
                                    mimeType = 'text/plain';
                              }
                              /*console.log(extension);
                              console.log(mimeType);*/
                              res.setHeader("Content-Type", mimeType);

                              const readStream = fs.createReadStream(req_path);
                              readStream.pipe(res);
                        }
                        //res.end('hello world\n');
                  }).listen(port);
                  
            } else {
                  started = false;
                  status.innerHTML = "Offline";
                  start_btn.value = "Start";
                  server.close();
            }
      });
});