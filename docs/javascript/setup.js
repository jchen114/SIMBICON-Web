// Physics
var world;
var m2p = 5;
var p2m = 1/m2p;

// Canvas
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;

// Three js
// var scene;
// var camera;
// var renderer;

var groundSegments = [];

function drawWorld(world, context) {
  for (var j = world.m_jointList; j; j = j.m_next) {
      drawJoint(j, context);
  }
  for (var b = world.m_bodyList; b; b = b.m_next) {
      for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
          drawShape(s, context);
      }
  }

  ctx.font = 'bold 18px arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000000';
  ctx.fillText("Click the screen to add more objects", 400, 20);
  ctx.font = 'bold 14px arial';
  ctx.fillText("Performance will vary by browser", 400, 40);

}

function drawJoint(joint, context) {
  var b1 = joint.m_body1;
  var b2 = joint.m_body2;
  var x1 = b1.m_position;
  var x2 = b2.m_position;
  var p1 = joint.GetAnchor1();
  var p2 = joint.GetAnchor2();
  context.strokeStyle = '#00eeee';
  context.beginPath();
  switch (joint.m_type) {
  case b2Joint.e_distanceJoint:
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      break;

  case b2Joint.e_pulleyJoint:
      // TODO
      break;

  default:
      if (b1 == world.m_groundBody) {
          context.moveTo(p1.x, p1.y);
          context.lineTo(x2.x, x2.y);
      }
      else if (b2 == world.m_groundBody) {
          context.moveTo(p1.x, p1.y);
          context.lineTo(x1.x, x1.y);
      }
      else {
          context.moveTo(x1.x, x1.y);
          context.lineTo(p1.x, p1.y);
          context.lineTo(x2.x, x2.y);
          context.lineTo(p2.x, p2.y);
      }
      break;
  }
  context.stroke();
}

function drawShape(shape, context) {
  context.strokeStyle = '#ffffff';
  if (shape.density == 1.0) {
      context.fillStyle = "red";
  } else {
      context.fillStyle = "black";
  }
  context.beginPath();
  switch (shape.m_type) {
  case b2Shape.e_circleShape:
      {
          var circle = shape;
          var pos = circle.m_position;
          var r = circle.m_radius;
          var segments = 16.0;
          var theta = 0.0;
          var dtheta = 2.0 * Math.PI / segments;

          // draw circle
          context.moveTo(pos.x + r, pos.y);
          for (var i = 0; i < segments; i++) {
              var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
              var v = b2Math.AddVV(pos, d);
              context.lineTo(v.x, v.y);
              theta += dtheta;
          }
          context.lineTo(pos.x + r, pos.y);

          // draw radius
          context.moveTo(pos.x, pos.y);
          var ax = circle.m_R.col1;
          var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
          context.lineTo(pos2.x, pos2.y);
      }
      break;
  case b2Shape.e_polyShape:
      {
          var poly = shape;
          var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
          context.moveTo(tV.x, tV.y);
          for (var i = 0; i < poly.m_vertexCount; i++) {
              var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
              context.lineTo(v.x, v.y);
          }
          context.lineTo(tV.x, tV.y);
      }
      break;
  }
  context.fill();
  context.stroke();
}

function createWorld() {
  var worldAABB = new b2AABB();
  worldAABB.minVertex.Set(-1000, -1000);
  worldAABB.maxVertex.Set(1000, 1000);
  var gravity = new b2Vec2(0, 300);
  var doSleep = true;
  world = new b2World(worldAABB, gravity, doSleep);
  createGround(world);
  return world;
}

function createGround(world) {

  //var segment = new Segment(world, 0, 470, 0, 400, 30, true)
  //groundSegments.push(segment);
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
  var stepping = false;
  var timeStep = 1.0/60;
  var iteration = 1;
  world.Step(timeStep, iteration);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawWorld(world, ctx);
  setTimeout('step(' + (cnt || 0) + ')', 10);
}

// main entry point
Event.observe(window, 'load', function() {

  world = createWorld();

  canvasWidth = parseInt(1000);
  canvasHeight = parseInt(700);

  var scene = new THREE.Scene(); // Create a Three.js scene object.
  var camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000); // Define the perspective camera's attributes.

  var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // Fallback to canvas renderer, if necessary.
  renderer.setSize(canvasWidth, canvasHeight); // Set the size of the WebGL viewport.
  var div_three = $('ctx');
  div_three.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.

  scene.background = new THREE.Color(0xffffff);

  var geometry = new THREE.CubeGeometry(20, 20, 20); // Create a 20 by 20 by 20 cube.
  var material = new THREE.MeshBasicMaterial({ color: 0x0000FF }); // Skin the cube with 100% blue.
  var cube = new THREE.Mesh(geometry, material); // Create a mesh based on the specified geometry (cube) and material (blue skin).
  scene.add(cube); // Add the cube at (0, 0, 0).

  camera.position.z = 50; // Move the camera away from the origin, down the positive z-axis.

  var render = function () {
    cube.rotation.x += 0.01; // Rotate the sphere by a small amount about the x- and y-axes.
    cube.rotation.y += 0.01;

    renderer.render(scene, camera); // Each time we change the position of the cube object, we must re-render it.
    requestAnimationFrame(render); // Call the render() function up to 60 times per second (i.e., up to 60 animation frames per second).
  };

  render(); // Start the rendering of the animation frames.
});
