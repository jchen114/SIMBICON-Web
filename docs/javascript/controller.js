function makeWalkingGait() {
	// Construct the walking gait.
	// State 1
	var oris = new Orientations(
		0.0, 	// Torso
		34.0, 	// Swing leg
		40.0, 	// Lower right leg
		8.0,	// Lower left leg
		0.0,	// Right foot
		0.0		// Left foot
	);
	var state_1 = new State(oris);
	// State 2
	oris = new Orientations(
		0.0,	// Torso
		-10.0,	// Swing Leg
		0.0,	// Lower right leg
		0.0,	// Lower left leg
		0.0,	// Right foot
		0.0	// Left foot
	);
	var state_2 = new State(oris); 
	// State 3

	oris = new Orientations(
		0.0, 	// Torso
		34.0, 	// Swing leg
		40.0, 	// Lower right leg
		8.0,	// Lower left leg
		0.0,	// Right foot
		0.0		// Left foot
	);
	var state_3 = new State(oris);

	// State 4
	oris = new Orientations(
		0.0,	// Torso
		-10.0,	// Swing Leg
		0.0,	// Lower right leg
		0.0,	// Lower left leg
		0.0,	// Right foot
		0.0		// Left foot
	);
	var state_4 = new State(oris);

	// Gains
	var torque_gains = [200, 200, 200, 200, 200, 30, 30];
	var feedback_gain = 10;
	var swing_time = 33;

	var walking_gait = new Gait('walk', state_1, state_2, state_3, state_4, torque_gains, feedback_gain, swing_time);

	return walking_gait;

}


class RagDollController {
  constructor() {

  }
}
