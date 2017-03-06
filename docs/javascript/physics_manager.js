
class AmmoPhysicsMgr {
	constructor() {

		this.collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
		this.dispatcher              = new Ammo.btCollisionDispatcher(this.collisionConfiguration),
		this.overlappingPairCache    = new Ammo.btDbvtBroadphase(),
		this.solver                  = new Ammo.btSequentialImpulseConstraintSolver(),
		this.dynamicsWorld           = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.overlappingPairCache, this.solver, this.collisionConfiguration);
		this.dynamicsWorld.setGravity(new Ammo.btVector3(0, -9.81, 0));

		this.objects = [];
		this.constraints = [];

	}

	step(dt, num_steps) {
		this.dynamicsWorld.stepSimulation(dt, num_steps); // 0 for once.
		// for (var i=0; i < num_steps; i++){
		// 	this.world.stepSimulation(dt, 0); // 0 for once.
		// }
	}

	CreateBox(
		mass,
		dimensions,
		color,
		name,
		initialPosition,
		initialRotation,
		restitution=0.99,
		friction=0.7
		) {

		var physicsObject = new PhysicsObject(
			new Ammo.btBoxShape(new Ammo.btVector3(dimensions.x/2, dimensions.y/2, dimensions.z/2)),
			mass,
			color,
			name,
			initialPosition,
			initialRotation,
			restitution,
			friction
			);

		if (this.dynamicsWorld) {
			this.dynamicsWorld.addRigidBody(physicsObject.body);
			this.objects.push(physicsObject)
		}

		return physicsObject;
	}

	CreateHingeJoint(
		segment1,
		segment2,
		localAnchor1,
		localAnchor2,
		lower_limit,
		upper_limit
		) {
		var hingeJoint = new PhysicsHingeJoint(segment1, segment2, localAnchor1, localAnchor2, lower_limit, upper_limit);
		if (this.dynamicsWorld) {
			this.dynamicsWorld.addConstraint(hingeJoint.joint, true);
			this.constraints.push(hingeJoint);
		}
		return hingeJoint;
	}
}

class PhysicsObject{
	constructor(
		collisionShape,
		mass,
		color,
		name,
		initialPosition,
		initialRotation,
		restitution=0.5,
		friction=0.7
		) {

		this.name = name;
		this.shape = collisionShape;
		this.color = color;

		var transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(initialPosition.x, initialPosition.y, initialPosition.z));

		// build rotation quaternion from z
		var rotation = new Ammo.btQuaternion();
		if (initialRotation < 0) {
			initialRotation = 2 * Math.PI + initialRotation;
		}
		rotation.setRotation(new Ammo.btVector3(0,0,1), initialRotation); // ???

		transform.setRotation(rotation);

        var isDynamic = (mass !== 0),
        localInertia  = new Ammo.btVector3(0, 0, 0);

		if (isDynamic)
		  collisionShape.calculateLocalInertia(mass, localInertia);

		var myMotionState = new Ammo.btDefaultMotionState(transform),
		    rbInfo        = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, collisionShape, localInertia),
		    body          = new Ammo.btRigidBody(rbInfo);

			// Set pointer to self
		body.setRestitution(restitution);
		body.setFriction(friction);

		body.setLinearFactor(new Ammo.btVector3(1,1,0));
		body.setAngularFactor(new Ammo.btVector3(0,0,1));

		this.body = body;
	}

	GetRotation() {
		var q = new Ammo.btQuaternion();
		this.body.getWorldTransform().getBasis().getRotation(q);
		var angle = this.body.getWorldTransform().getRotation().getAngle();
		if (q.getAxis().z() < 0) {
			angle *= -1;
		}
		return angle;
	}

	GetCenterPosition() {
		var origin = this.body.getWorldTransform().getOrigin();
		var vec3 = new THREE.Vector3(origin.x(), origin.y(), origin.z());
		return vec3;
	}

	GetLocalTransform() {
		return this.body.getLocalTransform();
	}
}

class PhysicsHingeJoint{

	constructor(
		segment1,
		segment2,
		localAnchor1, 	// Bullets btVector3
		localAnchor2,	// Bullets btVector3
		lower_limit,
		upper_limit
		) {


		this.segment1 = segment1;
		this.segment2 = segment2;

		this.localAnchor1 = localAnchor1;
		this.localAnchor2 = localAnchor2;

		this.joint = new Ammo.btHingeConstraint(
			segment1.body.body,
			segment2.body.body,
			new Ammo.btVector3(localAnchor1.x, localAnchor1.y, localAnchor1.z),
			new Ammo.btVector3(localAnchor2.x, localAnchor2.y, localAnchor2.z),
			new Ammo.btVector3(0,0,1),
			new Ammo.btVector3(0,0,1)
		);

		this.lower_limit = lower_limit;
		this.upper_limit = upper_limit;

		//this.joint.setLimit(lower_limit, upper_limit);

	}

	GetLocation() {

		var origin = this.segment1.body.GetCenterPosition(); 
		var rotation = this.segment1.body.GetRotation();
		var mat = new THREE.Matrix4();
		mat.multiply(new THREE.Matrix4().makeTranslation(origin.x, origin.y, this.segment2.z));
		mat.multiply(new THREE.Matrix4().makeRotationZ(rotation));
		mat.multiply(new THREE.Matrix4().makeTranslation(this.localAnchor1.x, this.localAnchor1.y, 0));
		var pos = new THREE.Vector3();
		var rot = new THREE.Quaternion();
		var scale = new THREE.Vector3();
		mat.decompose(pos, rot, scale);
		return {
			translation: pos,
			rotation: rot,
			scale: scale
		}
	}

	update() {
		var angle = this.joint.getHingeAngle();
		console.log(angle);
		if (angle < this.lower_limit) {
			console.log('lower limit');
		}
		if (angle > this.upper_limit) {
			console.log('upper limit');
		}
	}

}

