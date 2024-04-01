import * as vscode from "vscode";

export const executeCommand = (cmd: string, newTerminal = true) => {
    let terminal = vscode.window.activeTerminal;

    if (!terminal || newTerminal) {
        terminal = vscode.window.createTerminal('Extension Installer');
    };

    terminal.show();
    terminal.sendText(cmd);
}