"use strict";
{
    let VARIABLE = ` + VARIABLE + `;
    {
        if (typeof(VARIABLE) !== "object") {
            VARIABLE = {};
        }
        if (typeof(VARIABLE["TITLE"]) === "undefined") {
            VARIABLE["TITLE"] = "";
        }
        if (typeof(VARIABLE["WINDOW_FRAME"]) === "undefined") {
            VARIABLE["WINDOW_FRAME"] = true;
        }
        if (typeof(VARIABLE["SINGLE_INSTANCE"]) === "undefined") {
            VARIABLE["SINGLE_INSTANCE"] = false;
        }
        if (typeof(VARIABLE["URL"]) === "undefined" || VARIABLE["URL"] === "") {
            VARIABLE["URL"] = "local://local.local/index.html";
        }
    };
    const electron = require("electron");
    const app = electron["app"];
    const BrowserWindow = electron["BrowserWindow"];
    const dialog = electron["dialog"];
    const globalShortcut = electron["globalShortcut"];
    const inAppPurchase = electron["inAppPurchase"];
    const ipcMain = electron["ipcMain"];
    const Menu = electron["Menu"];
    const MessageChannelMain = electron["MessageChannelMain"];
    const nativeImage = electron["nativeImage"];
    const powerMonitor = electron["powerMonitor"];
    const protocol = electron["protocol"];
    let screen = null;
    const TouchBar = electron["TouchBar"];
    const Tray = electron["Tray"];
    const process = require("node:process");
    const fs = require("fs");

    //tab management
    /*
    {
        0: {
            "window": BrowserWindowObject,
            "isFrame": boolean,
            "trays": {"tag1": TrayObject, ...}
        }
    }
    */
    const tabs = {};
    const createWindow = (url, isFrame) => {
        //create ID
        let id = 0;
        while (typeof(tabs[id]) !== "undefined") {
            id++;
        }
        tabs[id] = {};
        
        //create window
        const win = new BrowserWindow({
            "title": VARIABLE["TITLE"],
            "frame": isFrame,
            "enableLargerThanScreen": true,
            "webPreferences": {
                "contextIsolation": false,
                "nodeIntegration": true,
                "nodeIntegrationInWorker": true,
                "enableWebSQL": false,
                "v8CacheOptions": "bypassHeatCheckAndEagerCompile"
            }
        });
        win["loadURL"](url);
        //win["setMenu"](null);

        //variable create
        tabs[id]["window"] = win;
        tabs[id]["isFrame"] = isFrame;
        tabs[id]["trays"] = {};

        //create event handle
        win["on"]("maximize", (e) => {
            e.sender["webContents"]["send"]("api", "on-maximize");
        });
        win["on"]("unmaximize", (e) => {
            e.sender["webContents"]["send"]("api", "on-unmaximize");
        });
        win["on"]("minimize", (e) => {
            e.sender["webContents"]["send"]("api", "on-minimize");
        });
        win["on"]("restore", (e) => {
            e.sender["webContents"]["send"]("api", "on-restore");
        });
        win["on"]("move", (e) => {
            e.sender["webContents"]["send"]("api", "on-move");
        });

        //close handle
        win["on"]("closed", (e) => {
            //find id
            let closedID = Object.keys(tabs).find((id) => {
                return tabs[id]["window"] === e.sender;
            });

            //close trays
            for (let trayID in tabs[closedID]["trays"]) {
                tabs[id]["trays"][trayID]["destroy"]();
            }

            //delete reference
            delete tabs[closedID];

            //send to others
            for (const tab in tabs) {
                tab["window"]["webContents"]["send"]("api", "window-closed");
            }
        });
    };
    const setWindowFrame = (id, isFrame, message) => {
        if (typeof(tabs[windowID]) === "undefined") {
            return false;
        }
        if (tabs[windowID]["isFrame"] === isFrame) {
            return true;
        }

        //copy save
        const url = tabs[windowID]["window"]["getURL"]();
        const windowData = {};
        for(var prop in tabs[windowID]["window"]) {
            if (prop !== "webContents" && prop !== "id") {
                windowData[prop] = tabs[windowID]["window"][prop];
            }
        }
        const webContentsData = {};
        for(var prop in tabs[windowID]["window"]["webContents"]) {
            if (prop === "audioMuted" || prop === "userAgent" || prop === "zoomLevel" || prop === "zoomFactor " || prop === "frameRate") {
                webContentsData[prop] = tabs[windowID]["window"]["webContents"][prop];
            }
        }

        //create window
        const win = new BrowserWindow({
            "title": VARIABLE["TITLE"],
            "frame": isFrame,
            "enableLargerThanScreen": true,
            "webPreferences": {
                "contextIsolation": false,
                "nodeIntegration": true,
                "nodeIntegrationInWorker": true,
                "enableWebSQL": false,
                "v8CacheOptions": "bypassHeatCheckAndEagerCompile"
            }
        });
        win["loadURL"](url); /*win["loadFile"]("index.html");*/

        //copy load
        for(var prop in windowData) {
            win[prop] = windowData[prop];
        }
        for(var prop in webContentsData) {
            win["webContents"][prop] = webContentsData[prop];
        }

        //variable write
        tabs[id]["window"] = win;
        tabs[id]["isFrame"] = isFrame;

        //create event handle
        win["on"]("maximize", (e) => {
            e.sender["webContents"]["send"]("api", "on-maximize");
        });
        win["on"]("unmaximize", (e) => {
            e.sender["webContents"]["send"]("api", "on-unmaximize");
        });
        win["on"]("minimize", (e) => {
            e.sender["webContents"]["send"]("api", "on-minimize");
        });
        win["on"]("restore", (e) => {
            e.sender["webContents"]["send"]("api", "on-restore");
        });
        win["on"]("move", (e) => {
            e.sender["webContents"]["send"]("api", "on-move");
        });

        //close handle
        win["on"]("closed", (e) => {
            //find id
            let closedID = Object.keys(tabs).find((id) => {
                return tabs[id]["window"] === e.sender;
            });

            //close trays
            for (let trayID in tabs[closedID]["trays"]) {
                tabs[id]["trays"][trayID]["destroy"]();
            }

            //delete reference
            delete tabs[closedID];

            //send to others
            for (const tab in tabs) {
                tab["window"]["webContents"]["send"]("api", "window-closed");
            }
        });
    };
    const getTabIDByContent = (webContents) => {
        return Object.keys(tabs).find((id) => {
            return tabs[id]["window"]["webContents"] === webContents;
        });
    };

    //handle sync/async API
    const handleAPI = async (fromID, handler, data) => {
        //general api
        if (handler === "open-context-menu") {

        } else if (handler === "close-context-menu") {

        } else if (handler === "set-window-menu") {

        } else if (handler === "remove-window-menu") {

        } else if (handler === "set-tray-menu") {

        } else if (handler === "remove-tray-menu") {

        } else if (handler === "set-dock-menu") {

        } else if (handler === "remove-dock-menu") {

        } else if (handler === "set-thumbar-menu") {

        } else if (handler === "remove-thumbar-menu") {

        }

        else if (handler === "set-menu-item") {

        } else if (handler === "copy-menu-item") {

        } else if (handler === "remove-menu-item") {

        }

        else if (handler === "maximize") {
            tabs[fromID]["window"]["maximize"]();
        } else if (handler === "unmaximize") {
            tabs[fromID]["window"]["unmaximize"]();
        } else if (handler === "minimize") {
            tabs[fromID]["window"]["minimize"]();
        } else if (handler === "restore") {
            tabs[fromID]["window"]["restore"]();
        } else if (handler === "set-size") {
            //width:integer; height:integer; is-content:boolean; is-animate:boolean;
            if (data["is-content"]) {
                tabs[fromID]["window"]["setContentSize"](data["width"], data["height"], data["is-animate"]);
            } else {
                tabs[fromID]["window"]["setSize"](data["width"], data["height"], data["is-animate"]);
            }
        } else if (handler === "set-position") {
            //x:integer; y:integer; is-animate:boolean;
            tabs[fromID]["window"]["setPosition"](data["x"], data["y"], data["is-animate"]);
        } else if (handler === "set-maximum-size") {
            //width:integer; height:integer;
            tabs[fromID]["window"]["setMaximumSize"](data["width"], data["height"]);
        } else if (handler === "set-minimum-size") {
            //width:integer; height:integer;
            tabs[fromID]["window"]["setMinimumSize"](data["width"], data["height"]);
        } else if (handler === "set-opacity") {
            //opacity:0-1 float;
            tabs[fromID]["window"]["setOpacity"](data["opacity"]);
        } else if (handler === "set-visible") {
            //is-visible:boolean;
            if (data["is-visible"]) {
                tabs[fromID]["window"]["show"]();
            } else {
                tabs[fromID]["window"]["hide"]();
            }
        } else if (handler === "move-top") {
            tabs[fromID]["window"]["moveTop"]();
        } else if (handler === "request-attention") {
            //is-attention:boolean;
            tabs[fromID]["window"]["flashFrame"](data["is-attention"]);
        } else if (handler === "set-progress") {
            //progress:0-1 float; type:none|normal|indeterminate|error|paused
            tabs[fromID]["window"]["setProgressBar"](data["progress"], {"mode": data["type"]});
        } else if (handler === "show-dev-tools") {
            //mode:right|bottom|left|undocked
            tabs[fromID]["window"]["webContents"]["openDevTools"]({"mode": data["mode"]});
        } else if (handler === "window-open") {
            //is-frame:boolean
            createWindow(VARIABLE["URL"], data["is-frame"]);
        } else if (handler === "window-message") {
            //to:integer; message:string
            if (typeof(tabs[data["to"]]) !== "undefined") {
                const msg = {
                    "from": fromID,
                    "message": data["message"]
                }
                tabs[data["to"]]["window"]["webContents"]["send"]("api", "window-message", msg)
            }
        } else if (handler === "window-close") {
            //id:integer;
            if (typeof(tabs[data["id"]]) !== "undefined") {
                tabs[data["to"]]["window"]["close"]();
            }
        }
        
        else if (handler === "set-window-frame") {
            //is-enabled:boolean; message:string
            setWindowFrame(fromID, data["is-enabled"], data["message"]);
        } else if (handler === "set-taskbar") {
            //is-enabled:boolean;
            tabs[fromID]["window"]["setSkipTaskbar"](!data["is-enabled"]);
        } else if (handler === "set-kiosk") {
            //is-enabled:boolean;
            tabs[fromID]["window"]["setKiosk"](data["is-enabled"]);
        } else if (handler === "set-always-on-top") {
            //is-enabled:boolean; level:floating|torn-off-menu|modal-panel|main-menu|status|pop-up-menu|screen-saver; relative-level:integer
            tabs[fromID]["window"]["setAlwaysOnTop"](data["is-enabled"], data["level"], data["relativeLevel"]);
        } else if (handler === "set-visible-on-all-workspaces") {
            //is-enabled:boolean; is-visible-on-fullscreen:boolean;
            tabs[fromID]["window"]["setVisibleOnAllWorkspaces"](data["is-enabled"], {"visibleOnFullScreen": data["is-visible-on-fullscreen"]});
        } else if (handler === "set-protection") {
            //is-enabled:boolean;
            tabs[fromID]["window"]["setContentProtection"](data["is-enabled"]);
        } else if (handler === "set-enabled") {
            //is-enabled:boolean;
            tabs[fromID]["window"]["setEnabled"](data["is-enabled"]);
        } else if (handler === "set-closable") {
            //is-enabled:boolean;
            tabs[fromID]["window"]["setClosable"](data["is-enabled"]);
        } else if (handler === "set-resizable") {
            //is-enabled:boolean;
            tabs[fromID]["window"]["setResizable"](data["is-enabled"]);
        } else if (handler === "set-movable") {
            //is-enabled:boolean;
            tabs[fromID]["window"]["setMovable"](data["is-enabled"]);
        } else if (handler === "set-maximizable") {
            //is-enabled:boolean;
            tabs[fromID]["window"]["setMaximizable"](data["is-enabled"]);
        } else if (handler === "set-minimizable") {
            //is-enabled:boolean
            tabs[fromID]["window"]["setMinimizable"](data["is-enabled"]);
        } else if (handler === "set-fullscreenable") {
            //is-enabled:boolean
            tabs[fromID]["window"]["setFullScreenable"](data["is-enabled"]);
        } else if (handler === "set-instance-prevent") {
            //is-enabled:boolean
            if (data["is-enabled"]) {
                app["requestSingleInstanceLock"]();
            } else {
                app["releaseSingleInstanceLock"]();
            }
        }
        
        else {
            return false;
        }
        return true;
    };
    ipcMain["on"]("api", async (event, handler, data) => {
        const fromID = getTabIDByContent(event["sender"]);
        await handleAPI(fromID, handler, data);
    });
    ipcMain["handle"]("api", async (event, handler, data) => {
        const fromID = getTabIDByContent(event["sender"]);
        const result = await handleAPI(fromID, handler, data);
        return result;
    });

    //menu menthods
    const PathToArray = (path) => {
        //get path tree in array and handle escaped dots (.)
        const pathArray = [];
        let lastIndex = 0;
        let reg = new RegExp(/(?:\\\\|\\\.)|(\.)/g);
        let match;
        while (match = reg.exec(path)) {
            if (match[1] !== undefined) {
                const str = path.substring(lastIndex, match.index);
                if (str !== "") {
                    pathArray.push(str);
                }
                lastIndex = match.index + 1;
            }
        }
        const str = path.substring(lastIndex, path.length);
        if (str !== "") {
            pathArray.push(str);
        }
        return pathArray;
    }
    const IsPathSelf = (srcPathArray, destPathArray) => {
        if (srcPathArray.length <= destPathArray.length) {
            return srcPathArray.every((el, i) => {
                return el === destPathArray[i];
            });
        } else {
            return destPathArray.every((el, i) => {
                return el === srcPathArray[i];
            });
        }
    }
    const MenuItemGet = (pathArray, isCreate, clearReference) => {
        return {
            "index": i,
            "selectObj": selectObj,
            "parentObj": parentObj
        };
    }

    //screen
    const startScreen = () => {
        screen["on"]("display-added", (event, newDisplay) => {

        });
        screen["on"]("display-removed", (event, oldDisplay) => {

        });
        screen["on"]("display-metrics-changed", (event, display, changedMetrics) => {

        });
    };

    //initial setup
    const Init = async () => {
        //lock behavior start/handle
        let lockAccess = app["requestSingleInstanceLock"]();
        if (!lockAccess) {
            app["quit"]();
            return;
        }
        if (VARIABLE["SINGLE_INSTANCE"] === false) {
            app["releaseSingleInstanceLock"]();
        }
        app["on"]("second-instance", (event, commandLine, workingDirectory) => {
            for (const tab in tabs) {
                tab["window"]["send"]("api", "instance-prevented");
            }
        });

        //simulate web server at local://local.local
        protocol["registerSchemesAsPrivileged"]([
            {
                "scheme": "local",
                "privileges": {
                    "standard": true,
                    "secure": true,
                    "bypassCSP": true,
                    "allowServiceWorkers": true,
                    "supportFetchAPI": true,
                    "corsEnabled": true,
                    "stream": true
                }
            }
        ]);

        //ready to start
        app["whenReady"]().then(() => {
            //screen start
            screen = require("electron")["screen"];
            startScreen();

            //start web server simulator at local://local.local
			protocol["registerFileProtocol"]("local", (request, callback) => {
				const result = {};
				
				const folder = app["getAppPath"]() + "\\project\\";
				
				const domain = "local://local.local";
				const domainRegExp = new RegExp("^" + domain + "\\/");
				const domainExt = domain + domain.replace(":", ""); //for bug that call domain name wrong
				const domainExtRegExp = new RegExp("^" + domainExt + "\\/"); //for bug
				
				let urlPath = request["url"];
				urlPath = urlPath.replace(domainExtRegExp, ""); //for bug
				urlPath = urlPath.replace(domainRegExp, "");
				
				let fullPath = folder + urlPath;
				
				if (fullPath === folder) {
					result["path"]  = folder + "index.html";
				} else if (!fs["existsSync"](fullPath) || fs["lstatSync"](fullPath)["isDirectory"]()) {
					result["path"] = folder + "index.html";
					result["error"] = -6;
					result["statusCode"] = 404;
				} else {
					result["path"]  = fullPath;
				}
				callback(result);
			});

            //create first window
            app["on"]("activate", () => {
                if (BrowserWindow["getAllWindows"]().length === 0) {
                    createWindow(VARIABLE["URL"], VARIABLE["WINDOW_FRAME"]);
                }
            });
            createWindow(VARIABLE["URL"], VARIABLE["WINDOW_FRAME"]);
            console.log("show in console");
        });

        //ending
        powerMonitor["on"]("shutdown", (e) => {
            e.preventDefault();
            for (const tab in tabs) {
                tab["window"]["webContents"]["send"]("api", "on-close-critical");
                //tab["window"]["close"]();
            }
        });
        app["on"]("window-all-closed", () => {
            if (process["platform"] !== "darwin") app["quit"]();
        });
    };
    Init();
};