var torque_limit = 100.0;

function makeWalkingGait() {
	// Construct the walking gait.

	// State 1
	var oris = new Orientations(
		0.6, 	// Torso
		40.0, 	// Swing leg
		60.0, 	// Lower right leg
		8.0,	// Lower left leg
		0.0,	// Right foot
		0.0		// Left foot
	);
	var state_1 = new State(oris);

	// State 2
	oris = new Orientations(
		0.6,	// Torso
		-3.5,	// Swing Leg
		10.0,	// Lower right leg
		10.0,	// Lower left leg
		0.0,	// Right foot
		0.0	// Left foot
	);
	var state_2 = new State(oris); 

	// State 3
	oris = new Orientations(
		0.6, 	// Torso
		40.0, 	// Swing leg
		8.0, 	// Lower right leg
		60.0,	// Lower left leg
		0.0,	// Right foot
		0.0		// Left foot
	);
	var state_3 = new State(oris);

	// State 4
	oris = new Orientations(
		0.6,	// Torso
		-3.5,	// Swing Leg
		10.0,	// Lower right leg
		10.0,	// Lower left leg
		0.0,	// Right foot
		0.0		// Left foot
	);
	var state_4 = new State(oris);

	// Gains
	var torque_gains = [460, 370, 370, 350, 350, 50, 50];
	var feedback_gain_1_2 = 0.17;
	var feedback_gain_3_4 = 0.17;
	var swing_time = 380;

	var walking_gait = new Gait(
		'walk', 
		state_1, 
		state_2, 
		state_3, 
		state_4, 
		torque_gains, 
		feedback_gain_1_2, 
		feedback_gain_3_4,
		swing_time
	);

	return walking_gait;
}

var STATE_INFO = {
	STATE_0: 0,
	STATE_1: 1,
	STATE_2: 2,
	STATE_3: 3,
	STATE_4: 4
};

var MODE = {
	STOPPED: 0,
	RUNNING: 1
};

class Torques {

	constructor(torso, url, ull, lrl, lll, rf, lf) {
		this.torso = torso;
		this.url = url;
		this.ull = ull;
		this.lrl = lrl;
		this.lll = lll;
		this.rf = rf;
		this.lf = lf;
	}
}

class RagDollController {

	constructor(ragDoll) {
		this.ragDoll = ragDoll; // get reference to rag doll.
		this.current_state = STATE_INFO.STATE_0;
		this.current_mode = MODE.STOPPED;
		this.time = Date.now();

		var hip_geo = new THREE.CircleGeometry(0.05, 8);
		var mat = new THREE.MeshBasicMaterial({color: 0xff9999}); // pink
		this.hip_circle = new THREE.Mesh(hip_geo, mat);
		scene.add(this.hip_circle);

		var stance_geo = new THREE.CircleGeometry(0.05, 8);
		var mat = new THREE.MeshBasicMaterial({color: 0x99ccff});
		//var mat = new THREE.MeshBasicMaterial({color: 0x000000});
		this.stance_circle = new THREE.Mesh(stance_geo, mat);
		scene.add(this.stance_circle);

		//var circle = new THREE.CircleGeometry(1.0, 8);
		//var mat = new THREE.MeshBasicMaterial({color: 0x000000});
		//scene.add(new THREE.Mesh(circle, mat));

		this.left_foot_contact = false;
		this.right_foot_contact = false;
		this.torso_contact = false;

	}

	setGait(gait) {
		this.gait = gait;
	}

	stateLoop() {

		switch(this.current_mode) {
			case MODE.STOPPED: {
				// Do nothing..
				// Draw hip and stance ankle?
				switch (current_state) {
					case 0:
						this.calculateSwingHipAngle(0.0, this.ragDoll.right_foot_segment);
					break;
					case 1:
					case 2:
						this.calculateSwingHipAngle(0.0, this.ragDoll.left_foot_segment);
					break;
					case 3:
					case 4:
						this.calculateSwingHipAngle(0.0, this.ragDoll.right_foot_segment);
					break;
				}
				
			}
			break;
			case MODE.RUNNING: {

				if (! this.torso_contact) {

					switch(this.current_state) {
						case 0: {
							this.current_state = STATE_INFO.STATE_1;
							this.time = Date.now();
							//console.log('Switch to state 1');
						}
						break;
						case 1: {

							// var torques = this.calculateState1Torques();
							// ragDoll.ApplyTorques(torques);

							var elapsed = Date.now() - this.time;

							if (elapsed >= this.gait.swing_time) {
								//console.log('Switch to state 2');
								this.current_state = STATE_INFO.STATE_2;
								this.right_foot_contact = false;
							} else {
								var torques = this.calculateState1Torques();
								ragDoll.ApplyTorques(torques);
							}
						}
						break;
						case 2: {
							// // check collision
							if (this.right_foot_contact) {
								this.current_state = STATE_INFO.STATE_3;
								this.time = Date.now();
							} else {
								var torques = this.calculateState2Torques();
								ragDoll.ApplyTorques(torques);
							}
						}
						break;
						case 3: {
							var elapsed = Date.now() - this.time;
							if (elapsed >= this.gait.swing_time) {
								this.current_state = STATE_INFO.STATE_4;
								this.left_foot_contact = false;
							} else {
								var torques = this.calculateState3Torques();
								ragDoll.ApplyTorques(torques);
							}
						}
						break;
						case 4: {
							if (this.left_foot_contact){
								this.time = Date.now();
								this.current_state = STATE_INFO.STATE_1;
							} else {
								var torques = this.calculateState4Torques();
								ragDoll.ApplyTorques(torques);
							}
						}
						break;
					}
				}
			}
			break;
		}
		
	}

	start() {
		
		console.log('RUN');
		this.left_foot_contact = false;
		this.right_foot_contact = false;
		this.torso_contact = false;
		this.current_state = 0;

		this.current_mode = MODE.RUNNING;
	}

	reset() {
		console.log('RESET');
		this.current_mode = MODE.STOPPED;
	}

	/************************************
	*
	*
	*				TORQUES		
	*
	*
	*************************************/

	calculateState1Torques() {
		// Get orientations from gait...
		var target_orientations = this.gait.get_rag_doll_orientations_for_state(1); // Target rotations in local
		return this.calculateStateTorques(target_orientations, 1);

	}

	calculateState2Torques() {
		// Get orientations from gait...
		var target_orientations = this.gait.get_rag_doll_orientations_for_state(2); // Target rotations in local
		return this.calculateStateTorques(target_orientations, 2);
	}

	calculateState3Torques() {
		// Get orientations from gait...
		var target_orientations = this.gait.get_rag_doll_orientations_for_state(3); // Target rotations in local
		return this.calculateStateTorques(target_orientations, 3);
	}

	calculateState4Torques() {
		// Get orientations from gait...
		var target_orientations = this.gait.get_rag_doll_orientations_for_state(4); // Target rotations in local
		return this.calculateStateTorques(target_orientations, 4);
	}

	calculateStateTorques(target_orientations, state) {

		// Get orientations from rag doll ...
		var current_orientations = this.ragDoll.GetOrientations(); // Local coordinates
		// Get Angular Velocities from rag doll ... 
		var ang_vels = this.ragDoll.GetAngularVelocities();

		var torque_gains = this.gait.torque_gains;

		// Compute torques...
		var torso_torque = this.calculateTorque(
			target_orientations[0], 
			current_orientations[0], 
			ang_vels[0],
			torque_gains[0],
			torque_gains[0]/10.0
			);

		switch (state) {
			case 1:
			case 2: {
				// upper right leg is swing
				var target_angle = target_orientations[1]; // upper right leg
				var url_target = this.calculateSwingHipAngle(target_angle, this.ragDoll.left_foot_segment, 1);
				var url_torque = this.calculateTorque(
					url_target, 
					current_orientations[1], 
					ang_vels[1], 
					torque_gains[1], 
					torque_gains[1]/10.0
				);
				// upper left leg is stance
				var ull_torque = - torso_torque - url_torque;

			}
			break;
			case 3:
			case 4: {
				var target_angle = target_orientations[2]; // upper left leg
				// upper left leg is swing
				var ull_target = this.calculateSwingHipAngle(target_angle, this.ragDoll.right_foot_segment, 2);
				var ull_torque = this.calculateTorque(
					ull_target, 
					current_orientations[2], 
					ang_vels[2], 
					torque_gains[2], 
					torque_gains[2]/10.0
				);
				// upper right leg is stance
				var url_torque = - torso_torque - ull_torque;

			}
			break;
		}
		
		// lower right leg
		var lrl_torque = this.calculateTorque(
			target_orientations[3],
			current_orientations[3],
			ang_vels[3],
			torque_gains[3],
			torque_gains[3]/10.0
		);
		// lower left leg
		var lll_torque = this.calculateTorque(
			target_orientations[4],
			current_orientations[4],
			ang_vels[4],
			torque_gains[4],
			torque_gains[4]/10.0
		);

		// right foot
		var rf_torque = this.calculateTorque(
			target_orientations[5],
			current_orientations[5],
			ang_vels[5],
			torque_gains[5],
			torque_gains[5]/10.0
		);

		// left foot
		var lf_torque = this.calculateTorque(
			target_orientations[6],
			current_orientations[6],
			ang_vels[6],
			torque_gains[6],
			torque_gains[6]/10.0
		);

		var torques = [
			url_torque - lrl_torque, 	// Upper right leg
			ull_torque - lll_torque, 	// Upper left leg
			lrl_torque - rf_torque,		// Lower right leg
			lll_torque - lf_torque,		// Lower left leg
			rf_torque,					// Right foot
			lf_torque					// Left Foot
		];

		for (var i = 0; i < torques.length; i ++) {
			torques[i] > torque_limit ? torques[i] = torque_limit : torques[i];
			torques[i] < -torque_limit ? torques[i] = -torque_limit : torques[i];
		}

		return torques;

	}

	calculateTorque(targetPos, currentPos, ang_vel, kp, kd) {
		var torque = kp * (targetPos - currentPos) - kd * ang_vel.z; // Target velocity is 0.
		return torque;
	}

	calculateSwingHipAngle(target_angle, stance_segment, cycle) {
		var hip_velocity = this.ragDoll.torso_segment.GetVelocityInLocalPoint(new THREE.Vector3(0, -this.ragDoll.lengths[0]/2.0, 0));

		// Get global position of hip..

		var torso_pos = this.ragDoll.torso_segment.GetPosition();
		var torso_rot = this.ragDoll.torso_segment.GetRotation();

		var hip_matrix = new THREE.Matrix4();
		hip_matrix.makeTranslation(torso_pos.x, torso_pos.y, torso_pos.z);
		hip_matrix.multiply(new THREE.Matrix4().makeRotationZ(torso_rot));
		hip_matrix.multiply(new THREE.Matrix4().makeTranslation(0, -this.ragDoll.lengths[0]/2.0, 0));

		var hip_pos = new THREE.Vector3();
		var rot = new THREE.Quaternion();
		var scale = new THREE.Vector3();

		hip_matrix.decompose(hip_pos, rot, scale);

		// Get global position of ankle.
		var foot_pos = stance_segment.GetPosition();
		var foot_rot = stance_segment.GetRotation();

		var foot_mat = new THREE.Matrix4();
		foot_mat.makeTranslation(foot_pos.x, foot_pos.y, foot_pos.z);
		foot_mat.multiply(new THREE.Matrix4().makeRotationZ(foot_rot));
		foot_mat.multiply(new THREE.Matrix4().makeTranslation(- this.ragDoll.lengths[3]/4, 0, 0));

		var ankle_pos = new THREE.Vector3();

		foot_mat.decompose(ankle_pos, rot, scale);

		var distance = hip_pos.x - ankle_pos.x;

		var mesh_pos = hip_pos.add(new THREE.Vector3(0, 0, 0.3));

		this.hip_circle.position.x = mesh_pos.x;
		this.hip_circle.position.y = mesh_pos.y;
		this.hip_circle.position.z = mesh_pos.z;

		mesh_pos = ankle_pos.add(new THREE.Vector3(0, 0, 0.1));
		this.stance_circle.position.x = mesh_pos.x;
		this.stance_circle.position.y = mesh_pos.y;
		this.stance_circle.position.z = mesh_pos.z;

		var feedback_gain = (cycle == 1) ? this.gait.feedback_gain_1_2 : this.gait.feedback_gain_3_4;
		return target_angle + feedback_gain * distance + feedback_gain/10.0 * hip_velocity.x;
	}

	processCollisions(collisions) {

		for (var i = 0; i < collisions.length; i ++) {
			var collision = collisions[i];
			var segment1 = collision.segment1;
			var segment2 = collision.segment2;

			if ((segment1.name == 'left foot' && segment2.name =='ground') ||
				(segment2.name == 'left foot' && segment1.name == 'ground')
				) {
				this.left_foot_contact = true;
			}
			if ((segment1.name == 'right foot' && segment2.name =='ground') ||
				(segment2.name == 'right foot' && segment1.name == 'ground')
				) {
				this.right_foot_contact = true;
			}
			if ((segment1.name == 'torso' && segment2.name =='ground') ||
				(segment2.name == 'torso' && segment1.name == 'ground')
				) {
				this.torso_contact = true;
			}

			if ((segment1.name == 'upper left leg' && segment2.name =='ground') ||
				(segment2.name == 'upper left leg' && segment1.name == 'ground')
				) {
				this.torso_contact = true;
			}

			if ((segment1.name == 'upper right leg' && segment2.name =='ground') ||
				(segment2.name == 'upper right leg' && segment1.name == 'ground')
				) {
				this.torso_contact = true;
			}

			if ((segment1.name == 'lower left leg' && segment2.name =='ground') ||
				(segment2.name == 'lower left leg' && segment1.name == 'ground')
				) {
				this.torso_contact = true;
			}

			if ((segment1.name == 'lower right leg' && segment2.name =='ground') ||
				(segment2.name == 'lower right leg' && segment1.name == 'ground')
				) {
				this.torso_contact = true;
			}

		}	
	}

	setLeftFootContact() {
		this.left_foot_segment = true;
	}

	setRightFootContact() {
		this.right_foot_segment = true;
	}

	setTorsoContact() {
		this.torso_contact = true;
	}

}
