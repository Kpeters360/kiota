// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import TelemetryReporter from '@vscode/extension-telemetry';
import * as vscode from "vscode";

import { CloseDescriptionCommand } from './commands/CloseDescriptionCommand';
import { EditPathsCommand } from './commands/EditPathsCommand';
import { FilterDescriptionCommand } from './commands/FilterDescriptionCommand';
import { DisplayGenerationResultsCommand } from './commands/generate-client/DisplayGenerationResultsCommand';
import { GenerateClientCommand } from './commands/generate-client/GenerateClientCommand';
import { KiotaStatusCommand } from "./commands/KiotaStatusCommand";
import { AddToSelectedEndpointsCommand } from './commands/open-api-tree-node/AddToSelectedEndpointsCommand';
import { OpenDocumentationPageCommand } from "./commands/open-api-tree-node/OpenDocumentationPageCommand";
import { RemoveAllFromSelectedEndpointsCommand } from './commands/open-api-tree-node/RemoveAllFromSelectedEndpointsCommand';
import { RemoveFromSelectedEndpointsCommand } from './commands/open-api-tree-node/RemoveFromSelectedEndpointsCommand';
import { RegenerateButtonCommand } from './commands/regenerate/RegenerateButtonCommand';
import { RegenerateCommand } from './commands/regenerate/RegenerateCommand';
import { SearchOrOpenApiDescriptionCommand } from './commands/SearchOrOpenApiDescriptionCommand';
import { SelectLockCommand } from './commands/SelectLockCommand';
import { UpdateClientsCommand } from './commands/UpdateClientsCommand';

import { AddAllToSelectedEndpointsCommand } from './commands/open-api-tree-node/AddAllToSelectedEndpointsCommand';
import { dependenciesInfo, extensionId, statusBarCommandId, treeViewId } from "./constants";
import { getExtensionSettings } from "./extensionSettings";
import { UriHandler } from './handlers/uri.handler';
import { ClientOrPluginProperties } from "./kiotaInterop";
import { CodeLensProvider } from "./providers/codelensProvider";
import { DependenciesViewProvider } from './providers/dependenciesViewProvider';
import { OpenApiTreeNode, OpenApiTreeProvider } from './providers/openApiTreeProvider';
import { loadTreeView } from './providers/workspaceTreeProvider';
import { GenerateState } from "./steps";
import { Telemetry } from './telemetry';
import { updateStatusBarItem } from './utilities/status-bar';

let kiotaStatusBarItem: vscode.StatusBarItem;
let clientOrPluginKey: string;
let clientOrPluginObject: ClientOrPluginProperties;
let workspaceGenerationType: string;
let config: Partial<GenerateState>;


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  const openApiTreeProvider = new OpenApiTreeProvider(context, () => getExtensionSettings(extensionId));
  const dependenciesInfoProvider = new DependenciesViewProvider(
    context.extensionUri
  );

  const kiotaStatusCommand = new KiotaStatusCommand();
  const openDocumentationPageCommand = new OpenDocumentationPageCommand();
  const generateClientCommand = new GenerateClientCommand(context, openApiTreeProvider);
  const searchOrOpenApiDescriptionCommand = new SearchOrOpenApiDescriptionCommand(context, openApiTreeProvider);
  const closeDescriptionCommand = new CloseDescriptionCommand(openApiTreeProvider);
  const filterDescriptionCommand = new FilterDescriptionCommand(openApiTreeProvider);
  const editPathsCommand = new EditPathsCommand(openApiTreeProvider, clientOrPluginKey, clientOrPluginObject);
  const regenerateButtonCommand = new RegenerateButtonCommand(context, openApiTreeProvider, clientOrPluginKey, clientOrPluginObject, workspaceGenerationType);
  const regenerateCommand = new RegenerateCommand(context, openApiTreeProvider, clientOrPluginKey, clientOrPluginObject, workspaceGenerationType);
  const addToSelectedEndpointsCommand = new AddToSelectedEndpointsCommand(openApiTreeProvider);
  const addAllToSelectedEndpointsCommand = new AddAllToSelectedEndpointsCommand(openApiTreeProvider);
  const removeFromSelectedEndpointsCommand = new RemoveFromSelectedEndpointsCommand(openApiTreeProvider);
  const removeAllFromSelectedEndpointsCommand = new RemoveAllFromSelectedEndpointsCommand(openApiTreeProvider);
  const updateClientsCommand = new UpdateClientsCommand(context);
  const displayGenerationResultsCommand = new DisplayGenerationResultsCommand(context, openApiTreeProvider);
  const selectLockCommand = new SelectLockCommand(openApiTreeProvider);
  const uriHandler = new UriHandler(openApiTreeProvider);
  const codeLensProvider = new CodeLensProvider();

  const reporter =  Telemetry.reporter;

  await loadTreeView(context);

  context.subscriptions.push(
    reporter,

    vscode.window.registerUriHandler({ handleUri: uriHandler.handleUri }),
    vscode.languages.registerCodeLensProvider('json', codeLensProvider),
    vscode.window.registerWebviewViewProvider(dependenciesInfo, dependenciesInfoProvider),
    vscode.window.registerTreeDataProvider(treeViewId, openApiTreeProvider),

    registerCommandWithTelemetry(reporter, selectLockCommand.toString(), (x) => selectLockCommand.execute(x)),
    registerCommandWithTelemetry(reporter, editPathsCommand.toString(), async () => editPathsCommand.execute()),
    registerCommandWithTelemetry(reporter, regenerateCommand.toString(), async () => regenerateCommand.execute()),

    registerCommandWithTelemetry(reporter, openDocumentationPageCommand.toString(), (openApiTreeNode: OpenApiTreeNode) => openDocumentationPageCommand.execute(openApiTreeNode)),
    registerCommandWithTelemetry(reporter, addToSelectedEndpointsCommand.toString(), (openApiTreeNode: OpenApiTreeNode) => addToSelectedEndpointsCommand.execute(openApiTreeNode)),
    registerCommandWithTelemetry(reporter, addAllToSelectedEndpointsCommand.toString(), (openApiTreeNode: OpenApiTreeNode) => addAllToSelectedEndpointsCommand.execute(openApiTreeNode)),
    registerCommandWithTelemetry(reporter, removeFromSelectedEndpointsCommand.toString(), (openApiTreeNode: OpenApiTreeNode) => removeFromSelectedEndpointsCommand.execute(openApiTreeNode)),
    registerCommandWithTelemetry(reporter, removeAllFromSelectedEndpointsCommand.toString(), (openApiTreeNode: OpenApiTreeNode) => removeAllFromSelectedEndpointsCommand.execute(openApiTreeNode)),
    registerCommandWithTelemetry(reporter, generateClientCommand.toString(), () => generateClientCommand.execute()),
    registerCommandWithTelemetry(reporter, searchOrOpenApiDescriptionCommand.toString(), () => searchOrOpenApiDescriptionCommand.execute()),
    registerCommandWithTelemetry(reporter, closeDescriptionCommand.toString(), () => closeDescriptionCommand.execute()),
    registerCommandWithTelemetry(reporter, filterDescriptionCommand.toString(), () => filterDescriptionCommand.execute()),
    registerCommandWithTelemetry(reporter, regenerateButtonCommand.toString(), async () => regenerateButtonCommand.execute(config)),

    registerCommandWithTelemetry(reporter, statusBarCommandId, async () => kiotaStatusCommand.execute()),
    vscode.workspace.onDidChangeWorkspaceFolders(async () => displayGenerationResultsCommand.execute(config)),
  );

  // create a new status bar item that we can now manage
  kiotaStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  kiotaStatusBarItem.command = statusBarCommandId;
  context.subscriptions.push(kiotaStatusBarItem);

  // update status bar item once at start
  await updateStatusBarItem(context, kiotaStatusBarItem);
  context.subscriptions.push(registerCommandWithTelemetry(reporter, updateClientsCommand.toString(), async () => updateClientsCommand.execute(kiotaStatusBarItem)));
}


function registerCommandWithTelemetry(reporter: TelemetryReporter, command: string, callback: (...args: any[]) => any, thisArg?: any): vscode.Disposable {
  return vscode.commands.registerCommand(command, (...args: any[]) => {
    const splatCommand = command.split('/');
    const eventName = splatCommand[splatCommand.length - 1];
    reporter.sendTelemetryEvent(eventName);
    return callback.apply(thisArg, args);
  }, thisArg);
}

// This method is called when your extension is deactivated
export function deactivate() { }
