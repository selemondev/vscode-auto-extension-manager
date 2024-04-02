import * as vscode from "vscode";

export const executeInstallCommand = (cmd: string, newTerminal = true) => {
    let terminal = vscode.window.activeTerminal;

    if (!terminal || newTerminal) {
        terminal = vscode.window.createTerminal('Extension Installer');
    };

    terminal.show();
    terminal.sendText(cmd);
}

export const executeUnInstallCommand = (cmd: string, newTerminal = true) => {
    let terminal = vscode.window.activeTerminal;

    if (!terminal || newTerminal) {
        terminal = vscode.window.createTerminal('Extension Uninstaller');
    };

    terminal.show();
    terminal.sendText(cmd);
}