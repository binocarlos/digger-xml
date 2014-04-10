digger-xml
==========

![Build status](https://api.travis-ci.org/binocarlos/digger-xml.png)

An XML parser/stringifier for digger container data

## example

```js
var XML = require('digger-xml');
var data = XML.parse('<folder name="hello"><thing name="thing" /></folder>');
var xml_string = XML.stringify(data);
```

data becomes:

```js
[{
	name:'hello',
	_digger:{
		tag:'folder'
	},
	_children:[{
		name:'thing',
		_digger:{
			tag:'thing'
		}
	}]
}]
```

xml_string becomes:

```xml
<folder name="hello"><thing name="thing" /></folder>
```

## installation

as a node module:

```
$ npm install digger-xml
```

or in the browser using [browserify](https://github.com/substack/node-browserify)

## usage

Both versions work the same in the browser or on the server.

The server version uses [xmldom](https://github.com/jindw/xmldom) for the XML parsing.

The browser version uses the native browser parsers.

### parse
Takes a string and returns digger data

```js
var data = XML.parse('<folder name="hello"><thing name="thing" /></folder>');
```

If there is an 'attr' element as a direct child - it is applied as an attribute of the parent:


```xml
<blog title="my post">
<attr name="content">hello world</attr>
</blog>
```

This is turned into:

```js
[{
	content:'hello world',
	_digger:{
		tag:'blog'
	}
}]
```

### stringify
Takes an array of digger data and returns an XML string.

Attributes are turned into nodes if they are strings and more than 32 chars long or container a \n char.

```js
var XML = require('digger-xml');
var data = [{
	content:"hello \nworld",
	_digger:{
		tag:'blog'
	}
}]

var xml_string = XML.stringify(data);
```

This outputs:

```xml
<blog title="my post">
<attr name="content">hello 
world</attr>
</blog>
```

## tests

There are 2 sets of tests one for the npm node version and one for the component.

To run the server tests:

```
$ make test
```

And the browser ones (using phantomjs which you need to install):

```
$ make browser-test
```

## licence

MIT

