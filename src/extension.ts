import * as vscode from "vscode";
import { executeInstallCommand, executeUnInstallCommand } from "./utils/getExecuteCommand";
import { getExtensionIds } from "./utils/getExtensionIds";
import { getProjectDependencies } from "./utils/getProjectDeps";
import { getProjectDirectory } from "./utils/getProjectDir";
import { execShell } from "./utils/getExecShellCmd";
let installedExtensions: string[] = [];
const getAllExtensions = async () => {
    try {
        const output = await execShell('code --list-extensions');
        const extensionIds = output.split('\n').filter(id => id.trim() !== '');
		installedExtensions.length = 0;
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
	const extensionsToUninstall = installedExtensions.filter((ext) => !extensionIds.includes(ext));
	// vscode.window.showInformationMessage('To install: ', `${extensionsToInstall.join(', ')}` )
	// vscode.window.showInformationMessage('To uninstall: ', `${extensionsToUninstall.join(', ')}` )
	const uninstallExtensions = () => {
		const extensionToUnInstall = extensionsToUninstall.map((ext) => `--uninstall-extension ${ext}`).join(' ');
		executeUnInstallCommand(`code ${extensionToUnInstall}`);
	};

	const installExtensions = () => {
		const extensions = extensionsToInstall.map((ext) => `--install-extension ${ext}`).join(' ');
		if(extensionsToInstall.length) {
			executeInstallCommand(`code ${extensions}`);
		}
	};
	if(extensionsToUninstall.length){
		vscode.window.showInformationMessage('Removing extensions....');
		uninstallExtensions();
	};

	if(extensionsToInstall.length) {
		vscode.window.showInformationMessage('Installing extensions....');
		installExtensions();
	}
	const fileWatcher = vscode.workspace.createFileSystemWatcher(`${getProjectDirectory()}/package.json`);
	fileWatcher?.onDidDelete(() => {
		vscode.window.showErrorMessage('Removing extensions.....');
		uninstallExtensions();
	});
	fileWatcher?.onDidChange(async () => {
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
		const extensionsToUninstall = installedExtensions.filter((ext) => !extensionIds.includes(ext));
		vscode.window.showInformationMessage('To install: ', `${extensionsToInstall.join(', ')}` )
		vscode.window.showInformationMessage('To uninstall: ', `${extensionsToUninstall.join(', ')}` )
		vscode.window.showInformationMessage('Extension IDS: ', `${extensionIds.join(', ')}` )
		const uninstallExtensions = () => {
			const extensionsToRemove = extensionsToUninstall.map((ext) => `--uninstall-extension ${ext}`).join(' ');
			executeUnInstallCommand(`code ${extensionsToRemove}`);
		};
	
		const installExtensions = () => {
			const extensions = extensionsToInstall.map((ext) => `--install-extension ${ext}`).join(' ');
			if(extensionsToInstall.length) {
				executeInstallCommand(`code ${extensions}`);
			}
		};
		if(extensionsToUninstall.length){
			vscode.window.showInformationMessage('Removing extensions....');
			uninstallExtensions();
		};
	
		if(extensionsToInstall.length) {
			vscode.window.showInformationMessage('Installing extensions....');
			installExtensions();
		}
	});

	vscode.workspace.onDidChangeWorkspaceFolders(installExtensions);
	context.subscriptions.push(fileWatcher);
}

// This method is called when your extension is deactivated
export function deactivate() {

}


