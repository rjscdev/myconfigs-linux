"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const EmojiLog_1 = require("./EmojiLog/EmojiLog");
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.EmojiLog', (uri) => {
        const git = getGitExtension();
        if (!git) {
            vscode.window.showErrorMessage('Unable to load Git Extension');
            return;
        }
        let emojis = EmojiLog_1.default;
        let items = [];
        for (let i = 0; i < emojis.length; i++) {
            items.push({
                label: `${emojis[i].emoji}`,
                description: `${emojis[i].description}`,
                emoji: emojis[i].emoji,
            });
        }
        vscode.window
            .showQuickPick(items, { placeHolder: 'Select a particular Emoji Log git commit.' })
            .then(function (selected) {
            if (selected) {
                vscode.commands.executeCommand('workbench.view.scm');
                if (uri) {
                    let selectedRepository = git.repositories.find((repository) => {
                        return repository.rootUri.path === uri._rootUri.path;
                    });
                    if (selectedRepository) {
                        prefixCommit(selectedRepository, selected.emoji);
                    }
                }
                else {
                    for (let repo of git.repositories) {
                        prefixCommit(repo, selected.emoji);
                    }
                }
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function prefixCommit(repository, prefix) {
    repository.inputBox.value = `${prefix} ${repository.inputBox.value}`;
}
function getGitExtension() {
    const vscodeGit = vscode.extensions.getExtension('vscode.git');
    const gitExtension = vscodeGit && vscodeGit.exports;
    return gitExtension && gitExtension.getAPI(1);
}
function deactivate() { }
exports.deactivate = deactivate;
