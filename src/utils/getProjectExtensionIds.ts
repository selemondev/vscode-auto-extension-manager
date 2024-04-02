import { getExtensionIds } from "./getExtensionIds";
import { commonExtensions } from "./getExtensionIds";
interface Dependency {
    name: string
}
export const getProjectExtensionIds = (dependencies: Dependency[]) => {
    let extensionIds: string[] = [];
    for (const dep of dependencies) {
        if (dep.name) {
            const extensions = getExtensionIds[dep.name];
            if (extensions) {
                extensionIds.push(...extensions.extensionIds, ...commonExtensions);
            }
        };
    };

    return extensionIds;
}