"use strict";
{
    const C3 = self.C3;
    C3.Plugins.RobotKaposzta_Clipboard.Cnds = {
        OnPermissonGranted(type) {
            return this._permissionReqType === type;
        },
        OnPermissionDenied(type) {
            return this._permissionReqType === type;
        },

        IsReadSupport(type) {
            if (type === 0 && this._isReadTextSupport === true && this._isReadDataSupport === false) {
                return true;
            }
            if (type === 1 && this._isReadTextSupport === true && this._isReadDataSupport === true) {
                return true;
            }
            return false;
        },
        OnAnyRead() {
            return true;
        },
        OnRead(tag) {
            return this._readTag === tag;
        },
        OnAnyReadError() {
            return true;
        },
        OnReadError(tag) {
            return this._readTag === tag;
        },
        OnUserPaste() {
            return true;
        },
        IsDropEnabled() {
            return this._enabledDrop;
        },
        OnUserDrop() {
            return true;
        },
        OnUserDragStart() {
            return true;
        },
        OnUserDrag() {
            return true;
        },
        OnUserDragEnd() {
            return true;
        },
        HasType(type) {
            const data = this._readData[type];
            if (typeof (data) === "undefined") return false;
            return true;
        },

        IsWriteSupport(type) {
            if (type === 0 && this._isWriteTextSupport === true && this._isWriteDataSupport === false) {
                return true;
            }
            if (type === 1 && this._isWriteTextSupport === true && this._isWriteDataSupport === true) {
                return true;
            }
            return false;
        },
        OnAnyWrite() {
            return true;
        },
        OnWrite(tag) {
            return this._writeTag === tag;
        },
        OnAnyWriteError() {
            return true;
        },
        OnWriteError(tag) {
            return this._writeTag === tag;
        },
        OnUserCopy() {
            return true;
        },
        OnUserCut() {
            return true;
        }

    };
};
