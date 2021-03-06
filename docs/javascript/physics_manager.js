
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

		this.ptrMap = new Map();

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

		physicsObject.length = dimensions.x;
		physicsObject.height = dimensions.y;

		if (this.dynamicsWorld) {
			this.dynamicsWorld.addRigidBody(physicsObject.body);
			this.objects.push(physicsObject);
			this.ptrMap.set(physicsObject.body.ptr, physicsObject);
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

	CheckCollisions() {
		var num_manifolds = this.dynamicsWorld.getDispatcher().getNumManifolds();

		var collisions = [];

		for (var i = 0; i < num_manifolds; i ++) {
			var contactManifold =  this.dynamicsWorld.getDispatcher().getManifoldByIndexInternal(i);
	        var obA = contactManifold.getBody0();
	        var obB = contactManifold.getBody1();

	        var numContacts = contactManifold.getNumContacts();
	        for (var j = 0; j < numContacts; j++)
	        {
	            var pt = contactManifold.getContactPoint(j);
	            if (pt.getDistance() <= 0.0)
	            {
	                var pObj1 = this.ptrMap.get(obA.ptr);
	                var pObj2 = this.ptrMap.get(obB.ptr);

	                var seg1 = bodies.get(pObj1);
	                var seg2 = bodies.get(pObj2);

	                if (seg1 !=null && seg2 != null) {
	                	collisions.push({
		                	segment1: seg1,
		                	segment2: seg2
	                	});
	                }

	                
	            }
	        }
    	}
        return collisions;
	}

	RemoveBody(body) {

		this.dynamicsWorld.removeRigidBody(body);

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
		restitution=0.3,
		friction=1.0
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

		this.localInertia = localInertia;
		this.mass = mass;

		this.body = body;

		this.positionTransform = new Ammo.btTransform();
		this.rotationQuaternion = new Ammo.btQuaternion();

	}

	UpdatePosition(trans, rot) {
		this.positionTransform.setIdentity();
		this.positionTransform.setOrigin(new Ammo.btVector3(trans.x, trans.y, trans.z));
		var rotation = new Ammo.btQuaternion();
		if (rot < 0) {
			rot = 2* Math.PI + rot;
		}
		rotation.setRotation(new Ammo.btVector3(0, 0, 1), rot);
		this.positionTransform.setRotation(rotation);

		this.body.setWorldTransform(this.positionTransform);

	}

	GetRotation() {
		this.body.getWorldTransform().getBasis().getRotation(this.rotationQuaternion);
		var angle = this.body.getWorldTransform().getRotation().getAngle();
		if (this.rotationQuaternion.getAxis().z() < 0) {
			angle *= -1;
		}
		return angle;
	}

	GetAngularVelocity() {
		var ang_vel = this.body.getAngularVelocity();
		return new THREE.Vector3(ang_vel.x(), ang_vel.y(), ang_vel.z());
	}

	GetLinearVelocity() {
		var lin_vel = this.body.getLinearVelocity();
		return new THREE.Vector3(lin_vel.x(), lin_vel.y(), lin_vel.z());
	}

	GetCenterPosition() {
		var origin = this.body.getWorldTransform().getOrigin();
		var vec3 = new THREE.Vector3(origin.x(), origin.y(), origin.z());
		return vec3;
	}

	GetLocalTransform() {
		return this.body.getLocalTransform();
	}

	Disable() {
		this.body.setMassProps(0.0, new Ammo.btVector3(0, 0, 0));
	}

	Enable() {
		this.body.setMassProps(this.mass, this.localInertia);
		this.body.activate();
	}

	ApplyTorque(torque) {
		var torque_vec = new Ammo.btVector3(0, 0, torque);
		this.body.applyTorque(torque_vec);

	}

	ClearForces() {
		this.body.setLinearVelocity(new Ammo.btVector3(0, 0, 0));
		this.body.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
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

