# ESC/POS TSC Buffer Builder

[![Build Status](https://travis-ci.com/sloth-dance/command-builder.svg?token=JN5h9RsNpqeiEDk9f2rW&branch=master)](https://travis-ci.com/sloth-dance/command-builder) [![Coverage Status](https://coveralls.io/repos/github/sloth-dance/command-builder/badge.svg?branch=master)](https://coveralls.io/github/sloth-dance/command-builder?branch=master)

JavaScript library that implements the ESC/POS and TSC protocol to buffer, also provides an AST like JSON tree structure that you can preparing convertible templates (hmtl/xml) as you want.

### Features
  * ESC/POS and TSC protocol compatible
  * Root, text, table, tr, td, img, blank, separator and qrcode nodes include style attribues implementation
  * Command node for cashbox and cut paper implementation
  * Compile semantic nodes to raw buffer according to ESC/POS and TSC protocol

### Usage

1. Installation of nodejs environment

```
  npm install @posprint/command-builder
```

The library is distributed as umd package, just import to your front-end project the normally.

2. Build json tree to command buffer

Build ESC command buffer from json tree

```javascript
const { buildCommand } = require('@posprint/command-builder')

const jsonTree = {
  "elementName": "root",
  "attributes":{},
  "children": [{
    "elementName": "blank",
    "attributes":{},
    "children": null
  },
  {
    "elementName": "text",
    "attributes": {
      "font-size": "wide-high",
      "align": "center"
    },
    "children": "Change Table"
  }]
}

const cmd = await buildCommand(jsonTree, { type: 'esc', encoding: 'UTF-8', paperSize: [80]})

const buffer =  commands.getBuffer().flush() 

```
After json tree is built by command bulder, pass buffer to printer tcp socket directly for printing.


Build TSC command buffer from json tree

```javascript
const { buildCommand } = require('@posprint/command-builder')

{
  "elementName": "root",
  "attributes":{},
  "children": [
  {
    "elementName": "text",
    "attributes":
    {
      "align": "center"
    },
    "children": "---Order List---"
  },
  {
    "elementName": "text",
    "attributes":{},
    "children": "Latte"
  },
  {
    "elementName": "text",
    "attributes":
    {},
    "children": "Take out"
  },
  {
    "elementName": "separator",
    "attributes":
    {},
    "children": null
  },
  {
    "elementName": "text",
    "attributes":
    {},
    "children": "05-18 14:29 #498"
  },
  ]
}

const cmd = await buildCommand(jsonTree, { type: 'tsc', encoding: 'UTF-8', paperSize: [40, 30]})

const buffer =  commands.getBuffer().flush()

```

Tsc only supports `text`, `separator` and `root` right now, other nodes will be ignored when you printer type is TSC. We are extending more tsc nodes, for example table, img, blank.

3. Send raw buffer to printer through tcp connection

View example folder to get demo and screenshot how to buffer be printed by physical printer.


###  API

#### buildCommand

```
buildCommand(json, option)
```

* json: json tree structure of nodes, view node tree description below
* object.type: string type allows 'esc' and 'tsc', default value is 'esc'
* object.encoding: string type of encoding, default value is 'UTF-8'
* object.paperSize: array type of printer paper size, 'tsc' type contains two elements, default value is [80]. ie, [80], [58], [40, 30]

Returns a Template instance which can invoke getBuffer() method to get raw buffer.

#### validateNode

```
validateNode(json, option)
```

* json, option parameters are the same as `buildCommand`, the difference is json tree not be built buffer in order to validate json tree of nodes

### Node Json Tree

Json tree that contains multiple `nodes` must have a root node, each node contains `elementName`, `attributes`, `children` and other attributes.

The specific json tree format is as follows:

```json
  {
    "elementName": "root",
    "attributes": {},
    "children": [{
        "elementName": "blank",
        "attributes": {},
        "children": null
      },
      {
        "elementName": "text",
        "attributes":
        {
          "align": "center"
        },
        "children": "Order List"
      }
    ]
  }
```

`node` specification

| Attribute | Type | Requirement | specification |
|-----|----|---|----|
|  elementName |  string  | required | A node describes a type of printing instruction, text, picture, QR code, etc. Allowed element name see supported nodes below. |
|  attributes |  object  |  optional | Describe the style of the node, font, style, alignment, etc. |
|  children |  array, string, null  | optional  | The content printed by printer or the child node. |

You can use different json parser to convert the HTML/XML or other source file into a json tree.

### Supported Nodes

* root
* text
* command
* blank
* img
* qrcode
* separator
* table
* tr
* td
* section

### Exmaples

View [source code](https://github.com/sloth-dance/command-builder/tree/master/examples) in the exmaples folder about ESC and TSC content printing.

### Recommended HTML/XML Parser
1. Live demo of parsers look [here](https://astexplorer.net/#/2AmVrGuGVJ)
2. React temple parser supports all nodes of current library is available [here](https://github.com/sloth-dance/template)
