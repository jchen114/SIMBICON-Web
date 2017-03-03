
class AmmoPhysicsMgr {
	constructor() {

		this.broadPhase = new Ammo.btDbvtBroadphase();
		this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
		
		//var overlappingPairCache = new Ammo.btAxisSweep3(new Ammo.btVector3(-10,-10,-10),new Ammo.btVector3(10,10,10));
		this.solver = new Ammo.btSequentialImpulseConstraintSolver();

		this.world = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.broadPhase, this.solver, this.collisionConfiguration);
		//this.m_dynamicsWorld.getSolverInfo().set_m_numIterations(10);
		this.world.setGravity(new Ammo.btVector3(0, -9.81, 0));

		this.objects = [];

	}

	step(dt, num_steps) {
		for (var i=0; i < num_steps; i++){
			this.world.stepSimulation(dt, 0); // 0 for once.
		}
	}

	CreateBox(
		mass,
		dimensions,
		color,
		name,
		initialPosition,
		initialRotation,
		restitution=0.5,
		friction=0.7
		) {
		var physicsObject = new PhysicsObject(
			new Ammo.btBoxShape(dimensions),
			mass,
			color,
			name,
			initialPosition,
			initialRotation,
			restitution,
			friction
			);

		if (this.world) {
			this.world.addRigidBody(physicsObject.body);
			this.objects.push(physicsObject)
		}

		return physicsObject;
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
		var rotation = new Ammo.btQuaternion(new Ammo.btVector3(0,0,1), initialRotation);

		transform.setRotation(rotation);

		var motionState = new OpenGLMotionState(transform);
		
		// Calculate the local inertia
		var localInertia = new Ammo.btVector3(0, 0, 0);

		// Objects of infinite mass can't move or rotate
		if (mass != 0.0) {
			this.shape.calculateLocalInertia(mass, localInertia);
		}

		// create the rigid body construction info using mass, motion state, and shape
		var cInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, this.shape, localInertia);
		//cInfo.m_friction = 5.0f;

		// create the rigid body
		this.body = new Ammo.btRigidBody(cInfo);

		this.inertia = localInertia;
		this.mass = mass;

		// Set pointer to self
		this.body.setRestitution(restitution);
		this.body.setFriction(friction);
	}

	GetRotation() {
		return 0;
	}

	GetCenterPosition() {
		var origin = this.body.getWorldTransform().getOrigin();
		return new THREE.Vector3(origin.x(), origin.y(), origin.z());
	}
}

class OpenGLMotionState extends Ammo.btDefaultMotionState {

	constructor(transform) {
		super(transform);
	} // Constructor inherits from btDefaultMotionState Creates a motion state
	
	GetWorldTransform(transform) {
		var trans = new Ammo.btTransform();
		Ammo.getWorldTransform(trans); // Gets the world transform from bullet
		trans.getOpenGLMatrix(transform); // Convenience method to convert the bullet world transform to OpenGL's world for rendering
	}
};

