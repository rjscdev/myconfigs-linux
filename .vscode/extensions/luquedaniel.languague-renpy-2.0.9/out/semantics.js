// Semantic Tokens
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSemanticTokens = void 0;
const vscode_1 = require("vscode");
const navigation_1 = require("./navigation");
const navigationdata_1 = require("./navigationdata");
const workspace_1 = require("./workspace");
function getSemanticTokens(document, legend) {
    const tokensBuilder = new vscode_1.SemanticTokensBuilder(legend);
    const rxKeywordList = /\s*(screen|label|transform|def|class)\s+/;
    const rxParameterList = /\s*(screen|label|transform|def|class)\s+([a-zA-Z_]\w+)\s*\((.*)\)\s*:|\s*(label)\s+([a-zA-Z0-9_.]+)\s*:|^(init)\s+([-\d]+\s+)*python\s+in\s+(\w+):|^(python)\s+early\s+in\s+(\w+):|\s*(class)\s+([a-zA-Z0-9_]+)\s*/s;
    const rxVariableDefines = /^\s*(default|define)\s+([a-zA-Z]+[a-zA-Z0-9_]*)\s*=\s*(.*)/;
    const rxPersistentDefines = /^\s*(default|define)\s+persistent\.([a-zA-Z]+[a-zA-Z0-9_]*)\s*=\s*(.*)/;
    const filename = (0, workspace_1.stripWorkspaceFromFile)(document.uri.path);
    let insideComment = false;
    let parent = '';
    let parent_line = 0;
    let parent_type = '';
    let parent_args = [];
    let parent_local = [];
    let parent_defaults = {};
    let indent_level = 0;
    let append_line = 0;
    for (let i = 0; i < document.lineCount; ++i) {
        let line = document.lineAt(i).text;
        // check if we've outdented out of the parent block
        if (line.length > 0 && line.length - line.trimStart().length <= indent_level) {
            parent = '';
            parent_args = [];
            parent_local = [];
            parent_defaults = {};
            parent_line = 0;
            parent_type = '';
        }
        append_line = i;
        if (line.match(rxKeywordList)) {
            // check for unterminated parenthesis for multiline declarations
            let no_string = navigationdata_1.NavigationData.filterStringLiterals(line);
            let open_count = (no_string.match(/\(/g) || []).length;
            let close_count = (no_string.match(/\)/g) || []).length;
            while (open_count > close_count && append_line < document.lineCount - 1) {
                append_line++;
                line = line + document.lineAt(append_line).text + '\n';
                no_string = navigationdata_1.NavigationData.filterStringLiterals(line);
                open_count = (no_string.match(/\(/g) || []).length;
                close_count = (no_string.match(/\)/g) || []).length;
            }
        }
        if (line.trim().length === 0) {
            continue;
        }
        if (line.indexOf('"""') >= 0) {
            if (insideComment) {
                insideComment = false;
            }
            else {
                if (line.substring(line.indexOf('"""') + 3).indexOf('"""') < 0) {
                    insideComment = true;
                }
            }
            continue;
        }
        if (insideComment) {
            continue;
        }
        const matches = line.match(rxParameterList);
        if (matches) {
            // this line has a parameter list - tokenize the parameter ranges
            if (matches[1] !== 'class' && matches[3] && matches[3].length > 0 && matches[2] !== '_') {
                indent_level = line.length - line.trimStart().length;
                parent = matches[2];
                parent_type = matches[1];
                parent_line = i + 1;
                let start = line.indexOf('(') + 1;
                const split = (0, navigation_1.splitParameters)(matches[3], false);
                for (let m of split) {
                    const offset = m.length - m.trimStart().length;
                    let length = m.length;
                    if (m.indexOf('=') > 0) {
                        length = m.split('=')[0].trimEnd().length;
                    }
                    const range = new vscode_1.Range(i, start + offset, i, start + length);
                    if (m.substring(offset, length) === 'self' || m.substring(offset, length) === 'cls') {
                        tokensBuilder.push(range, 'keyword');
                    }
                    else {
                        tokensBuilder.push(range, 'parameter', ['declaration']);
                    }
                    parent_args.push(line.substring(start + offset, length - offset));
                    parent_defaults[m.substring(offset, length)] = new navigation_1.Navigation("parameter", m.substring(offset, length), filename, i + 1, "", m.trim(), "", start + offset);
                    // create a Navigation dictionary entry for this token range
                    const key = (0, navigation_1.rangeAsString)(filename, range);
                    const docs = `${parent_type} ${parent}()`;
                    const navigation = new navigation_1.Navigation("parameter", matches[1], filename, parent_line, docs, "", parent_type, start + offset);
                    navigationdata_1.NavigationData.gameObjects['semantic'][key] = navigation;
                    start += m.length + 1;
                }
                if (matches[1] === 'def') {
                    const context = i - 1 < 0 ? undefined : (0, navigation_1.getCurrentContext)(document, new vscode_1.Position(i - 1, indent_level));
                    if (context === undefined) {
                        (0, navigationdata_1.updateNavigationData)('callable', matches[2], filename, i);
                    }
                    else if (context.startsWith('store.')) {
                        (0, navigationdata_1.updateNavigationData)('callable', `${context.split('.')[1]}.${matches[2]}`, filename, i);
                    }
                }
                else {
                    (0, navigationdata_1.updateNavigationData)(matches[1], matches[2], filename, i);
                }
            }
            else if (matches[1] === 'screen' || matches[1] === 'def' || matches[1] === 'class' || matches[11] === 'class') {
                // parent screen or function def with no parameters
                indent_level = line.length - line.trimStart().length;
                parent = matches[2] || matches[12];
                parent_type = matches[1] || matches[11];
                parent_line = i;
                parent_args = [];
                parent_local = [];
                parent_defaults = {};
                if (matches[1] === 'def') {
                    const context = i - 1 < 0 ? undefined : (0, navigation_1.getCurrentContext)(document, new vscode_1.Position(i - 1, indent_level));
                    if (context === undefined) {
                        (0, navigationdata_1.updateNavigationData)('callable', matches[2], filename, i);
                    }
                    else if (context.startsWith('store.')) {
                        (0, navigationdata_1.updateNavigationData)('callable', `${context.split('.')[1]}.${matches[2]}`, filename, i);
                    }
                }
                else if (matches[1] === 'screen') {
                    (0, navigationdata_1.updateNavigationData)(matches[1], matches[2], filename, i);
                }
            }
            else if (matches[4] === 'label') {
                indent_level = line.length - line.trimStart().length;
                const context = i - 1 < 0 ? undefined : (0, navigation_1.getCurrentContext)(document, new vscode_1.Position(i - 1, indent_level));
                if (context === undefined) {
                    (0, navigationdata_1.updateNavigationData)('label', matches[5], filename, i);
                }
            }
            else if ((matches[6] === 'init' && matches[8] !== undefined) || (matches[9] === 'python' && matches[10] !== undefined)) {
                // named store (init python in storename)
                indent_level = line.length - line.trimStart().length;
                if (matches[10] !== undefined) {
                    parent = matches[10];
                }
                else {
                    parent = matches[8];
                }
                parent_type = 'store';
                parent_line = i + 1;
                parent_args = [];
                parent_local = [];
                parent_defaults = {};
                const navigation = new navigation_1.Navigation("store", parent, filename, parent_line, "", "", parent_type, indent_level);
                navigationdata_1.NavigationData.gameObjects['stores'][parent] = navigation;
            }
        }
        else if (parent !== '') {
            // we are still inside a parent block
            // check if this line has any tokens that are parameters
            if (parent_args.length > 0) {
                for (let a of parent_args) {
                    try {
                        const token = escapeRegExp(a);
                        const rx = RegExp(`[^a-zA-Z_](${token})($|[^a-zA-Z_])`, 'g');
                        let matches;
                        while ((matches = rx.exec(line)) !== null) {
                            const offset = matches[0].indexOf(matches[1]);
                            let length = matches[1].length;
                            if (navigationdata_1.NavigationData.positionIsCleanForCompletion(line, new vscode_1.Position(i, matches.index + offset))) {
                                // push the token into the token builder
                                const range = new vscode_1.Range(i, matches.index + offset, i, matches.index + offset + length);
                                if (token === 'self' || token === 'cls') {
                                    tokensBuilder.push(range, 'keyword');
                                }
                                else {
                                    tokensBuilder.push(range, 'parameter');
                                }
                                // create a Navigation dictionary entry for this token range
                                const key = (0, navigation_1.rangeAsString)(filename, range);
                                const docs = `${parent_type} ${parent}()`;
                                const parent_nav = parent_defaults[matches[1]];
                                const navigation = new navigation_1.Navigation("parameter", matches[1], filename, parent_line, docs, "", parent_type, parent_nav.character);
                                navigationdata_1.NavigationData.gameObjects['semantic'][key] = navigation;
                            }
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
            // tokenize any local variables
            if (parent_local.length > 0) {
                for (let a of parent_local) {
                    try {
                        const token = escapeRegExp(a[0]);
                        const rx = RegExp(`[^a-zA-Z_](${token})($|[^a-zA-Z_])`, 'g');
                        let matches;
                        while ((matches = rx.exec(line)) !== null) {
                            const offset = matches[0].indexOf(matches[1]);
                            let length = matches[1].length;
                            if (navigationdata_1.NavigationData.positionIsCleanForCompletion(line, new vscode_1.Position(i, matches.index + offset))) {
                                // push the token into the token builder
                                const range = new vscode_1.Range(i, matches.index + offset, i, matches.index + offset + length);
                                tokensBuilder.push(range, 'variable');
                                // create a Navigation dictionary entry for this token range
                                const key = (0, navigation_1.rangeAsString)(filename, range);
                                const parent_nav = parent_defaults[`${parent_type}.${parent}.${matches[1]}`];
                                if (parent_nav === undefined) {
                                    continue;
                                }
                                let nav_source = 'variable';
                                if (a[1] === 'sv') {
                                    nav_source = 'screen variable';
                                }
                                else if (a[1] === 'g') {
                                    nav_source = 'global variable';
                                }
                                const navigation = new navigation_1.Navigation(nav_source, matches[1], filename, parent_nav.location, parent_nav.documentation, "", parent_nav.type, parent_nav.character);
                                navigationdata_1.NavigationData.gameObjects['semantic'][key] = navigation;
                            }
                        }
                    }
                    catch (error) {
                        console.log(`error at ${filename}:${i}: ${error}`);
                    }
                }
            }
            // check if this line is a default and we're in a screen
            // mark the token as a screen variable
            if (parent_type === 'screen') {
                const rxDefault = /^\s*(default)\s+(\w*)\s*=\s*([\w'"`\[{]*)/;
                const matches = rxDefault.exec(line);
                if (matches) {
                    parent_local.push([matches[2], 'sv']);
                    // push the token into the token builder
                    const offset = matches[0].indexOf(matches[2]);
                    const range = new vscode_1.Range(i, matches.index + offset, i, matches.index + offset + matches[2].length);
                    tokensBuilder.push(range, 'variable', ['declaration']);
                    // create a Navigation dictionary entry for this token range
                    const key = (0, navigation_1.rangeAsString)(filename, range);
                    const docs = `${parent_type} ${parent}()\n    ${line.trim()}`;
                    const navigation = new navigation_1.Navigation("screen variable", matches[2], filename, i + 1, docs, "", parent_type, matches.index + offset);
                    navigationdata_1.NavigationData.gameObjects['semantic'][key] = navigation;
                    parent_defaults[`${parent_type}.${parent}.${matches[2]}`] = navigation;
                }
            }
            else if (parent_type === 'def' || parent_type === 'store' || parent_type === 'class') {
                // check if this line is a variable declaration in a function or store
                // mark the token as a variable
                const rxPatterns = [/^\s*(global)\s+(\w*)/g, /\s*(for)\s+([a-zA-Z0-9_]+)\s+in\s+/g, /(\s*)([a-zA-Z0-9_,]+)\s*=\s*[a-zA-Z0-9_"]+/g];
                for (let rx of rxPatterns) {
                    let matches;
                    while ((matches = rx.exec(line)) !== null) {
                        try {
                            let start = line.indexOf(matches[2]);
                            const split = matches[2].split(',');
                            for (let m of split) {
                                const offset = m.length - m.trimStart().length;
                                if (parent_args.includes(m.substring(offset))) {
                                    continue;
                                }
                                let length = m.length;
                                let source = 'variable';
                                if (matches[1] === 'global') {
                                    source = 'global variable';
                                }
                                if (!parent_local.some(e => e[0] === m.substring(offset))) {
                                    if (matches[1] === 'global') {
                                        parent_local.push([m.substring(offset), 'g']);
                                    }
                                    else {
                                        parent_local.push([m.substring(offset), 'v']);
                                    }
                                }
                                else {
                                    continue;
                                }
                                // push the token into the token builder
                                const range = new vscode_1.Range(i, start + offset, i, start + length);
                                tokensBuilder.push(range, 'variable', ['declaration']);
                                // create a Navigation dictionary entry for this token range
                                const key = (0, navigation_1.rangeAsString)(filename, range);
                                let docs = '';
                                if (parent_type === 'store') {
                                    docs = `init python in ${parent}:\n    ${line.trim()}`;
                                }
                                else {
                                    docs = `${parent_type} ${parent}()\n    ${line.trim()}`;
                                }
                                const navigation = new navigation_1.Navigation(source, m.substring(offset), filename, i + 1, docs, "", parent_type, start + offset);
                                navigationdata_1.NavigationData.gameObjects['semantic'][key] = navigation;
                                parent_defaults[`${parent_type}.${parent}.${m.substring(offset)}`] = navigation;
                                if (parent_type === 'store') {
                                    const pKey = `store.${parent}`;
                                    const objKey = `${parent}.${m.substring(offset)}`;
                                    const navigation = new navigation_1.Navigation(source, objKey, filename, i + 1, docs, "", parent_type, start + offset);
                                    if (navigationdata_1.NavigationData.gameObjects['fields'][pKey] === undefined) {
                                        navigationdata_1.NavigationData.gameObjects['fields'][pKey] = [];
                                    }
                                    navigationdata_1.NavigationData.gameObjects['fields'][pKey] = navigationdata_1.NavigationData.gameObjects['fields'][pKey].filter((e) => e.keyword !== objKey);
                                    navigationdata_1.NavigationData.gameObjects['fields'][pKey].push(navigation);
                                }
                                start += m.length + 1;
                            }
                        }
                        catch (error) {
                            console.log(`error at ${filename}:${i}: ${error}`);
                        }
                    }
                }
            }
        }
        else if (parent === '') {
            let match = line.match(rxVariableDefines);
            if (match) {
                const datatype = new navigation_1.DataType(match[2], match[1], match[3]);
                navigationdata_1.NavigationData.gameObjects['define_types'][match[2]] = datatype;
                (0, navigationdata_1.updateNavigationData)('define', match[2], filename, i);
            }
            match = line.match(rxPersistentDefines);
            if (match) {
                const gameObjects = navigationdata_1.NavigationData.data.location['persistent'];
                gameObjects[match[2]] = [filename, i + 1];
            }
        }
    }
    return tokensBuilder.build();
}
exports.getSemanticTokens = getSemanticTokens;
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=semantics.js.map