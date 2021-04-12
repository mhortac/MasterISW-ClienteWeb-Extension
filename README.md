# Actividad 1

_Trabajo: Creación de una extensión para VS Code_
_Creado por: Murphy Horta Camargo_

### ¿Que es Visual Studio Code?

**Visual Studio Code** es un editor de código fuente desarrollado por Microsoft que permite trabajar con diversos lenguajes de programación, admite gestionar tus propios atajos de teclado y refactorizar el código. Es gratuito, de código abierto y nos proporciona una utilidad para descargar y gestionar extensiones con las que podemos personalizar y potenciar esta herramienta.

### **Objetivo**

Crear una extensión **Visual Studio Code**. Esta extensión va a insertar una línea en blanco cada _N_ líneas.

## Instalación

Primero debemos tener instalado node que es un entorno de tiempo de ejecución de JavaScript, este lo podemos descargar desde su página oficial en el siguiente link [descargar node](https://nodejs.org/en/download/current/). Puedes comprobar si la descarga ha sido exitosa, abriendo la terminal de comandos y ejecutar `node -v`

luego, necesitarás instalar varias dependencias globales :

- `yo` : Yeoman, nos ayudará a generar plantilla para el proyecto
- `generator-code` : Junto con Yeoman, nos ayudará a generar el esqueleto o plantilla para extensiones
- `typescript` : Compilador para typescript

Esto lo lograremos con ayuda del **node package manager** (npm) que hoy en día viene integrado a node. Ejecuta la línea a continuación en la terminal de comandos:

`npm install -g yo generator-code typescript`

Después de instalar estas dependencias, ejecutarás el siguiente comando en la terminal `yo code` para indicarle a Yeoman que queremos generar una extensión para VS Code.

Elegimos TypeScript como tipo de lenguaje de desarrollo: New Extension (TypeScript). Luego dale un nombre a la extensión (Line Gapper) y un identificador (gapline). La opción de publisher name es por si vamos a publicar la extensión en el repositorio de extensiones de VS Code, pero nosotros no vamos a hacerlo, así que podéis elegir un nombre cualquiera. Por último, cuando se nos pregunte si queremos iniciar un repositorio Git, decimos que no (Git se utiliza para control de versiones, que no vamos a utilizar).

### Desarrollo de Extensión

Primero, haremos una importación de vscode con la siguiente línea de código.

```
// Es una forma de elegir una variante restringida de JavaScript,
// así implícitamente se deja de lado el modo poco riguroso
"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
```

Luego, exportaremos dos funciones, `activate` que es ejecutada cuando se emite un `actionEvent` y deactivate que nos brinda la oportunidad de limpiar antes de que la extensión sea desactivada.

```
/**
 * Este método es llamada cuando la extensión es activada.
 * La extensión es activada la primera vez que el comando es ejecutado.
 * @param context {vscode.ExtensionContext}
 */
export function activate(context: vscode.ExtensionContext) {

}

/**
 * Este método es llamadado cuando la extensión es desactivada
 */
 export function deactivate() {

 }
```

Vinculemos una función a nuestra extensión. Para esto haremos uso del `vscode.commands.registerCommand`Quién recibe como parámetros un identificador único para el comando, seguido de una función de controlador de comandos en la cual colocaremos la lógica de nuestra extensión.

En la siguiente imagen mostraremos la función completa e identificaremos, elementos propios de **TypeScript**, como los es el uso de Interface que nos permite determinar la estructura que debería o puede tener un objeto, variable o parámetro. Lo podemos evidenciar en las línea 12 con el parámetro **context**, en la línea 34 donde indicamos que **textInChunks** será un array de `string` y en la línea 37 donde indicamos que **currentLine** es de tipo `string`

```
export function activate(context: vscode.ExtensionContext) {
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
        var textInChunks: Array<string> = [];
        // Separa el texto seleccionado por saltos de líneas con ayuda de la función split quien retorna un array.
        // Este array es iterado  para evaluar cada cuantas líneas agrega una nueva vacía, esto, a partir del mod u operación residuo
        text.split("\n").forEach((currentLine: string, lineIndex) => {
          textInChunks.push(currentLine);
          if ((lineIndex + 1) % numberOfLines === 0) textInChunks.push("");
        });

        // Unimos las líneas en una sola
        text = textInChunks.join("\n");
        // Agregamos el texto en el editor a partir el rango seleccionado
        editor.edit((editBuilder) => {
          var range = new vscode.Range(
            selection.start.line,
            0,
            selection.end.line,
            editor.document.lineAt(selection.end.line).text.length
          );
          editBuilder.replace(range, text);
        });
      });
  });
  // Agrega lo desarrollado a nuestro contexto del editor
  context.subscriptions.push(disposable);
}

```
