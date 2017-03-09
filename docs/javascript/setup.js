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

var groundSegments = [];
var bodies = new Map(); // body -> Segment
var joints = new Map(); // constraint -> Joint
var gaits = new Map();

var debugPoints = [];

var physicsTimeStep = 1/120.0;

var ticks = 0;

var timeBegin;
var remainingTime = 0;
var remainingTimeDiv;

var ammoPhysicsMgr = new AmmoPhysicsMgr();


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

function step() {
  //world.Step(physicsTimeStep, 1);  
  //console.log('begin: %s', timeBegin );
  timeEnd = Math.floor(Date.now()); // Get current time
  //console.log('end: %s', timeEnd);
  elapsedTime = timeEnd - timeBegin; // Get elapsed time passing milliseconds.
  //console.log('elapsed: %s', elapsedTime);
  remainingTime += elapsedTime; // Add the elapsed real time that has passed in milliseconds
  //console.log('remaining: %s: ', remainingTime);
  var steps = Math.floor(remainingTime / (physicsTimeStep*1000)); // number of steps to perform to catch up to remaining time
  //console.log('steps: %s', steps);
  var simBeginTime = Math.floor(Date.now());
  for (var step = 0; step < steps; step ++) {
      ammoPhysicsMgr.step(physicsTimeStep, 1); 
  } 
  var simEndTime = Math.floor(Date.now());
  var simTime = simEndTime - simBeginTime;
  //world.Step(physicsTimeStep, steps);
  //console.log(simTime);
  remainingTime += simTime; // Time physics engine took for simulation
  remainingTime -= physicsTimeStep*1000 * steps; // time physics engine has simulated
  timeBegin = Math.floor(Date.now()); // reset the time

  ticks +=1;
  if (ticks % 3 == 0) {
    var str = 'Remaining Time: ' + remainingTime;
    //console.log(remainingTime);
    remainingTimeDiv.innerHTML = str;
    ticks = 0;
  }
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

  scene.background = new THREE.Color(0xffffff);

  // var geometry = new THREE.CubeGeometry(20, 20, 20); // Create a 20 by 20 by 20 cube.
  // var material = new THREE.MeshBasicMaterial({ color: 0x0000FF }); // Skin the cube with 100% blue.
  // var cube = new THREE.Mesh(geometry, material); // Create a mesh based on the specified geometry (cube) and material (blue skin).
  // scene.add(cube); // Add the cube at (0, 0, 0).

  var dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
  dirLight1.position.set(0, 100, 80);
  dirLight1.castShadow = true;
  dirLight1.shadowDarkness = 0.5;
  dirLight1.shadow.camera.far = 1000;
  dirLight1.shadowCameraVisible = true;
  scene.add(dirLight1);

  // var dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
  // dirLight2.position.set(0, 10, -100);
  // dirLight2.castShadow = true;
  // dirLight2.shadowDarkness = 0.5;
  // dirLight2.shadowCameraFar = 1000;
  // scene.add(dirLight2);
  //
  // var dirLight3 = new THREE.DirectionalLight(0xffffff, 1);
  // dirLight3.position.set(100, -100, -50);
  // scene.add(dirLight3);

  // var dirLight4 = new THREE.DirectionalLight(0xffffff, 1);
  // dirLight4.position.set(0, 100, 100);
  // scene.add(dirLight4);
  camera.position.y = 0.9;
  camera.position.z = 4; // Move the camera away from the origin, down the positive z-axis.

  camera.lookAt(scene.position);

  //SETUP ORBIT CONTROL OF THE CAMERA
  // var controls = new THREE.OrbitControls(camera);
  // controls.damping = 0.2;
  // controls.enablePan = false;
}

function createGround() {
  var ground_segment = new Segment(
    new THREE.Vector3(0, -1, 0),
    0.0,
    new THREE.Vector3(10, 0.5, 4),
    'ground',
    new THREE.MeshLambertMaterial(),
    new THREE.Vector3(1,0,0),
    true
  );
  ground_segment.mesh.receiveShadow=true;
  bodies.set(ground_segment.body, ground_segment);
  //scene.add(ground_segment.mesh);
}

// main entry point
Event.observe(window, 'load', function() {

  setupTHREE();
  createGround();

  // load the gaits from cookies.
  // >>>>>>>>>> TODO <<<<<<<<<< 
  // Add to Gait Map
  // Make default walk gait
  var walking_gait = makeWalkingGait();
  gaits.set('walk', walking_gait);


  setupControls();
  // setup GUI controls

  var orientations = walking_gait.get_rag_doll_orientations_for_state(0);

  var ragDoll = new RagDoll(
    [0.75, 0.7, 0.55, 0.35],
    orientations,
     new THREE.Vector3(0, -1 - (-2.2), 0)
   );

  // disable ragDoll
  ragDoll.Disable();

  timeBegin = Math.floor(Date.now());
  setInterval(step, physicsTimeStep); // step every physicsTimeStep
  var render = function () {
    //console.log('ticks = %s', ticks);
    //ticks = 0;
    //step();
    getUpdates();
    drawDebug();
    renderer.render(scene, camera); // Each time we change the position of the cube object, we must re-render it.
    requestAnimationFrame(render); // Call the render() function up to 60 times per second (i.e., up to 60 animation frames per second).
  };
  
  render(); // Start the rendering of the animation frames.
});
