function setupControls(){

	// State Radio Group
	setupStateRadios();
	setupStatePositions()
	setupBodyGainSliders();
	setupFeedbackGainSliders();
	setupTimeSlider();
	
};

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
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});

	$j( "#url_pos" ).slider({
	  range: "min",
	  value: 0,
	  min: -90,
	  max: 90,
	  step: 0.5,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});

	$j( "#ull_pos" ).slider({
	  range: "min",
	  value: 0,
	  min: -90,
	  max: 90,
	  step: 0.5,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});

	$j( "#lrl_pos" ).slider({
	  range: "min",
	  value: 0,
	  min: 0,
	  max: 90,
	  step: 0.5,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});

	$j( "#lll_pos" ).slider({
	  range: "min",
	  value: 0,
	  min: 0,
	  max: 90,
	  step: 0.5,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});

	$j( "#rf_pos" ).slider({
	  range: "min",
	  value: 0,
	  min: 0,
	  max: 90,
	  step: 0.5,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});

	$j( "#lf_pos" ).slider({
	  range: "min",
	  value: 0,
	  min: 0,
	  max: 90,
	  step: 0.5,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
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
	  	console.log(ui.value);
	  }
	});

	$j( "#url_gain" ).slider({
	  range: "min",
	  value: 200,
	  min: 0,
	  max: 500,
	  step: 1,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});

	$j( "#ull_gain" ).slider({
	  range: "min",
	  value: 200,
	  min: 0,
	  max: 500,
	  step: 1,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});

	$j( "#lrl_gain" ).slider({
	  range: "min",
	  value: 200,
	  min: 0,
	  max: 500,
	  step: 1,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});

	$j( "#lll_gain" ).slider({
	  range: "min",
	  value: 200,
	  min: 0,
	  max: 500,
	  step: 1,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});

	$j( "#rf_gain" ).slider({
	  range: "min",
	  value: 200,
	  min: 0,
	  max: 500,
	  step: 1,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});

	$j( "#lf_gain" ).slider({
	  range: "min",
	  value: 200,
	  min: 0,
	  max: 500,
	  step: 1,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
	  }
	});
}

function setupFeedbackGainSliders() {
	$j( "#feedback_gain" ).slider({
	  range: "min",
	  value: 50,
	  min: 0,
	  max: 100,
	  step: 1,
	  slide: function( event, ui ) {
	  	console.log(ui.value);
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
	  	console.log(ui.value);
	  }
	});
}

function radioListen(radio_button) {
	//console.log('%s has been clicked', radio_button.attr('id'));
}