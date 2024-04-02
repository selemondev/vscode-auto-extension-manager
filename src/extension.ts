import * as vscode from "vscode";
import { executeInstallCommand, executeUnInstallCommand } from "./utils/getExecuteCommand";
import { getProjectDependencies } from "./utils/getProjectDeps";
import { getProjectExtensionIds } from "./utils/getProjectExtensionIds";
import { getProjectDirectory } from "./utils/getProjectDir";
import { execShell } from "./utils/getExecShellCmd";
let installedExtensions: string[] = [];
let extensionsToInstall: string[] = [];
let extensionsToUninstall: string[] = [];
const getAllExtensions = async () => {
    try {
        const output = await execShell('code --list-extensions');
        const extensionIds = output.split('\n').filter(id => id.trim() !== '');
		installedExtensions.length = 0;
        installedExtensions.push(...extensionIds);
    } catch (error) {
        vscode.window.showErrorMessage('Failed to get installed extensions.');
    }
};

const uninstallExtensions = () => {
	const extensionsToRemove = extensionsToUninstall.map((ext) => `--uninstall-extension ${ext}`).join(' ');
	executeUnInstallCommand(`code ${extensionsToRemove}`);
};

const installExtensions = () => {
	const extensions = extensionsToInstall.map((ext: string) => `--install-extension ${ext}`).join(' ');
	if(extensionsToInstall.length) {
		executeInstallCommand(`code ${extensions}`);
	}
};

const manageExtensions = async () => {
	await getAllExtensions();
	const dependencies = await getProjectDependencies();
	const extensionIds = getProjectExtensionIds(dependencies);
	extensionsToInstall = extensionIds.filter((ext: string) => !installedExtensions.includes(ext));
	extensionsToUninstall = installedExtensions.filter((ext) => !extensionIds.includes(ext));
	if(extensionsToUninstall.length){
		uninstallExtensions();
	};

	if(extensionsToInstall.length) {
		installExtensions();
	}
};

export async function activate(context: vscode.ExtensionContext) {
	await manageExtensions();
	const fileWatcher = vscode.workspace.createFileSystemWatcher(`${getProjectDirectory()}/package.json`);
	fileWatcher?.onDidDelete(() => {
		vscode.window.showErrorMessage('Removing extensions.....');
		uninstallExtensions();
	});
	fileWatcher?.onDidChange(async () => {
		await manageExtensions();
	});
	context.subscriptions.push(fileWatcher);
}

// This method is called when your extension is deactivated
export function deactivate() {}