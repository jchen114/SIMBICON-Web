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

  get_torso_pos () {
    return this.orientations.torso;
  }

  get_swing_pos() {
    return this.orientations.swing;
  }

  get_lrl_pos() {
    return this.orientations.lrl;
  }

  get_lll_pos() {
    return this.orientations.lll;
  }

  get_rf_pos() {
    return this.orientations.rf;
  }

  get_lf_pos() {
    return this.orientations.lf;
  }
}

class Gait {

  constructor(name, state_1, state_2, state_3, state_4, torque_gains, feedback_gain, swing_time) {

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
    this.feedback_gain = feedback_gain;
    this.swing_time = swing_time;
  }

}
