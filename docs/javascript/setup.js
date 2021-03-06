// Physics
var world;

// Canvas
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;

// Three js
var scene;
var camera;
var renderer;

var controls;
var deltaCam;

// Physics
var groundSegments = [];
var bodies = new Map(); // body -> Segment
var joints = new Map(); // constraint -> Joint
var gaits = new Map();
var physicsTimeStep = 1/1700.0;
var desiredFrameStep = 1/60.0;
var ground_length = 10;

var ticks = 0;

var timeLast;
var remainingTime = 0;
var remainingTimeDiv;
var factorDiv;
var frameTimeDiv;

var ammoPhysicsMgr = new AmmoPhysicsMgr();

// Drawing
var debugPoints = [];

// Rag doll
var ragDoll;
var prevRagDollPos;
var ragDollController;

var endLine;
var endPt;


class DebugPoint {
  constructor(color, segment) {
    this.material = new THREE.MeshBasicMaterial();
    this.material.color = color;
    this.geometry = new THREE.CircleGeometry(0.1, 32);
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.segment = segment;

    scene.add(this.mesh);
  }

  update(x,y) {

    var vec = this.segment.GetPosition();
    //console.log('%s, %s', vec.x, vec.y);
    this.mesh.position.x = vec.x;
    this.mesh.position.y = vec.y;

    this.mesh.position.z = 5;
  }
}


function getUpdates() {


  for (var i = 0; i < ammoPhysicsMgr.constraints.length ; i++) {
      joint = ammoPhysicsMgr.constraints[i];
      updateJoint(joint);
  }
  for (var i = 0; i < ammoPhysicsMgr.objects.length; i++) {
      body = ammoPhysicsMgr.objects[i];
      updateBody(body);
  }

}

function updateJoint(joint) {
  var constraint = joints.get(joint);
  if (constraint) {
    constraint.update();
  }
}

var ground_mesh;
var box_mesh;

function updateBody(b) {

  var body = bodies.get(b);
  if (body) {
    body.update();
  }

}

function drawDebug() {
  for (i = 0; i < debugPoints.length; i ++) {
    var dp = debugPoints[i];
    dp.update();
  }
}

function updateCamera() {

  var currentRagDollPos = ragDoll.GetPosition();
  deltaCam = currentRagDollPos.x - prevRagDollPos.x;
  controls.object.translateX(deltaCam);
  var target = controls.target;
  target.x += deltaCam;

  controls.object.lookAt(target);

  prevRagDollPos = currentRagDollPos;

  // var target = new THREE.Vector3(1, 0, 0);
  // camera.lookAt(target);

}

function step() {
  // var step;
  // for (step = 1; step <= 25; step ++) {
  //   ragDollController.stateLoop();
  //   ammoPhysicsMgr.step(physicsTimeStep, 0);
  // }

  // //ammoPhysicsMgr.step(1/1000, 1);

  dt = Date.now() - timeLast;

  if (dt > 3000) {
    dt = 0;
    remainingTime = 0;
  }

  //var num_steps = Math.floor((remainingTime + dt)/physicsTimeStep);
  var num_steps = Math.floor(desiredFrameStep/physicsTimeStep);

  var begin_sim_time = Date.now();
  var step;
  for (step = 1; step <= num_steps; step ++) {
    ragDollController.stateLoop();
    ammoPhysicsMgr.step(physicsTimeStep, 0);
    //var curr_sim_time = Date.now() - begin_sim_time;
  }

  var collisions = ammoPhysicsMgr.CheckCollisions();
  if (collisions.length > 0) {
    ragDollController.processCollisions(collisions);
  }

  //console.log('step: ' + step);
  var end_sim_time = Date.now();
  var sim_time = end_sim_time - begin_sim_time; // milliseconds

  var speed_factor = (sim_time)/(physicsTimeStep * 1000 * step); // how fast is physics engine vs real time

  remainingTime += sim_time;
  remainingTime -= physicsTimeStep * step; // time taken away from physics sim...

  if (remainingTime > 160) { // Reset remaining time if it gets too big
    remainingTime = 0; 
  }

  timeLast = Date.now();

  ticks +=1;
  if (ticks % 1 == 0) {
    var str = 'Remaining Time: ' + remainingTime;
    //console.log(remainingTime);
    remainingTimeDiv.innerHTML = str;

    var str = 'Speed Factor: ' + speed_factor;
    factorDiv.innerHTML = str;

    var str = 'Frame time: ' + dt;
    frameTimeDiv.innerHTML = str;
    ticks = 0;
  }

  updateCamera();

  // Create more ground if needed.
  manageGround();


}

function setupTHREE() {

  canvasWidth = parseInt(1000);
  canvasHeight = parseInt(700);

  scene = new THREE.Scene(); // Create a Three.js scene object.
  camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000); // Define the perspective camera's attributes.

  renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // Fallback to canvas renderer, if necessary.
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.setSize(canvasWidth, canvasHeight); // Set the size of the WebGL viewport.

  var div_three = $('ctx');
  var div_intro = div_three.parentNode;
  div_intro.style.marginLeft = '0px';
  var canvas_elmt = renderer.domElement;
  div_three.appendChild(canvas_elmt); // Append the WebGL viewport to the DOM.

  // Display amount of remaining time
  remainingTimeDiv = document.createElement('div');

  remainingTimeDiv.style.position = 'absolute';
  remainingTimeDiv.style.left='50px';
  remainingTimeDiv.style.top='150px';
  remainingTimeDiv.style.width='300px';
  remainingTimeDiv.style.height='25px';
  remainingTimeDiv.style.background='gray';
  remainingTimeDiv.innerHTML='Remaining Time: ';
  remainingTimeDiv.style.textAlign='left';
  div_three.parentNode.appendChild(remainingTimeDiv);

  factorDiv = document.createElement('div');
  factorDiv.style.position = 'absolute';
  factorDiv.style.left = '50px';
  factorDiv.style.top = '180px';
  factorDiv.style.width = '300px';
  factorDiv.style.height = '25px';
  factorDiv.style.background = 'gray';
  factorDiv.innerHTML = "Speed factor: ";
  factorDiv.style.textAlign = 'left';
  div_three.parentNode.appendChild(factorDiv);

  frameTimeDiv = document.createElement('div');
  frameTimeDiv.style.position = 'absolute';
  frameTimeDiv.style.left = '50px';
  frameTimeDiv.style.top = '210px';
  frameTimeDiv.style.width = '300px';
  frameTimeDiv.style.height = '25px';
  frameTimeDiv.style.background = 'gray';
  frameTimeDiv.innerHTML = "Speed factor: ";
  frameTimeDiv.style.textAlign = 'left';
  div_three.parentNode.appendChild(frameTimeDiv);

  scene.background = new THREE.Color(0xffffff);

  var dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
  dirLight1.position.set(0, 100, 80);
  dirLight1.castShadow = true;
  dirLight1.shadowDarkness = 0.5;
  dirLight1.shadow.camera.far = 1000;
  dirLight1.shadowCameraVisible = true;
  scene.add(dirLight1);


  camera.position.y = 0.9;
  camera.position.z = 4; // Move the camera away from the origin, down the positive z-axis.

  camera.lookAt(scene.position);

  //SETUP ORBIT CONTROL OF THE CAMERA
  controls = new THREE.OrbitControls(camera, canvas_elmt);
  controls.damping = 0.2;
  controls.enablePan = false;
}

function createGround(position=new THREE.Vector3(0, -1, 0)) {
  
  var ground_segment = new Segment(
    position,
    0.0,
    new THREE.Vector3(ground_length, 0.5, 4),
    'ground',
    new THREE.MeshLambertMaterial(),
    new THREE.Vector3(0.9,0.9,0.9),
    true
  );
  ground_segment.mesh.receiveShadow=true;
  bodies.set(ground_segment.body, ground_segment);
  //scene.add(ground_segment.mesh);

  var txLoader = new THREE.TextureLoader();
  txLoader.load(
    'textures/checker.gif',
    function ( texture ) {
      // do something with the texture
      ground_segment.mesh.material.map = texture;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      ground_segment.mesh.geometry.faceVertexUvs[0][4][0].set(0, 0);
      ground_segment.mesh.geometry.faceVertexUvs[0][4][1].set(4, 0);
      ground_segment.mesh.geometry.faceVertexUvs[0][4][2].set(0, 4);

      ground_segment.mesh.geometry.faceVertexUvs[0][5][0].set(4, 0);
      ground_segment.mesh.geometry.faceVertexUvs[0][5][1].set(4, 4);
      ground_segment.mesh.geometry.faceVertexUvs[0][5][2].set(0, 4);

      ground_segment.mesh.geometry.faceVertexUvs[0][8][0].set(0, 0);
      ground_segment.mesh.geometry.faceVertexUvs[0][8][1].set(0.5, 0);
      ground_segment.mesh.geometry.faceVertexUvs[0][8][2].set(0, 4);

      ground_segment.mesh.geometry.faceVertexUvs[0][9][0].set(0.5, 0);
      ground_segment.mesh.geometry.faceVertexUvs[0][9][1].set(0.5, 4);
      ground_segment.mesh.geometry.faceVertexUvs[0][9][2].set(0, 4);

      ground_segment.mesh.geometry.uvsNeedUpdate = true;
      ground_segment.mesh.material.needsUpdate = true;
    }
  );

  groundSegments.push(ground_segment);

}

function manageGround() {
  // Get the most recent ground..
  var furthest_segment = groundSegments[groundSegments.length - 1];
  var worldTrans = furthest_segment.GetWorldTransform(); // Obj -> World coordinates
  var worldTransInv = new THREE.Matrix4().getInverse(worldTrans); // World -> Obj.

  var ragDollPos = ragDoll.GetPosition();

  endPt = new THREE.Vector3(furthest_segment.body.length/2, 0, 0);
  endPt = endPt.applyMatrix4(worldTrans); // Get where the end point is in global coordinates

  endLine.position.x = endPt.x;
  endLine.position.y = endPt.y;
  endLine.position.z = endPt.z;

  if (ragDollPos.x >= endPt.x - 3) {
    console.log('Create MOAR ground');
    createMoarGround();
  }

}

function createMoarGround() {

  var ground_position = endPt.add(new THREE.Vector3(length/2, 0, 0));
  createGround(ground_position);

}

function resetSim() {

  // Remove all the grounds from simulation
  for (var i = 0; i < groundSegments.length; i ++) {
    var segment = groundSegments[i];
    // Remove mesh from the scene...
    segment.Delete();
  }

  // Reset array to store ground segments.
  groundSegments = [];

  // Create ground
  createGround();
}

// main entry point
Event.observe(window, 'load', function() {

  setupTHREE();

  var geometry = new THREE.CylinderGeometry(0.03, 0.03, 15);
  var material = new THREE.MeshBasicMaterial({color: 0x7f00f});
  endLine = new THREE.Mesh(geometry, material);
  scene.add(endLine);

  createGround();

  // load the gaits from localStorage.
  console.log('Load gaits: ')
  for (var i = 0; i < localStorage.length; i ++) {
    var name = localStorage.key(i);
    var gait = JSON.parse(localStorage.getItem(name));

    var torque_gains = JSON.parse(gait.torque_gains);
    gait.torque_gains = torque_gains;
    
    gait = Gait.copy(gait);
    addGaitToDropdown(gait.name);

    gaits.set(gait.name, gait);
    console.log(name);
    // Load these into the gait map...
  }
  // Add to Gait Map
  // Make default walk gait
  var walking_gait = makeWalkingGait();
  gaits.set('walk', walking_gait);

  var orientations = walking_gait.get_rag_doll_orientations_for_state(0);

  ragDoll = new RagDoll(
    [0.75, 0.7, 0.55, 0.35],  // Lengths
    orientations,             // Positions
     new THREE.Vector3(0, -1 - (-1.935), 0) // Position
   );

  ragDollController = new RagDollController(ragDoll);

  // disable ragDoll
  ragDoll.Disable();

  setupControls();
  // setup GUI controls
  remainingTime = 0;
  prevRagDollPos = ragDoll.GetPosition();
  timeLast = Math.floor(Date.now());
  deltaCam = 0;
  var render = function () {
    step();
    getUpdates();
    drawDebug();
    renderer.render(scene, camera); // Each time we change the position of the cube object, we must re-render it.
    requestAnimationFrame(render); // Call the render() function up to 60 times per second (i.e., up to 60 animation frames per second).
  };
  
  render(); // Start the rendering of the animation frames.
});
