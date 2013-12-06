var XML = require('../src');
var testdata = require('./data');

describe('digger-xml', function(){

  it('should have a parse function', function () {
    XML.parse.should.be.an.instanceOf(Function);
  });

  it('should have a stringify function', function () {
    XML.stringify.should.be.an.instanceOf(Function);
  });

  it('should process the city XML', function() {

    var data = XML.parse(testdata.citiesxml);

    data.should.be.an.instanceOf(Array);
    data.length.should.equal(1);

    var countries = data[0]._children;
    var uk = countries[0];
    var cities = uk._children;

    countries.length.should.equal(2);
    uk._digger.tag.should.equal('country');
    cities.length.should.equal(6);

    cities[1]._children[2].population.should.equal(68);

  })

  it('should process attribute nodes', function(){
    var data = XML.parse(testdata.attrxml);

    data[0].notes.should.equal('hello world');
  })

  it('should stringify attribute nodes', function(){

    var data = [{
      _digger:{
        tag:'foo'
      },
      html:"hello\nworld"
    }]

    var xml = XML.stringify(data);

    var expect_xml = [
      "<foo>",
      "\t<attr name=\"html\">hello",
      "world</attr>",
      "</foo>",
      ""
    ].join("\n")

    xml.should.equal(expect_xml)
  })

  it('should stringify all data', function(){

    var data = [{
      _digger:{
        tag:'foo',
        id:'bar',
        class:['apple', 'orange']
      },
      height:10,
      html:"hello\nworld"
    }]

    var xml = XML.stringify(data);

    var expect_xml = [
      "<foo id=\"bar\" class=\"apple orange\" height=\"10\">",
      "\t<attr name=\"html\">hello",
      "world</attr>",
      "</foo>",
      ""
    ].join("\n")

    xml.should.equal(expect_xml)


  })


  
})