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

module.exports.toXML = toXML;
module.exports.data_factory = data_factory;
module.exports.string_factory = string_factory;

function is_array(arr){
  return Object.prototype.toString.call(arr) == '[object Array]';
}

function toXML(data_array){
  if(!is_array(data_array)){
    data_array = [data_array];
  }
  return data_array.map(function(data){
    return string_factory(data, 0);
  }).join("\n");
}

function extract_attr_text_node(xml_elem){
  var child = xml_elem.childNodes[0];

  if(child && child.nodeType==xml_elem.TEXT_NODE){
    var value = child.nodeValue;

    if(value.match(/^[\s\n\r]+$/)){
      return;
    }

    return value;
  }

  return null;
}

function get_node_attributes(xml_elem){
  var attr = {};
  for(var i=0; i<xml_elem.attributes.length; i++){
    var node_attr = xml_elem.attributes[i];
    attr[node_attr.nodeName] = node_attr.nodeValue;
  }
  return attr;
}

function parse_attribute_value(val){
  if(!val){
    return val;
  }
  if(('' + val).toLowerCase()==="true"){
    val = true;
  }
  else if(('' + val).toLowerCase()==="false"){
    val = false;
  }
  else if(('' + val).match(/^-?\d+(\.\d+)?$/)){
    var num = parseFloat(val);
    if(!isNaN(num)){
      val = num;
    }
  }
  return val;
}

function write_dot_notation(obj, field, value){
  var parts = field.split('.');
  var lastpart = parts.pop();
  var currentobj = obj;
  parts.forEach(function(part){
    if(!currentobj[part]){
      currentobj[part] = {};
    }
    currentobj = currentobj[part];
  })
  currentobj[lastpart] = value;
}
    
function data_factory(xml_elem){

  if(xml_elem.nodeType==xml_elem.TEXT_NODE){
    return null;
  }
  
  var attr = get_node_attributes(xml_elem);

  var classnames = (attr.class || '').split(/[\s,]+/);
  delete(attr.class);
  var id = attr.id;
  delete(attr.id);

  var data = {
    _digger:{
      tag:xml_elem.tagName,
      class:[]
    },
    _children:[]
  }
  
  classnames.forEach(function(classname){
    data._digger.class.push(classname);
  })

  if(id){
    data._digger.id = id;
  }

  Object.keys(attr || {}).forEach(function(prop){
    var val = parse_attribute_value(attr[prop]);
    write_dot_notation(data, prop, val);
  })

  var child_models = [];

  for(var j=0; j<xml_elem.childNodes.length; j++){
    var child_node = xml_elem.childNodes[j];

    if(child_node.tagName=='attr'){
      var child_attr = get_node_attributes(child_node);
      var name = child_attr.name;
      var value = child_attr.value;
      var text_value = extract_attr_text_node(child_node);
      if(text_value){
        value = text_value;
      }
      write_dot_notation(data, name, value);
    }
    else{
      var child = data_factory(child_node);
      if(child){
        child_models.push(child);
      }
    }
  }

  data._children = child_models;

  return data;
}


function string_factory(data, depth){

  var meta = data._digger || {};
  var children = data._children || [];
  var attr = data;
  depth = depth || 0;

  if(!meta.tag){
    meta.tag = 'item';
  }

  function get_indent_string(){
    var st = "\t";
    var ret = '';
    for(var i=0; i<depth; i++){
      ret += st;
    }
    return ret;
  }

  var pairs = {};
  var attr_nodes = [];

  if(meta.id && meta.id.length>0){
    pairs.id = meta.id;
  }

  if(meta.class && meta.class.length>0){
    pairs.class = meta.class.join(' ');
  }

  var pair_strings = [];

  Object.keys(attr || {}).forEach(function(key){
    var val = attr[key];
    if(key.indexOf('_')===0){
      return;
    }
    if(key=='$$hashKey'){
      return;
    }
    if(typeof(val)==='string'){
      if(val.length>32 || val.match(/\n/)){
        attr_nodes.push({
          name:key,
          value:val
        })
      }
      else{
        pairs[key] = val;
      }
    }
    else{
      pairs[key] = val;  
    }
    
  })
  
  Object.keys(pairs || {}).forEach(function(field){
    var value = pairs[field];
  
    if(value!=null && value!=''){
      pair_strings.push(field + '="' + value + '"');  
    }
  })

  function build_attr_nodes(){
    depth++;
    var ret = '';
    attr_nodes.forEach(function(attr_node){
      ret += get_indent_string() + '<attr name="' + attr_node.name + '">' + attr_node.value + '</attr>' + "\n";
    })
    depth--;
    return ret;
  }

  function get_attr_string(){
    return (pair_strings.length>0?' ' : '') + pair_strings.join(' ');
  }

  if(children && children.length>0){
    var ret = get_indent_string() + '<' + meta.tag + get_attr_string() + '>' + "\n";

    ret += build_attr_nodes();

    children.forEach(function(child){
      ret += string_factory(child, depth+1);
    })

    ret += get_indent_string() + '</' + meta.tag + '>' + "\n";

    return ret;    
  }
  else{
    if(attr_nodes.length<=0){
      return get_indent_string() + '<' + meta.tag + get_attr_string() + ' />' + "\n";  
    }
    else{
      var ret = get_indent_string() + '<' + meta.tag + get_attr_string() + '>' + "\n";
      ret += build_attr_nodes();
      ret += get_indent_string() + '</' + meta.tag + '>' + "\n";

      return ret;
    }
    
  }
}