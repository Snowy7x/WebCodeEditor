let editor = null;
let currLang = 'javascript';

function loadEditor() {
        editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
            mode: currLang,
            htmlMode: true,
            theme: "default",
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
            lineNumbers: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            extraKeys: {"Ctrl-E": "autocomplete"}
        });

        const hintWords = ["trap.our()", "trap.hints()", "trap"]; // custom hints
        const jsHinter = CodeMirror.hint.javascript; // copy default hinter for JavaScript
        CodeMirror.hint.javascript = function (editor) {
            // Find the word fragment near cursor that needs auto-complete...
            const cursor = editor.getCursor();
            const currentLine = editor.getLine(cursor.line);
            let start = cursor.ch;
            let end = start;
            const rex = /[\w.]/; // a pattern to match any characters in our hint "words"
            // Our hints include function calls, e.g. "trap.getSource()"
            // so we search for word charcters (\w) and periods.
            // First (and optional), find end of current "word" at cursor...
            while (end < currentLine.length && rex.test(currentLine.charAt(end))) ++end;
            // Find beginning of current "word" at cursor...
            while (start && rex.test(currentLine.charAt(start - 1))) --start;
            // Grab the current word, if any...
            const curWord = start !== end && currentLine.slice(start, end);
            // Get the default results object from the JavaScript hinter...
            const dflt = jsHinter(editor);
            // If the default hinter didn't hint, create a blank result for now...
            const result = dflt || {list: []};
            // Set the start/end of the replacement range...
            result.to = CodeMirror.Pos(cursor.line, end);
            result.from = CodeMirror.Pos(cursor.line, start);
            // Add our custom hintWords to the list, if they start with the curWord...
            hintWords.forEach(h => {
                if (h.startsWith(curWord)) result.list.push(h);
            });
            result.list.sort(); // sort the final list of hints
            return result;
        };
}

function myFunction() {
    var w = window.outerWidth;
    var h = window.outerHeight;
    var txt = "Window size: width=" + w + ", height=" + h;
    console.log(txt);
}

function changeLanguage(lang){
    if (editor == null)
        return;
    console.log("changing language to: " + lang);
    if (lang !== currLang){
        switch (lang) {
            case 'javascript':
                editor.setOption('mode', 'javascript');
                currLang = lang;
                break;
            case 'python':
                editor.setOption('mode', 'python');
                currLang = lang;
                break;
        }
    }
}