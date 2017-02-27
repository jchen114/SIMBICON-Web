class Segment {
  constructor(world, x, y, z, width, height, depth, fixed, restitution=0.0, friction=1.0, density=1.0) {
    // Box 2d
    this.body = createBox(world, x, y, width, height, fixed, restitution, friction, density);

    // THREE
    this.z = z;
    this.geometry = new THREE.BoxGeometry(width, height, depth);
    this.material = new THREE.MeshBasicMaterial({color:0x00ff00});
    this.cube = new THREE.Mesh(geometry, material);
  }
}


function createBox(world, x, y, width, height, fixed, restitution, friction, density) {
  //console.log(' Create Box, x= %s, y=%s', x, y);
  if (typeof(fixed) == 'undefined') fixed = true;
  var boxSd = new b2BoxDef();
  if (!fixed) boxSd.density = density;
  boxSd.restitution = restitution;
  boxSd.friction = friction;
  boxSd.extents.Set(width, height);
  var boxBd = new b2BodyDef();
  boxBd.AddShape(boxSd);
  boxBd.position.Set(x,y);
  return world.CreateBody(boxBd);
}
