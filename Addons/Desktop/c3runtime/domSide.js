"use strict";
{
    const DOM_COMPONENT_ID = "RobotKaposzta_Desktop";
    const HANDLER_CLASS = class DesktopDOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);

            const data = this.GetContext();
            this.mode = data["mode"]; // none|nwjs|electron;
            this.framework = data["framework"]; // ipcRenderer|nw
            this.cmd = data["cmd"];

            this._LoadMethods(this.mode);
            this._LoadEvents(this.mode);

            this.execProcesses = {};

            

            //from runtime
            this.AddRuntimeMessageHandlers([
                ["get-init", (e) => this.GetInit(e)],

                ["exec-command", (e) => this.ExecCommand(e)],
                ["exec-message", (e) => this.ExecMessage(e)],
                ["exec-stop", (e) => this.ExecStop(e)],

                ["open-context-menu", (e) => this.OpenContextMenu(e)],
                ["close-context-menu", () => this.CloseContextMenu()],
                ["set-window-menu", (e) => this.SetWindowMenu(e)],
                ["remove-window-menu", () => this.RemoveWindowMenu()],
                ["set-tray-menu", (e) => this.SetTrayMenu(e)],
                ["remove-tray-menu", (e) => this.RemoveTrayMenu(e)],
                ["set-dock-menu", (e) => this.SetDockMenu(e)],
                ["remove-dock-menu", () => this.RemoveDockMenu()],
                ["set-thumbar-menu", (e) => this.SetThumbarMenu(e)],
                ["remove-thumbar-menu", () => this.RemoveThumbarMenu()],

                ["set-menu-item", (e) => this.SetMenuItem(e)],
                ["copy-menu-item", (e) => this.CopyMenuItem(e)],
                ["remove-menu-item", (e) => this.RemoveMenuItem(e)],

                ["maximize", () => this.Maximize()],
                ["unmaximize", () => this.Unmaximize()],
                ["minimize", () => this.Minimize()],
                ["restore", () => this.Restore()],
                ["set-size", (e) => this.SetSize(e)],
                ["set-position", (e) => this.SetPosition(e)],
                ["set-maximum-size", (e) => this.SetMaximumSize(e)],
                ["set-minimum-size", (e) => this.SetMinimumSize(e)],
                ["set-opacity", (e) => this.SetOpacity(e)],
                ["set-visible", (e) => this.SetVisible(e)],
                ["move-top", () => this.MoveTop()],
                ["request-attention", (e) => this.RequestAttention(e)],
                ["set-progress", (e) => this.SetProgress(e)],
                ["show-dev-tools", (e) => this.ShowDevTools(e)],
                ["window-open", (e) => this.WindowOpen(e)],
                ["window-message", (e) => this.WindowMessage(e)],
                ["window-close", (e) => this.WindowClose(e)],

                ["set-window-frame", (e) => this.SetWindowFrame(e)],
                ["set-taskbar", (e) => this.SetTaskbar(e)],
                ["set-kiosk", (e) => this.SetKiosk(e)],
                ["set-always-on-top", (e) => this.SetAlwaysOnTop(e)],
                ["set-visible-on-all-workspaces", (e) => this.SetVisibleOnAllWorkspaces(e)],
                ["set-protection", (e) => this.SetProtection(e)],
                ["set-enabled", (e) => this.SetEnabled(e)],
                ["set-closable", (e) => this.SetClosable(e)],
                ["set-resizable", (e) => this.SetResizable(e)],
                ["set-movable", (e) => this.SetMovable(e)],
                ["set-maximizable", (e) => this.SetMaximizable(e)],
                ["set-minimizable", (e) => this.SetMinimizable(e)],
                ["set-fullscreenable", (e) => this.SetFullscreenable(e)],
                ["set-instance-prevent", (e) => this.SetInstancePrevent(e)]
            ]);
		}
        GetContext() {
            let framework;
            let cmd;
            let isElectron = true;
            try {
                framework = require("electron")["ipcRenderer"];
                cmd = require("node:child_process")["spawn"];
            } catch (error) {
                isElectron = false;
            }
            if (isElectron) {
                return {
                    "mode": "electron",
                    "framework": framework,
                    "cmd": cmd
                };
            }

            let isNWjs = true;
            try {
                framework = self["nw"];
                cmd = require("node:child_process")["spawn"];
            } catch (error) {
                isNWjs = false;
            }
            if (isNWjs) {
                return {
                    "mode": "nwjs",
                    "framework": framework,
                    "cmd": cmd
                };
            }

            return {
                "mode": "none",
                "framework": null,
                "cmd": null
            };
        }
        GetInit(data) {
            return {};
        }

        //Methods
        _LoadMethods(mode) {
            if (mode !== "none") {
                this.ExecCommand = (data) => {
                    const options = {};
                    options["windowsHide"] = data["is-hide"];
                    options["timeout"] = data["timeout"];
                    options["detached"] = data["is-detached"];
                    if (data["cwd"] !== "") {
                        options["cwd"] = data["cwd"];
                    }
                    if (data["env"] !== "") {
                        options["env"] = data["env"];
                    }
                    if (data["argv0"] !== "") {
                        options["argv0"] = data["argv0"];
                    }
                    if (data["shell"] !== "") {
                        options["shell"] = data["shell"];
                    }
                    if (data["killsignal"] !== "") {
                        options["killsignal"] = data["killsignal"];
                    }
                    this.execProcesses[data["tag"]] = this.cmd["spawn"](data["command"], data["args"], options);
                    this.execProcesses[data["tag"]]["stdout"]["on"]("data", (data) => {
                        console.log(data.toString());
                    });
                    this.execProcesses[data["tag"]]["stderr"]["on"]("data", (data) => {
                        console.error(`grep stderr: ${data}`);
                    });
                    this.execProcesses[data["tag"]].on("close", (code) => {
                        delete this.execProcesses[data["tag"]];
                    });
                };
                this.ExecMessage = (data) => {
                    if (typeof this.execProcesses[data["tag"]] !== "undefined") {
                        this.execProcesses[data["tag"]]["stdin"]["write"](data["message"]);
                    }
                };
                this.ExecStop = (data) => {
                    if (data["message"] === "") {
                        data["message"] = undefined;
                    }
                    this.execProcesses[data["tag"]]["kill"](data["message"]);
                }
            }
            if (mode === "electron") {
                this.OpenContextMenu = (data) => {

                };
                this.CloseContextMenu = () => {

                };
                this.SetWindowMenu = (data) => {

                };
                this.RemoveWindowMenu = () => {

                };
                this.SetTrayMenu = (data) => {

                };
                this.RemoveTrayMenu = () => {

                };
                this.SetDockMenu = (data) => {

                };
                this.RemoveDockMenu = () => {

                };
                this.SetThumbarMenu = (data) => {

                };
                this.RemoveThumbarMenu = () => {

                };

                this.SetMenuItem = (data) => {
                    this.framework["send"]("api", "set-menu-item", data);
                };
                this.CopyMenuItem = (data) => {
                    this.framework["send"]("api", "copy-menu-item", data);
                };
                this.RemoveMenuItem = (data) => {
                    this.framework["send"]("api", "remove-menu-item", data);
                };

                this.Maximize = () => {
                    this.framework["send"]("api", "maximize");
                };
                this.Unmaximize = () => {
                    this.framework["send"]("api", "unmaximize");
                };
                this.Minimize = () => {
                    this.framework["send"]("api", "minimize");
                };
                this.Restore = () => {
                    this.framework["send"]("api", "restore");
                };
                this.SetSize = (data) => {
                    this.framework["send"]("api", "set-size", data);
                };
                this.SetPosition = (data) => {
                    this.framework["send"]("api", "set-position", data);
                };
                this.SetMaximumSize = (data) => {
                    this.framework["send"]("api", "set-maximum-size", data);
                };
                this.SetMinimumSize = (data) => {
                    this.framework["send"]("api", "set-minimum-size", data);
                };
                this.SetOpacity = (data) => {
                    this.framework["send"]("api", "set-opacity", data);
                };
                this.SetVisible = (data) => {
                    this.framework["send"]("api", "set-visible", data);
                };
                this.MoveTop = () => {
                    this.framework["send"]("api", "move-top");
                };
                this.RequestAttention = (data) => {
                    this.framework["send"]("api", "request-attention", data);
                };
                this.SetProgress = (data) => {
                    this.framework["send"]("api", "set-progress", data);
                };
                this.ShowDevTools = (data) => {
                    this.framework["send"]("api", "show-dev-tools", data);
                };
                this.WindowOpen = (data) => {
                    this.framework["send"]("api", "window-open", data);
                };
                this.WindowMessage = (data) => {
                    this.framework["send"]("api", "window-message", data);
                };
                this.WindowClose = (data) => {
                    this.framework["send"]("api", "window-close", data);
                };
            } else if (mode === "nwjs") {
                this.GetNWjsWindow = () => {
                    return this.framework["Window"]["get"]();
                };

                //Path methods
                this.windowPathArray = null;
                this.trayPathArray = null;
                this.docPathArray = null;
                this.thumbarPathArray = null;
                
                this.menuItems = {
                    "id": "",
                    "type": "normal",
                    "submenu": [],
                    "reference": [],
                    "text": "",
                    "subtext": "",
                    "icon": "",
                    "enabled": true,
                    "checked": false,
                    "visible": true,
                    "hotkey": "",
                    "nwMenu": null,
                    "nwMenuItem": null
                };

                //path helper methods
                this._PathToArray = (path) => {
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
                };
                this._IsPathSelf = (sourcePathArray, destPathArray) => {
                    if (sourcePathArray.length <= destPathArray.length) {
                        return sourcePathArray.every((el, i) => {
                            return el === destPathArray[i];
                        });
                    } else {
                        return destPathArray.every((el, i) => {
                            return el === sourcePathArray[i];
                        });
                    }
                }
                this._MenuItemGet = (pathArray, isCreate = false, clearReference = false) => {
                    //get item and his parent at path and show index where get error or create path anyway.
                    let selectObj = this.menuItems;
                    let parentObj = null;
                    let i = 0, length = pathArray.length;
                    while (i < length && selectObj !== null) {
                        parentObj = selectObj;
                        selectObj = selectObj["submenu"].find((subItem) => {
                            console.log(subItem);
                            console.log(subItem["id"]);
                            if (subItem["id"] === pathArray[i]) {
                                return true;
                            }
                            return false;
                        });
                        if (typeof(selectObj) === "object") {
                            if (clearReference) {
                                parentObj["reference"] = [];
                                if (parentObj["nwMenuItem"] !== null) {
                                    parentObj["nwMenuItem"]["submenu"] = null;
                                }
                                selectObj["reference"] = [];
                            }
                            i++;
                        } else {
                            selectObj = null;
                        }
                    }
                    if (isCreate && selectObj === null) {
                        while (i < length - 1) {
                            let nwMenu = null;
                            if (parentObj["submenu"].length !== 0) {
                                nwMenu = parentObj["submenu"][0]["nwMenu"];
                            } else {
                                nwMenu = new this.framework["Menu"]({type: 'menubar'});
                            }
                            let nwMenuItem = new this.framework["MenuItem"]({
                                "type": "normal",
                                "label": "",
                                "icon": "",
                                "enabled": true,
                                "checked": false,
                                "key": ""
                            });
                            nwMenu["append"](nwMenuItem);
                            selectObj = {
                                "id": pathArray[i],
                                "submenu": [],
                                "reference": [],
                                "type": "normal",
                                "text": "",
                                "subtext": "",
                                "icon": "",
                                "enabled": true,
                                "checked": false,
                                "visible": true,
                                "hotkey": "",
                                "nwMenu": nwMenu,
                                "nwMenuItem": nwMenuItem
                            };
                            parentObj["submenu"].push(selectObj);
                            if (parentObj["nwMenuItem"] === null) {
                                
                            } else {
                                parentObj["nwMenuItem"]["submenu"] = nwMenu;
                            }
                            parentObj = selectObj;
                            i++;
                        }
                        let nwMenu = null;
                        if (parentObj["submenu"].length !== 0) {
                            nwMenu = parentObj["submenu"][0]["nwMenu"];
                        } else {
                            nwMenu = new this.framework["Menu"]({type: 'menubar'});
                        }
                        let nwMenuItem = new this.framework["MenuItem"]({
                            "type": "normal",
                            "label": "",
                            "icon": "",
                            "enabled": true,
                            "checked": false,
                            "key": ""
                        });
                        nwMenu["append"](nwMenuItem);
                        selectObj = {
                            "id": pathArray[i],
                            "submenu": [],
                            "reference": [],
                            "type": "normal",
                            "text": "",
                            "subtext": "",
                            "icon": "",
                            "enabled": true,
                            "checked": false,
                            "visible": true,
                            "hotkey": "",
                            "nwMenu": nwMenu,
                            "nwMenuItem": nwMenuItem
                        };
                        parentObj["submenu"].push(selectObj);
                        if (parentObj["nwMenuItem"] !== null) {
                            parentObj["nwMenuItem"]["submenu"] = nwMenu;
                        }
                        i++;
                    }
                    return {
                        "index": i,
                        "selectObj": selectObj,
                        "parentObj": parentObj
                    };
                };

                //API
                this.OpenContextMenu = (data) => {

                };
                this.CloseContextMenu = () => {

                };
                this.SetWindowMenu = (data) => {
                    //empty/non-exist path check
                    const pathArray = this._PathToArray(data["path"]);
                    console.log(pathArray);
                    if (pathArray.length === 0) {
                        if (this.menuItems["submenu"].length === 0) {
                            return false;
                        }
                        console.log(this.menuItems);
                        this.GetNWjsWindow()["menu"] = this.menuItems["submenu"][0]["nwMenu"];
                        return true;
                    }
                    const pathData = this._MenuItemGet(pathArray, false, false);
                    console.log(pathData);
                    if (pathData["index"] !== pathArray.length) {
                        return false;
                    }
                    if (pathData["parentObj"]["submenu"].length === 0) {
                        return false;
                    }
                    console.log(pathData);
                    this.GetNWjsWindow()["menu"] = pathData["parentObj"]["submenu"][0]["nwMenu"];
                    return true;
                };
                this.RemoveWindowMenu = () => {
                    this.GetNWjsWindow()["menu"] = null;
                };
                this.SetTrayMenu = (data) => {

                };
                this.RemoveTrayMenu = () => {

                };
                this.SetDockMenu = (data) => {

                };
                this.RemoveDockMenu = () => {

                };
                this.SetThumbarMenu = (data) => {

                };
                this.RemoveThumbarMenu = () => {

                };

                this.SetMenuItem = (data) => {
                    data = data["data"];
                    //path, index, type, text, subtext, icon, enabled, checked, visible, hotkey
                    const pathArray = this._PathToArray(data["path"]);
                    if (pathArray.length === 0) {
                        return false;
                    }
                    const pathData = this._MenuItemGet(pathArray, true, true);
                    const selectItem = pathData["selectObj"];
                    const parentItem = pathData["parentObj"];
                    if (typeof data["index"] === "number") {
                        parentItem["submenu"].splice(parentItem["submenu"].indexOf(selectItem), 1);
                        parentItem["submenu"].splice(data["index"], 0, selectItem);
                    }
                    if (data["type"] === "normal" || data["type"] === "separator" || data["type"] === "checkbox" || data["type"] === "radio") {
                        selectItem["type"] = data["type"];
                    }
                    if (typeof data["text"] === "string") {
                        selectItem["text"] = data["text"];
                    }
                    if (typeof data["subtext"] === "string") {
                        selectItem["subtext"] = data["subtext"];
                    }
                    if (typeof data["icon"] === "string") {
                        selectItem["icon"] = data["icon"];
                    }
                    if (typeof data["enabled"] === "boolean") {
                        selectItem["enabled"] = data["enabled"];
                    }
                    if (typeof data["checked"] === "boolean") {
                        selectItem["checked"] = data["checked"];
                    }
                    if (typeof data["visible"] === "boolean") {
                        selectItem["visible"] = data["visible"];
                    }
                    if (typeof data["hotkey"] === "string") {
                        selectItem["hotkey"] = data["hotkey"];
                    }
                    //menuItem create
                    selectItem["nwMenu"]["remove"](selectItem["nwMenuItem"]);
                    selectItem["nwMenuItem"] = new this.framework["MenuItem"]({
                        "type": (selectItem["type"] === "radio" ? "checkbox" : selectItem["type"]),
                        "label": selectItem["text"],
                        "icon": selectItem["icon"],
                        "enabled": selectItem["enabled"],
                        "checked": selectItem["checked"],
                        "key": selectItem["hotkey"]
                    });
                    selectItem["nwMenu"]["insert"](selectItem["nwMenuItem"], parentItem["submenu"].indexOf(selectItem));

                    //radio behavior
                    if (data["type"] === "radio" && selectItem["checked"] === true) {
                        const index = parentItem["submenu"].indexOf(selectItem);
                        let i = index + 1 , length = parentItem["submenu"].length;
                        while (i < length && parentItem["submenu"][i] !== "separator") {
                            if (parentItem["submenu"][i] === "radio") {
                                parentItem["submenu"][i]["checked"] = false;
                                parentItem["submenu"][i]["nwMenuItem"]["checked"] = false; //for menuItem
                            }
                            i++;
                        }
                        let j = index - 1;
                        while (j > 0 && parentItem["submenu"][i] !== "separator") {
                            if (parentItem["submenu"][i] === "radio") {
                                parentItem["submenu"][i]["checked"] = false;
                                parentItem["submenu"][i]["nwMenuItem"]["checked"] = false; //for menuItem
                            }
                            j--;
                        }
                    }
                    return true;
                };
                this.CopyMenuItem = (data) => {
                    
                };
                this.RemoveMenuItem = (data) => {
                    
                };

                this.Maximize = () => {
                    this.GetNWjsWindow()["maximize"]();
                };
                this.Unmaximize = () => {
                    this.GetNWjsWindow()["restore"]();
                };
                this.Minimize = () => {
                    this.GetNWjsWindow()["minimize"]();
                };
                this.Restore = () => {
                    this.GetNWjsWindow()["restore"]();
                };
                this.SetSize = (data) => {
                    if (data["is-content"]) {
                        this.GetNWjsWindow()["resizeTo"](data["width"], data["height"]);
                    } else {
                        this.GetNWjsWindow()["width"] = data["width"];
                        this.GetNWjsWindow()["height"] = data["height"];
                    }
                };
                this.SetPosition = (data) => {
                    this.GetNWjsWindow()["x"] = data["x"];
                    this.GetNWjsWindow()["y"] = data["y"];
                };
                this.SetMaximumSize = (data) => {
                    this.GetNWjsWindow()["setMaximumSize"](data["width"], data["height"]);
                };
                this.SetMinimumSize = (data) => {
                    this.GetNWjsWindow()["setMinimumSize"](data["width"], data["height"]);
                };
                this.SetOpacity = (data) => {

                };
                this.SetVisible = (data) => {
                    this.GetNWjsWindow()["show"](data["is-visible"]);
                };
                this.MoveTop = () => {

                };
                this.RequestAttention = (data) => {
                    this.GetNWjsWindow()["requestAttention"](data["is-attention"]);
                };
                this.SetProgress = (data) => {
                    this.GetNWjsWindow()["setProgressBar"](data["progress"]);
                };
                this.ShowDevTools = (data) => {
                    this.GetNWjsWindow()["showDevTools"]();
                };
                this.WindowOpen = (data) => {

                };
                this.WindowMessage = (data) => {

                };
                this.WindowClose = (data) => {

                };
            }
        }

        ExecCommand(data) {
            //tag:string; command:string; args:string[]; is-hide:boolean; timeout:integer; is-detached:boolean; cwd:string; env:string; argv0:string; shell:string; killsignal:string
        }
        ExecMessage(data) {
            //tag:string; message:string;
        }
        ExecStop(data) {
            //tag:string; message:string;
        }

        OpenContextMenu(data) {
            //menu:menuObject
        }
        CloseContextMenu() {

        }
        SetWindowMenu(data) {
            //path
        }
        RemoveWindowMenu() {

        }
        SetTrayMenu(data) {
            //tag:string menu:menuObject
        }
        RemoveTrayMenu(data) {
            //tag:string
        }
        SetDockMenu(data) {
            //menu:menuObject
        }
        RemoveDockMenu() {

        }
        SetThumbarMenu(data) {
            //menu:menuObject
        }
        RemoveThumbarMenu() {
            
        }

        SetMenuItem(data) {
            //data: -> path, index, type, text, subtext, icon, enabled, checked, visible, hotkey
        }
        CopyMenuItem(data) {
            //source-path; dest-path; is-reference
        }
        RemoveMenuItem(data) {
            //path;
        }

        Maximize() {

        }
        Unmaximize() {

        }
        Minimize() {
            
        }
        Restore() {
            
        }
        SetSize(data) {
            //width:integer; height:integer; is-content:boolean; is-animate:boolean;
        }
        SetPosition(data) {
            //x:integer; y:integer; is-animate:boolean;
        }
        SetMaximumSize(data) {
            //width:integer; height:integer;
        }
        SetMinimumSize(data) {
            //width:integer; height:integer;
        }
        SetOpacity(data) {
            //opacity:0-1 float;
        }
        SetVisible(data) {
            //is-visible:boolean;
        }
        MoveTop() {

        }
        RequestAttention(data) {
            //is-attention:boolean;
        }
        SetProgress(data) {
            //progress:0-1 float; type:none|normal|indeterminate|error|paused;
        }
        ShowDevTools(data) {
            //mode:right|bottom|left|undocked;
        }
        WindowOpen(data) {
            //message:string; is-frame:boolean;
        }
        WindowMessage(data) {
            //to:integer; tag:string; message:string;
        }
        WindowClose(data) {
            //id:integer;
        }

        SetWindowFrame(data) {
            //is-enabled:boolean; message:string
        }
        SetTaskbar(data) {
            //is-enabled:boolean;
        }
        SetKiosk(data) {
            //is-enabled:boolean;
        }
        SetAlwaysOnTop(data) {
            //is-enabled:boolean; level:floating|torn-off-menu|modal-panel|main-menu|status|pop-up-menu|screen-saver; relative-level:integer
        }
        SetVisibleOnAllWorkspaces(data) {
            //is-enabled:boolean;
        }
        SetProtection(data) {
            //is-enabled:boolean;
        }
        SetEnabled(data) {
            //is-enabled:boolean;
        }
        SetClosable(data) {
            //is-enabled:boolean;
        }
        SetResizable(data) {
            //is-enabled:boolean;
        }
        SetMovable(data) {
            //is-enabled:boolean;
        }
        SetMaximizable(data) {
            //is-enabled:boolean;
        }
        SetMinimizable(data) {
            //is-enabled:boolean;
        }
        SetFullscreenable (data) {
            //is-enabled:boolean;
        }
        SetInstancePrevent(data) {
            //is-enabled:boolean;
        }

        //Events
        _LoadEvents(mode) {
            if (mode === "electron") {
                this.framework["on"]("api", (event, method, params) => {
                    if (method === "on-maximize") {
                        this.OnMaximize();
                    }
                });
            } else if (mode === "nwjs") {
                this.GetNWjsWindow()["on"]("maximize", this.OnMaximize);
            }
        }

        OnMaximize() {

        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
};
