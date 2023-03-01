"use strict";
{
    const C3 = self.C3;

    C3.Plugins.RobotKaposzta_FileManager.Cnds = {
        IsWriteSupported() {
            return this._support.isNWJS || this._support.isElectron || this._support.isFileAccess;
        },
        IsDropMode(mode) {
            const boolRW = mode === 1;
            return boolRW === this._dropRW;
        },
        IsDropEnabled() {
            return this._isDropEnable;
        },
        OnDragStart() {
            return true;
        },
        OnDrag() {
            return true;
        },
        OnDragEnd() {
            return true;
        },
        OnDrop() {
            return true;
        },
        IsDialogMode(mode) {
            const boolRW = mode === 1;
            return boolRW === this._dialogRW;
        },
        OnDialogOK() {
            return true;
        },
        OnDialogCancel() {
            return true;
        },
        IsVirtualPath(path, type) {
            path = this._Normalize(path);
            if (path[0] === "/") {
                path = path.substring(1);
            }
            path = path.replaceAll("\\", "/");
            path = path.split("/");
            if (path[0].toLowerCase() !== "virtual: ") {
                return false;
            }
            const id = path[1];
            if (typeof this._virtualStorage.get(id) === "undefined") {
                return false;
            }
            if (type === 0) {
                return true;
            } else if (type === 1) {
                type = 0;
            } else if (type === 2) {
                type = 1;
            } else {
                type = 2;
            }
            return this._virtualStorage.get(id) === type;
        },


        OnStart() {
            return true;
        },
        OnPause() {
            return true;
        },
        OnResume() {
            return true;
        },
        OnProgress() {
            return true;
        },
        OnError() {
            return true;
        },
        OnAbort() {
            return true;
        },
        OnCompleted() {
            return true;
        },
		

        IsAbsolutePath(path) {
            return this._IsAbsolute(path);
        }
	};
};