import { getProjectDirectory } from "./getProjectDir";
import { existsSync } from "fs";
import { readPackageJSON } from "pkg-types";
import * as vscode from "vscode";

type Dependency = {
    name: string
};

export const getProjectDependencies = async (): Promise<Dependency[]> => {
    const dependencies: Dependency[] = [];
    const packageJsonPath = `${getProjectDirectory()}/package.json`;

    if (!existsSync(packageJsonPath)) {
        vscode.window.showErrorMessage("Cannot find package.json!");
        return [];
    } else {
        const packageJSON = await readPackageJSON(packageJsonPath);
        const addDependencies = (depObj: Record<string, string> | undefined) => {
            if (depObj) {
                dependencies.push(
                    ...Object.keys(depObj).map((key) => ({
                        name: key
                    }))
                );
            }
        };

        addDependencies(packageJSON?.dependencies);
        addDependencies(packageJSON?.devDependencies);

        return dependencies;
    }
}