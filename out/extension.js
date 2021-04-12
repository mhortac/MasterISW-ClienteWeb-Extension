// Es una forma de elegir una variante restringida de JavaScript,
// así implícitamente se deja de lado el modo poco riguroso
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
/**
 * Este método es llamada cuando la extensión es activada.
 * La extensión es activada la primera vez que el comando es ejecutado.
 * @param context {vscode.ExtensionContext}
 */
function activate(context) {
    // Registra un comando que se puede invocar mediante un método abreviado de teclado,
    // un elemento de menú, una acción o directamente.
    let disposable = vscode.commands.registerCommand("gapline", () => {
        // Obtiene el editor de texto activo en el momento
        var editor = vscode.window.activeTextEditor;
        // Termina la función en caso de que editor sea `undefined`
        if (!editor) {
            return;
        }
        // Obtiene el rango de selección.
        var selection = editor.selection;
        // Obtiene el texto de acuerdo al rango seleccionado.
        var text = editor.document.getText(selection);
        // Muestra una ventana de ingreso de texto
        vscode.window
            .showInputBox({ prompt: "¿Cantidad de lineas?" })
            .then((value) => {
            // Obtiene el valor convertido a entero
            let numberOfLines = +value;
            // Array en el cual agregaremos nuestras líneas seleccionadas y las nuevas
            var textInChunks = [];
            // Separa el texto seleccionado por saltos de líneas con ayuda de la función split quien retorna un array.
            // Este array es iterado  para evaluar cada cuantas líneas agrega una nueva vacía, esto, a partir del mod u operación residuo
            text.split("\n").forEach((currentLine, lineIndex) => {
                textInChunks.push(currentLine);
                if ((lineIndex + 1) % numberOfLines === 0)
                    textInChunks.push("");
            });
            // Unimos las líneas en una sola
            text = textInChunks.join("\n");
            // Agregamos el texto en el editor a partir el rango seleccionado
            editor.edit((editBuilder) => {
                var range = new vscode.Range(selection.start.line, 0, selection.end.line, editor.document.lineAt(selection.end.line).text.length);
                editBuilder.replace(range, text);
            });
        });
    });
    // Agrega lo desarrollado a nuestro contexto del editor
    context.subscriptions.push(disposable);
}
exports.activate = activate;
/**
 * Este método es llamadado cuando la extensión es desactivada
 */
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map