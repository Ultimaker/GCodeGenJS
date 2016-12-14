class GCode
{
    constructor()
    {
    }
    
    start(flavor)
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.e = 0;
        this.last_speed = -1.0;
        this.lines = []
        this.extrusion_lines = []
        this.filament_diameter = 2.85;
        this.extrusion_in_mm3 = false;
        this.travel_speed = 150;
        this.print_speed = 50;

        if (flavor == "UM2")
        {
            this.output = [
                ";FLAVOR:UltiGCode",
                ";TIME:1",
                ";MATERIAL:1",
            ]
            this.extrusion_in_mm3 = true;
        }
        else if (flavor == "UM3")
        {
            this.output = [
                ";START_OF_HEADER",
                ";HEADER_VERSION:0.1",
                ";FLAVOR:Griffin",
                ";GENERATOR.NAME:GCodeGenJS",
                ";GENERATOR.VERSION:?",
                ";GENERATOR.BUILD_DATE:2016-11-26",
                ";TARGET_MACHINE.NAME:Ultimaker Jedi",
                ";EXTRUDER_TRAIN.0.INITIAL_TEMPERATURE:200",
                ";EXTRUDER_TRAIN.0.MATERIAL.VOLUME_USED:1",
                ";EXTRUDER_TRAIN.0.NOZZLE.DIAMETER:0.4",
                ";BUILD_PLATE.INITIAL_TEMPERATURE:0",
                ";PRINT.TIME:1",
                ";PRINT.SIZE.MIN.X:0",
                ";PRINT.SIZE.MIN.Y:0",
                ";PRINT.SIZE.MIN.Z:0",
                ";PRINT.SIZE.MAX.X:215",
                ";PRINT.SIZE.MAX.Y:215",
                ";PRINT.SIZE.MAX.Z:200",
                ";END_OF_HEADER",
                "G92 E0",
            ]
        }
        else
        {
            this.output = [
                ";RepRap target",
                "G28",
                "G92 E0",
            ]
        }

        this.setExtrusionWidthHeight(0.4, 0.1);
    }
    
    move(position, extrude)
    {
        var new_x = this.x;
        var new_y = this.y;
        var new_z = this.z;
        if (position.absolute)
        {
            if (position.x != undefined)
                new_x = position.x;
            if (position.y != undefined)
                new_y = position.y;
            if (position.z != undefined)
                new_z = position.z;
        }
        else
        {
            if (position.x != undefined)
                new_x = this.x + position.x;
            if (position.y != undefined)
                new_y = this.y + position.y;
            if (position.z != undefined)
                new_z = this.z + position.z;
        }
        var speed = position.speed;
        if (!speed)
        {
            if (extrude)
                speed = this.print_speed
            else
                speed = this.travel_speed
        }
        this._move(new_x, new_y, new_z, speed, extrude);
    }
    
    setExtrusionWidthHeight(width, height)
    {
        this.extrusion_per_mm_movement = width * height;
        this.extrusion_per_mm_z_movement = Math.PI * (width / 2) * (width / 2);
        if (!this.extrusion_in_mm3)
        {
            var radius = this.filament_diameter / 2.0;
            this.extrusion_per_mm_movement /= Math.PI * radius * radius;
            this.extrusion_per_mm_z_movement /= Math.PI * radius * radius;
        }
    }
    
    setTravelSpeed(speed)
    {
        this.travel_speed = speed;
    }

    setPrintSpeed(speed)
    {
        this.print_speed = speed;
    }

    fan(speed)
    {
        this.output.push("M106 S" + (speed / 100 * 255));
    }
    
    setHotendTemperature(temperature)
    {
        this.output.push("M109 S" + temperature.toFixed());
    }
    
    wait(time)
    {
        this.output.push("G4 P" + (time * 1000));
    }

    comment(comment)
    {
        this.output.push("; " + comment);
    }
    
    _move(x, y, z, speed, extrude)
    {
        if (extrude)
        {
            var dx = x - this.x;
            var dy = y - this.y;
            var len = Math.sqrt(dx * dx + dy * dy);
            
            var nx = dy / len * 0.2;
            var ny = -dx / len * 0.2;

            this.extrusion_lines.push(this.x + nx)
            this.extrusion_lines.push(this.y + ny)
            this.extrusion_lines.push(this.z)
            this.extrusion_lines.push(0.0)
            
            this.extrusion_lines.push(x + nx)
            this.extrusion_lines.push(y + ny)
            this.extrusion_lines.push(z)
            this.extrusion_lines.push(0.0)

            this.extrusion_lines.push(this.x - nx)
            this.extrusion_lines.push(this.y - ny)
            this.extrusion_lines.push(this.z)
            this.extrusion_lines.push(1.0)

            this.extrusion_lines.push(x + nx)
            this.extrusion_lines.push(y + ny)
            this.extrusion_lines.push(z)
            this.extrusion_lines.push(0.0)

            this.extrusion_lines.push(this.x - nx)
            this.extrusion_lines.push(this.y - ny)
            this.extrusion_lines.push(this.z)
            this.extrusion_lines.push(1.0)
            
            this.extrusion_lines.push(x - nx)
            this.extrusion_lines.push(y - ny)
            this.extrusion_lines.push(z)
            this.extrusion_lines.push(1.0)
        }
        else
        {
            this.lines.push(this.x)
            this.lines.push(this.y)
            this.lines.push(this.z)
            this.lines.push(x)
            this.lines.push(y)
            this.lines.push(z)
        }
    
        var command = "G0";
        if (extrude)
        {
            command = "G1";

            var distance_xy = Math.sqrt((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y));
            var distance_z = z - this.z;
            this.e += distance_xy * this.extrusion_per_mm_movement;
            this.e += distance_z * this.extrusion_per_mm_z_movement;
        }
        if (speed != this.last_speed)
        {
            command += " F" + (speed * 60);
            this.last_speed = speed;
        }
        if (x != this.x)
        {
            command += " X" + x.toFixed(3);
            this.x = x;
        }
        if (y != this.y)
        {
            command += " Y" + y.toFixed(3);
            this.y = y;
        }
        if (z != this.z)
        {
            command += " Z" + z.toFixed(3);
            this.z = z;
        }
        if (extrude)
        {
            command += " E" + this.e.toFixed(5)
        }
        if (command.length > 2)
            this.output.push(command);
    }
    
    getOutput()
    {
        return this.output;
    }
}

var gcode = new GCode();
