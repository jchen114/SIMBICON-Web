class Segment {

  var z = 0;
  constructor(world, x, y, z, width, height, fixed) {
    this.body = createBox(world, x, y, width, height, fixed);
    this.z = z;
  }
}


function createBox(world, x, y, width, height, fixed, restitution=0.0, friction=1.0, density=1.0) {
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
