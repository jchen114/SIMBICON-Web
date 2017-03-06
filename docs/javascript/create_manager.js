class b3Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Segment {
  constructor(
    position,
    rotation,
    dimensions,
    name='body',
    material=new THREE.MeshBasicMaterial(),
    color=new THREE.Vector3(1,0,0),
    fixed=true,
    density=1.0,
    restitution=0.8,
    friction=1.0
  ) {
    this.name = name;
    this.z = position.z;
    /* ====== Box 2d ====== */
    //this.body = createBox(world, position.x, position.y, rotation, dimensions.x/2, dimensions.y/2, fixed, restitution, friction, density);
    if (fixed) {
      density = 0.0;
    }
    /* ====== Ammo =====*/
    this.body = ammoPhysicsMgr.CreateBox(
      density * dimensions.x * dimensions.y * dimensions.z, 
      dimensions,
      color,
      name,
      position,
      rotation,
      restitution,
      friction
      )

    /* ====== THREE ====== */
    // geometry
    this.geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
    // material
    material.color = new THREE.Color(color.x, color.y, color.z);
    this.material = material;

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.mesh);
  }

  update() {
    //console.log('update %s', this.name);

    var worldTransform = this.body.GetCenterPosition(); // global translate
    var rotation = this.body.GetRotation(); // can only rotate about z in 2d

    // this.mesh.matrixAutoUpdate = false;
    // var updateMatrix = this.mesh.matrixWorld.clone();
    //
    // updateMatrix.makeTranslation(worldTransform.x, worldTransform.y, this.z)
    // updateMatrix.makeRotationZ(rotation);
    //
    // this.mesh.matrix.multiply(updateMatrix);

    this.mesh.position.x = worldTransform.x;
    this.mesh.position.y = worldTransform.y;
    this.mesh.position.z = this.z;

    this.mesh.rotation.z = rotation;
  }

  GetPosition() {
    var vec = this.body.GetCenterPosition();
    return new THREE.Vector3(vec.x, vec.y, this.z);
  }

  GetRotation() {
    return this.body.GetRotation(); // in z
  }

}

class Joint {
  constructor(
    lower_limit,
    upper_limit,
    segment1,
    segment2,
    localAnchor1,
    localAnchor2,
    name='joint',
    material=new THREE.MeshBasicMaterial(),
    color=new THREE.Vector3(0,0,1)
  ){

    this.segment1 = segment1;
    this.segment2 = segment2;
    this.localAnchorFrom1 = localAnchor1;
    this.localAnchorFrom2 = localAnchor2;

    /* ====== Box 2d ====== */
    // createJoint(segment1, segment2, location, upper, lower);

    /* ====== AMMO ====== */
    this.joint = ammoPhysicsMgr.CreateHingeJoint(
      segment1,
      segment2,
      localAnchor1,
      localAnchor2,
      lower_limit,
      upper_limit
      );

    /* ====== THREE ====== */
    // geometry
    this.geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.15);
    // material
    material.color = new THREE.Color(color.x, color.y, color.z);
    this.material = material;

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.mesh);

  }

  update() {
    //console.log('update %s', this.name);

    var location = this.GetLocation();

    this.mesh.position.x = location.translation.x;
    this.mesh.position.y = location.translation.y;
    this.mesh.position.z = location.translation.z;

    this.mesh.rotation.x = Math.PI/2;

    //this.joint.update();
    //this.mesh.rotation.z = location.rotation;
  }

  GetLocation() {

    var location = this.joint.GetLocation();

    return {
      translation: location.translation,
      rotation: location.rotation,
      scale: location.scale
    }
  }

}


function createBox(world, x, y, rotation, width, height, fixed, restitution, friction, density) {
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
  boxBd.rotation = rotation;
  return world.CreateBody(boxBd);
}

function createJoint(segment1, segment2, location, upper_limit, lower_limit){
  var jointDef = new b2RevoluteJointDef();
  jointDef.body1 = segment1.body;
  jointDef.body2 = segment2.body;

  jointDef.enableLimit = true;

  jointDef.collideConnected = false;

  var location = this.GetLocation();
  jointDef.anchorPoint = new b2Vec2(location.translation.x, location.translation.y);
  jointDef.lowerAngle = lower_limit;
  jointDef.upperAngle = upper_limit;

  this.joint = world.CreateJoint(jointDef);

}
