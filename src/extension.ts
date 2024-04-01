import * as vscode from "vscode";
import { executeCommand } from "./utils/getExecuteCommand";
import { getExtensionIds } from "./utils/getExtensionIds";
import { getProjectDependencies } from "./utils/getProjectDeps";
import { getProjectDirectory } from "./utils/getProjectDir";
import { execShell } from "./utils/getExecShellCmd";

const commands = {
	initDeps: "check.deps",
	testIds: "test.extensions"
} as const;

const installedExtensions: string[] = [];
const getAllExtensions = async () => {
    try {
        const output = await execShell('code --list-extensions');
        const extensionIds = output.split('\n').filter(id => id.trim() !== '');
        installedExtensions.push(...extensionIds);
    } catch (error) {
        console.error('Error:', error);
        vscode.window.showErrorMessage('Failed to get installed extensions.');
    }
};

export async function activate(context: vscode.ExtensionContext) {
	await getAllExtensions();
	let extensionIds: string[] = [];
	const dependencies = await getProjectDependencies();
	for (const dep of dependencies) {
		if (dep.name) {
			const extensions = getExtensionIds[dep.name];
			if (extensions) {
				extensionIds.push(...extensions.extensionIds);
			}
		};
	};
	const extensionsToInstall = extensionIds.filter((ext) => !installedExtensions.includes(ext));
	const uninstallExtensions = () => {
		const extensionToUnInstall = extensionIds.map((ext) => `--uninstall-extension ${ext}`).join(' ');
		executeCommand(`code ${extensionToUnInstall}`);
	};

	const installExtensions = () => {
		const extensions = extensionsToInstall.map((ext) => `--install-extension ${ext}`).join(' ');
		if(extensionsToInstall.length) {
			executeCommand(`code ${extensions}`);
		}
	};
	installExtensions();
	const fileWatcher = vscode.workspace.createFileSystemWatcher(`${getProjectDirectory()}/package.json`);
	fileWatcher?.onDidDelete(() => {
		vscode.window.showErrorMessage('Removing extensions.....');
		uninstallExtensions();
	});
	fileWatcher?.onDidCreate(() => {
		vscode.window.showInformationMessage('Installing extensions....');
		installExtensions();
	});

	vscode.workspace.onDidChangeWorkspaceFolders(installExtensions);
	context.subscriptions.push(fileWatcher);
}

// This method is called when your extension is deactivated
export function deactivate() {

}


