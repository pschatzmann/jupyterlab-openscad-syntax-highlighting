/**
 * Register CodeMirror Syntax Hightlighting for OpenSCAD in Jupyterlab.
 * We just extended Javascript Simple Mode https://codemirror.net/demo/simplemode.html by adding
 * the additional keywords.
 */
const CodeMirror = require('codemirror');
require('codemirror/addon/mode/simple');

const OpenSCAD = {
  name: 'openscad',
  displayName: 'OpenSCAD',
  extensions: ['scad'],
  mimetype: 'application/x-openscad'
}

module.exports = [{
  id: 'openscad-extension',
  autoStart: true,
  activate: function (app) {
    registerOpenSCADFileType(app);
    registerOpenSCADWithCodeMirror();
    console.log('JupyterLab extension openscad-extension is activated!');
  }
}];

function registerOpenSCADFileType(app) {
  app.docRegistry.addFileType({
    name: OpenSCAD.name,
    displayName: OpenSCAD.displayName,
    extensions: OpenSCAD.extensions,
    mimeTypes: [OpenSCAD.mimetype]
  });
}

function registerOpenSCADWithCodeMirror() {
  CodeMirror.defineSimpleMode(OpenSCAD.name, {
      // The start state contains the rules that are intially used
      start: [
        // The regex matches the token, the token property contains the type
        {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
        // You can match multiple tokens at once. Note that the captured
        // groups must span the whole string in this case
        {regex: /(function)(\s+)([a-z$][\w$]*)/,token: ["keyword", null, "variable-2"]},
        // Rules are matched in the order in which they appear, so there is
        // no ambiguity between this one and the one above
        {regex: /(?:cos|acos|sin|asin|tan|atan|atan2|abs|sign|rands|min|max|round|ceil|floor|pow|sqrt|exp|log|ln|str|lookup|version|version_num|len|search|dxf_dim|dxf_cross|norm|cross|concat|chr|children|echo|for|intersection_for|if|else|cube|sphere|cylinder|polyhedron|square|circle|polygon|scale|rotate|translate|mirror|multmatrix|union|difference|intersection|render|color|surface|linear_extrude|rotate_extrude|import|use|group|projection|minkowski|hull|resize|module|function|let|offset|text|return)\b/, token: "keyword"},
        {regex: /true|false|null|undefined/, token: "atom"},
        {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,token: "number"},
        {regex: /\/\/.*/, token: "comment"},
        {regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},
        // A next property will cause the mode to move to a different state
        {regex: /\/\*/, token: "comment", next: "comment"},
        {regex: /[-+\/*=<>!]+/, token: "operator"},
        // indent and dedent properties guide autoindentation
        {regex: /[\{\[\(]/, indent: true},
        {regex: /[\}\]\)]/, dedent: true},
        {regex: /[a-z$][\w$]*/, token: "variable"},

        // Magic commands %clear %display %%display %mime %command %lsmagic %include %saveAs
        {regex: /(?:%lsmagic|%display|%%display|%mime|%command|%include|%saveAs)\b/, token: "meta"},

        // You can embed other modes with the mode property. This rule
        // causes all code between << and >> to be highlighted with the XML
        // mode.
      ],
      // The multi-line comment state.
      comment: [
        {regex: /.*?\*\//, token: "comment", next: "start"},
        {regex: /.*/, token: "comment"}
      ],
      // The meta property contains global information about the mode. It
      // can contain properties like lineComment, which are supported by
      // all modes, and also directives like dontIndentStates, which are
      // specific to simple modes.
      meta: {
        dontIndentStates: ["comment"],
        lineComment: "//"
      }
  });

  CodeMirror.defineMIME(OpenSCAD.mimetype, OpenSCAD.name);

  CodeMirror.modeInfo.push({
    name: OpenSCAD.displayName,
    mime: OpenSCAD.mimetype,
    mode: OpenSCAD.name,
    ext: OpenSCAD.extensions
  });
}

