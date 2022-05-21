'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusBarText = exports.updateNavigationData = exports.readNavigationJson = exports.NavigationData = void 0;
const vscode_1 = require("vscode");
const hover_1 = require("./hover");
const navigation_1 = require("./navigation");
const workspace_1 = require("./workspace");
const fs = require("fs");
const displayable_1 = require("./displayable");
const character_1 = require("./character");
const filterCharacter = '\u2588';
class NavigationData {
    static init(extensionPath) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`NavigationData init`);
            const data = require(`${extensionPath}/src/renpy.json`);
            NavigationData.renpyFunctions = data;
            const kwData = require(`${extensionPath}/src/renpyauto.json`);
            NavigationData.autoCompleteKeywords = kwData;
            NavigationData.renpyAutoComplete = [];
            for (let key in NavigationData.renpyFunctions.renpy) {
                if (key.charAt(0) === key.charAt(0).toUpperCase()) {
                    NavigationData.renpyAutoComplete.push(new vscode_1.CompletionItem(key.substring(6), vscode_1.CompletionItemKind.Class));
                }
                else {
                    NavigationData.renpyAutoComplete.push(new vscode_1.CompletionItem(key.substring(6), vscode_1.CompletionItemKind.Method));
                }
            }
            NavigationData.configAutoComplete = [];
            for (let key in NavigationData.renpyFunctions.config) {
                NavigationData.configAutoComplete.push(new vscode_1.CompletionItem(key.substring(7), vscode_1.CompletionItemKind.Property));
            }
            NavigationData.guiAutoComplete = [];
            NavigationData.internalAutoComplete = [];
            for (let key in NavigationData.renpyFunctions.internal) {
                NavigationData.internalAutoComplete.push(new vscode_1.CompletionItem(key, vscode_1.CompletionItemKind.Class));
                if (key.startsWith('gui.')) {
                    NavigationData.guiAutoComplete.push(new vscode_1.CompletionItem(key.substring(4), vscode_1.CompletionItemKind.Variable));
                }
            }
            yield NavigationData.refresh();
        });
    }
    static refresh(interactive = false) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`${Date()}: NavigationData refresh`);
            NavigationData.isImporting = true;
            try {
                NavigationData.data = readNavigationJson();
                if (NavigationData.data.error) {
                    vscode_1.window.showWarningMessage("Navigation data is empty. Ren'Py could not compile your project. Please check your project can start successfully.");
                }
                if (NavigationData.data.location === undefined) {
                    NavigationData.data.location = {};
                    NavigationData.data.location['callable'] = {};
                    NavigationData.data.location['screen'] = {};
                    NavigationData.data.location['define'] = {};
                    NavigationData.data.location['transform'] = {};
                    NavigationData.data.location['label'] = {};
                }
                NavigationData.data.location['class'] = {};
                NavigationData.data.location['displayable'] = {};
                NavigationData.data.location['persistent'] = {};
                NavigationData.data.location['statement'] = {};
                NavigationData.gameObjects['characters'] = {};
                NavigationData.gameObjects['attributes'] = {};
                NavigationData.gameObjects['channels'] = {};
                NavigationData.gameObjects['properties'] = {};
                NavigationData.gameObjects['fields'] = {};
                NavigationData.gameObjects['define_types'] = {};
                NavigationData.gameObjects['semantic'] = {};
                NavigationData.gameObjects['audio'] = {};
                NavigationData.gameObjects['fonts'] = {};
                NavigationData.gameObjects['outlines'] = {};
                NavigationData.gameObjects['stores'] = {};
                NavigationData.displayableAutoComplete = [];
                NavigationData.displayableQuotedAutoComplete = [];
                var scriptResult = yield NavigationData.scanForScriptFiles();
                var imageResult = yield NavigationData.scanForImages();
                if (scriptResult && imageResult) {
                    yield NavigationData.getCharacterImageAttributes();
                }
                yield NavigationData.scanForFonts();
                yield NavigationData.scanForAudio();
                vscode_1.commands.executeCommand('renpy.refreshDiagnostics');
                console.log(`NavigationData for ${NavigationData.data.name} v${NavigationData.data.version} loaded`);
                if (interactive) {
                    vscode_1.window.showInformationMessage(`NavigationData for ${NavigationData.data.name} v${NavigationData.data.version} loaded`);
                }
            }
            catch (error) {
                console.log(`Error loading NavigationData.json: ${error}`);
                if (interactive) {
                    vscode_1.window.showErrorMessage(`NavigationData.json not loaded. Please check Ren'Py can start your project successfully.`);
                }
            }
            finally {
                NavigationData.isImporting = false;
            }
            return true;
        });
    }
    static find(keyword) {
        let locations = [];
        let split = keyword.split('.');
        if (split.length === 2 && split[0] === 'persistent') {
            const type = NavigationData.data.location[split[0]];
            if (type) {
                const location = type[split[1]];
                if (location) {
                    locations.push(new navigation_1.Navigation(split[0], split[1], location[0], location[1]));
                    return locations;
                }
            }
        }
        for (let key in NavigationData.data.location) {
            let type = NavigationData.data.location[key];
            if (type[keyword]) {
                const data = type[keyword];
                if (data instanceof navigation_1.Navigation) { //!data.length
                    locations.push(data);
                }
                else if (data instanceof displayable_1.Displayable) {
                    locations.push(new navigation_1.Navigation(key, keyword, data.filename, data.location));
                }
                else {
                    locations.push(new navigation_1.Navigation(key, keyword, data[0], data[1]));
                }
            }
        }
        if (NavigationData.renpyFunctions.internal[keyword]) {
            let type = NavigationData.renpyFunctions.internal[keyword];
            locations.push(NavigationData.getNavigationObject("internal", keyword, type));
        }
        if (NavigationData.renpyFunctions.config[keyword]) {
            let type = NavigationData.renpyFunctions.config[keyword];
            locations.push(NavigationData.getNavigationObject("config", keyword, type));
        }
        if (NavigationData.renpyFunctions.renpy[keyword]) {
            let type = NavigationData.renpyFunctions.renpy[keyword];
            locations.push(NavigationData.getNavigationObject("equivalent", keyword, type));
        }
        if (NavigationData.gameObjects['stores'][keyword]) {
            let nav = NavigationData.gameObjects['stores'][keyword];
            if (nav instanceof navigation_1.Navigation) {
                locations.push(nav);
            }
            else {
                locations.push(new navigation_1.Navigation('store', keyword, nav[0], nav[1]));
            }
        }
        if (split.length === 2 && NavigationData.gameObjects['properties'][split[0]]) {
            if (NavigationData.gameObjects['properties'][split[0]]) {
                const properties = NavigationData.gameObjects['properties'][split[0]];
                const filtered = Object.keys(properties).filter(key => properties[key].keyword === split[1]);
                if (filtered && filtered.length > 0) {
                    let nav = Object.create(properties[filtered[0]]);
                    nav.keyword = `${nav.type}.${nav.keyword}`;
                    locations.push(nav);
                }
            }
        }
        if (split.length === 2 && NavigationData.gameObjects['fields'][split[0]]) {
            if (NavigationData.gameObjects['fields'][split[0]]) {
                const fields = NavigationData.gameObjects['fields'][split[0]];
                const filtered = Object.keys(fields).filter(key => fields[key].keyword === split[1]);
                if (filtered && filtered.length > 0) {
                    let nav = Object.create(fields[filtered[0]]);
                    nav.keyword = `${nav.type}.${nav.keyword}`;
                    locations.push(nav);
                }
            }
        }
        if (split.length === 2 && NavigationData.gameObjects['fields'][`store.${split[0]}`]) {
            const fields = NavigationData.gameObjects['fields'][`store.${split[0]}`];
            const filtered = fields.filter((nav) => nav.keyword === keyword);
            if (filtered && filtered.length > 0) {
                locations.push(filtered[0]);
            }
        }
        if (locations && locations.length > 0) {
            return locations;
        }
    }
    static getNavigationDumpEntry(keyword) {
        const data = NavigationData.getNavigationDumpEntries(keyword);
        if (data) {
            return data[0];
        }
    }
    static getNavigationDumpEntries(keyword) {
        let entries = NavigationData.find(keyword);
        if (!entries || entries.length === 0 && keyword.indexOf('.') > 0) {
            entries = NavigationData.resolve(keyword);
        }
        return entries;
    }
    /**
     * Determines if the line position is valid for completion or hover events
     * @remarks
     * This prevents hover/completion from triggering over keywords inside a comment or inside a string literal
     *
     * @param line The current line in the TextDocument
     * @param position The current position in the TextDocument
     * @returns `True` if the position is valid for completion or hover events
     */
    static positionIsCleanForCompletion(line, position) {
        const prefix = line.substring(0, position.character);
        // ignore hover/completion if we're in a comment
        if (prefix.indexOf('#') >= 0) {
            return false;
        }
        // ignore completion if we're inside a quoted strings
        const filtered = NavigationData.filterStringLiterals(line);
        if (filtered.substring(position.character, 1) === filterCharacter) {
            return false;
        }
        return true;
    }
    /**
     * Filters out string literals and comments from the given line of text
     * @param line The current line in the TextDocument
     * @returns A string with any string constants and comments replaced with an unused character
     */
    static filterStringLiterals(line) {
        let parsed = '';
        let insideSingleQuote = false;
        let insideDoubleQuote = false;
        let insideBracket = false;
        let escaped = false;
        for (let c of line) {
            if (c === '\\') {
                if (!insideBracket && (insideSingleQuote || insideDoubleQuote)) {
                    escaped = true;
                    parsed += filterCharacter;
                }
                else {
                    parsed += c;
                }
                continue;
            }
            else if (!escaped && c === '"') {
                if (!insideSingleQuote) {
                    insideDoubleQuote = !insideDoubleQuote;
                    if (!insideDoubleQuote) {
                        parsed += filterCharacter;
                        continue;
                    }
                }
            }
            else if (!escaped && c === "'") {
                if (!insideDoubleQuote) {
                    insideSingleQuote = !insideSingleQuote;
                    if (!insideSingleQuote) {
                        parsed += filterCharacter;
                        continue;
                    }
                }
            }
            else if (c === "[" && (insideSingleQuote || insideDoubleQuote)) {
                if (insideBracket) {
                    // a second bracket
                    insideBracket = false;
                }
                else {
                    insideBracket = true;
                }
            }
            else if (c === "]" && (insideSingleQuote || insideDoubleQuote)) {
                insideBracket = false;
                parsed += c;
                continue;
            }
            else if (c === '#') {
                if (!insideSingleQuote && !insideDoubleQuote) {
                    parsed += c;
                    parsed += filterCharacter.repeat(line.length - parsed.length);
                    return parsed;
                }
            }
            if (!insideBracket && (insideSingleQuote || insideDoubleQuote)) {
                parsed += filterCharacter;
            }
            else {
                parsed += c;
            }
            escaped = false;
        }
        return parsed;
    }
    /**
     * Returns whether or not the given keyword is the name of a Class
     * @param keyword - The keyword to validate
     * @returns `True` if the keyword is a Class definition
     */
    static isClass(keyword) {
        const classes = NavigationData.data.location['class'];
        if (keyword in classes) {
            return keyword;
        }
        else {
            const init = keyword + ".__init__";
            const base = NavigationData.resolve(init);
            if (base && base[0].keyword.indexOf('.') > 0) {
                return base[0].keyword.split('.')[0];
            }
            const defineType = NavigationData.gameObjects['define_types'][keyword];
            if (defineType && defineType.baseclass && defineType.baseclass.indexOf('(') > 0) {
                const base = defineType.baseclass.substring(0, defineType.baseclass.indexOf('('));
                return this.isClass(base);
            }
        }
        return;
    }
    static getClassAutoComplete(keyword) {
        let newlist = [];
        const prefix = keyword + '.';
        // get any inherited class items
        const cls = NavigationData.data.location['class'][keyword];
        if (cls) {
            if (cls.type && cls.type.length > 0) {
                const bases = cls.type.split(',');
                for (let base of bases) {
                    const items = NavigationData.getClassAutoComplete(base.trim());
                    if (items) {
                        for (let item of items) {
                            newlist.push(item);
                        }
                    }
                }
            }
        }
        // get the callables
        const callables = NavigationData.data.location['callable'];
        if (callables) {
            const filtered = Object.keys(callables).filter(key => key.indexOf(prefix) === 0);
            if (filtered) {
                for (let key in filtered) {
                    const label = filtered[key].substring(prefix.length);
                    if (!newlist.some(e => e.label === label)) {
                        newlist.push(new vscode_1.CompletionItem(label, vscode_1.CompletionItemKind.Method));
                    }
                }
            }
        }
        // get any properties
        const properties = NavigationData.gameObjects['properties'][keyword];
        if (properties) {
            for (let p of properties) {
                if (!newlist.some(e => e.label === p.keyword)) {
                    if (p.source === 'property') {
                        newlist.push(new vscode_1.CompletionItem(p.keyword, vscode_1.CompletionItemKind.Property));
                    }
                    else {
                        newlist.push(new vscode_1.CompletionItem(p.keyword, vscode_1.CompletionItemKind.Variable));
                    }
                }
            }
        }
        // get any fields
        const fields = NavigationData.gameObjects['fields'][keyword];
        if (fields) {
            for (let p of fields) {
                if (!newlist.some(e => e.label === p.keyword)) {
                    newlist.push(new vscode_1.CompletionItem(p.keyword, vscode_1.CompletionItemKind.Field));
                }
            }
        }
        return newlist;
    }
    static resolve(keyword) {
        const split = keyword.split('.');
        if (split.length < 2) {
            return;
        }
        const entries = NavigationData.find(split[0]);
        if (entries && entries.length === 1) {
            const entry = entries[0];
            if (entry && entry.filename && entry.filename !== "") {
                const line = (0, hover_1.getDefinitionFromFile)(entry.filename, entry.location);
                if (line) {
                    const base = (0, navigation_1.getBaseTypeFromDefine)(keyword, line.keyword);
                    if (base) {
                        return NavigationData.find(`${base}.${split[1]}`);
                    }
                }
            }
        }
    }
    static getClassData(location) {
        const def = (0, hover_1.getDefinitionFromFile)(location.filename, location.location);
        if (def) {
            if (!location.documentation || location.documentation.length === 0) {
                location.documentation = def.documentation;
            }
            if (!location.args || location.args.length === 0) {
                if (location.source === 'class') {
                    const init = NavigationData.data.location['callable'][`${location.keyword}.__init__`];
                    if (init) {
                        const initData = (0, hover_1.getDefinitionFromFile)(init[0], init[1]);
                        if (initData) {
                            let args = initData.args.replace('(self, ', '(');
                            args = args.replace('(self)', '()');
                            location.args = args;
                        }
                    }
                    else {
                        // if this class has no __init__ but has a base, look for its __init__
                        const bases = location.type.split(',');
                        for (let base of bases) {
                            if (location.args.length === 0) {
                                const init = NavigationData.data.location['callable'][`${base}.__init__`];
                                if (init) {
                                    const initData = (0, hover_1.getDefinitionFromFile)(init[0], init[1]);
                                    if (initData && initData.args && initData.args.length > 0) {
                                        let args = initData.args.replace('(self, ', '(');
                                        args = args.replace('(self)', '()');
                                        location.args = args;
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    location.args = def.args;
                }
            }
        }
        return location;
    }
    static getClassProperties(keyword, document, location) {
        // find @property attributes in the class definition
        let props = [];
        const rxDef = /^def\s+(\w*).*:/;
        const rxVariable = /^\s*(\w*)\s*=\s*(.*$)/;
        const filename = (0, workspace_1.stripWorkspaceFromFile)(document.uri.path);
        try {
            let index = location;
            let line = document.lineAt(index - 1).text;
            const spacing = line.indexOf('class ' + keyword);
            let finished = false;
            while (!finished && index < document.lineCount) {
                let line = document.lineAt(index).text.replace(/[\n\r]/g, '');
                let indent = line.length - line.trimLeft().length;
                if (line.length > 0 && (indent <= spacing)) {
                    finished = true;
                    break;
                }
                line = line.trim();
                const matches = line.match(rxDef);
                if (matches) {
                    // if document edits moved the callables, then update the location
                    let define_keyword = `${keyword}.${matches[1]}`;
                    let current_def = NavigationData.data.location['callable'][define_keyword];
                    if (current_def && current_def[0] === filename) {
                        if (current_def[1] !== index + 1) {
                            current_def[1] = index + 1;
                        }
                    }
                    else {
                        NavigationData.data.location['callable'][define_keyword] = [filename, index + 1];
                    }
                }
                // class variables and constants
                const variable = line.match(rxVariable);
                if (variable && indent === spacing * 2) {
                    const documentation = `::class ${keyword}:\n    ${line}`;
                    const nav = new navigation_1.Navigation('variable', variable[1], filename, index + 2, documentation, "", keyword, variable.index);
                    props.push(nav);
                }
                if (line.startsWith('@property')) {
                    const matches = document.lineAt(index + 1).text.trim().match(rxDef);
                    if (matches) {
                        const pyDocs = (0, navigation_1.getPyDocsFromTextDocumentAtLine)(document, index + 2);
                        const documentation = `${pyDocs}::class ${keyword}:\n    @property\n    def ${matches[1]}(self):`;
                        const nav = new navigation_1.Navigation('property', matches[1], filename, index + 2, documentation, "", keyword, matches.index);
                        props.push(nav);
                    }
                    index++;
                }
                index++;
            }
            return props;
        }
        catch (error) {
            return props;
        }
    }
    static getClassFields(keyword, document, location) {
        // find fields in the __init__ method of the class definition
        let props = [];
        if (!document || !document.lineCount) {
            return props;
        }
        const filename = (0, workspace_1.stripWorkspaceFromFile)(document.uri.path);
        const rxDef = /^\s*(self)\.(\w*)\s*=\s*(.*$)/;
        try {
            let index = location;
            let line = document.lineAt(index - 1).text;
            if (!line) {
                return props;
            }
            const spacing = line.indexOf('def ');
            if (spacing < 0) {
                return props;
            }
            let finished = false;
            while (!finished && index < document.lineCount) {
                let line = document.lineAt(index).text.replace(/[\n\r]/g, '');
                if (line.length > 0 && (line.length - line.trimLeft().length <= spacing)) {
                    finished = true;
                    break;
                }
                line = line.trim();
                const matches = line.match(rxDef);
                if (matches) {
                    const pyDocs = (0, navigation_1.getPyDocsFromTextDocumentAtLine)(document, index);
                    const documentation = `${pyDocs}::class ${keyword}:\n    def __init__(self):\n        self.${matches[2]} = ...`;
                    const nav = new navigation_1.Navigation('field', matches[2], filename, index + 1, documentation, "", keyword, matches.index);
                    if (!props.includes(nav)) {
                        props.push(nav);
                    }
                }
                index++;
            }
            return props;
        }
        catch (error) {
            return props;
        }
    }
    static getNavigationObject(source, keyword, array) {
        /*
        0 basefile,
        1 kind,
        2 args,
        3 class,
        4 type,
        5 docs
        */
        if (typeof array[0] === 'string' && (array[0] === 'obsolete' || array[0] === 'transitions')) {
            source = array[0];
        }
        else if (typeof array[4] === 'string' && (array[4] === 'Action')) {
            source = array[4].toLowerCase();
        }
        else if (source === 'equivalent') {
            source = array[0];
        }
        return new navigation_1.Navigation(source, keyword, "", //filename
        0, //location
        array[5], //documentation
        array[2], //args
        array[4] //type
        );
    }
    /**
     * Scans the workspace for any supported script files and searches them for class definitions
     */
    static scanForScriptFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield vscode_1.workspace.findFiles('**/*.rpy');
            if (files && files.length > 0) {
                for (let file of files) {
                    let document = yield vscode_1.workspace.openTextDocument(file);
                    const filename = (0, workspace_1.stripWorkspaceFromFile)((0, workspace_1.cleanUpPath)(file.path));
                    NavigationData.scanDocumentForClasses(filename, document);
                }
            }
            return true;
        });
    }
    /**
     * Scans the workspace for any supported images
     */
    static scanForImages() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield vscode_1.workspace.findFiles('**/*.{png,jpg,jpeg,webp}');
            if (files && files.length > 0) {
                for (let file of files) {
                    const filename = (0, workspace_1.stripWorkspaceFromFile)(file.path);
                    const displayable = NavigationData.getPythonName(filename);
                    if (displayable) {
                        const key = (0, workspace_1.extractFilenameWithoutExtension)(filename);
                        if (key) {
                            const path = (0, workspace_1.stripWorkspaceFromFile)((0, workspace_1.cleanUpPath)(file.path));
                            const displayable = new displayable_1.Displayable(key, 'image', '', path, -1);
                            NavigationData.data.location['displayable'][key] = displayable;
                        }
                    }
                }
            }
            return true;
        });
    }
    /**
     * Scans the workspace for any supported fonts
     */
    static scanForFonts() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield vscode_1.workspace.findFiles('**/*.{ttf,otf,ttc}');
            if (files && files.length > 0) {
                for (let file of files) {
                    const filename = (0, workspace_1.stripWorkspaceFromFile)(file.path);
                    let key = filename.replace(/^(game\/)/, '');
                    if (key.endsWith('.ttc')) {
                        key = "0@" + key;
                    }
                    NavigationData.gameObjects['fonts'][key] = key;
                }
            }
            return true;
        });
    }
    /**
     * Scans the workspace for any supported audio files
     */
    static scanForAudio() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield vscode_1.workspace.findFiles('**/*.{opus,ogg,mp3,wav}');
            if (files && files.length > 0) {
                for (let file of files) {
                    const filename = (0, workspace_1.stripWorkspaceFromFile)(file.path);
                    // add the path relative to the workspace/game folder
                    const key = filename.replace(/^(game\/)/, '');
                    NavigationData.gameObjects['audio'][key] = '"' + key + '"';
                    // if this file is in the game/audio folder and can be represented
                    // as a python variable, add it to the audio namespace
                    if (filename.startsWith('game/audio/')) {
                        const pythonName = NavigationData.getPythonName(filename);
                        if (pythonName) {
                            const key = "audio." + (0, workspace_1.extractFilenameWithoutExtension)(filename);
                            if (key && !NavigationData.gameObjects['audio'][key]) {
                                NavigationData.gameObjects['audio'][key] = key;
                            }
                        }
                    }
                }
            }
            return true;
        });
    }
    /**
     * Deletes any scanned data related to the given filename
     * @param filename - The filename for the script file
     */
    static clearScannedDataForFile(filename) {
        if (NavigationData.data.location === undefined) {
            NavigationData.data.location = {};
        }
        const categories = ['callable', 'class', 'displayable', 'persistent', 'properties', 'fields', 'stores'];
        for (let cat of categories) {
            let category = NavigationData.data.location[cat];
            if (category) {
                for (let key in category) {
                    if (category[key] instanceof navigation_1.Navigation) {
                        if (category[key].filename === filename) {
                            delete category[key];
                        }
                    }
                    else {
                        if (category[key][0] === filename) {
                            delete category[key];
                        }
                    }
                }
            }
            category = NavigationData.gameObjects[cat];
            if (category) {
                for (let key in category) {
                    if (category[key] instanceof navigation_1.Navigation) {
                        if (category[key].filename === filename) {
                            delete category[key];
                        }
                    }
                    else {
                        if (category[key][0] === filename) {
                            delete category[key];
                        }
                    }
                }
            }
        }
    }
    /**
     * Scans the given TextDocument looking for Ren'Py commands and definitions
     * @param filename - The filename for the script file
     * @param document - The TextDocument for the script file
     */
    static scanDocumentForClasses(filename, document) {
        const rxKeywordList = /\s*(register_channel|register_statement|default|define|class)[\s\()]+/;
        const rxClass = /^\s*class\s+(\w*)\s*(\(.*\))?.*:/;
        const rxDisplayable = /^\s*(image)\s+([^=.]*)\s*[=]\s*(.+)|(layeredimage)\s+(.+):|(image)\s+([^=.:]*)\s*:/;
        const rxChannels = /.*renpy.(audio|music).register_channel\s*\(\s*"(\w+)"(.*)/;
        const rxPersistent = /^\s*(default|define)\s+persistent\.([a-zA-Z]+[a-zA-Z0-9_]*)\s*=\s*(.*$)/;
        const rxDefaultDefine = /^(default|define)\s+([a-zA-Z0-9._]+)\s*=\s*([\w'"`\[{]*)/;
        const rxCharacters = /^\s*(define)\s*(\w*)\s*=\s*(Character|DynamicCharacter)\s*\((.*)/;
        const rxStatements = /.*renpy.register_statement\s*\("(\w+)"(.*)\)/;
        const rxOutlines = /[\s_]*outlines\s+(\[.*\])/;
        const rxInitStore = /^(init)\s+([-\d]+\s+)*python\s+in\s+(\w+):|^python\s+early\s+in\s+(\w+):/;
        const gameFilename = (0, workspace_1.stripWorkspaceFromFile)(document.uri.path);
        const internal = NavigationData.renpyFunctions.internal;
        let transitions = Object.keys(internal).filter(key => internal[key][0] === 'transitions');
        for (let i = 0; i < document.lineCount; ++i) {
            let line = document.lineAt(i).text;
            let append_line = i;
            let containsKeyword = line.match(rxKeywordList);
            if (containsKeyword) {
                // check for unterminated parenthesis for multiline declarations
                let no_string = NavigationData.filterStringLiterals(line);
                let open_count = (no_string.match(/\(/g) || []).length;
                let close_count = (no_string.match(/\)/g) || []).length;
                while (open_count > close_count && append_line < document.lineCount - 1 && append_line < 10) {
                    append_line++;
                    line = line + document.lineAt(append_line).text + '\n';
                    no_string = NavigationData.filterStringLiterals(line);
                    open_count = (no_string.match(/\(/g) || []).length;
                    close_count = (no_string.match(/\)/g) || []).length;
                }
            }
            if (line.trim().length === 0) {
                continue;
            }
            // match class definitions
            const matches = line.match(rxClass);
            if (matches) {
                const match = matches[1];
                let base = matches[2];
                if (base) {
                    base = base.replace(/\(/g, '').replace(/\)/g, '').trim();
                }
                const nav = new navigation_1.Navigation('class', match, filename, i + 1, "", "", base);
                NavigationData.data.location['class'][match] = nav;
                const properties = NavigationData.getClassProperties(match, document, i + 1);
                if (properties) {
                    NavigationData.gameObjects['properties'][match] = properties;
                }
                const initData = NavigationData.data.location['callable'][`${match}.__init__`];
                if (initData && initData[0] === gameFilename) {
                    const fields = NavigationData.getClassFields(match, document, initData[1]);
                    if (fields) {
                        NavigationData.gameObjects['fields'][match] = fields;
                    }
                }
                continue;
            }
            // match displayable definitions
            const displayables = line.match(rxDisplayable);
            if (displayables) {
                let match = "";
                let image_type = "image";
                if (displayables[2]) {
                    // image match
                    match = displayables[2].trim();
                }
                else if (displayables[5]) {
                    // layered image match
                    match = displayables[5].trim();
                    image_type = displayables[4].trim();
                }
                else if (displayables[7]) {
                    // atl image match
                    match = displayables[7].trim();
                    image_type = displayables[6].trim();
                }
                if (match.length > 0) {
                    const displayable = new displayable_1.Displayable(match, image_type, displayables[3], filename, i + 1);
                    NavigationData.data.location['displayable'][match] = displayable;
                }
                continue;
            }
            // match audio channels created with register_channel
            const channels = line.match(rxChannels);
            if (channels) {
                let match = channels[2];
                NavigationData.gameObjects['channels'][match] = [filename, i + 1];
                continue;
            }
            // match persistent definitions (define persistent)
            const persistents = line.match(rxPersistent);
            if (persistents) {
                let match = persistents[2];
                NavigationData.data.location['persistent'][match] = [filename, i + 1];
                continue;
            }
            // match outlines
            const outlines = line.match(rxOutlines);
            if (outlines) {
                let match = outlines[1];
                if (!NavigationData.data.location['outlines']) {
                    NavigationData.data.location['outlines'] = {};
                    NavigationData.data.location['outlines']['array'] = [];
                }
                let current_outlines = NavigationData.data.location['outlines']['array'];
                if (current_outlines === undefined) {
                    current_outlines = [];
                }
                if (!current_outlines.includes(match)) {
                    current_outlines.push(match);
                }
                NavigationData.data.location['outlines']['array'] = current_outlines;
                continue;
            }
            // match default/defines
            const defaults = line.match(rxDefaultDefine);
            if (defaults) {
                const datatype = new navigation_1.DataType(defaults[2], defaults[1], defaults[3]);
                datatype.checkTypeArray('transitions', transitions);
                NavigationData.gameObjects['define_types'][defaults[2]] = datatype;
                updateNavigationData('define', defaults[2], filename, i);
            }
            // match stores
            const stores = line.match(rxInitStore);
            if (stores) {
                let match = '';
                if (stores[4] !== undefined) {
                    match = stores[4];
                }
                else {
                    match = stores[3];
                }
                NavigationData.gameObjects['stores'][match] = [filename, i + 1];
                const datatype = new navigation_1.DataType(stores[3], 'default', 'store');
                NavigationData.gameObjects['define_types'][match] = datatype;
                continue;
            }
            // match characters
            const characters = line.match(rxCharacters);
            if (characters) {
                let char_name = '';
                let char_image = '';
                let dynamic = '';
                let split = (0, navigation_1.splitParameters)(characters[4], true);
                if (split) {
                    char_name = (0, navigation_1.stripQuotes)(split[0]);
                    char_image = (0, navigation_1.getNamedParameter)(split, 'image');
                    dynamic = (0, navigation_1.getNamedParameter)(split, 'dynamic');
                }
                if (characters[3] === 'DynamicCharacter') {
                    dynamic = 'True';
                }
                else if (!dynamic || dynamic.length === 0) {
                    dynamic = 'False';
                }
                var chr_object = new character_1.Character(char_name, char_image, dynamic, split, filename, i);
                NavigationData.gameObjects['characters'][characters[2]] = chr_object;
                continue;
            }
            // creator defined statements
            const statements = line.match(rxStatements);
            if (statements) {
                const statement_name = statements[1];
                const statement_args = (0, navigation_1.splitParameters)(statements[1] + statements[2], true);
                let statement_docs = '';
                const execute = (0, navigation_1.getNamedParameter)(statement_args, 'execute');
                if (execute && execute.length > 0) {
                    let entries = NavigationData.find(execute);
                    if (entries) {
                        const def = (0, hover_1.getDefinitionFromFile)(entries[0].filename, entries[0].location);
                        if (def) {
                            statement_docs = def.documentation;
                        }
                    }
                }
                const statement = new navigation_1.Navigation('statement', statement_name, filename, i + 1, statement_docs, "", "cds", statements.index);
                NavigationData.data.location['statement'][statement_name] = statement;
                continue;
            }
        }
    }
    static getCharacterImageAttributes() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("getCharacterImageAttributes");
            const characters = NavigationData.gameObjects['characters'];
            const displayables = NavigationData.data.location['displayable'];
            for (let key in characters) {
                const char = characters[key];
                let attributes = [];
                if (char && char.image && char.image.length > 0) {
                    const displayable = displayables[char.image];
                    if (displayable) {
                        // find layered image attributes
                        if (displayable.image_type === 'layeredimage') {
                            const li_attributes = yield NavigationData.getLayeredImageAttributes(displayable.name, displayable.filename, displayable.location);
                            if (li_attributes) {
                                for (let attr of li_attributes) {
                                    if (!attributes.includes(attr)) {
                                        attributes.push(attr);
                                    }
                                }
                            }
                        }
                        // find defined image attributes
                        const filtered = Object.keys(displayables).filter(key => displayables[key].tag === char.image);
                        if (filtered) {
                            for (let key of filtered) {
                                if (key !== char.image) {
                                    const attr = key.substring(char.image.length + 1);
                                    if (!attributes.includes(attr)) {
                                        attributes.push(attr);
                                    }
                                }
                            }
                        }
                    }
                    NavigationData.gameObjects['attributes'][key] = attributes;
                }
            }
        });
    }
    static getLayeredImageAttributes(keyword, filename, location) {
        return __awaiter(this, void 0, void 0, function* () {
            // find attributes in the layered image definition
            const displayables = NavigationData.data.location['displayable'];
            const path = (0, workspace_1.getFileWithPath)(filename);
            let document = yield vscode_1.workspace.openTextDocument(path);
            let attributes = [];
            const rxAttr = /^\s*attribute\s+(\w*)/;
            try {
                let index = location;
                let line = document.lineAt(index - 1).text;
                const spacing = line.indexOf('layeredimage ' + keyword);
                let finished = false;
                while (!finished && index < document.lineCount) {
                    let line = document.lineAt(index).text.replace(/[\n\r]/g, '');
                    if (line.length > 0 && (line.length - line.trimLeft().length <= spacing)) {
                        finished = true;
                        break;
                    }
                    line = line.trim();
                    if (line.startsWith('attribute')) {
                        // specific attribute
                        const match = line.match(rxAttr);
                        if (match) {
                            if (!attributes.includes(match[1])) {
                                attributes.push(match[1]);
                            }
                        }
                    }
                    else if (line.startsWith('group') && line.indexOf('auto') > 0) {
                        // auto attributes
                        const match = line.match(/^\s*group\s+(\w*)/);
                        if (match) {
                            const image_key = `${keyword}_${match[1]}_`;
                            const filtered = Object.keys(displayables).filter(key => key.startsWith(image_key));
                            if (filtered) {
                                for (let d of filtered) {
                                    if (d !== image_key) {
                                        const attr = d.substring(image_key.length);
                                        if (attr.indexOf('_') > 0) {
                                            const split = attr.split('_');
                                            if (!attributes.includes(split[0])) {
                                                attributes.push(split[0]);
                                            }
                                        }
                                        else {
                                            if (!attributes.includes(attr)) {
                                                attributes.push(attr);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    index++;
                }
                return attributes;
            }
            catch (error) {
                return attributes;
            }
        });
    }
    /**
     * Returns whether or not the given filename can be represented as a Python variable
     * @param filename - The filename
     * @returns True if the filename can be represented as a Python variable
     */
    static getPythonName(filename) {
        const rx = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        let fn_only = (0, workspace_1.extractFilenameWithoutExtension)(filename) || '';
        const split = fn_only.split(' ');
        for (let i = 0; i < split.length; i++) {
            const match = split[i].match(rx);
            if (!match || match.length === 0) {
                return false;
            }
        }
        return true;
    }
}
exports.NavigationData = NavigationData;
NavigationData.data = {};
NavigationData.gameObjects = {};
NavigationData.isImporting = false;
NavigationData.isCompiling = false;
function readNavigationJson() {
    try {
        const filepath = (0, workspace_1.getNavigationJsonFilepath)();
        console.log(`readNavigationJson: ${filepath}`);
        let flatData;
        try {
            flatData = fs.readFileSync(filepath, 'utf-8');
        }
        catch (error) {
            flatData = '{}';
        }
        const json = JSON.parse(flatData);
        return json;
    }
    catch (error) {
        vscode_1.window.showErrorMessage(`readNavigationJson error: ${error}`);
    }
}
exports.readNavigationJson = readNavigationJson;
function updateNavigationData(type, keyword, filename, line) {
    if (type === 'define' || type === 'screen' || type === 'label' || type === 'transform' || type === 'callable') {
        let category = NavigationData.data.location[type];
        if (category[keyword]) {
            let entry = category[keyword];
            if (entry) {
                if (entry[0] === filename && entry[1] !== line + 1) {
                    entry[1] = line + 1;
                }
            }
        }
        else {
            category[keyword] = [filename, line + 1];
        }
    }
}
exports.updateNavigationData = updateNavigationData;
function getStatusBarText() {
    if (!vscode_1.window.activeTextEditor || !vscode_1.window.activeTextEditor.document || vscode_1.window.activeTextEditor.document.languageId !== 'renpy') {
        return "";
    }
    if (NavigationData.data) {
        if (NavigationData.data.name !== undefined) {
            return `${NavigationData.data.name} v${NavigationData.data.version}`;
        }
        else {
            return "(Uncompiled Game)";
        }
    }
    else {
        return "";
    }
}
exports.getStatusBarText = getStatusBarText;
//# sourceMappingURL=navigationdata.js.map