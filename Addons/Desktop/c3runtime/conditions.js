"use strict";
{
    const C3 = self.C3;
    C3.Plugins.RobotKaposzta_Desktop.Cnds = {
        OnExecMessage() {
            return true;
        },
        OnExecError() {
            return true;
        },
        OnExecStop() {
            return true;
        },

        IsMenuItemExist(path) {
            
        },
        IsMenuItemType(path, type) {
            
        },
        IsMenuItemEnabled(path) {
            
        },
        IsMenuItemChecked(path) {
            
        },
        IsMenuItemVisible(path) {
            
        },
        OnAnyMenuItemClicked() {
            return true;
        },
        OnMenuItemClicked(cmpMode, path, refMode) {
            
        },

        OnScreenAdded() {
            return true;
        },
        OnScreenRemoved() {
            return true;
        },
        OnScreenChanged() {
            return true;
        },
        IsScreenMonochrome(id) {

        },
        IsScreenTouchSupport(id, type) {

        },
        IsScreenAccelometer(id, type) {

        },

        OnMaximized() {
            return true;
        },
        IsMaximized() {

        },
        OnUnmaximized() {
            return true;
        },
        OnMinimized() {
            return true;
        },
        IsMinimized() {

        },
        OnRestored() {
            return true;
        },
        OnMove() {
            return true;
        },
        IsVisible() {

        },
        OnWindowOpen() {
            return true;
        },
        OnWindowMessage() {
            return true;
        },
        OnWindowClosed() {
            return true;
        },

        IsWindowFrameVisible() {

        },
        IsTaskbarVisible() {

        },
        IsKiosk() {

        },
        IsAlwaysOnTop() {

        },
        IsVisibleOnAllWorkspaces() {

        },
        IsProtected() {

        },
        IsEnabled() {

        },
        IsClosable() {

        },
        IsResizable() {

        },
        IsMovable() {

        },
        IsMaximizable() {

        },
        IsMinimizable() {

        },
        IsFullscreenable() {

        },
        IsClosePrevent() {

        },
        OnClosePrevent() {
            return true;
        },
        IsInstancePrevent() {

        },
        OnInstancePrevent() {
            return true;
        }
    };
};