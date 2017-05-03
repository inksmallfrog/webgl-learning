/*
* @Author: inksmallfrog
* @Date:   2017-05-03 09:56:45
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-03 10:19:53
*/

'use strict';
var VSHADER_SOURCE = 'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'uniform mat4 m_Matrix;\n' +
    'uniform mat4 v_Matrix;\n' +
    'uniform mat4 p_Matrix;\n' +
    'void main() {\n' +
    '  gl_Position = p_Matrix * v_Matrix * m_Matrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}';

var FSHADER_SOURCE = 'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

function gl01(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('experimental-webgl');
    if(!gl){
        console.warn('Can\'t get the context of webgl');
        return;
    }

    var vshader = gl.createShader(gl.VERTEX_SHADER),
        fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vshader, VSHADER_SOURCE);
    gl.shaderSource(fshader, FSHADER_SOURCE);
    gl.compileShader(vshader);
    gl.compileShader(fshader);
    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);

    gl.useProgram(program);

    var varray = new Float32Array([-1, -1, 0, 1, -1, 0, 0, 1, 0]);
    var vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, varray, gl.STATIC_DRAW);
    var aloc = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(aloc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aloc);

    var carray = new Float32Array([1,0,0,0,1,0,0,0,1]);
    var cbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, carray, gl.STATIC_DRAW);
    var cloc = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(cloc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cloc);

    var mloc = gl.getUniformLocation(program, 'm_Matrix');
    var vloc = gl.getUniformLocation(program, 'v_Matrix');
    var ploc = gl.getUniformLocation(program, 'p_Matrix');
    var mmatrix = new Float32Array([1, 0, 0, 0,
                                    0, 1, 0, 0,
                                    0, 0, 1, 0,
                                    0, 0, -1, 1]);
    var vmatrix = new Float32Array([1, 0, 0, 0,
                                    0, 1, 0, 0,
                                    0, 0, 1, 0,
                                    0, 0, -1, 1]);
    var pmatrix = new Float32Array([1, 0, 0, 0,
                                    0, 1, 0, 0,
                                    0, 0, -2, -1,
                                    0, 0, -3, 0]);
    gl.uniformMatrix4fv(mloc, false, mmatrix);
    gl.uniformMatrix4fv(vloc, false, vmatrix);
    gl.uniformMatrix4fv(ploc, false, pmatrix);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
