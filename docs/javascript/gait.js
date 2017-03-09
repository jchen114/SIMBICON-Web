class Positions {
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

class State {
  constructor(positions) {
    this.positions = positions;
  }

  get_torso_pos () {
    return this.positions.torso;
  }

  get_url_pos() {
    return this.positions.url;
  }

  get_ull_pos() {
    return this.positions.ull;
  }

  get_lrl_pos() {
    return this.positions.lrl;
  }

  get_lll_pos() {
    return this.positions.lll;
  }

  get_rf_pos() {
    return this.positions.rf;
  }

  get_lf_pos() {
    return this.positions.lf;
  }
}

class Gait {

  constructor(states, torque_gains, feedback_gain, swing_time) {
    this.states = states;
    this.torque_gains = torque_gains;
    this.feedback_gain = feedback_gain;
    this.swing_time = swing_time;
  }

}
