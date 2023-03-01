"use strict";
{
    const C3 = self.C3;

    C3.Plugins.RobotKaposzta_FileManager.Exps = {
		DragPositionX(at=0) {
            return this._CssToLayer(this._dragX, this._dragY, at)[0];
        },
        DragPositionY(at=0) {
            return this._CssToLayer(this._dragX, this._dragY, at)[1];
        },


        ProcessTag() {
            return this._curTag;
        },
        ProcessProgress() {
            return this._curProgress;
        },
        PathCount() {
            return this._paths.length;
        },
        PathAt(at) {
            if (typeof this._paths[at] === "undefined") {
                return "";
            }
            return this._paths[at];
        },
        TypeAt(at) {
            if (typeof this._types[at] === "undefined") {
                return "";
            }
            return this._types[at];
        },
        SizeAt(at) {
            if (typeof this._sizes[at] === "undefined") {
                return "";
            }
            return this._sizes[at];
        },
        ModifiedAt(at) {
            if (typeof this._modifies[at] === "undefined") {
                return "";
            }
            return this._modifies[at];
        },
        ReadData() {
            return this._readData;
        },


        PathNormalize(path) {
			return this._Normalize(path);
        },
        PathJoin() {
            return this._Join(...arguments);
        },
        PathDirname(path) {
			return this._Dirname(path);
        },
        PathFilename(path)  {
			return this._Filename(path);
        },
        PathExtname(path) {
			return this._Extname(path);
        },
        GetMIMETypes(extension) {
			return this._MIMETypes(extension);
        },
        GetMIMEExtensions(mimeType) {
			return this._MIMEExtensions(mimeType);
        },
        DirectorySelf() {
            return this._Directory("self");
        },
        DirectoryHome() {
            return this._Directory("home");
        },
        DirectoryTemp() {
            return this._Directory("temp");
        },
        DirectoryAppID() {
            return this._Directory("appid");
        },
        DirectorySDcardID() {
            return this._Directory("sdcardid");
        }
	};
};