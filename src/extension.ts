import * as vscode from 'vscode';

function trySetGraalScript(doc: vscode.TextDocument) {
    if (doc.fileName.endsWith('.txt')) {
        const text = doc.getText();

        const graalKeywords = [
            'function',
            'player',
            'this',
            'temp',
            'setlevel',
            'client',
            'class',
            'import',
            'enum',
            'if',
            'else',
            'elseif',
            'while',
            'break',
            'return',
        ];

        let count = 0;
        for (const kw of graalKeywords) {
            const regex = new RegExp(`\\b${kw}\\b`, 'g');
            const matches = text.match(regex);
            if (matches) {
                count += matches.length;
            }
        }

        if (count > 4) {
            vscode.languages.setTextDocumentLanguage(doc, 'graalscript');
        } else {
            vscode.languages.setTextDocumentLanguage(doc, 'plaintext');
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(trySetGraalScript)
    );

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                trySetGraalScript(editor.document);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(trySetGraalScript)
    );

    for (const doc of vscode.workspace.textDocuments) {
        trySetGraalScript(doc);
    }
}
