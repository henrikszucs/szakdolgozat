"use strict";
{
    const C3 = self.C3;

    C3.Plugins.RobotKaposzta_FileManager.Acts = {
        SetDropMode(mode) {
            this._SetDropMode(mode===1);
        },
		EnableDrop(mode) {
            this._SetDropEnable(mode===0);
        },
        SetDialogMode(mode) {
            this._SetDialogMode(mode===1);
        },
        async ShowDialog(type, accept, suggest) {
            //0-General, 1-FileAccess, 2-NWJS, 3-Electron
            if (await this._OpenDialog(type, accept, suggest)) {
                this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnDialogOK);
            } else {
                this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnDialogCancel);
            }
        },
        async SetVirtualPath(path, type) {
            //console.log(path)
            // virtual: \<id>\path\to\file
            // /virtual: /<id>/path/to/file
            path = this._Normalize(path);
            if (path[0] === "/") {
                path = path.substring(1);
            }
            path = path.replaceAll("\\", "/");
            path = path.split("/");
            //console.log(path)
            if (path[0] !== "virtual: ") {
                return;
            }
            const id = path[1];
            //console.log(this._virtualStorage.get(id));
            if (typeof this._virtualStorage.get(id) === "undefined") {
                return;
            }
            //console.log([id, type]);
            const result = await this.PostToDOMAsync("set-virtual-path", [id, type]);
            //console.log(result);
            if (result === true) {
                if (type !== 0) {
                    this._virtualStorage.set(id, type);
                } else {
                    this._virtualStorage.delete(id);
                }   
            }
        },

        
        async List(tag, path, type) {
            const id = this._CreateProcess(tag);
            const isFolderList = (type === 0 || type === 1 || type === 3 || type === 4);
            const isFileList = (type === 0 || type === 2 || type === 3 || type === 5);
            const isRecurse= (type === 3 || type === 4 || type === 5);
            const result = await this._List(id, path, isFolderList, isFileList, isRecurse);
            console.log(result);
            if (result === undefined) {
                this._paths = [];
                this._types = [];
                this._sizes = [];
                this._modifies = [];
                this._curTag = tag;
                this._curProgress = 1;
                this._readData = "";
                this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnAbort);
            } else if (result === false) {
                this._paths = [];
                this._types = [];
                this._sizes = [];
                this._modifies = [];
                this._curTag = tag;
                this._curProgress = 1;
                this._readData = "";
                this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnError);
            } else {
                this._paths = result[0];
                this._types = result[1];
                this._sizes = result[2];
                this._modifies = result[3];
                this._curTag = tag;
                this._curProgress = 1;
                this._readData = "";
                this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnCompleted);
            }
            this._EndProcess(id);
        },
        async CheckPath(tag, path, type, endItem) {
            const id = this._CreateProcess(tag);
            const result = await this._Check(id, path, endItem, type);
            console.log(result);
            if (result === undefined) {
                this._paths = [];
                this._types = [];
                this._sizes = [];
                this._modifies = [];
                this._curTag = tag;
                this._curProgress = 1;
                this._readData = "";
                this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnAbort);
            } else {
                this._paths = [result[1][0]];
                this._types = [result[1][1]];
                this._sizes = [result[1][2]];
                this._modifies = [result[1][3]];
                this._curTag = tag;
                this._curProgress = 1;
                this._readData = "";
                if (result[0] === false) {
                    this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnError);
                } else {
                    this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnCompleted);
                }
            }
            this._EndProcess(id);
        },
        async CreatePath(tag, path, endItem) {

        },
        async SetPermission(tag, path, owner, group, world) {
            
        },
        async ReadTextFile(tag, path, start, end, encoding) {

        },
        async ReadBinaryFile(tag, path, start, end, binaryData) {

        },
        async WriteTextFile(tag, path, text, position, encoding, mode) {

        },
        async WriteBinaryFile(tag, path, binaryData, position, mode) {

        },
        async Rename(tag, src, name) {

        },
        async Move(tag, src, dest) {

        },
        async Copy(tag, src, dest) {

        },
        async Delete(tag, src) {

        },
        async ManageProcess(action, tag) {
            //select keys
            const keys = [];
            if (action === 0 || action === 1 || action === 2) {
                const it = this._processes.entries();
                for (const [key, value] of it) {
                    if (value.tag === tag) {
                        keys.push(key);
                    }
                }
            } else {
                const it = this._processes.keys();
                for (const key of it) {
                    keys.push(key);
                }
            }
            //do the action
            if (action === 0 || action === 3) {
                for (let key of keys) {
                    this._PauseProcess(key);
                }
            } else if (action === 1 || action === 4) {
                for (let key of keys) {
                    this._ResumeProcess(key);
                }
            } else {;
                for (let key of keys) {
                    this._AbortProcess(key);
                }
            }
        }
	};
};