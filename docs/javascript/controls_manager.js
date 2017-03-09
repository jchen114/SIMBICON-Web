var current_gait;
var current_state;

var STATE = {
	RUNNING: 0,
	STOPPED: 0
}

function setupControls(){

	// State Radio Group
	setupStateRadios();
	setupStatePositions()
	setupBodyGainSliders();
	setupFeedbackGainSliders();
	setupTimeSlider();

	current_gait = gaits.get('walk');
	current_state = 0;

	displayCurrentState();
	displayCurrentTorques();
	displayCurrentFeedback();
	displayCurrentTime();

	disableStateSliders();

}

function setupStateRadios() {
	var $radios = $j("[name='state_radio']"); // radio buttons
	$j('input[name="state_radio"]').click(function() {
		//console.log('%s has been clicked', $j(this).attr('id'));
		radioListen($j(this));
	});
}

function setupStatePositions() {

	$j( "#torso_pos" ).slider({
		range: "min",
		value: 0,
		min: -45,
		max: 45,
		step: 0.5,
		slide: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateTorsoState(ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateTorsoState(ui.value);
		}
	});

	$j( "#swing_pos" ).slider({
		range: "min",
		value: 0,
		min: -90,
		max: 90,
		step: 0.5,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
			updateSwingState(ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateSwingState(ui.value);
		}
	});

	$j( "#lrl_pos" ).slider({
		range: "min",
		value: 0,
		min: 0,
		max: 90,
		step: 0.5,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
			updateLRLState(ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateLRLState(ui.value);
		}
	});

	$j( "#lll_pos" ).slider({
		range: "min",
		value: 0,
		min: 0,
		max: 90,
		step: 0.5,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
			updateLLLState(ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateLLLState(ui.value);
		}
	});

	$j( "#rf_pos" ).slider({
		range: "min",
		value: 0,
		min: 0,
		max: 90,
		step: 0.5,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
			updateRFState(ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateRFState(ui.value);
		}
	});

	$j( "#lf_pos" ).slider({
		range: "min",
		value: 0,
		min: 0,
		max: 90,
		step: 0.5,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
			updateLFState(ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateLFState(ui.value);
		}
	});
}

function setupBodyGainSliders() {
	// Gain sliders
	$j( "#torso_gain" ).slider({
		range: "min",
		value: 200,
		min: 0,
		max: 500,
		step: 1,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateTorsoGain(ui.value);
		}
	});

	$j( "#url_gain" ).slider({
		range: "min",
		value: 200,
		min: 0,
		max: 500,
		step: 1,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateURLGain(ui.value);
		}
	});

	$j( "#ull_gain" ).slider({
		range: "min",
		value: 200,
		min: 0,
		max: 500,
		step: 1,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateULLGain(ui.value);
		}
	});

	$j( "#lrl_gain" ).slider({
		range: "min",
		value: 200,
		min: 0,
		max: 500,
		step: 1,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateLRLGain(ui.value);
		}
	});

	$j( "#lll_gain" ).slider({
		range: "min",
		value: 200,
		min: 0,
		max: 500,
		step: 1,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateLLLGain(ui.value);
		}
	});

	$j( "#rf_gain" ).slider({
		range: "min",
		value: 50,
		min: 0,
		max: 100,
		step: 1,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateRFGain(ui.value);
	  }
	});

	$j( "#lf_gain" ).slider({
		range: "min",
		value: 50,
		min: 0,
		max: 100,
		step: 1,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateLFGain(ui.value);
		}
	});
}

function setupFeedbackGainSliders() {
	$j( "#feedback_gain" ).slider({
		range: "min",
		value: 50,
		min: 0,
		max: 500,
		step: 1,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateFeedback(ui.value);
		}
		});
}

function setupTimeSlider() {
	$j( "#swing_time" ).slider({
		range: "min",
		value: 50,
		min: 0,
		max: 100,
		step: 1,
		slide: function( event, ui ) {
			displaySliderValue($j(this).prev(), ui.value);
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
			updateTime(ui.value);
		}
	});
}

function radioListen(radio_button) {
	console.log('%s has been clicked', radio_button.attr('id'));

	switch(radio_button.attr('id')) {
		case 'state_0': {
			current_state = 0;
		}
		break;
		case 'state_1': {
			current_state = 1;
		}
		break;
		case 'state_2': {
			current_state = 2;
		}
		break;
		case 'state_3': {
			current_state = 3;
		}
		break;
		case 'state_4': {
			current_state = 4;
		}
		break;
	}

	displayCurrentState();
	displayCurrentTorques();
	displayCurrentFeedback();
	displayCurrentTime();

	if (current_state == 0) {
		// disable slider for states
		disableStateSliders();

	} else {
		// enable sliders
		enableStateSliders();
	}

}

// ================ Display ================ //

function displaySliderValue(label, value) {
	label.text(function(i, txt) {
		return txt.replace(/-*\d+(.\d)*/, value.toFixed(1));
	});
}

function displayCurrentState() {

	var state;

	switch(current_state) {
		case 0:
			state = current_gait.state_0;
		break;
		case 1:
			state = current_gait.state_1;
		break;
		case 2:
			state = current_gait.state_2;
		break;
		case 3:
			state = current_gait.state_3;
		break;
		case 4:
			state = current_gait.state_4;
		break;
	}	

	$j('#torso_pos').slider('value', state.get_torso_pos());
	$j('#swing_pos').slider('value', state.get_swing_pos());
	$j('#lrl_pos').slider('value', state.get_lrl_pos());
	$j('#lll_pos').slider('value', state.get_lll_pos());
	$j('#rf_pos').slider('value', state.get_rf_pos());
	$j('#lf_pos').slider('value', state.get_lf_pos());
}

function displayCurrentTorques() {

	var torque_gains = current_gait.torque_gains;

	$j('#torso_gain').slider('value', torque_gains[0]);
	$j('#url_gain').slider('value', torque_gains[1]);
	$j('#ull_gain').slider('value', torque_gains[2]);
	$j('#lrl_gain').slider('value', torque_gains[3]);
	$j('#lll_gain').slider('value', torque_gains[4]);
	$j('#rf_gain').slider('value', torque_gains[5]);
	$j('#lf_gain').slider('value', torque_gains[6]);
}

function displayCurrentFeedback() {
	var feedback_gain = current_gait.feedback_gain;
	$j('#feedback_gain').slider('value', feedback_gain);
}

function displayCurrentTime() {
	var time = current_gait.swing_time;
	$j('#swing_time').slider('value', time);
}

// ================ Update State ============== //

function updateTorsoState(orientation) {

	switch(current_state) {

		case 1: {
			current_gait.state_1.set_torso_pos(orientation);
		}
			break;
		case 2: {
			current_gait.state_2.set_torso_pos(orientation);
		}
			break;
		case 3: {
			current_gait.state_3.set_torso_pos(orientation);
		}
			break;
		case 4: {
			current_gait.state_4.set_torso_pos(orientation);
		}
			break;
	}

	var orientations = current_gait.get_rag_doll_orientations_for_state(current_state);
	ragDoll.Update(orientations);

}

function updateSwingState(orientation) {

	switch(current_state) {
		case 1:
			current_gait.state_1.set_swing_pos(orientation);
			break;
		case 2:
			current_gait.state_2.set_swing_pos(orientation);
			break;
		case 3:
			current_gait.state_3.set_swing_pos(orientation);
			break;
		case 4:
			current_gait.state_4.set_swing_pos(orientation);
			break;
	}
	var orientations = current_gait.get_rag_doll_orientations_for_state(current_state);
	ragDoll.Update(orientations);
}

function updateLRLState(orientation) {

	switch(current_state) {
		case 1:
			current_gait.state_1.set_lrl_pos(orientation);
			break;
		case 2:
			current_gait.state_2.set_lrl_pos(orientation);
			break;
		case 3:
			current_gait.state_3.set_lrl_pos(orientation);
			break;
		case 4:
			current_gait.state_4.set_lrl_pos(orientation);
			break;
	}
	var orientations = current_gait.get_rag_doll_orientations_for_state(current_state);
	ragDoll.Update(orientations);
}

function updateLLLState(orientation) {

	switch(current_state) {
		case 1:
			current_gait.state_1.set_lll_pos(orientation);
			break;
		case 2:
			current_gait.state_2.set_lll_pos(orientation);
			break;
		case 3:
			current_gait.state_3.set_lll_pos(orientation);
			break;
		case 4:
			current_gait.state_4.set_lll_pos(orientation);
			break;
	}

	var orientations = current_gait.get_rag_doll_orientations_for_state(current_state);
	ragDoll.Update(orientations);
}

function updateRFState(orientation) {

	switch(current_state) {
		case 1:
			current_gait.state_1.set_rf_pos(orientation);
			break;
		case 2:
			current_gait.state_2.set_rf_pos(orientation);
			break;
		case 3:
			current_gait.state_3.set_rf_pos(orientation);
			break;
		case 4:
			current_gait.state_4.set_rf_pos(orientation);
			break;
	}
	var orientations = current_gait.get_rag_doll_orientations_for_state(current_state);
	ragDoll.Update(orientations);
}

function updateLFState(orientation) {

	switch(current_state) {
		case 1:
			current_gait.state_1.set_lf_pos(orientation);
			break;
		case 2:
			current_gait.state_2.set_lf_pos(orientation);
			break;
		case 3:
			current_gait.state_3.set_lf_pos(orientation);
			break;
		case 4:
			current_gait.state_4.set_lf_pos(orientation);
			break;
	}
	var orientations = current_gait.get_rag_doll_orientations_for_state(current_state);
	ragDoll.Update(orientations);
}

// ================ Update Torque Gain ============== //

function updateTorsoGain(gain) {

	current_gait.torque_gains[0] = gain;

}

function updateURLGain(gain) {

	current_gait.torque_gains[1] = gain;
}

function updateULLGain(gain) {

	current_gait.torque_gains[2] = gain;
}

function updateLRLGain(gain) {

	current_gait.torque_gains[3] = gain;
}

function updateLLLGain(gain) {

	current_gait.torque_gains[4] = gain;
}

function updateRFGain(gain) {

	current_gait.torque_gains[5] = gain;
}

function updateLFGain(gain) {

	current_gait.torque_gains[6] = gain;
}

// ============== Update Feedback ============ //

function updateFeedback(gain) {

	current_gait.feedback_gain = gain;
}

// ============== Update Time ============ //

function updateTime(time) {

	current_gait.swing_time = time;
}

function disableStateSliders() {
	$j("#torso_pos").slider('option', 'disabled', true);
	$j("#swing_pos").slider('option', 'disabled', true);
	$j("#lrl_pos").slider('option', 'disabled', true);
	$j("#lll_pos").slider('option', 'disabled', true);
	$j("#rf_pos").slider('option', 'disabled', true);
	$j("#lf_pos").slider('option', 'disabled', true);
}

function enableStateSliders() {
	$j("#torso_pos").slider('option', 'disabled', false);
	$j("#swing_pos").slider('option', 'disabled', false);
	$j("#lrl_pos").slider('option', 'disabled', false);
	$j("#lll_pos").slider('option', 'disabled', false);
	$j("#rf_pos").slider('option', 'disabled', false);
	$j("#lf_pos").slider('option', 'disabled', false);
}

function disableGainSliders() {
	$j('#torso_gain').slider('option', 'disabled', true);
	$j('#url_gain').slider('option', 'disabled', true);
	$j('#ull_gain').slider('option', 'disabled', true);
	$j('#lrl_gain').slider('option', 'disabled', true);
	$j('#lll_gain').slider('option', 'disabled', true);
	$j('#rf_gain').slider('option', 'disabled', true);
	$j('#lf_gain').slider('option', 'disabled', true);
}

function enableGainSliders() {
	$j('#torso_gain').slider('option', 'disabled', false);
	$j('#url_gain').slider('option', 'disabled', false);
	$j('#ull_gain').slider('option', 'disabled', false);
	$j('#lrl_gain').slider('option', 'disabled', false);
	$j('#lll_gain').slider('option', 'disabled', false);
	$j('#rf_gain').slider('option', 'disabled', false);
	$j('#lf_gain').slider('option', 'disabled', false);
}

function disableFeedbackGainSlider() {
	$j('#feedback_gain').slider('option', 'disabled', true);
}

function enableFeedbackGainSlider() {
	$j('#feedback_gain').slider('option', 'disabled', false);
}

function disableTimeSlider() {
	$j('#swing_time').slider('option', 'disabled', true);
}

function enableTimeSlider() {
	$j('#swing_time').slider('option', 'disabled', false);
}