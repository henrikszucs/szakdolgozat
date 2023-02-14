"use strict";
{
    const C3 = self.C3;

    self.C3.Plugins.RobotKaposzta_FileManager.Acts = {
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
            // virtual:\<id>\path\to\file
            // /virtual:/<id>/path/to/file
            path = this._Normalize(path);
            if (path[0] === "/") {
                path = path.substring(1);
            }
            path = path.replaceAll("\\", "/");
            path = path.split("/");
            //console.log(path)
            if (path[0] !== "virtual:") {
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


        SetPermission(tag, path, owner, group, world) {

        },
        List(tag, path, type) {
            
        },
        CheckPath(tag, path, type, endItem) {

        },
        CreatePath(tag, path, endItem) {

        },
        ReadTextFile(tag, path, start, end, encoding) {

        },
        ReadBinaryFile(tag, path, start, end, binaryData) {

        },
        WriteTextFile(tag, path, text, position, encoding, mode) {

        },
        WriteBinaryFile(tag, path, binaryData, position, mode) {

        },
        Rename(tag, src, name) {

        },
        Move(tag, src, dest) {

        },
        Copy(tag, src, dest) {

        },
        Delete(tag, src) {

        },
        ManageProcess(action, tag) {

        }
	};
};