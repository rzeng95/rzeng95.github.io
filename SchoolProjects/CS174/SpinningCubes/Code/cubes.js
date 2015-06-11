var canvas;
var gl;

var cubeVerticesBuffer;
var cubeVerticesTextureCoordBuffer;
var cubeVerticesIndexBuffer;
var cubeVerticesIndexBuffer;
var cubeRotation = 0.0;
var cubeRotation2 = 0.0;
var lastCubeUpdateTime = 0;


//Our two textures: I'm using a mac and a windows icon (found in Images folder) 
var cubeImage;
var cubeTexture;
var cubeImage2;
var cubeTexture2;

var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var textureCoordAttribute;
var perspectiveMatrix;

//Input Key operation variables. fov controls zoom, canRotate toggles rotation, amt controls rotation amount 
var fov = 0;
var canRotate = true;
var amt = 0;
var amt2 = 0;

/**************************************************

Start by initializing webGL canvas and setting up shaders, buffers, and textures 

**************************************************/
function start() {

	initWebGL(canvas);      

	initShaders();

	initBuffers();

	initTextures();

	setInterval(render, 15);
}

/*******************
Initial webGL canvas 
*******************/
function initWebGL() {
	canvas = document.getElementById("glcanvas");
	
	gl = canvas.getContext("experimental-webgl");

	if (!gl) {alert("error: could not get canvas");}
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  
	gl.clearDepth(1.0);                 
	gl.enable(gl.DEPTH_TEST);    
}

/*******************
Create our buffers for the cubes we will be making. 
*******************/
function initBuffers() {

  cubeVerticesBuffer = gl.createBuffer();
  
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
  
  var vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  cubeVerticesTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
  
  var textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

  cubeVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
  
  var cubeVertexIndices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ]
  
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
}

/*******************
Set up textures. This is where I summon my two image files from the Images folder. 
Also, via handleTextureLoaded, I can apply mipmapping and other filtering 
*******************/
function initTextures() {
	cubeTexture = gl.createTexture();
	cubeImage = new Image();
	cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
	cubeImage.src = "../Images/mac.png";

	cubeTexture2 = gl.createTexture();
	cubeImage2 = new Image();
	cubeImage2.onload = function() { handleTextureLoaded2(cubeImage2, cubeTexture2); }
	cubeImage2.src = "../Images/windows.png";
}
//For the first cube, we want to use nearest neighbor filtering 
function handleTextureLoaded(image, texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
}
//FOr the second cube, we want to use mipmap filtering 
function handleTextureLoaded2(image, texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

/*******************
I created this function to streamline cube creation. This way I can instantiate two cubes with only
slight differences, such as the direction of rotation and which texture to use. 
*******************/
function drawCube(choice) {
	
	loadIdentity();
	if (choice == 1) 
		mvTranslate([-2, 0.0, -10.0]);
	else
		mvTranslate([2, 0.0, -10.0]);
	
	mvPushMatrix();
	
	if (choice == 1) 
		mvRotate(cubeRotation, [0, 1, 0]);
	else 
		mvRotate(cubeRotation2, [1, 0, 0]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  
    gl.activeTexture(gl.TEXTURE0);
	
	if (choice == 1) 
		gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
	else 
		gl.bindTexture(gl.TEXTURE_2D, cubeTexture2);
	
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  
    mvPopMatrix();
}	

/*******************
Render calls the cube creation function above. Also, we handle input keys here.
*******************/
function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	perspectiveMatrix = makePerspective(45 + fov, canvas.width/canvas.height, 0.1, 100.0);
	drawCube(1);
	drawCube(2);

	window.onkeydown = function(e) {
		if (e.keyCode==73)  //i : zoom in 
			fov=fov-0.6;

		if (e.keyCode==79)  //o : zoom out 
			fov=fov+0.6;

		if (e.keyCode==82)  //r : toggle rotation
			canRotate = !canRotate;
	}


	var currentTime = (new Date).getTime();
	if (lastCubeUpdateTime) {
		var delta = currentTime - lastCubeUpdateTime;

		if (canRotate) amt = (60 * delta) / 1000.0; //10 rpm = 60 degrees per second
		else amt = 0;
		cubeRotation += amt;
		
		if (canRotate) amt2 = (30 * delta) / 1000.0; //5 rpm = 30 degrees per second
		else amt2 = 0;
		cubeRotation2 += amt2;
		
	}

	lastCubeUpdateTime = currentTime;
}


/********************************************************

Anything below this line is tutorial stuff (directly copy-pasted) for basic utility functions for matrix operations 

Note that initShaders is defined below instead of in a separate file (is how the tutorial did things)

********************************************************/

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");
  
  // Create the shader program
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  // If creating the shader program failed, alert
  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  gl.useProgram(shaderProgram);
  
  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
  
  textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(textureCoordAttribute);
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  
  // Didn't find an element with the specified ID; abort.
  
  if (!shaderScript) {
    return null;
  }
  
  // Walk through the source element's children, building the
  // shader source string.
  
  var theSource = "";
  var currentChild = shaderScript.firstChild;
  
  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }
    
    currentChild = currentChild.nextSibling;
  }
  
  // Now figure out what type of shader script we have,
  // based on its MIME type.
  
  var shader;
  
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }
  
  // Send the source to the shader object
  
  gl.shaderSource(shader, theSource);
  
  // Compile the shader program
  
  gl.compileShader(shader);
  
  // See if it compiled successfully
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }
  
  return shader;
}

//
// Matrix utility functions
//

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

var mvMatrixStack = [];

function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(m.dup());
    mvMatrix = m.dup();
  } else {
    mvMatrixStack.push(mvMatrix.dup());
  }
}

function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }
  
  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}

function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;
  
  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  multMatrix(m);
}