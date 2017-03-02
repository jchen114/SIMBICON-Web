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
var bodies = new Map(); // Hashmap from box2D objects to Segment objects
var joints = new Map();

var debugPoints = [];

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
  for (var j = world.m_jointList; j; j = j.m_next) {
      updateJoint(j);
  }
  for (var b = world.m_bodyList; b; b = b.m_next) {
      updateBody(b);
  }

}

function updateJoint(joint) {
  var my_joint = joints.get(joint);
  if (my_joint) {
    my_joint.update();
  }
}

function updateBody(body) {
  // Get threejs mesh
  var segment = bodies.get(body);
  if (segment) {
    segment.update();
  }
}

function drawDebug() {
  for (i = 0; i < debugPoints.length; i ++) {
    var dp = debugPoints[i];
    dp.update();
  }
}


function createWorld() {
  var worldAABB = new b2AABB();
  worldAABB.minVertex.Set(-100, -100);
  worldAABB.maxVertex.Set(100, 100);
  var gravity = new b2Vec2(0, -9.81);
  var doSleep = true;
  world = new b2World(worldAABB, gravity, doSleep);
  return world;
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

function createBall(world, x, y) {
  //console.log(' Create Circle, x= %s, y=%s', x, y);
  var ballSd = new b2CircleDef();
  ballSd.density = 1.0;
  ballSd.radius = 20;
  ballSd.restitution = 0.5;
  ballSd.friction = 0.5;
  var ballBd = new b2BodyDef();
  ballBd.AddShape(ballSd);
  ballBd.position.Set(x,y);
  return world.CreateBody(ballBd);
}

function step(cnt) {
  var timeStep = 1.0/60;
  var iteration = 1;
  world.Step(timeStep, iteration);
}

// main entry point
Event.observe(window, 'load', function() {

  world = createWorld();

  canvasWidth = parseInt(1000);
  canvasHeight = parseInt(700);

  scene = new THREE.Scene(); // Create a Three.js scene object.
  camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000); // Define the perspective camera's attributes.

  renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // Fallback to canvas renderer, if necessary.
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.setSize(canvasWidth, canvasHeight); // Set the size of the WebGL viewport.

  var div_three = $('ctx');
  div_three.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.

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

  // SETUP ORBIT CONTROL OF THE CAMERA
  var controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.enablePan = false;

  createGround();

  // var box = new Segment(
  //   new THREE.Vector3(-1,3,0),
  //   0.0,
  //   new THREE.Vector3(0.3, 0.3, 0.1),
  //   'box',
  //   new THREE.MeshLambertMaterial(),
  //   new THREE.Vector3(1,1,0.3),
  //   false,
  //   0.5
  // )
  // bodies.set(box.body, box);

  // geometry = new THREE.CylinderGeometry(1, 1, 1);
  // // material
  // material = new THREE.MeshLambertMaterial();
  // material.color = new THREE.Color(0, 0, 1);
  //
  // mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);


  var ragDoll = new RagDoll(
    [0.75, 0.7, 0.55, 0.35],
    [0.0, Math.PI/2, Math.PI/2, -1.5, 0, 0.1, -0.1],
     new THREE.Vector3(0, -1 - (-2.2), 0)
   );

  var render = function () {
    step(1);
    getUpdates();
    drawDebug();
    renderer.render(scene, camera); // Each time we change the position of the cube object, we must re-render it.
    requestAnimationFrame(render); // Call the render() function up to 60 times per second (i.e., up to 60 animation frames per second).
  };

  render(); // Start the rendering of the animation frames.
});
