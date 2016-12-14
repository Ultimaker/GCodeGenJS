class Shader
{
    constructor(vertex_shader_string, fragment_shader_string)
    {
        var vertex_shader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertex_shader, vertex_shader_string);
        gl.compileShader(vertex_shader);
        if (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) 
        {
            alert(gl.getShaderInfoLog(vertex_shader));
        }

        var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragment_shader, fragment_shader_string);
        gl.compileShader(fragment_shader);
        if (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)) 
        {
            alert(gl.getShaderInfoLog(fragment_shader));
        }
        
        this._shader_program = gl.createProgram();
        gl.attachShader(this._shader_program, vertex_shader);
        gl.attachShader(this._shader_program, fragment_shader);
        gl.linkProgram(this._shader_program);

        if (!gl.getProgramParameter(this._shader_program, gl.LINK_STATUS))
        {
            alert("Could not initialise shaders");
        }


        this._projection_matrix_uniform = gl.getUniformLocation(this._shader_program, "projection_matrix");
        this._model_matrix_uniform = gl.getUniformLocation(this._shader_program, "model_matrix");
        this._vertex_position_attribute = gl.getAttribLocation(this._shader_program, "vertex_position");
    }
    
    bind(n)
    {
        if (!n) n = 3;
        gl.useProgram(this._shader_program);
        gl.uniformMatrix4fv(this._projection_matrix_uniform, false, projection_matrix);
        gl.uniformMatrix4fv(this._model_matrix_uniform, false, model_matrix);
        
        gl.enableVertexAttribArray(this._vertex_position_attribute);
        gl.vertexAttribPointer(this._vertex_position_attribute, 3, gl.FLOAT, false, 4 * n, 0);
        if (n == 4)
        {
            gl.enableVertexAttribArray(gl.getAttribLocation(this._shader_program, "side"));
            gl.vertexAttribPointer(gl.getAttribLocation(this._shader_program, "side"), 1, gl.FLOAT, false, 4 * n, 4 * 3);
        }
    }
}

class VertexBuffer
{
    constructor(vertices)
    {
        this._buffer = gl.createBuffer();
        this.update(vertices);
    }
    
    update(vertices, item_size)
    {
        if (!item_size) item_size = 3;
        this._count = vertices.length / item_size;
        this._item_size = item_size;
        if (this._count > 0)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        }
    }
    
    render(shader, type)
    {
        if (this._count < 1)
            return;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        shader.bind(this._item_size);
        if (!type)
            type = gl.TRIANGLES
        gl.drawArrays(type, 0, this._count);
    }
}
