var current_gait;
var current_state;

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
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
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
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
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
		},
		change: function(event, ui) {
			displaySliderValue($j(this).prev(), ui.value);
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
	  },
	  change: function(event, ui) {
	  	displaySliderValue($j(this).prev(), ui.value);
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
	  },
	  change: function(event, ui) {
	  	displaySliderValue($j(this).prev(), ui.value);
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
	  },
	  change: function(event, ui) {
	  	displaySliderValue($j(this).prev(), ui.value);
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

}

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
