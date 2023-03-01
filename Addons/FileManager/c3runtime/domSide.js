"use strict";
{
    //thrid-party library
    //IDB library    
    const getIDBLibrary = function() {
        const DBName = "database";
        async function _loadDB() {
            return new Promise((resolve) => {
                if (typeof indexedDB === "undefined") {
                    resolve(null);
                }
                const db = indexedDB.open(DBName);
                db.onerror = (event) => {
                    resolve(null);
                };
                db.onsuccess = (event) => {
                    resolve(event.target.result);
                };
                db.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    db.onerror = (event) => {
                        resolve(null);
                    };
                    db.createObjectStore("data");
                };
            });
        };
    
        async function setDB(key, value) {
            return new Promise(async (resolve) => {
                const database = await _loadDB();
                if (database === null) {
                    resolve(false);
                }
                const transaction = database.transaction("data", "readwrite");
                const objectStore = transaction.objectStore("data");
                const request = objectStore.put(value, key);
                request.onsuccess = () => {
                    resolve(true);
                };
                request.onerror = () => {
                    resolve(false);
                };
            });
    
        };
    
        async function getDB(key) {
            return new Promise(async (resolve) => {
                const database = await _loadDB();
                if (database === null) {
                    resolve(undefined);
                }
                const transaction = database.transaction("data", "readonly");
                const objectStore = transaction.objectStore("data");
                const request = objectStore.get(key);
                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };
                request.onerror = () => {
                    resolve(undefined);
                };
            });
    
        };
    
        async function getAllKeysDB() {
            return new Promise(async (resolve) => {
                const database = await _loadDB();
                if (database === null) {
                    resolve(undefined);
                }
                const transaction = database.transaction("data", "readonly");
                const objectStore = transaction.objectStore("data");
                const request = objectStore.getAllKeys();
                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };
                request.onerror = () => {
                    resolve(undefined);
                };
            });
        };
    
        async function getAllValuesDB() {
            return new Promise(async (resolve) => {
                const database = await _loadDB();
                if (database === null) {
                    resolve(undefined);
                }
                const transaction = database.transaction("data", "readonly");
                const objectStore = transaction.objectStore("data");
                const request = objectStore.getAll();
                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };
                request.onerror = () => {
                    resolve(undefined);
                };
            });
        };
    
        async function removeDB(key) {
            return new Promise(async (resolve) => {
                const database = await _loadDB();
                if (database === null) {
                    resolve(false);
                }
                const transaction = database.transaction("data", "readwrite");
                const objectStore = transaction.objectStore("data");
                const request = objectStore.delete(key);
                request.onsuccess = () => {
                    resolve(true);
                };
                request.onerror = () => {
                    resolve(false);
                };
            });
        };
    
        return {
            set: setDB,
            get: getDB,
            getAllKeys: getAllKeysDB,
            getAllValues: getAllValuesDB,
            remove: removeDB
        }
    };
    const storeDB = getIDBLibrary();

    const DOM_COMPONENT_ID = "RobotKaposzta_FileManager";

    /**
     * @external DOMHandler
     * @desc This class run in the runtime side. <br><br> The DOMHandler interface is a base class for DOM-side scripts (typically in domSide.js). This means it does not have access to the runtime, since in Web Worker mode the runtime is hosted in a separate JavaScript context within the worker. However the DOM-side script does have access to the full DOM APIs, e.g. document, and using the messaging methods can communicate with the runtime. See DOM calls in the C3 runtime for more information.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/domhandler
     */
    /**
     * @classdesc TextManager editor class.
     * @extends external:DOMHandler
     */
    class FileManagerRuntimeDOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);
            
            this._virtualStorage = new Map();

            this._dragTimeout = 0;
            this._isDropEnable = false;
            this._dropType = 1;

            this._processes = new Map();
            
            this.AddRuntimeMessageHandlers([
                ["get-platform", () => this._GetPlatform()],

                ["pause-process", (e) => this._CreateProcess(...e)],
                ["resume-process", (e) => this._ResumeProcess(...e)],
                ["abort-process", (e) => this._AbortProcess(...e)],

                ["load-virtual-path", () => this._LoadVirtualPath()],
                ["set-virtual-path", (e) => this._SetVirtualPath(...e)],
                ["get-virtual-path", (e) => this._GetVirtualPath(...e)],

                ["set-drop-handle", (e) => this._SetDropHandle(...e)],
                ["enable-drop", (e) => this._EnableDrop(...e)],
                ["set-dialog-handle", (e) => this._SetDialogHandle(...e)],
                ["open-dialog", (e) => this._OpenDialog(...e)],

                ["list-cordova-path", (e) =>  this._CordovaList(...e)],
                ["read-cordova-file", (e) =>  this._CordovaRead(...e)],
                ["write-cordova-file", (e) =>  this._CordovaWrite(...e)]
            ]);
            const THIS = this;
            window.addEventListener("dragover", function (event) {
                event.preventDefault();
                if (THIS._isDropEnable) {
                    THIS._DragHandle(event);
                }
            });
            window.addEventListener("drop", function (event) {
                event.preventDefault();
                if (THIS._isDropEnable) {
                    THIS._DropHandle(event);
                }
            });
            self.robotkaposzta = (e) => this._GetVirtualPath(...e);
        }
        _JoinStr() {
            let joinList = [];
            for (let i = 0, length = arguments.length; i < length; ++i) {
                if (arguments[i] !== "") {
                    let arg = arguments[i];
                    if (arg[arg.length - 1] === "/") {
                        arg = arg.substring(0, arg.length - 1);
                    }
                    if (arg[0] === "/") {
                        arg = arg.substring(1);
                    }
                    if (arg !== "") {
                        joinList.push(arg);
                    }
                }
            }
            return joinList.join("/");
        }
        async _EntryToFile(entry) {
            return new Promise((resolve) => {
                entry.file((file) => {
                    resolve(file);
                }, (error) => {
                    resolve(null);
                })
            });
            
        }
        async _ListEntry(entry) {
            return new Promise((resolve) => {
                entry.createReader().readEntries((entires) => {
                    resolve(entires);
                }, (error) => {
                    resolve([]);
                });
            });
        }


        _GetPlatform() {
            let isDesktop = false;
            let isNWJS = false;
            let isElectron = false;
            let isCordova = false;
            let isFileAccess = false;
            //Desktop/mobile check
            try {
                require("path");
                isDesktop = true;
            } catch (error) {};
            if (isDesktop) {
                if (typeof window["nw"] !== "undefined" && window["nw"] !== null) {
                    isNWJS = true;
                } else {
                    try {
                        require("electron");
                        isElectron = true;
                    } catch (error) {}
                }
            } else {
                const cordova = window?.["cordova"]?.["file"];
                if (typeof cordova !== "undefined" && cordova !== null) {
                    isCordova = true;
                }
            }
            //File access check
            if (typeof window["showOpenFilePicker"] !== "undefined" && window["showOpenFilePicker"] !== null) {
                isFileAccess = true;
            }
            return {
                "isNWJS": isNWJS,
                "isElectron": isElectron,
                "isCordova": isCordova,
                "isFileAccess": isFileAccess
            };
        }


        _CreateProcess(id) {
            this._processes.set(id, {
                statusActive: 0, // 0-run, 1-pause
                status: 0, // 0-running, 1-pausing, 2-aborting
            });
        } 
        _PauseProcess(id) {
            const val = this._processes.get(id);
            if (!val) {
                return;
            }
            val.status = 1;
            this._processes.set(id, val);
        }
        _ResumeProcess(id) {
            const val = this._processes.get(id);
            if (!val) {
                return;
            }
            val.status = 0;
            this._processes.set(id, val);
        } 
        _AbortProcess(id) {
            const val = this._processes.get(id);
            if (!val) {
                return;
            }
            val.status = 2;
            this._processes.set(id, val);
        }
        async _CheckProcess(id) {
            return new Promise((resolve) => {
                const val = this._processes.get(id);
                if (!val) {
                    resolve(true);
                } else if (val.status === 2) {
                    resolve(true);
                } else if (val.status === 0) {
                    resolve(false);
                } else {
                    val.statusActive = 1;
                    this._processes.set(id, val);
                    this.PostToRuntime("on-process-pause", [id]);
                    const i = setInterval(() => {
                        const val = this._processes.get(id);
                        if (val.status === 2) {
                            clearInterval(i);
                            resolve(true);
                        } else if (val.status === 0) {
                            clearInterval(i);
                            val.statusActive = 0;
                            this._processes.set(id, val);
                            this.PostToRuntime("on-process-resume", [id]);
                            resolve(false);
                        }
                    }, 1000);
                }
            });
        }
        _EndProcess(id) {
            this._processes.delete(id);
        }


        async _LoadVirtualPath() {
            const keys = await storeDB.getAllKeys();
            const values = await storeDB.getAllValues();
            const template = new Map();
            for (let i = 0, length = keys.length; i < length; i++) {
                this._virtualStorage.set(keys[i], values[i]);
                template.set(keys[i], 2);
            }
            return template;
        }
        _AddVirtualPath(storeObj) {
            //generate ID
            let newId = 0;
            while (typeof this._virtualStorage.get(String(newId)) !== "undefined") {
                newId++;
            }
            //return root folder
            this._virtualStorage.set(String(newId), storeObj);
            return String(newId);
        }
        async _SetVirtualPath(id, type) {
            //const id = e[0];
            //const type = e[1]; 0-not saved, 1 memory saved, 2-disk saved
            const obj = this._virtualStorage.get(id);
            if (typeof obj === "undefined") {
                return false;
            }
            if (type === 2) {
                if (!(obj.some((el) => el instanceof FileSystemHandle))) {
                    return false;
                }
                storeDB.set(id, obj);
            } else if (type === 1) {
                await storeDB.remove(id);
            } else {
                await storeDB.remove(id);
                this._virtualStorage.delete(id);
            }
            return true;
        }
        async __GetVirtualPath(path, isFolderList, isFileList, isRecurse, create, id) {
            /*
            const path = e[0].split("/"); //string - path/to/search
            const isFolderList = e[1]; //boolean - list folders (1st level)
            const isFileList = e[2]; //boolean - list files (1st level)
            const isRecurse = e[3]; //boolean - list in recursive (nth levels)
            const create = e[4]; //0 not create, 1-create folder, 2-create file
            const id = e[5]; //string id of the process
            */
            path = path.split("/");
            const data = [];
            const result = [false, data]; // [success, data[]]

            //zero level exception
            if (path[0] === "") {
                result[0] = true;
                data.push(["", ""]);
                if (isFolderList) {
                    const stringFolders = new Set();
                    if (isRecurse) {
                        const it = this._virtualStorage.entries();
                        for (const [key, value] of it) {
                            stringFolders.add(key + "/");
                            for (const item of value) {
                                if (item instanceof File && item["webkitRelativePath"] !== "") {
                                    const path = item["webkitRelativePath"].split("/");
                                    path.pop();
                                    for (let i = 0, length = path.length; i < length; i++) {
                                        stringFolders.add(path.slice(0, i + 1).join("/") + "/");
                                    }
                                } else if (item instanceof FileSystemDirectoryHandle) {
                                    let waited = [[item, ""]];
                                    while (waited.length !== 0) {
                                        const newWaited = [];
                                        for (const item of waited) {
                                            const handle = item[0];
                                            const root = item[1];
                                            const path = this._JoinStr(root, handle["name"]) + "/";
                                            data.push([handle, key + "/" + path]);
                                            for await (const item of handle.values()) {
                                                if (item["kind"] === "directory") {
                                                    newWaited.push([item, path]);
                                                }
                                            }
                                        }
                                        waited = newWaited;
                                        if (await this._CheckProcess(id)) {
                                            return [undefined, []];
                                        }
                                    }
                                } else if (item?.["isDirectory"]) {
                                    let waited = [[item, ""]];
                                    while (waited.length !== 0) {
                                        const newWaited = [];
                                        for (const item of waited) {
                                            const entry = item[0];
                                            const root = item[1];
                                            const path = this._JoinStr(root, entry["name"]) + "/";
                                            data.push([entry, key + "/" + path]);
                                            const list = await this._ListEntry(entry);
                                            for (const entry of list) {
                                                if (entry["isDirectory"]) {
                                                    newWaited.push([entry, path]);
                                                }
                                            }
                                        }
                                        waited = newWaited;
                                        if (await this._CheckProcess(id)) {
                                            return [undefined, []];
                                        }
                                    }
                                }
                                if (await this._CheckProcess(id)) {
                                    return [undefined, []];
                                }
                            }
                        }
                    } else {
                        const it = this._virtualStorage.keys();
                        for (const key of it) {
                            stringFolders.add(key + "/");
                        }
                    }
                    for (const folder of stringFolders) {
                        data.push(["", folder]);
                    }
                }
                if (isFileList) {
                    if (isRecurse) {
                        const it = this._virtualStorage.entries();
                        for (const [key, value] of it) {
                            for (const item of value) {
                                if (item instanceof File) {
                                    if (item["webkitRelativePath"] !== "") {
                                        data.push([item, key + "/" + item["webkitRelativePath"] + "/"]);
                                    } else {
                                        data.push([item, key + "/" + item["name"]]);
                                    }
                                } else if (item instanceof FileSystemHandle) {
                                    let waited = [[item, ""]];
                                    while (waited.length !== 0) {
                                        const newWaited = [];
                                        for (const item of waited) {
                                            const handle = item[0];
                                            const root = item[1];
                                            const path = this._JoinStr(root, handle["name"]);
                                            if (handle["kind"] === "directory") {
                                                for await (const item of handle.values()) {
                                                    newWaited.push([item, path + "/"]);
                                                }
                                            } else {
                                                data.push([handle, key + "/" + path]);
                                            }
                                        }
                                        waited = newWaited;
                                        if (await this._CheckProcess(id)) {
                                            return [undefined, []];
                                        }
                                    }
                                } else if (item?.["isFile"] || item?.["isDirectory"]) {
                                    let waited = [[item, ""]];
                                    while (waited.length !== 0) {
                                        const newWaited = [];
                                        for (const item of waited) {
                                            const entry = item[0];
                                            const root = item[1];
                                            const path = this._JoinStr(root, entry["name"]);
                                            if (entry["isDirectory"]) {
                                                const list = await this._ListEntry(entry);
                                                for (const entry of list) {
                                                    newWaited.push([entry, path + "/"]);
                                                }
                                            } else if (entry["isFile"]) {
                                                data.push([await this._EntryToFile(entry), key + "/" + path]);
                                            }
                                        }
                                        waited = newWaited;
                                        if (await this._CheckProcess(id)) {
                                            return [undefined, []];
                                        }
                                    }
                                }
                                if (await this._CheckProcess(id)) {
                                    return [undefined, []];
                                }
                            }
                        }
                    }
                }
                
                return result;
            }

            //first level exception
            let obj = this._virtualStorage.get(path[0]); // array<File,File(webkitRelativePath),FileHandler,DirectoryHandler,FileEntry,DirectoryEntry>   ||   File, FileHandler, FileEntry
            if (typeof obj === "undefined") {
                data.push(["", ""]);
                return result;
            }

            //search folder path
            let objParentParent = ""; // string, DirectoryHandle, DirectoryEntry
            let objParent = ""; // string, DirectoryHandle, DirectoryEntry
            let searchIndex = 1;
            let searchLength = path.length;
            while (searchIndex < searchLength) {
                let newObjParent;
                let newObj = [];
                for (const file of obj) {
                    if (file instanceof File) {
                        if (file["webkitRelativePath"] !== "" && path[searchIndex] === file["webkitRelativePath"].split("/")?.[searchIndex - 1]) {
                            newObjParent = path.slice(0, searchIndex).join("/");
                            newObj.push(file);
                        } else if (file["webkitRelativePath"] === path.slice(0, searchIndex).join("/")) {
                            newObjParent = file;
                            break;
                        } else if (file["webkitRelativePath"] === "" && path[searchIndex] === file["name"]) {
                            newObjParent = file;
                            break;
                        }
                    } else if (path[searchIndex] === file["name"]) {
                        if (file instanceof FileSystemDirectoryHandle) {
                            newObjParent = file;
                            for await (const handle of file.values()) {
                                newObj.push(handle);
                            }
                        } else if (file instanceof FileSystemFileHandle) {
                            newObjParent = file;
                        } else if (file["isDirectory"]) {
                            newObjParent = file;
                            newObj = await this._ListEntry(file);
                        } else if (file["isFile"]) {
                            newObjParent = await this._EntryToFile(file);
                        }
                        break;
                    }
                }
                if (typeof newObjParent === "undefined") {
                    obj = null;
                    break;
                }
                searchIndex++;
                if (newObjParent instanceof File || newObjParent instanceof FileSystemFileHandle || newObjParent["isFile"]) {
                    obj = newObjParent;
                    break;
                }
                objParentParent = objParent;
                objParent = newObjParent;
                obj = newObj;
            }

            //undo if in wrong end
            if (searchIndex >= searchLength) {
                /*console.log(objParentParent);
                console.log(objParent);
                console.log(obj);*/
                if (create === 1 && obj instanceof FileSystemFileHandle) {
                    searchIndex--;
                } else if (create === 2 && !(obj instanceof FileSystemFileHandle)) {
                    if (objParentParent !== "") {
                        await objParentParent["removeEntry"](objParent["name"], {"recursive": true});
                        objParent = objParentParent;
                        obj = [];
                        searchIndex--;
                    } else {
                        data.push(["", path.slice(0, searchIndex).join("/") + "/"]);
                        return  result;
                    }
                }
            }
            
            //end when not found, might create
            if (searchIndex < searchLength) {
                if (create === 0 || (create !== 0 && !(objParent instanceof FileSystemDirectoryHandle))) {
                    if (obj instanceof File || obj instanceof FileSystemFileHandle) {
                        data.push([obj, path.slice(0, searchIndex).join("/")]);
                    } else {
                        data.push(["", path.slice(0, searchIndex).join("/") + "/"]);
                    }
                } else {
                    if (obj instanceof FileSystemFileHandle) {
                        await objParent["removeEntry"](obj["name"], {"recursive": true});
                        searchIndex--;
                    }
                    /*console.log(path);
                    console.log("index: " + searchIndex);
                    console.log(objParent);
                    console.log(obj);*/
                    result[0] = true;
                    while (searchIndex < searchLength - 1) {
                        objParent = await objParent["getDirectoryHandle"](path[searchIndex], {create: true});
                        searchIndex++;
                    }
                    //console.log(objParent);
                    if (create === 1) {
                        try {
                            await objParent["removeEntry"](path[searchIndex], {"recursive": true});
                            obj = await objParent["getDirectoryHandle"](path[searchIndex], {"create": true});
                        } catch (error) {
                            console.error(error);
                        }
                    } else {
                        try {
                            await objParent["removeEntry"](path[searchIndex], {"recursive": true});
                            obj = await objParent["getFileHandle"](path[searchIndex], {"create": true});
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    data.push([obj, ""]);
                }
                return result;
            }

            //end if single data
            result[0] = true;
            if (obj instanceof File || obj instanceof FileSystemFileHandle || obj?.["isFile"]) {
                data.push([obj, ""]);
                return result;
            }

            //end data list (with abort option)
            if (objParent instanceof FileSystemDirectoryHandle) {
                data.push([objParent, ""]);
            } else {
                data.push(["", ""]);
            }
            if (isFolderList) {
                const stringFolders = new Set();
                if (isRecurse) {
                    for (const item of obj) {
                        if (item instanceof File && item["webkitRelativePath"] !== "") {
                            const path = item["webkitRelativePath"].split("/");
                            path.pop();
                            for (let i = 0, length = path.length; i < length; i++) {
                                stringFolders.add(path.slice(0, i + 1).join("/") + "/");
                            }
                        } else if (item instanceof FileSystemDirectoryHandle) {
                            let waited = [[item, ""]];
                            while (waited.length !== 0) {
                                const newWaited = [];
                                for (const item of waited) {
                                    const handle = item[0];
                                    const root = item[1];
                                    const path = this._JoinStr(root, handle["name"]) + "/";
                                    data.push([handle, path]);
                                    for await (const item of handle.values()) {
                                        if (item["kind"] === "directory") {
                                            newWaited.push([item, path]);
                                        }
                                    }
                                }
                                waited = newWaited;
                                if (await this._CheckProcess(id)) {
                                    return [undefined, []];
                                }
                            }
                        } else if (item?.["isDirectory"]) {
                            let waited = [[item, ""]];
                            while (waited.length !== 0) {
                                const newWaited = [];
                                for (const item of waited) {
                                    const entry = item[0];
                                    const root = item[1];
                                    const path = this._JoinStr(root, entry["name"]) + "/";
                                    data.push([entry, path]);
                                    const list = await this._ListEntry(entry);
                                    for (const entry of list) {
                                        if (entry["isDirectory"]) {
                                            newWaited.push([entry, path]);
                                        }
                                    }
                                }
                                waited = newWaited;
                                if (await this._CheckProcess(id)) {
                                    return [undefined, []];
                                }
                            }
                        }
                        if (await this._CheckProcess(id)) {
                            return [undefined, []];
                        }
                    }
                } else {
                    for (const item of obj) {
                        if (item instanceof File && item["webkitRelativePath"] !== "") {
                            stringFolders.add(item["webkitRelativePath"].split("/")[0] + "/");
                        } else if (item instanceof FileSystemDirectoryHandle) {
                            data.push([item, item["name"] + "/"]);
                        } else if (item?.["isDirectory"]) {
                            data.push(["", item["name"] + "/"]);
                        }
                    }
                }
                for (const folder of stringFolders) {
                    data.push(["", folder]);
                }
            }
            if (isFileList) {
                if (isRecurse) {
                    for (const item of obj) {
                        if (item instanceof File) {
                            if (item["webkitRelativePath"] !== "") {
                                data.push([item, item["webkitRelativePath"] + "/"]);
                            } else {
                                data.push([item, item["name"]]);
                            }
                        } else if (item instanceof FileSystemHandle) {
                            let waited = [[item, ""]];
                            while (waited.length !== 0) {
                                const newWaited = [];
                                for (const item of waited) {
                                    const handle = item[0];
                                    const root = item[1];
                                    const path = this._JoinStr(root, handle["name"]);
                                    if (handle["kind"] === "directory") {
                                        for await (const item of handle.values()) {
                                            newWaited.push([item, path + "/"]);
                                        }
                                    } else {
                                        data.push([handle, path]);
                                    }
                                }
                                waited = newWaited;
                                if (await this._CheckProcess(id)) {
                                    return [undefined, []];
                                }
                            }
                        } else if (item?.["isFile"] || item?.["isDirectory"]) {
                            let waited = [[item, ""]];
                            while (waited.length !== 0) {
                                const newWaited = [];
                                for (const item of waited) {
                                    const entry = item[0];
                                    const root = item[1];
                                    const path = this._JoinStr(root, entry["name"]);
                                    if (entry["isDirectory"]) {
                                        const list = await this._ListEntry(entry);
                                        for (const entry of list) {
                                            newWaited.push([entry, path + "/"]);
                                        }
                                    } else if (entry["isFile"]) {
                                        data.push([await this._EntryToFile(entry), path]);
                                    }
                                }
                                waited = newWaited;
                                if (await this._CheckProcess(id)) {
                                    return [undefined, []];
                                }
                            }
                        }
                        if (await this._CheckProcess(id)) {
                            return [undefined, []];
                        }
                    }
                } else {
                    for (const item of obj) {
                        if (item instanceof File && item["webkitRelativePath"] === "") {
                            data.push([item, item["name"]]);
                        } else if (item instanceof FileSystemFileHandle) {
                            data.push([item, item["name"]]);
                        } else if (item?.["isFile"]) {
                            data.push([item, item["name"]]);
                        }
                    }
                }
            }
            return result;
        }
        async _GetVirtualPath(path, isFolderList, isFileList, isRecurse, create, id) {
            this._CreateProcess(id);
            /*const it = this._processes.entries();
            for (const [key, value] of it) {
                console.log("key: " + key + " value:" + JSON.stringify(value));
            }
            console.log(await this._CheckProcess(id));*/
            const result = await this.__GetVirtualPath(path, isFolderList, isFileList, isRecurse, create, id);
            this._EndProcess(id);
            return result;
        }


        _SetDropHandle(type) {
            //const type = e[0]; //0-General, 1-FileAccess, 2-Desktop (NWJS/Electron)
            if (type === 0) {
                this._DropHandle = this._DropGeneralHandle;
            } else if (type === 1) {
                this._DropHandle = this._DropFileAccessHandle;
            } else {
                this._DropHandle = this._DropDesktopHandle;
            }
        }
        _EnableDrop(isDropEnable) {
            this._isDropEnable = isDropEnable;
        }

        _DragHandle(event) {
            const isContainFile = event["dataTransfer"]["types"]["indexOf"]("Files");
            if (isContainFile === -1) {
                return;
            }
            const offset = document.getElementsByTagName("canvas")[0].getBoundingClientRect();
            const x = event["pageX"] - offset.x;
            const y = event["pageY"] - offset.y;
            if (this._dragTimeout === 0) {
                this._dragTimeout = setTimeout(this._DragEndHandle, 200, x, y, this);
                this.PostToRuntime("on-drag-start", [x, y]);
            } else {
                clearTimeout(this._dragTimeout);
                this._dragTimeout = setTimeout(this._DragEndHandle, 200, x, y, this);
            }
            this.PostToRuntime("on-drag", [x, y]);
        }
        _DragEndHandle(x, y, THIS=this) {
            clearTimeout(THIS._dragTimeout);
            THIS._dragTimeout = 0;
            THIS.PostToRuntime("on-drag-end", [x, y]);
        }
        _DropHandle(event) {
            return this._DropGeneralHandle(event);
        }

        async _DropGeneralHandle(event) {
            if (typeof event["dataTransfer"]["items"] === "undefined") {
                return;
            }
            //get data
            const data = [];
            for (let i = 0, length = event["dataTransfer"]["items"]["length"]; i < length; i++) {
                const item = event["dataTransfer"]["items"][i];
                if (item["kind"] === "file") {
                    let entry = null;
                    if (typeof item["webkitGetAsEntry"] !== "undefined") {
                        entry = item["webkitGetAsEntry"]();
                    }
                    if (entry === null) {
                        entry = item["getAsFile"]();
                    }
                    data.push(entry);
                }
            }
            if (data.length === 0) {
                return;
            }
            //list data path
            const root = "virtual: /" + this._AddVirtualPath(data);
            const paths = [];
            const types = [];
            const sizes = [];
            const modifies = [];
            for (let file of data) {
                if (file instanceof File) {
                    paths.push("/" + this._JoinStr(root, file["name"]));
                    types.push(file["type"]);
                    sizes.push(file["size"]);
                    modifies.push(file["lastModified"]);
                } else {
                    if (file["isDirectory"]) {
                        paths.push("/" + this._JoinStr(root, file["name"]) + "/");
                        types.push("");
                        sizes.push(0);
                        modifies.push(0);
                    } else {
                        file = await this._EntryToFile(file);
                        paths.push("/" + this._JoinStr(root, file["name"]));
                        types.push(file["type"]);
                        sizes.push(file["size"]);
                        modifies.push(file["lastModified"]);
                    }
                }
            }
            //send
            const offset = document.getElementsByTagName("canvas")[0].getBoundingClientRect();
            const x = event["pageX"] - offset.x;
            const y = event["pageY"] - offset.y;
            this._DragEndHandle(x, y);
            this.PostToRuntime("on-drop", [x, y, [paths, types, sizes, modifies]]);
        }
        async _DropFileAccessHandle(event) {
            if (typeof event["dataTransfer"]["items"] === "undefined") {
                return;
            }
            //get data
            let data = [];
            for (const item of event["dataTransfer"]["items"]) {
                if (typeof item["getAsFileSystemHandle"] !== "undefined") {
                    data.push(item["getAsFileSystemHandle"]());
                } else {
                    data(item["getAsFile"]());
                }
            }
            if (data.length === 0) {
                return;
            }
            data = await Promise.all(data);
            //list data path
            const root = "virtual: /" + this._AddVirtualPath(data);
            const paths = [];
            const types = [];
            const sizes = [];
            const modifies = [];
            for (let file of data) {
                if (file instanceof File) {
                    paths.push("/" + this._JoinStr(root, file["name"]));
                    types.push(file["type"]);
                    sizes.push(file["size"]);
                    modifies.push(file["lastModified"]);
                } else {
                    if (file["kind"] === "directory") {
                        paths.push("/" + this._JoinStr(root, file["name"]) + "/");
                        types.push("");
                        sizes.push(0);
                        modifies.push(0);
                    } else {
                        file = await file.getFile();
                        paths.push("/" + this._JoinStr(root, file["name"]));
                        types.push(file["type"]);
                        sizes.push(file["size"]);
                        modifies.push(file["lastModified"]);
                    }
                }
            }
            //send
            const offset = document.getElementsByTagName("canvas")[0].getBoundingClientRect();
            const x = event["pageX"] - offset.x;
            const y = event["pageY"] - offset.y;
            this._DragEndHandle(x, y);
            this.PostToRuntime("on-drop", [x, y, [paths, types, sizes, modifies]]);
        }
        _DropDesktopHandle(event) {
            if (typeof event["dataTransfer"]["items"] === "undefined") {
                return;
            }
            //get data
            const data = [];
            const dataVirtual = [];
            for (let i = 0, length = event["dataTransfer"]["items"]["length"]; i < length; i++) {
                const item = event["dataTransfer"]["items"][i];
                if (item["kind"] === "file") {
                    let entry = item["getAsFile"]();
                    if (entry["path"] !== "") {
                        data.push(entry);
                    } else {
                        dataVirtual.push(entry);
                    }
                }
            }
            if (data.length === 0 && dataVirtual.length === 0) {
                return;
            }
            //list desktop data path
            const paths = [];
            const types = [];
            const sizes = [];
            const modifies = [];
            const fs = require("node:fs");
            const path = require("node:path");
            for (const file of data) {
                if (fs["existsSync"](file["path"]) && fs["lstatSync"](file["path"])["isDirectory"]()) {
                    paths.push(path["join"](file["path"], "/"));
                    types.push("");
                    sizes.push(0);
                    modifies.push(parseInt(fs["statSync"](file["path"])["mtimeMs"]));
                } else {
                    paths.push(file["path"]);
                    types.push(file["type"]);
                    sizes.push(file["size"]);
                    modifies.push(file["lastModified"]);
                }
            }

            //list virtual data path
            if (dataVirtual.length !== 0) {
                const root = "virtual: /" + this._AddVirtualPath(dataVirtual);
                for (const file of dataVirtual) {
                    paths.push("/" + this._JoinStr(root, file["name"]));
                    types.push(file["type"]);
                    sizes.push(file["size"]);
                    modifies.push(file["lastModified"]);
                }
            }

            //send
            const offset = document.getElementsByTagName("canvas")[0].getBoundingClientRect();
            const x = event["pageX"] - offset.x;
            const y = event["pageY"] - offset.y;
            this._DragEndHandle(x, y);
            this.PostToRuntime("on-drop", [x, y, [paths, types, sizes, modifies]]);
        }


        _SetDialogHandle(type) {
            //const type = e[0]; //0-General, 1-FileAccess, 2-NWJS, 3-Electron
            if (type === 0) {
                this._OpenDialog = this._DialogGeneralHandle;
            } else if (type === 1) {
                this._OpenDialog = this._DialogFileAccessHandle;
            } else if (type === 2) {
                this._OpenDialog = this._DialogNWJSHandle;
            } else {
                this._OpenDialog = this._DialogElectronHandle;
            }
        }
        async _OpenDialog(type, accept, suggest) {
            return await this._DialogGeneralHandle(type, accept, suggest);
        }

        async _DialogGeneralHandle(type, accept) {
            //const type = e[0]; //0-file, 1-multiple, 2-folder, 3-save(same as file open)
            //const accept = e[1]; //string
            const openPicker = () => {
                return new Promise((resolve) => {
                    let fileInput = document.createElement("input");
                    fileInput.setAttribute("type", "file");
                    if (type === 1) {
                        fileInput.setAttribute("multiple", "multiple");
                    } else if (type === 2) {
                        fileInput.setAttribute("webkitdirectory", "webkitdirectory");
                    }
                    if (accept !== "") {
                        fileInput.setAttribute("accept", accept);
                    }
                    
                    fileInput.onchange = () => {
                        window.removeEventListener("click", exitClick);
                        resolve(fileInput.files);
                    };
                    const exitClick = () => {
                        window.removeEventListener("click", exitClick);
                        resolve([]);
                    };
                    fileInput.click();
                    //hack for click trigger
                    setTimeout(function () {
                        window.addEventListener("click", exitClick);
                    }, 1);
                });
            }
            const data = await openPicker();
            const paths = [];
            const types = [];
            const sizes = [];
            const modifies = [];
            if (data.length === 0) {
                return [paths, types, sizes, modifies];
            }
            //list data path
            const root = "virtual: /" + this._AddVirtualPath(data);
            if (data[0]["webkitRelativePath"] === "") {
                for (const file of data) {
                    paths.push("/" + this._JoinStr(root, file["name"]));
                    types.push(file["type"]);
                    sizes.push(file["size"]);
                    modifies.push(file["lastModified"]);
                }
            } else {
                let name = data[0]["webkitRelativePath"].split("/")[0] + "/";
                paths.push("/" + this._JoinStr(root, name));
                types.push("");
                sizes.push(0);
                modifies.push(0);
            }
            //send
            return [paths, types, sizes, modifies];
        }
        async _DialogFileAccessHandle(type, accept, suggest) {
            //const type = e[0]; //0-file, 1-multiple, 2-folder, 3-save
            //const accept = e[1]; //string
            //const suggest = e[2]; //string
            const options = {};
            let data = [];
            const paths = [];
            const types = [];
            const sizes = [];
            const modifies = [];
            if (accept.length !== 0) {
                options["types"] = accept;
            }
            try {
                if (type === 0) {
                    options["multiple"] = false;
                    data = await window.showOpenFilePicker(options);
                } else if (type === 1) {
                    options["multiple"] = true;
                    data = await window.showOpenFilePicker(options);
                } else if (type === 2) {
                    options["id"] = 0;
                    options["mode"] = "readwrite";
                    options["startIn"] = "downloads";
                    delete options["types"];
                    data = await window.showDirectoryPicker(options);
                    data = [data];
                } else if (type === 3) {
                    options["multiple"] = false;
                    options["suggestName"] = suggest;
                    data = await window.showSaveFilePicker(options);
                    data = [data];
                }
            } catch (error) {
                console.error(error);
                return [paths, types, sizes, modifies];
            }
            if (data.length === 0) {
                return [paths, types, sizes, modifies];
            }
            //list data path
            const root = "virtual: /" + this._AddVirtualPath(data);
            for (let file of data) {
                if (file["kind"] === "directory") {
                    paths.push("/" + this._JoinStr(root, file["name"]) + "/");
                    types.push("");
                    sizes.push(0);
                    modifies.push(0);
                } else {
                    file = await file.getFile();
                    paths.push("/" + this._JoinStr(root, file["name"]));
                    types.push(file["type"]);
                    sizes.push(file["size"]);
                    modifies.push(file["lastModified"]);
                }
            }
            //send
            return [paths, types, sizes, modifies];
        }
        async _DialogNWJSHandle(type, accept, suggest) {
            //const type = e[0]; //0-file, 1-multiple, 2-folder, 3-save
            //const accept = e[1]; //string
            //const suggest = e[2]; //string
            const openPicker = () => {
                return new Promise((resolve) => {
                    let fileInput = document.createElement("input");
                    fileInput.setAttribute("type", "file");
                    if (type === 1) {
                        fileInput.setAttribute("multiple", "multiple");
                    } else if (type === 2) {
                        fileInput.setAttribute("nwdirectory", "nwdirectory");
                    } else if (type === 3) {
                        fileInput.setAttribute("nwsaveas", suggest);
                    }
                    if (accept !== "") {
                        fileInput.setAttribute("accept", accept);
                    }
                    //fileInput.setAttribute("nwworkingdir", "nwworkingdir");
                    const exitClick = () => {
                        window.removeEventListener("click", exitClick);
                        resolve([]);
                    };
                    fileInput.onchange = () => {
                        window.removeEventListener("click", exitClick);
                        resolve(fileInput.files);
                    };
                    fileInput.click();
                    //hack for click trigger
                    setTimeout(function () {
                        window.addEventListener("click", exitClick);
                    }, 1);
                });
            };
            const data = await openPicker();
            const paths = [];
            const types = [];
            const sizes = [];
            const modifies = [];
            if (data.length === 0) {
                return [paths, types, sizes, modifies];;
            }
            const fs = require("node:fs");
            const path = require("node:path");
            for (const file of data) {
                if (fs["existsSync"](file["path"]) && fs["lstatSync"](file["path"])["isDirectory"]()) {
                    paths.push(path["join"](file["path"], "/"));
                    types.push("");
                    sizes.push(0);
                    modifies.push(parseInt(fs["statSync"](file["path"])["mtimeMs"]));
                } else {
                    paths.push(file["path"]);
                    types.push(file["type"]);
                    sizes.push(file["size"]);
                    modifies.push(file["lastModified"]);
                }
            }

            //send
            return [paths, types, sizes, modifies];
        }
        async _DialogElectronHandle(type, accept, suggest) {
            return [[],[],[],[]];
        }


        _CordovaList(id, path, isRootList, isFolderList=false, isFileList=false, isRecurse=false, isShowNormal=true, isShowHidden=true, orderBy="name|type|size|date", create=0) {
            window.FileEntry;
            window.DirectoryEntry;
        }
        _CordovaRead(id, path, start, end) {

        }
        _CordovaWrite(id, path, data, position, mode="write|append|insert", deleteCount) {

        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(FileManagerRuntimeDOMHandler);
};