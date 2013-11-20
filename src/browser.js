/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var utils = require('./utils');

module.exports.parse = XMLParser;
module.exports.stringify = utils.toXML;

function get_parser(){
  function MicrosoftXMLDOMParser() {
    this.parser = new window.ActiveXObject('Microsoft.XMLDOM');
  }

  MicrosoftXMLDOMParser.prototype.parse = function (input) {
    this.parser.async = false;
    return this.parser.loadXml(input);
  };

  function XMLDOMParser() {
    this.parser = new window.DOMParser();
  }

  XMLDOMParser.prototype.parse = function (input) {
    return this.parser.parseFromString(input, 'text/xml');
  };

  if (window.DOMParser) {
    return new XMLDOMParser();
  } else if (window.ActiveXObject) {
    return new MicrosoftXMLDOMParser();
  } else {
    throw new Error('Cannot parser XML in this environment.');
  }

}

function XMLParser(xml){
  var xmlParser = get_parser();
  xml = xml.replace(/^[^<]*/, '').replace(/[^>]*$/, '');

  var domElement = xmlParser.parse(xml);
  var doc = domElement.documentElement;
  if(doc.nodeName=='html'){
    return [];
  }
  else{
    var node_arr = [];

    for(var i=0; i<domElement.childNodes.length; i++){
      node_arr[i] = domElement.childNodes[i];
    }
    
    var results = node_arr.map(utils.data_factory);

    return results;
  }
}