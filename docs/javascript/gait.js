class Orientations {
  constructor(torso, swing, lrl, lll, rf, lf) {

    this.torso = torso;
    this.swing = swing;
    this.lrl = lrl;
    this.lll = lll;
    this.rf = rf;
    this.lf = lf;

  }
}

class State {

  constructor(orientations) {
    this.orientations = orientations;
  }

  set_torso_pos(orientation) {
    this.orientations.torso = orientation
  }

  get_torso_pos () {
    return this.orientations.torso;
  }

  set_swing_pos(orientation) {
    this.orientations.swing = orientation;
  }

  get_swing_pos() {
    return this.orientations.swing;
  }

  set_lrl_pos(orientation) {
    this.orientations.lrl = orientation;
  }

  get_lrl_pos() {
    return this.orientations.lrl;
  }

  set_lll_pos(orientation) {
    this.orientations.lll = orientation;
  }

  get_lll_pos() {
    return this.orientations.lll;
  }

  set_rf_pos(orientation) {
    this.orientations.rf = orientation;
  }

  get_rf_pos() {
    return this.orientations.rf;
  }

  set_lf_pos(orientation) {
    this.orientations.lf = orientation;
  }

  get_lf_pos() {
    return this.orientations.lf;
  }
}

class Gait {

  constructor(name, state_1, state_2, state_3, state_4, torque_gains, feedback_gain_1_2, feedback_gain_3_4, swing_time) {

    this.name = name;

    var pos = new Orientations(
      0.0,  // Torso
      0.0,  // Swing
      0.0,  // Lower Right
      0.0,  // Lower Left
      0.0,  // Right foot
      0.0   // Left foot
      );

    var state_0 = new State(pos);

    this.state_0 = state_0;
    this.state_1 = state_1;
    this.state_2 = state_2;
    this.state_3 = state_3;
    this.state_4 = state_4;

    this.torque_gains = torque_gains;
    this.feedback_gain_1_2 = feedback_gain_1_2;
    this.feedback_gain_3_4 = feedback_gain_3_4;
    this.swing_time = swing_time;
  }

  get_rag_doll_orientations_for_state(state) { // These are in local coordinates!
    var orientations;
    switch (state) {
      case 0: {
        var state = this.state_0;
        orientations = [
          0.0,  // Torso
          0.0,  // URL
          0.0,  // ULL
          0.0,  // LRL
          0.0,  // LLL
          0.0,  // RF
          0.0   // LF
        ];
      }
      break;
      case 1: {
        var state = this.state_1;
        orientations = [
          state.get_torso_pos(),
          state.get_swing_pos(),
          0.0, // stance
          - state.get_lrl_pos(),
          - state.get_lll_pos(),
          - state.get_rf_pos(),
          - state.get_lf_pos()
        ];
      }
      break;
      case 2: {
        var state = this.state_2;
        orientations = [
          state.get_torso_pos(),
          state.get_swing_pos(),
          0.0, // stance
          - state.get_lrl_pos(),
          - state.get_lll_pos(),
          - state.get_rf_pos(),
          - state.get_lf_pos()
        ];
      }
      break;
      case 3: {
        var state = this.state_3;
        orientations = [
          state.get_torso_pos(),
          0.0, // stance
          state.get_swing_pos(),
          - state.get_lrl_pos(),
          - state.get_lll_pos(),
          - state.get_rf_pos(),
          - state.get_lf_pos()
        ];
      }
      break;
      case 4: {
        var state = this.state_4;
        orientations = [
          state.get_torso_pos(),
          0.0, // stance
          state.get_swing_pos(),
          - state.get_lrl_pos(),
          - state.get_lll_pos(),
          - state.get_rf_pos(),
          - state.get_lf_pos()
        ];
      }
      break;
    }

    for (var i = 0; i < orientations.length; i ++) { // Convert to radians
      orientations[i] *= Math.PI/180.0; 
    }

    return orientations;

  }
}
