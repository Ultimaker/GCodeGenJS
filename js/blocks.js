function blockGetFieldValue(block, field_name)
{
    var value = block.getFieldValue(field_name);
    for(var variable of block.workspace.variableList)
    {
        if (value == variable)
            return Blockly.JavaScript.variableDB_.getName(value, Blockly.Variables.NAME_TYPE);
    }
    return value;
}

Blockly.Blocks['gcode_start'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Start")
            .appendField(new Blockly.FieldTextInput("generated.gcode"), "FILENAME")
            .appendField(new Blockly.FieldDropdown([["Ultimaker_Origonal", "UMO"], ["Ultimaker_2", "UM2"], ["Ultimaker_3", "UM3"]]), "FLAVOR");
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip('');
    }
};
Blockly.JavaScript['gcode_start'] = function(block) {
    var flavor = block.getFieldValue('FLAVOR');
    return "gcode.start('" + flavor + "')\n";
};

Blockly.Blocks['gcode_move'] = {
    init: function() {
        this.appendValueInput("POSITION")
            .setCheck("Position")
            .appendField("Move");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip('');
    }
};
Blockly.JavaScript['gcode_move'] = function(block) {
    var input = Blockly.JavaScript.valueToCode(block, 'POSITION', Blockly.JavaScript.ORDER_NONE);
 
    return "gcode.move(" + input + ", false)\n";
};

Blockly.Blocks['gcode_extrude_move'] = {
    init: function() {
        this.appendValueInput("POSITION")
            .setCheck("Position")
            .appendField("Extrude to");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip('');
    }
};
Blockly.JavaScript['gcode_extrude_move'] = function(block) {
    var input = Blockly.JavaScript.valueToCode(block, 'POSITION', Blockly.JavaScript.ORDER_NONE);
 
    return "gcode.move(" + input + ", true)\n";
};


Blockly.Blocks['gcode_hotend_temperature'] = {
    init: function() {
        this.appendValueInput("TEMPERATURE")
            .setCheck("Number")
            .appendField("Temperature");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip('');
    }
};
Blockly.JavaScript['gcode_hotend_temperature'] = function(block) {
    var temperature = Blockly.JavaScript.valueToCode(block, 'TEMPERATURE', Blockly.JavaScript.ORDER_NONE) || '0'
    return "gcode.setHotendTemperature(" + temperature + ")\n";
};

Blockly.Blocks['gcode_wait'] = {
    init: function() {
        this.appendValueInput("TIME")
            .setCheck("Number")
            .appendField("Wait");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip('');
    }
};
Blockly.JavaScript['gcode_wait'] = function(block) {
    var time = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_NONE) || '0'
    return "gcode.wait(" + time + ")\n";
};

Blockly.Blocks['gcode_fan'] = {
    init: function() {
        this.appendValueInput("SPEED")
            .setCheck("Number")
            .appendField("Fan speed");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip('');
    }
};
Blockly.JavaScript['gcode_fan'] = function(block) {
    var speed = Blockly.JavaScript.valueToCode(block, 'SPEED', Blockly.JavaScript.ORDER_NONE) || '0'
    return "gcode.fan(" + speed + ")\n";
};

Blockly.Blocks['gcode_comment'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Comment")
            .appendField(new Blockly.FieldTextInput(""), "COMMENT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip('');
    }
};
Blockly.JavaScript['gcode_comment'] = function(block) {
    var comment = block.getFieldValue('COMMENT');
    return "gcode.comment('" + comment + "')\n";
};

Blockly.Blocks['gcode_position_xy'] = {
  init: function() {
    this.appendValueInput("INPUT")
        .setCheck("Position")
        .appendField("X")
        .appendField(new Blockly.FieldTextInput("0"), "X")
        .appendField("Y")
        .appendField(new Blockly.FieldTextInput("0"), "Y");
    this.setInputsInline(false);
    this.setOutput(true, "Position");
    this.setColour(65);
    this.setTooltip('');
  }
};
Blockly.JavaScript['gcode_position_xy'] = function(block) {
    var number_x = blockGetFieldValue(block, 'X');
    var number_y = blockGetFieldValue(block, 'Y');
    var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_NONE);
    var code = 'new Position({x: ' + number_x + ", y: " + number_y + "})";
    if (input)
        code = "(" + code + ").add(" + input + ")";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['gcode_position_z'] = {
  init: function() {
    this.appendValueInput("INPUT")
        .setCheck("Position")
        .appendField("Z")
        .appendField(new Blockly.FieldTextInput("0"), "Z");
    this.setInputsInline(false);
    this.setOutput(true, "Position");
    this.setColour(65);
    this.setTooltip('');
  }
};
Blockly.JavaScript['gcode_position_z'] = function(block) {
    var number_z = blockGetFieldValue(block, 'Z');
    var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_NONE);
    var code = 'new Position({z: ' + number_z + "})";
    if (input)
        code = "(" + code + ").add(" + input + ")";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['gcode_position_speed'] = {
  init: function() {
    this.appendValueInput("INPUT")
        .setCheck("Position")
        .appendField("Speed")
        .appendField(new Blockly.FieldTextInput("50"), "SPEED");
    this.setInputsInline(false);
    this.setOutput(true, "Position");
    this.setColour(65);
    this.setTooltip('');
  }
};
Blockly.JavaScript['gcode_position_speed'] = function(block) {
    var number_speed = blockGetFieldValue(block, 'SPEED');
    var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_NONE);
    var code = 'new Position({speed: ' + number_speed + "})";
    if (input)
        code = "(" + code + ").add(" + input + ")";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['gcode_position_absolute'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("absolute");
    this.setInputsInline(false);
    this.setOutput(true, "Position");
    this.setColour(65);
    this.setTooltip('');
  }
};
Blockly.JavaScript['gcode_position_absolute'] = function(block) {
    var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_NONE);
    var code = 'new Position({absolute: true})';
    if (input)
        code = "(" + code + ").add(" + input + ")";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['gcode_position_angle'] = {
  init: function() {
    this.appendValueInput("INPUT")
        .setCheck("Position")
        .appendField("Radius")
        .appendField(new Blockly.FieldTextInput("0"), "RADIUS")
        .appendField("Angle")
        .appendField(new Blockly.FieldTextInput("0"), "ANGLE");
    this.setInputsInline(false);
    this.setOutput(true, "Position");
    this.setColour(65);
    this.setTooltip('');
  }
};
Blockly.JavaScript['gcode_position_angle'] = function(block) {
    var number_radius = blockGetFieldValue(block, 'RADIUS');
    var number_angle = blockGetFieldValue(block, 'ANGLE');
    var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_NONE);
    var code = 'new Position({x: Math.cos((' + number_angle + ') / 180.0 * Math.PI) * (' + number_radius + '), y: Math.sin((' + number_angle + ') / 180.0 * Math.PI) * (' + number_radius + ')})';
    if (input)
        code = "(" + code + ").add(" + input + ")";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['gcode_extrusion_setup'] = {
  init: function() {
    this.appendValueInput("WIDTH")
        .setCheck("Number")
        .appendField("Line width");
    this.appendValueInput("HEIGHT")
        .setCheck("Number")
        .appendField("Layer height");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
  }
};
Blockly.JavaScript['gcode_extrusion_setup'] = function(block) {
  var value_width = Blockly.JavaScript.valueToCode(block, 'WIDTH', Blockly.JavaScript.ORDER_NONE);
  var value_height = Blockly.JavaScript.valueToCode(block, 'HEIGHT', Blockly.JavaScript.ORDER_NONE);

  var code = 'gcode.setExtrusionWidthHeight(' + value_width + ', ' + value_height + ');\n';
  return code;
};

Blockly.Blocks['gcode_speed_setup'] = {
  init: function() {
    this.appendValueInput("TRAVEL")
        .setCheck("Number")
        .appendField("Travel speed");
    this.appendValueInput("EXTRUDE")
        .setCheck("Number")
        .appendField("Print speed");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
Blockly.JavaScript['gcode_speed_setup'] = function(block) {
  var value_travel = Blockly.JavaScript.valueToCode(block, 'TRAVEL', Blockly.JavaScript.ORDER_ATOMIC);
  var value_extrude = Blockly.JavaScript.valueToCode(block, 'EXTRUDE', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'gcode.setTravelSpeed(' + value_travel + ');\n';
  code += 'gcode.setPrintSpeed(' + value_extrude + ');\n';
  return code;
};
