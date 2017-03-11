var ratio = 3.8;
var mass = 80.7;

class RagDoll {

  constructor(
    lengths,
    rotations,
    torso_position
  ) {
    /***************************************************************
    *
    *                           Torso
    *
    ****************************************************************/

      this.lengths = lengths;
      this.torso_position = torso_position;

      var torso_length = lengths[0];
      var torso_width = torso_length/ratio;
      this.torso_density = mass/(torso_length * torso_width) * 0.5;

      var torso_rot = rotations[0];

      this.torsoMatrix = new THREE.Matrix4().identity();
      this.torsoMatrix.makeTranslation(torso_position.x, torso_position.y, torso_position.z); // Sets the origin point of torso
      this.torsoMatrix.multiply(new THREE.Matrix4().makeRotationZ(torso_rot));

      var torso_pos = new THREE.Vector3();
      var torso_rot = new THREE.Quaternion();
      var torso_scale = new THREE.Vector3();

      this.torsoMatrix.decompose(torso_pos, torso_rot, torso_scale);

      torso_rot = new THREE.Euler().setFromQuaternion(torso_rot);

      this.torso_segment = new Segment(
        torso_pos,
        torso_rot.z,
        new THREE.Vector3(torso_width, torso_length, 0.1),
        'torso',
        new THREE.MeshLambertMaterial(),
        new THREE.Vector3(1,1,0),
        false,
        this.torso_density
      );
      this.torso_segment.mesh.castShadow = true;
      bodies.set(this.torso_segment.body, this.torso_segment);

      /***************************************************************
      *
      *                           Upper Legs
      *
      ****************************************************************/
      var upper_leg_length = lengths[1];
      var upper_leg_width = upper_leg_length/ratio;
      this.upper_leg_density = mass/(upper_leg_length * upper_leg_width) * 0.15;

      var url_rot = rotations[1];

      this.urlMatrix = this.torsoMatrix.clone();
      this.urlMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(torso_length/2), 0.2));
      this.urlMatrix.multiply(new THREE.Matrix4().makeRotationZ(url_rot));
      this.urlMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(upper_leg_length/2), 0));

      var url_pos = new THREE.Vector3();
      var url_rot = new THREE.Quaternion();
      var url_scale = new THREE.Vector3();

      this.urlMatrix.decompose(url_pos, url_rot, url_scale);

      url_rot = new THREE.Euler().setFromQuaternion(url_rot);

      this.upper_right_leg_segment = new Segment(
        url_pos,
        url_rot.z,
        new THREE.Vector3(upper_leg_width, upper_leg_length, 0.1),
        'upper right leg',
        new THREE.MeshLambertMaterial(),
        new THREE.Vector3(0, 1, 0),
        false,
        this.upper_leg_density
      );
      this.upper_right_leg_segment.mesh.castShadow = true;
      bodies.set(this.upper_right_leg_segment.body, this.upper_right_leg_segment);
      //
      var ull_rot = rotations[2];

      this.ullMatrix = this.torsoMatrix.clone();
      this.ullMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(torso_length/2), -0.2));
      this.ullMatrix.multiply(new THREE.Matrix4().makeRotationZ(ull_rot));
      this.ullMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(upper_leg_length/2), 0));

      var ull_pos = new THREE.Vector3();
      var ull_rot = new THREE.Quaternion();
      var ull_scale = new THREE.Vector3();

      this.ullMatrix.decompose(ull_pos, ull_rot, ull_scale);

      ull_rot = new THREE.Euler().setFromQuaternion(ull_rot);
      this.upper_left_leg_segment = new Segment(
        ull_pos,
        ull_rot.z,
        new THREE.Vector3(upper_leg_width, upper_leg_length, 0.1),
        'upper left leg',
        new THREE.MeshStandardMaterial(),
        new THREE.Vector3(0, 1, 0),
        false,
        this.upper_leg_density
      )
      this.upper_left_leg_segment.mesh.castShadow = true;
      this.upper_left_leg_segment.mesh.receiveShadow = true;
      bodies.set(this.upper_left_leg_segment.body, this.upper_left_leg_segment);

      /**************************************************************
      *                           Joints
      **************************************************************/
      this.Torso_URL_Joint = new Joint(
        -Math.PI/2,
        Math.PI/2,
        this.torso_segment,
        this.upper_right_leg_segment,
        new THREE.Vector3(0, -torso_length/2, 0.0),
        new THREE.Vector3(0, upper_leg_length/2, 0.0),
        'Torso_URL',
        new THREE.MeshLambertMaterial()
      )
      joints.set(this.Torso_URL_Joint.joint, this.Torso_URL_Joint);

      this.Torso_ULL_Joint = new Joint(
        -Math.PI/2,
        Math.PI/2,
        this.torso_segment,
        this.upper_left_leg_segment,
        new THREE.Vector3(0, -torso_length/2, 0.2),
        new THREE.Vector3(0, upper_leg_length/2, 0.0),
        'Torso_ULL',
        new THREE.MeshLambertMaterial()
      )
      joints.set(this.Torso_ULL_Joint.joint, this.Torso_ULL_Joint);

      // /***************************************************************
      // *
      // *                           Lower Legs
      // *
      // ****************************************************************/

      var lower_leg_length = lengths[2];
      var lower_leg_width = lower_leg_length/ratio;

      this.lower_leg_density = mass/(lower_leg_length * lower_leg_width) * 0.08

      var lrl_rot = rotations[3];

      this.lrlMatrix = this.urlMatrix.clone();
      this.lrlMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(upper_leg_length/2), 0.0));
      this.lrlMatrix.multiply(new THREE.Matrix4().makeRotationZ(lrl_rot));
      this.lrlMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(lower_leg_length/2), 0));

      var lrl_pos = new THREE.Vector3();
      var lrl_rot = new THREE.Quaternion();
      var lrl_scale = new THREE.Vector3();

      this.lrlMatrix.decompose(lrl_pos, lrl_rot, lrl_scale);

      lrl_rot = new THREE.Euler().setFromQuaternion(lrl_rot);

      this.lower_right_leg_segment = new Segment(
        lrl_pos,
        lrl_rot.z,
        new THREE.Vector3(lower_leg_width, lower_leg_length, 0.1),
        'lower right leg',
        new THREE.MeshLambertMaterial(),
        new THREE.Vector3(1, 0.2, 0.6),
        false,
        this.lower_leg_density
      )
      this.lower_right_leg_segment.mesh.castShadow = true;
      bodies.set(this.lower_right_leg_segment.body, this.lower_right_leg_segment);
      //
      var lll_rot = rotations[4];

      this.lllMatrix = this.ullMatrix.clone();
      this.lllMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(upper_leg_length/2), -0.0));
      this.lllMatrix.multiply(new THREE.Matrix4().makeRotationZ(lll_rot));
      this.lllMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(lower_leg_length/2), 0));

      var lll_pos = new THREE.Vector3();
      var lll_rot = new THREE.Quaternion();
      var lll_scale = new THREE.Vector3();

      this.lllMatrix.decompose(lll_pos, lll_rot, lll_scale);

      lll_rot = new THREE.Euler().setFromQuaternion(lll_rot);
      this.lower_left_leg_segment = new Segment(
        lll_pos,
        lll_rot.z,
        new THREE.Vector3(lower_leg_width, lower_leg_length, 0.1),
        'lower left leg',
        new THREE.MeshStandardMaterial(),
        new THREE.Vector3(1, 0.2, 0.6),
        false,
        this.lower_leg_density
      )
      this.lower_left_leg_segment.mesh.castShadow = true;
      this.lower_left_leg_segment.mesh.receiveShadow = true;
      bodies.set(this.lower_left_leg_segment.body, this.lower_left_leg_segment);

      /**************************************************************
      *                           Joints
      **************************************************************/
      this.URL_LRL_Joint = new Joint(
        -Math.PI/2,
        Math.PI/4,
        this.upper_right_leg_segment,
        this.lower_right_leg_segment,
        new THREE.Vector3(0, -upper_leg_length/2, 0.0),
        new THREE.Vector3(0, lower_leg_length/2, 0.0),
        'URL_LRL',
        new THREE.MeshLambertMaterial()
      )
      joints.set(this.URL_LRL_Joint.joint, this.URL_LRL_Joint);

      this.ULL_LLL_Joint = new Joint(
        -Math.PI/2,
        0,
        this.upper_left_leg_segment,
        this.lower_left_leg_segment,
        new THREE.Vector3(0, -upper_leg_length/2, 0.0),
        new THREE.Vector3(0, lower_leg_length/2, 0.0),
        'ULL_LLL',
        new THREE.MeshLambertMaterial()
      )
      joints.set(this.ULL_LLL_Joint.joint, this.ULL_LLL_Joint);

      // /***************************************************************
      // *
      // *                           Feet
      // *
      // ****************************************************************/

      var feet_length = lengths[3];
      var feet_width = lower_leg_length/5;

      this.feet_density = mass/(feet_length * feet_width) * 0.02

      var rf_rot = rotations[5];

      this.rfMatrix = this.lrlMatrix.clone();
      this.rfMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(lower_leg_length/2), 0.0));
      this.rfMatrix.multiply(new THREE.Matrix4().makeRotationZ(rf_rot));
      this.rfMatrix.multiply(new THREE.Matrix4().makeTranslation(feet_length/4, 0, 0));

      var rf_pos = new THREE.Vector3();
      var rf_rot = new THREE.Quaternion();
      var rf_scale = new THREE.Vector3();

      this.rfMatrix.decompose(rf_pos, rf_rot, rf_scale);

      rf_rot = new THREE.Euler().setFromQuaternion(rf_rot);

      this.right_foot_segment = new Segment(
        rf_pos,
        rf_rot.z,
        new THREE.Vector3(feet_length, feet_width, 0.1),
        'right foot',
        new THREE.MeshLambertMaterial(),
        new THREE.Vector3(1, 0.5, 0.0),
        false,
        this.feet_density
      )
      this.right_foot_segment.mesh.castShadow = true;
      bodies.set(this.right_foot_segment.body, this.right_foot_segment);
      // //
      var lf_rot = rotations[6];

      this.lfMatrix = this.lllMatrix.clone();
      this.lfMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(lower_leg_length/2), -0.0));
      this.lfMatrix.multiply(new THREE.Matrix4().makeRotationZ(lf_rot));
      this.lfMatrix.multiply(new THREE.Matrix4().makeTranslation(feet_length/4, 0, 0));

      var lf_pos = new THREE.Vector3();
      var lf_rot = new THREE.Quaternion();
      var lf_scale = new THREE.Vector3();

      this.lfMatrix.decompose(lf_pos, lf_rot, lf_scale);

      lf_rot = new THREE.Euler().setFromQuaternion(lf_rot);
      this.left_foot_segment = new Segment(
        lf_pos,
        lf_rot.z,
        new THREE.Vector3(feet_length, feet_width, 0.1),
        'left foot',
        new THREE.MeshStandardMaterial(),
        new THREE.Vector3(1, 0.5, 0.0),
        false,
        this.feet_density
      )
      this.left_foot_segment.mesh.castShadow = true;
      this.left_foot_segment.mesh.receiveShadow = true;
      bodies.set(this.left_foot_segment.body, this.left_foot_segment);

      // /**************************************************************
      // *                           Joints
      // **************************************************************/
      this.LRL_RF_Joint = new Joint(
        -Math.PI/2,
        0.0,
        this.lower_right_leg_segment,
        this.right_foot_segment,
        new THREE.Vector3(0, -lower_leg_length/2, 0.0),
        new THREE.Vector3(-feet_length/4, 0, 0.0),
        'LRL_RF',
        new THREE.MeshLambertMaterial()
      )
      joints.set(this.LRL_RF_Joint.joint, this.LRL_RF_Joint);

      this.LLL_LF_Joint = new Joint(
        -Math.PI/2,
        0.0,
        this.lower_left_leg_segment,
        this.left_foot_segment,
        new THREE.Vector3(0, -lower_leg_length/2, 0.0),
        new THREE.Vector3(-feet_length/4, 0, 0.0),
        'LLL_LF',
        new THREE.MeshLambertMaterial()
      )
      joints.set(this.LLL_LF_Joint.joint, this.LLL_LF_Joint);
  }

  Disable() {
    this.torso_segment.Disable();
    this.upper_right_leg_segment.Disable();
    this.upper_left_leg_segment.Disable();
    this.lower_right_leg_segment.Disable();
    this.lower_left_leg_segment.Disable();
    this.right_foot_segment.Disable();
    this.left_foot_segment.Disable();
  }

  Enable() {
    this.torso_segment.Enable();
    this.upper_right_leg_segment.Enable();
    this.upper_left_leg_segment.Enable();
    this.lower_right_leg_segment.Enable();
    this.lower_left_leg_segment.Enable();
    this.right_foot_segment.Enable();
    this.left_foot_segment.Enable();
  }

  Update(orientations) {
      // Get Positions and Rotations for each segment...

      /**********************************
      *            Torso
      ***********************************/

      var torso_length = this.lengths[0];

      var torso_rot = orientations[0];

      this.torsoMatrix = new THREE.Matrix4().identity();
      this.torsoMatrix.makeTranslation(this.torso_position.x, this.torso_position.y, this.torso_position.z);
      this.torsoMatrix.multiply(new THREE.Matrix4().makeRotationZ(torso_rot));

      var pos = new THREE.Vector3();
      var rot = new THREE.Quaternion();
      var scale = new THREE.Vector3();

      this.torsoMatrix.decompose(pos, rot, scale);

      rot = new THREE.Euler().setFromQuaternion(rot);

      this.torso_segment.UpdatePosition(pos, rot.z);

      /**********************************
      *            Upper Legs
      ***********************************/

      var ul_length = this.lengths[1];

      var url_rot = orientations[1];

      this.urlMatrix = this.torsoMatrix.clone();
      this.urlMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(torso_length/2), 0.2));
      this.urlMatrix.multiply(new THREE.Matrix4().makeRotationZ(url_rot));
      this.urlMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(ul_length/2), 0));

      var pos = new THREE.Vector3();
      var rot = new THREE.Quaternion();
      var scale = new THREE.Vector3();

      this.urlMatrix.decompose(pos, rot, scale);

      rot = new THREE.Euler().setFromQuaternion(rot);

      this.upper_right_leg_segment.UpdatePosition(pos, rot.z);

      var ull_rot = orientations[2];

      this.ullMatrix = this.torsoMatrix.clone();
      this.ullMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(torso_length/2), -0.2));
      this.ullMatrix.multiply(new THREE.Matrix4().makeRotationZ(ull_rot));
      this.ullMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(ul_length/2), 0));

      var pos = new THREE.Vector3();
      var rot = new THREE.Quaternion();
      var scale = new THREE.Vector3();

      this.ullMatrix.decompose(pos, rot, scale);

      rot = new THREE.Euler().setFromQuaternion(rot);

      this.upper_left_leg_segment.UpdatePosition(pos, rot.z);

      /**********************************
      *            Lower Legs
      ***********************************/

      var ll_length = this.lengths[2];

      var lrl_rot = orientations[3];
      
      this.lrlMatrix = this.urlMatrix.clone();
      this.lrlMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(ul_length/2), 0.0));
      this.lrlMatrix.multiply(new THREE.Matrix4().makeRotationZ(lrl_rot));
      this.lrlMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(ll_length/2), 0.0));

      var pos = new THREE.Vector3();
      var rot = new THREE.Quaternion();
      var scale = new THREE.Vector3();

      this.lrlMatrix.decompose(pos, rot, scale);

      rot = new THREE.Euler().setFromQuaternion(rot);

      this.lower_right_leg_segment.UpdatePosition(pos, rot.z);

      var lll_rot = orientations[4];

      this.lllMatrix = this.ullMatrix.clone();
      this.lllMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(ul_length/2), 0.0));
      this.lllMatrix.multiply(new THREE.Matrix4().makeRotationZ(lll_rot));
      this.lllMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(ll_length/2), 0));

      var pos = new THREE.Vector3();
      var rot = new THREE.Quaternion();
      var scale = new THREE.Vector3();

      this.lllMatrix.decompose(pos, rot, scale);

      rot = new THREE.Euler().setFromQuaternion(rot);

      this.lower_left_leg_segment.UpdatePosition(pos, rot.z);

      /**********************************
      *            Feet
      ***********************************/

      var feet_length = this.lengths[3];

      var rf_rot = orientations[5];
      
      this.rfMatrix = this.lrlMatrix.clone();
      this.rfMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(ll_length/2), 0.0));
      this.rfMatrix.multiply(new THREE.Matrix4().makeRotationZ(rf_rot));
      this.rfMatrix.multiply(new THREE.Matrix4().makeTranslation(feet_length/4, 0, 0));

      var pos = new THREE.Vector3();
      var rot = new THREE.Quaternion();
      var scale = new THREE.Vector3();

      this.rfMatrix.decompose(pos, rot, scale);

      rot = new THREE.Euler().setFromQuaternion(rot);

      this.right_foot_segment.UpdatePosition(pos, rot.z);

      var lf_rot = orientations[6];

      this.lfMatrix = this.lllMatrix.clone();
      this.lfMatrix.multiply(new THREE.Matrix4().makeTranslation(0, -(ll_length/2), 0.0));
      this.lfMatrix.multiply(new THREE.Matrix4().makeRotationZ(lf_rot));
      this.lfMatrix.multiply(new THREE.Matrix4().makeTranslation(feet_length/4, 0, 0));

      var pos = new THREE.Vector3();
      var rot = new THREE.Quaternion();
      var scale = new THREE.Vector3();

      this.lfMatrix.decompose(pos, rot, scale);

      rot = new THREE.Euler().setFromQuaternion(rot);

      this.left_foot_segment.UpdatePosition(pos, rot.z);
  }

  GetOrientations() {
    // Get these orientations in local angles..

    var orientations = [
      this.torso_segment.GetRotation(),
      this.upper_right_leg_segment.GetRotation() - this.torso_segment.GetRotation(),
      this.upper_left_leg_segment.GetRotation() - this.torso_segment.GetRotation(),
      this.upper_right_leg_segment.GetRotation() - this.lower_right_leg_segment.GetRotation(),
      this.upper_left_leg_segment.GetRotation() - this.lower_left_leg_segment.GetRotation(),
      this.lower_right_leg_segment.GetRotation() - this.right_foot_segment.GetRotation(),
      this.lower_left_leg_segment.GetRotation() - this.left_foot_segment.GetRotation()
    ];

    for (var i = 0; i < orientations.length; i ++) {
      orientations[i] *= Math.PI/180.0;
    }

    return orientations;

  }

  GetAngularVelocities() {
    return [
      this.torso_segment.GetAngularVelocity(),
      this.upper_right_leg_segment.GetAngularVelocity(),
      this.upper_left_leg_segment.GetAngularVelocity(),
      this.lower_right_leg_segment.GetAngularVelocity(),
      this.lower_left_leg_segment.GetAngularVelocity(),
      this.right_foot_segment.GetAngularVelocity(),
      this.left_foot_segment.GetAngularVelocity()
    ];
  }

  ApplyTorques(torques) {



  }

}
