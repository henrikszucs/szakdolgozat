"use strict";
{
    const C3 = self.C3;
    C3.Plugins.RobotKaposzta_Desktop.Acts = {
        ExecCommand(tag, command, args, windowHide, timeout, detached, cwd, env, argv0, shell, killSignal) {
            this.execTags.push(tag);
            this.PostToDOM("exec-command", {
                "tag": tag,
                "command": command,
                "args": args.split(" "),
                "is-hide": windowHide,
                "timeout": timeout,
                "is-detached": detached,
                "cwd": cwd,
                "env": env,
                "argv0": argv0,
                "shell": shell,
                "killsignal": killSignal
            });
        },
        ExecMessage(tag, message) {
            this.PostToDOM("exec-message", {
                "tag": tag,
                "message": message
            });
        },
        ExecStop(tag, message) {
            const index = this.execTags.indexOf(tag);
            if (index !== -1) {
                this.execTags.splice(index, 1);
            }
            this.PostToDOM("exec-stop", {
                "tag": tag,
                "message": message
            });
        },

        OpenContextMenu(path, x, y) {
            this.PostToDOM("open-context-menu", {
                "path": path,
                "x": x,
                "y": y
            });
        },
        CloseContextMenu() {
            this.PostToDOM("close-context-menu");
        },
        SetWindowMenu(path) {
            this.PostToDOM("set-window-menu", {
                "path": path
            });
        },
        RemoveWindowMenu() {
            this.PostToDOM("remove-window-menu");
        },
        SetTrayMenu(tag, path, icon, tooltip) {
            this.PostToDOM("set-tray-menu", {
                "tag": tag,
                "path": path,
                "icon": icon,
                "tooltip": tooltip
            });
        },
        RemoveTrayMenu(tag) {
            this.PostToDOM("remove-tray-menu", {
                "tag": tag
            });
        },
        SetDockMenu(path) {
            this.PostToDOM("set-dock-menu", {
                "path": path
            });
        },
        RemoveDockMenu() {
            this.PostToDOM("remove-dock-menu");
        },
        SetThumbarMenu(path) {
            this.PostToDOM("set-thumbar-menu", {
                "path": path
            });
        },
        RemoveThumbarMenu() {
            this.PostToDOM("remove-thumbar-menu");
        },

        SetMenuItem(path, index, type, text, subtext, icon, enabled, checked, visibility, hotkey) {
            if (type === 0) {
                type = "normal";
            } else if (type === 1) {
                type = "separator";
            } else if (type === 2) {
                type = "checkbox";
            } else {
                type = "radio";
            }
            this._SetMenuItem({
                "path": path,
                "index": index,
                "type": type,
                "text": text,
                "subtext": subtext,
                "icon": icon,
                "enabled": enabled,
                "checked": checked,
                "visible": visibility,
                "hotkey": hotkey
            });
        },
        SetMenuItemType(path, type) {
            if (type === 0) {
                type = "normal";
            } else if (type === 1) {
                type = "separator";
            } else if (type === 2) {
                type = "checkbox";
            } else {
                type = "radio";
            }
            this._SetMenuItem({
                "path": path,
                "type": type
            });
        },
        SetMenuItemIndex(path, index) {
            this._SetMenuItem({
                "path": path,
                "index": index
            });
        },
        SetMenuItemText(path, text) {
            this._SetMenuItem({
                "path": path,
                "text": text
            });
        },
        SetMenuItemSubtext(path, subText) {
            this._SetMenuItem({
                "path": path,
                "subText": subText
            });
        },
        SetMenuItemIcon(path, icon) {
            this._SetMenuItem({
                "path": path,
                "icon": icon
            });
        },
        SetMenuItemEnabled(path, mode) {
            this._SetMenuItem({
                "path": path,
                "enabled": mode === 0
            });
        },
        SetMenuItemChecked(path, state) {
            this._SetMenuItem({
                "path": path,
                "checked": state === 0
            });
        },
        SetMenuItemVisible(path, visibility) {
            this._SetMenuItem({
                "path": path,
                "visible": visibility === 0
            });
        },
        SetMenuItemHotkey(path, hotkey) {
            this._SetMenuItem({
                "path": path,
                "hotkey": hotkey
            });
        },
        CopyMenuItem(srcPath, destPath, mode) {
            this._CopyMenuItem(srcPath, destPath, mode===1);
        },
        RemoveMenuItem(path) {
            this._RemoveMenuItem(path);
        },

        Maximize() {
            this.PostToDOM("maximize");
        },
        Unmaximize() {
            this.PostToDOM("unmaximize");
        },
        Minimize() {
            this.PostToDOM("minimize");
        },
        Restore() {
            this.PostToDOM("restore");
        },
        SetSize(width, height, mode, isAnimate) {
            this.PostToDOM("set-size", {
                "width": width,
                "height": height,
                "is-content": mode === 1,
                "is-animate": isAnimate
            });
        },
        SetPosition(x, y, isAnimate) {
            this.PostToDOM("set-size", {
                "x": x,
                "y": y,
                "is-animate": isAnimate
            });
        },
        SetMaximumSize(width, height) {
            this.PostToDOM("set-maximum-size", {
                "width": width,
                "height": height
            });
        },
        SetMinimumSize(width, height) {
            this.PostToDOM("set-minimum-size", {
                "width": width,
                "height": height
            });
        },
        SetOpacity(opacity) {
            this.PostToDOM("set-opacity", {
                "opacity": opacity
            });
        },
        SetVisible(visibility) {
            this.PostToDOM("set-visible", {
                "is-visible": visibility === 0
            });
        },
        MoveTop() {
            this.PostToDOM("move-top");
        },
        RequestAttention(mode) {
            this.PostToDOM("request-attention", {
                "is-attention": mode === 0
            });
        },
        SetProgress(progress, type) {
            if (type === 0) {
                type = "none";
            } else if (type === 1) {
                type = "normal";
            } else if (type === 2) {
                type = "indeterminate";
            } else if (type === 3) {
                type = "error";
            } else {
                type = "paused";
            }
            this.PostToDOM("set-progress", {
                "progress": progress,
                "type": type
            });
        },
        ShowDevTools(mode) {
            if (mode === 0) {
                mode = "right";
            } else if (mode === 1) {
                mode = "bottom";
            } else if (mode === 2) {
                mode = "left";
            } else {
                mode = "undocked";
            }
            this.PostToDOM("show-dev-tool", {
                "mode": mode
            });
        },
        OpenWindow(msg, isFrame) {
            this.PostToDOM("window-open", {
                "message": msg,
                "is-frame": isFrame
            });
        },
        SendWindowMessage(id, tag, msg) {
            this.PostToDOM("window-message", {
                "to": id,
                "tag": tag,
                "message": msg
            });
        },
        CloseWindow(id) {
            this.PostToDOM("window-close", {
                "id": id
            });
        },

        SetWindowFrame(visibility, message) {
            this.PostToDOM("set-window-frame", {
                "is-enabled": visibility === 0,
                "message": message
            });
        },
        SetTaskbar(visibility) {
            this.PostToDOM("set-taskbar", {
                "is-enabled": visibility === 0
            });
        },
        SetKiosk(state) {
            this.PostToDOM("set-kiosk", {
                "is-enabled": state === 0
            });
        },
        SetAlwaysOnTop(state, level, relLevel) {
            this.PostToDOM("set-always-on-top", {
                "is-enabled": state === 0,
                "level": level,
                "relative-level": relLevel
            });
        },
        SetVisibleOnAllWorkspaces(state, fullscreen) {
            this.PostToDOM("set-visible-on-all-workspaces", {
                "is-enabled": state === 0,
                "is-visible-on-fullscreen": fullscreen === 0,
            });
        },
        SetProtection(state) {
            this.PostToDOM("set-protection", {
                "is-enabled": state === 0
            });
        },
        SetEnabled(state) {
            this.PostToDOM("set-enabled", {
                "is-enabled": state === 0
            });
        },
        SetClosable(state) {
            this.PostToDOM("set-closable", {
                "is-enabled": state === 0
            });
        },
        SetResizable(state) {
            this.PostToDOM("set-resizable", {
                "is-enabled": state === 0
            });
        },
        SetMovable(state) {
            this.PostToDOM("set-movable", {
                "is-enabled": state === 0
            });
        },
        SetMaximizable(state) {
            this.PostToDOM("set-maximizable", {
                "is-enabled": state === 0
            });
        },
        SetMinimizable(state) {
            this.PostToDOM("set-minimizable", {
                "is-enabled": state === 0
            });
        },
        SetFullscreenable(state) {
            this.PostToDOM("set-fullscreenable", {
                "is-enabled": state === 0
            });
        },
        SetClosePrevent(state) {
            this.PostToDOM("set-close-prevent", {
                "is-enabled": state === 0
            });
        },
        SetInstancePrevent(state) {
            this.PostToDOM("set-instance-prevent", {
                "is-enabled": state === 0
            });
        },
    };
};