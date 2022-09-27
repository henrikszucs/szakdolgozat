"use strict";
{
    const C3 = self.C3;
    C3.Plugins.RobotKaposzta_Clipboard.Exps = {
        ReadTag() {
            return this._readTag();
        },
        ReadError() {
            return this._readError;
        },
        ReadTypeCount() {
           return Object.keys(this._readData).length;
        },
        ReadTypeAt(at) {
            const data = Object.keys(this._readData)[at];
            if (typeof (data) !== "undefined") return data;
            return "";
        },
        ReadData(type) {
            const data = this._readData[type];
            if (typeof (data) !== "undefined") return data;
            return "";
        },
        DragPositionX() {
            return this._dragPosX;
        },
        DragPositionY() {
            return this._dragPosY;
        },

        WriteTag() {
            return this._writeTag;
        },
        WriteError() {
            return this._writeError;
        }
    };
};