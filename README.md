<p align="center">
 <img align="center" src="https://raw.githubusercontent.com/selemondev/vscode-auto-extension-manager/master/src/images/icon.png" height="96" />
 <h1 align="center">
  Auto Extension Manager
 </h1>
</p>

Auto Extension Manager:

1. Automatically scans your package.json and installs the necessary VSCode extensions needed for development.

2. When the dependencies change, it uninstalls the previously installed extensions and installs the new ones. For example: If the previous dependency was React, it uninstalls all the React VSCode extensions and installs the new VSCode extensions. ( Let's assume that we switched from React to Vue. So Vue related VSCode extensions will be installed.)

3. You can check the [Get Extension Ids](./src/utils/getExtensionIds.ts) file to see how the extension Ids are configured depending on the dependency.

### How to contribute?

Contributions are welcome and encouraged! If you have any ideas or suggestions for new features, or if you encounter any bugs or issues, please open an issue or submit a pull request on the GitHub repository. 

Developers interested in contributing should read the [Code of Conduct](./CODE_OF_CONDUCT.md) and the [Contributing Guide](./CONTRIBUTING.md).