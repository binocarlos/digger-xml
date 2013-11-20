var XML = require('digger-xml');

var testdata = {};

testdata.simplexml = [
  '<folder>',
  ' <product name="Chair" class="red">',
  '   <caption name="User1" class="blue" />',
  '   <caption name="User2" class="green" />',
  '   <caption name="User3" class="yellow" />',
  ' </product>',
  ' <product name="Table" class="purple">',
  '   <caption name="User1" class="orange" />',
  '   <caption name="User2" class="pink" />',
  ' </product>',
  '</folder>'
].join("\n");

testdata.blueprintxml = [
  '<folder>',

  '  <blueprint name="folder">',
  '    <blueprint__attr name="desc">',
  '       hello this is raw text',
  '    </blueprint__attr>',
  '    <field name="name" required="true" />',
  '  </blueprint>',

  '  <blueprint name="warehouse" leaf="true">',
  '    <field name="name" />',
  '    <field name="access" type="warehouse_access" />',
  '    <field name="readme" type="markdown" />',
  '  </blueprint>',

  '</folder>'
].join("\n");

testdata.attrxml = [
  '<folder>',
  '<attr name="notes">hello world</attr>',
  '</folder>'
].join("\n");

testdata.citiesxml = [ 
  '<folder id="places" class="hello">',
  '  <country class="big apples" name="UK">',
  '    <city class="south" name="Bristol" team="Bristol City">',
  '      <area class="poor" name="St. Pauls" population="103" />',
  '      <area class="rich" name="Redland" population="79" />',
  '      <area class="poor" name="Easton" population="38" />',
  '      <area class="rich" name="Hotwells" population="320" />',
  '    </city>',
  '    <city class="south" name="London" team="Arsenal">',
  '      <area class="rich" name="Westminster" population="298" />',
  '      <area class="rich" name="Ealing" population="98" />',
  '      <area class="poor" name="Woolwich" population="68" />',
  '    </city>',
  '    <city class="midlands" name="Birmingham" team="Ason Villa">',
  '      <area  class="rich" name="Edgbaston" population="183" />',
  '    </city>',
  '    <city class="midlands" name="Nottingham" team="Nottingham Forest">',
  '      <area class="rich" name="Edgbaston" population="183" />',
  '    </city>',
  '    <city class="north" name="Liverpool" team="Everton">',
  '      <area class="poor" name="Everton" population="89" />',
  '    </city>',
  '    <city class="north" name="Middlesbrough" team="Middlesbrough">',
  '      <area class="rich" name="Linthorpe" population="28" />',
  '      <area class="poor" name="Grangetown" population="39" />',
  '    </city>',
  '  </country>',
  '  <country class="big" name="Scotland">',
  '    <city class="north" name="Aberdeen" team="Aberdeen">',
  '      <area class="poor" name="Harbourside" population="39" />',
  '    </city>',
  '    <city class="south" name="Edinburgh" team="Hearts">',
  '      <area class="rich" name="Meadows" population="97" />',
  '    </city>',
  '  </country>',
  '</folder>'
].join("\n");


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