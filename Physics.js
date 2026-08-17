//Code for a Plugin Node in "GSN Composer" a Node based Rendering Software
//Access to 2 Functions Init and Loop 

//Plugin Node init

//Code for a Plugin Node in "GSN Composer" a Node based Rendering Software
//Access to 2 Functions Init and Loop 

//Plugin Node init

this.onTick = function () {return true;};

InputKeyIdentifier = {

  FORWARD: "Forward",
  BACKWARD: "Backward",
  LEFT: "Left",
  RIGHT: "Right",
  BREAKING: "Upward",
  SPECIAL: "Special"

};

InputDataIdentifier = {

  DELTA_TIME: "Delta Time"

};

MeshIdentifier = {

  PLAYER: "Player",
  ENEMY: "Enemy"

};

MeshFieldIdentifier = {
  
  VERTICIES: " Mesh Verticies",
  POSITIONS_X: " Positions X",
  POSITIONS_Y: " Positions Y",
  POSITIONS_Z: " Positions Z",
  ROTATIONS_X: " Rotations X",
  ROTATIONS_Y: " Rotations Y",
  ROTATIONS_Z: " Rotations Z",
  SCALE: " Mesh Scale"

}

CameraDataIdentifier = {

  POSITION_X: "Camera Position X",
  POSITION_Y: "Camera Position Y",
  POSITION_Z: "Camera Position Z",
  TARGET_X: "Camera Target X",
  TARGET_Y: "Camera Target Y",
  TARGET_Z: "Camera Target Z"

};

EngineDataIdentifier = {

  STATE: "EngineState"
  
}

OutputData = function(identifier, datatype) {
  
  this.IDENTIFIER = identifier;
  this.DATATYPE = datatype;

}

EngineOutputData = {

  STATE: new OutputData("EngineState", "Text");
  
}

EngineStateType = {

  MENU: "Menu",
  LOADING: "Loading",
  GAME: "Game"

}

this.addInput("Float", InputDataIdentifier.DELTA_TIME);

this.addOutput("Text", EngineDataIdentifier.STATE);

this.addOutput("Float", CameraDataIdentifier.POSITION_X);
this.addOutput("Float", CameraDataIdentifier.POSITION_Y);
this.addOutput("Float", CameraDataIdentifier.POSITION_Z);

this.addOutput("Float", CameraDataIdentifier.TARGET_X);
this.addOutput("Float", CameraDataIdentifier.TARGET_Y);
this.addOutput("Float", CameraDataIdentifier.TARGET_Z);

const key_identifiers = Object.values(InputKeyIdentifier);

for (var i = 0; i < key_identifiers.length; i++) {

  const identifier = key_identifiers[i];

  this.addInput("Boolean", identifier);

}

const mesh_identifiers = Object.values(MeshIdentifier);

for (var i = 0; i < mesh_identifiers.length; i++) {

  const identifier = mesh_identifiers[i];

  this.addInput("SignalProcessing.Data.Signal", identifier + MeshFieldIdentifier.VERTICIES);

  this.addOutput("SignalProcessing.Data.Signal", identifier + MeshFieldIdentifier.POSITIONS_X);
  this.addOutput("SignalProcessing.Data.Signal", identifier + MeshFieldIdentifier.POSITIONS_Y);
  this.addOutput("SignalProcessing.Data.Signal", identifier + MeshFieldIdentifier.POSITIONS_Z);

  this.addOutput("SignalProcessing.Data.Signal", identifier + MeshFieldIdentifier.ROTATIONS_X);
  this.addOutput("SignalProcessing.Data.Signal", identifier + MeshFieldIdentifier.ROTATIONS_Y);
  this.addOutput("SignalProcessing.Data.Signal", identifier + MeshFieldIdentifier.ROTATIONS_Z);

  this.addOutput("SignalProcessing.Data.Signal", identifier + MeshFieldIdentifier.SCALE);

};


Util = function () { }

Util.radiansToDegrees = function (angle_in_radians) {

  return 180 * angle_in_radians / Math.PI;

}

Util.degreesToRadians = function (angle_in_degrees) {

  return Math.PI * angle_in_degrees / 180;

}

Util.interpolate_angle = function (alpha, a_old, a_new) {

  var difference = a_new - a_old;

  if (difference > Math.PI) {

    difference -= Math.PI * 2;

  } else if (difference < -Math.PI) {

    difference += Math.PI * 2;

  }

  return a_old + difference * alpha;

}

InputSystem = function (plugin_node_object) {

  this.plugin_node_object = plugin_node_object;

};


InputSystem.prototype._getInput = function (input_identifier) {

  return this.plugin_node_object.getInputDataByName(input_identifier);

}

InputSystem.prototype.isKeydown = function (input_key_identifier) {

  return this._getInput(input_key_identifier);

}

InputSystem.prototype.getData = function (input_data_identifier) {

  return this._getInput(input_data_identifier);

}

InputSystem.prototype.getMeshData = function (mesh_identifier) {

  return this._getInput(mesh_identifier + " Mesh Verticies");

}

OutputSystem = function (plugin_node_object) {

  this.plugin_node_object = plugin_node_object;

};

OutputSystem.prototype.set_camera = function (camera) {

  const output_node_camera_position_x = this.plugin_node_object.getOutputNodeByName(CameraDataIdentifier.POSITION_X);
  const output_node_camera_position_y = this.plugin_node_object.getOutputNodeByName(CameraDataIdentifier.POSITION_Y);
  const output_node_camera_position_z = this.plugin_node_object.getOutputNodeByName(CameraDataIdentifier.POSITION_Z);

  const output_node_camera_target_x = this.plugin_node_object.getOutputNodeByName(CameraDataIdentifier.TARGET_X);
  const output_node_camera_target_y = this.plugin_node_object.getOutputNodeByName(CameraDataIdentifier.TARGET_Y);
  const output_node_camera_target_z = this.plugin_node_object.getOutputNodeByName(CameraDataIdentifier.TARGET_Z);

  output_node_camera_position_x.data = camera.position.x;
  output_node_camera_position_y.data = camera.position.z;
  output_node_camera_position_z.data = camera.position.y;

  output_node_camera_target_x.data = camera.target.x;
  output_node_camera_target_y.data = camera.target.z;
  output_node_camera_target_z.data = camera.target.y;

  output_node_camera_position_x.update();
  output_node_camera_position_y.update();
  output_node_camera_position_z.update();

  output_node_camera_target_x.update();
  output_node_camera_target_y.update();
  output_node_camera_target_z.update();

}

OutputSystem.prototype.setEngineState = function (state) {

  const output_node_engine_state = this.plugin_node_object.getOutputNodeByName(EngineDataIdentifier.STATE);
  output_node_engine_state.data = state;

  output_node_engine_state.update();

}

OutputSystem.prototype.render_mesh = function (mesh_identifier, positions, rotations, scales) {

  const number_of_meshes = positions.length;

  const output_node_positions_x = this.plugin_node_object.getOutputNodeByName(mesh_identifier + MeshFieldIdentifier.POSITIONS_X);
  const output_node_positions_y = this.plugin_node_object.getOutputNodeByName(mesh_identifier + MeshFieldIdentifier.POSITIONS_Y);
  const output_node_positions_z = this.plugin_node_object.getOutputNodeByName(mesh_identifier + MeshFieldIdentifier.POSITIONS_Z);

  const output_node_rotations_x = this.plugin_node_object.getOutputNodeByName(mesh_identifier + MeshFieldIdentifier.ROTATIONS_X);
  const output_node_rotations_y = this.plugin_node_object.getOutputNodeByName(mesh_identifier + MeshFieldIdentifier.ROTATIONS_Y);
  const output_node_rotations_z = this.plugin_node_object.getOutputNodeByName(mesh_identifier + MeshFieldIdentifier.ROTATIONS_Z);

  const output_node_scale = this.plugin_node_object.getOutputNodeByName(mesh_identifier + MeshFieldIdentifier.SCALE);

  if (output_node_positions_x.data.length != number_of_meshes) {

    output_node_positions_x.data = new Float32Array(number_of_meshes);
    output_node_positions_y.data = new Float32Array(number_of_meshes);
    output_node_positions_z.data = new Float32Array(number_of_meshes);

    output_node_rotations_x.data = new Float32Array(number_of_meshes);
    output_node_rotations_y.data = new Float32Array(number_of_meshes);
    output_node_rotations_z.data = new Float32Array(number_of_meshes);

    output_node_scale.data = new Float32Array(number_of_meshes);

  }

  for (var i = 0; i < number_of_meshes; i++) {

    output_node_positions_x.data[i] = positions[i].x;
    output_node_positions_y.data[i] = positions[i].z;
    output_node_positions_z.data[i] = positions[i].y;

    output_node_rotations_x.data[i] = Util.radiansToDegrees(rotations[i].x);
    output_node_rotations_y.data[i] = Util.radiansToDegrees(rotations[i].z);
    output_node_rotations_z.data[i] = Util.radiansToDegrees(rotations[i].y);

    output_node_scale.data[i] = scales[i];

  }

  output_node_positions_x.update();
  output_node_positions_y.update();
  output_node_positions_z.update();

  output_node_rotations_x.update();
  output_node_rotations_y.update();
  output_node_rotations_z.update();

  output_node_scale.update();

}



Vector3 = function (x = 0, y = 0, z = 0) {

  this.x = x;
  this.y = y;
  this.z = z;

};

Vector3.prototype.copy = function () {

  return new Vector3(this.x, this.y, this.z);

};

Vector3.prototype.copyOf = function (other) {

  this.x = other.x;
  this.y = other.y;
  this.z = other.z;

  return this;

};

Vector3.prototype.add = function (other) {

  this.x += other.x;
  this.y += other.y;
  this.z += other.z;

  return this;

};

Vector3.prototype.addScaled = function (other, scale) {

  this.x += other.x * scale;
  this.y += other.y * scale;
  this.z += other.z * scale;

  return this;

};

Vector3.prototype.mult = function (s) {

  this.x *= s;
  this.y *= s;
  this.z *= s;

  return this;

};

Vector3.prototype.cross = function (other) {

  const x = this.y * other.z - this.z * other.y;
  const y = this.z * other.x - this.x * other.z;
  const z = this.x * other.y - this.y * other.x;

  this.x = x;
  this.y = y;
  this.z = z;

  return this;

};

Vector3.prototype.dot = function (other) {

  return this.x * other.x + this.y * other.y + this.z * other.z;

};

Vector3.prototype.mag = function () {

  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

};

Vector3.prototype.magSq = function () {

  return this.x * this.x + this.y * this.y + this.z * this.z;

};

Vector3.prototype.normalize = function () {

  return this.setMag(1);

};

Vector3.prototype.rotateAround = function (axis, angle) {

  const norm_axis = axis.copy().normalize();
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const dot = norm_axis.dot(this);
  const cross = norm_axis.copy().cross(this);
  this.mult(cos).add(cross.mult(sin)).add(norm_axis.mult(dot * (1 - cos)));

  return this;

};

Vector3.prototype.setMag = function (magnitude) {

  const length = this.mag();

  if (length === 0) {

    return this;

  }

  this.x = (this.x / length) * magnitude;
  this.y = (this.y / length) * magnitude;
  this.z = (this.z / length) * magnitude;

  return this;

};

Vector3.prototype.limit = function (lim) {

  const length = this.mag();

  if (length <= lim) {

    return this;

  }

  this.setMag(lim);

  return this;

};

Vector3.arrayFromFloatArray = function (float_array) {

  if (float_array.length % 3 != 0) return [];

  const vectors = [];
  for (var i = 0; i < float_array.length; i += 3) {
    const vector = new Vector3(float_array[i], float_array[i + 1], float_array[i + 2]);
    vectors.push(vector)
  };

  return vectors

};

Vector3.interpolate_vectors = function (alpha, old_v, new_v) {

  const difference = new_v.copy().addScaled(old_v, -1);
  return old_v.copy().addScaled(difference, alpha);

}

Vector3.interpolate_rotation_vectors = function (alpha, old_v, new_v) {
  return new Vector3(
    Util.interpolate_angle(alpha, old_v.x, new_v.x),
    Util.interpolate_angle(alpha, old_v.y, new_v.y),
    Util.interpolate_angle(alpha, old_v.z, new_v.z)
  );
}

Entity = function (type, physics_body, controller) {

  this.type = type;
  this.physics_body = physics_body;
  this.controller = controller;

};

PhysicsBody = function (collider, scale) {

  this.scale = scale;

  this.positionOld = new Vector3();
  this.acceleration = new Vector3();
  this.velocity = new Vector3();
  this.position = new Vector3();

  this.rotationOld = new Vector3();
  this.angular_acceleration = new Vector3();
  this.angular_velocity = new Vector3();
  this.rotation = new Vector3();

  this.collider = collider;

};

PhysicsBody.prototype.applyForce = function (force) {

  this.acceleration.add(force);

};

PhysicsBody.prototype.collide = function (other) {

  const other_aabb = other.collider.transformed_aabb;
  const self_aabb = this.collider.transformed_aabb;

  const overlapX = Math.min(self_aabb.max.x, other_aabb.max.x) - Math.max(self_aabb.min.x, other_aabb.min.x);
  const overlapY = Math.min(self_aabb.max.y, other_aabb.max.y) - Math.max(self_aabb.min.y, other_aabb.min.y);
  const overlapZ = Math.min(self_aabb.max.z, other_aabb.max.z) - Math.max(self_aabb.min.z, other_aabb.min.z);

  if (overlapX <= 0 || overlapY <= 0 || overlapZ <= 0) {

    return { has_collided: false };

  }

  const min_overlap = Math.min(overlapX, overlapY, overlapZ);

  var axis, sign;

  if (overlapX < overlapY && overlapX < overlapZ) {

    axis = new Vector3(1, 0, 0);
    sign = (self_aabb.min.x + self_aabb.max.x) < (other_aabb.min.x + other_aabb.max.x) ? -1 : 1;

  } else if (overlapY < overlapZ) {

    axis = new Vector3(0, 1, 0);
    sign = (self_aabb.min.y + self_aabb.max.y) < (other_aabb.min.y + other_aabb.max.y) ? -1 : 1;

  } else {

    axis = new Vector3(0, 0, 1);
    sign = (self_aabb.min.z + self_aabb.max.z) < (other_aabb.min.z + other_aabb.max.z) ? -1 : 1;

  }

  return {

    has_collided: true,
    correction_vector: axis.mult(min_overlap * sign)

  };

};

AABB = function (mesh_points) {

  this.min = new Vector3(Infinity, Infinity, Infinity);
  this.max = new Vector3(-Infinity, -Infinity, -Infinity);

  if (!mesh_points) return;

  for (var i = 0; i < mesh_points.length; i++) {

    const point = mesh_points[i];

    this.min.x = Math.min(this.min.x, point.x);
    this.min.y = Math.min(this.min.y, point.y);
    this.min.z = Math.min(this.min.z, point.z);

    this.max.x = Math.max(this.max.x, point.x);
    this.max.y = Math.max(this.max.y, point.y);
    this.max.z = Math.max(this.max.z, point.z);

  };

  this.half_width = (this.max.x - this.min.x) / 2;
  this.half_height = (this.max.y - this.min.y) / 2;
  this.half_depth = (this.max.z - this.min.z) / 2;

}

AABB.prototype.copy = function () {

  const c = new AABB();
  c.min = this.min.copy();
  c.max = this.max.copy();

  return c;

}

AABB.prototype.recalculate = function (mesh_points) {

  if (!mesh_points) return;

  this.min = new Vector3(Infinity, Infinity, Infinity);
  this.max = new Vector3(-Infinity, -Infinity, -Infinity);

  for (var i = 0; i < mesh_points.length; i++) {

    const point = mesh_points[i];

    this.min.x = Math.min(this.min.x, point.x);
    this.min.y = Math.min(this.min.y, point.y);
    this.min.z = Math.min(this.min.z, point.z);

    this.max.x = Math.max(this.max.x, point.x);
    this.max.y = Math.max(this.max.y, point.y);
    this.max.z = Math.max(this.max.z, point.z);

  }

  this.half_width = (this.max.x - this.min.x) / 2;
  this.half_height = (this.max.y - this.min.y) / 2;
  this.half_depth = (this.max.z - this.min.z) / 2;

  return this;

}

AABBCollider = function (aabb) {

  this.base_aabb = aabb;

  this.corners = [
    new Vector3(this.base_aabb.min.x, this.base_aabb.min.y, this.base_aabb.min.z),
    new Vector3(this.base_aabb.max.x, this.base_aabb.min.y, this.base_aabb.min.z),
    new Vector3(this.base_aabb.min.x, this.base_aabb.max.y, this.base_aabb.min.z),
    new Vector3(this.base_aabb.max.x, this.base_aabb.max.y, this.base_aabb.min.z),

    new Vector3(this.base_aabb.min.x, this.base_aabb.min.y, this.base_aabb.max.z),
    new Vector3(this.base_aabb.max.x, this.base_aabb.min.y, this.base_aabb.max.z),
    new Vector3(this.base_aabb.min.x, this.base_aabb.max.y, this.base_aabb.max.z),
    new Vector3(this.base_aabb.max.x, this.base_aabb.max.y, this.base_aabb.max.z)
  ];

  this.transformed_aabb = aabb.copy();

  this.half_width = this.transformed_aabb.half_width;
  this.half_depth = this.transformed_aabb.half_depth;
  this.half_height = this.transformed_aabb.half_height;

}

AABBCollider.prototype.applyTransform = function (position, rotation, scale) {

  const world_points = [];
  const X_AXIS = new Vector3(1, 0, 0);
  const Y_AXIS = new Vector3(0, 1, 0);
  const Z_AXIS = new Vector3(0, 0, 1);

  for (let i = 0; i < this.corners.length; i++) {

    let p = this.corners[i].copy();

    // Apply scale
    p.mult(scale);

    // Apply rotation
    p.rotateAround(X_AXIS, rotation.x);
    p.rotateAround(Y_AXIS, rotation.y);
    p.rotateAround(Z_AXIS, rotation.z);

    // Apply position
    p.add(position);

    world_points.push(p);

  }


  this.transformed_aabb.recalculate(world_points);

  this.half_width = this.transformed_aabb.half_width;
  this.half_depth = this.transformed_aabb.half_depth;
  this.half_height = this.transformed_aabb.half_height;

}


PhysicsBodySpatialGrid = function (resolution) {

  this.grid = [];

  this.insert = function (body) {
    this.grid.push(body)
  }

  this.clear = function () {

    this.grid = [];

  }

}

PhysicsSystem = function (collision_iterations, collision_grid_resolution) {

  this.collision_grid_resolution = collision_grid_resolution;
  this.collision_iterations = collision_iterations;
  this.grid = new PhysicsBodySpatialGrid(this.collision_grid_resolution);

  this.step = function (entities, dt) {

    this.grid.clear();

    for (var i = 0; i < entities.length; i++) {

      const body = entities[i].physics_body;

      body.positionOld = body.positionOld.copyOf(body.position);
      body.rotationOld = body.rotationOld.copyOf(body.rotation);

      body.velocity.addScaled(body.acceleration, dt);
      body.position.addScaled(body.velocity, dt);
      body.acceleration.mult(0);

      body.angular_velocity.addScaled(body.angular_acceleration, dt);
      body.rotation.addScaled(body.angular_velocity, dt);
      body.angular_acceleration.mult(0);

      body.collider.applyTransform(body.position, body.rotation, body.scale);

      this.grid.insert(body);

    }

    for(var i = 0; i < this.collision_iterations; i++) {
      this.resolveCollisions(entities);
    }

  }

  this.resolveCollisions = function (entities) {

    const tmp_vector = new Vector3();

    for (var i = 0; i < entities.length; i++) {

      const e1 = entities[i];

      for (var j = i + 1; j < entities.length; j++) {

        const e2 = entities[j];

        const b1 = e1.physics_body;
        const b2 = e2.physics_body;

        const collision = b1.collide(b2);

        if (collision.has_collided) {

          const norm_correction = collision.correction_vector.copy().normalize();

          b1.position.add(tmp_vector.copyOf(collision.correction_vector).mult(0.5));
          b2.position.add(tmp_vector.copyOf(collision.correction_vector).mult(-0.5));

          b1.collider.applyTransform(b1.position, b1.rotation, b1.scale);
          b2.collider.applyTransform(b2.position, b2.rotation, b2.scale);

          var b1_correction_velocity_mag = -b1.velocity.dot(tmp_vector.copyOf(norm_correction));
          var b2_correction_velocity_mag = -b2.velocity.dot(tmp_vector.copyOf(norm_correction));

          if (b1_correction_velocity_mag > 0) {

            b1.velocity.add(tmp_vector.copyOf(norm_correction).mult(b1_correction_velocity_mag));

          };

          if (b2_correction_velocity_mag < 0) {

            b2.velocity.add(tmp_vector.copyOf(norm_correction).mult(b2_correction_velocity_mag));

          };

          e1.controller.on_collision(e2);
          e2.controller.on_collision(e1);

        }

      };

    };


  }

};

PlayerController = function () {

  this.MAX_MOTOR_ACCELERATION_STRENGTH = 10;
  this.MAX_MOTOR_SPEED = 15;
  this.MAX_MOTOR_DRAG = this.MAX_MOTOR_ACCELERATION_STRENGTH / (this.MAX_MOTOR_SPEED * this.MAX_MOTOR_SPEED);

  this.updateBody = function (body) {

    if (Engine.Systems.Input.isKeydown(InputKeyIdentifier.LEFT) || Engine.Systems.Input.isKeydown(InputKeyIdentifier.RIGHT)) {

      const rotation_direction = new Vector3(0, Engine.Systems.Input.isKeydown(InputKeyIdentifier.LEFT) ? 1 : -1, 0);
      rotation_direction.mult(Engine.Systems.Input.isKeydown(InputKeyIdentifier.BACKWARD) ? -1 : 1);
      body.angular_velocity = rotation_direction;

    } else {

      body.angular_velocity.y = 0;

    }

    const current_speed_sq = body.velocity.magSq();
    const motor_drag = body.velocity.copy().setMag(-this.MAX_MOTOR_DRAG * current_speed_sq);
    motor_drag.y = 0;

    body.applyForce(motor_drag);

    if (Engine.Systems.Input.isKeydown(InputKeyIdentifier.FORWARD) || Engine.Systems.Input.isKeydown(InputKeyIdentifier.BACKWARD)) {

      const global_upward = new Vector3(0, 1, 0);
      const global_direction = new Vector3(0, 0, Engine.Systems.Input.isKeydown(InputKeyIdentifier.FORWARD) ? 1 : -1);
      const direction = global_direction.rotateAround(global_upward, -body.rotation.y);
      const acceleration = direction.setMag(this.MAX_MOTOR_ACCELERATION_STRENGTH);

      body.applyForce(acceleration);

    };

  }

  this.on_collision = function (other) {

  }

};

EnemyController = function (target_entity) {

  this.MAX_MOTOR_ACCELERATION_STRENGTH = 9;
  this.MAX_MOTOR_SPEED = 15;
  this.MOTOR_DRAG = this.MAX_MOTOR_ACCELERATION_STRENGTH / (this.MAX_MOTOR_SPEED * this.MAX_MOTOR_SPEED);

  this.updateBody = function (body) {

    const current_speed_sq = body.velocity.magSq();
    const drag = body.velocity.copy().setMag(-this.MOTOR_DRAG * current_speed_sq);
    drag.y = 0;

    body.applyForce(drag);

    const target = target_entity.physics_body.position.copy();
    const direction = target.addScaled(body.position, -1);
    const acceleration = direction.setMag(this.MAX_MOTOR_ACCELERATION_STRENGTH);

    body.applyForce(acceleration);


    body.rotation.y = Math.atan2(body.velocity.z, body.velocity.x);

  }

  this.on_collision = function(other) {

  }

};


ControllerSystem = function() {

  this.step = function (entities) {

    for (var i = 0; i < entities.length; i++) {

      entities[i].controller.updateBody(entities[i].physics_body);

    }

  }

};

SignalBusSystem = function() {

  this.signals = new Map();
  
  this.create_signal = function(signal_name) {

    this.signals.set(signal_name, []);

  }

  this.connect_to_signal = function(signal_name, callback) {

    if (!this.signals.has(signal_name)) {

      console.error("Signal '" + signal_name +"' could not be found");
      return;

    }

    this.signals.get(signal_name).push(callback);

  }

  this.emit_signal = function(signal_name) {

    if (!this.signals.has(signal_name)) {
      console.error("Signal '" + signal_name +"' could not be found");
      return;
    }

    const listner_callbacks = this.signals.get(signal_name);

    for(var i = 0 ; i < listner_callbacks.length; i++) {

      listner_callbacks[i](...args);

    }

  }

}

Camera = function (distance, angle_x) {

  this.position = new Vector3();
  this.target = new Vector3();

  this.distance = distance;
  this.angle_x = angle_x;
  this.angle_y = 0;

  this.offset = new Vector3();
  this.X_AXIS = new Vector3(1, 0, 0);
  this.Y_AXIS = new Vector3(0, 1, 0)

  this.update = function (target, angle_y) {

    this.target = this.target.copyOf(target);
    this.angle_y = angle_y;

    this.offset.mult(0);
    this.offset.z = -this.distance;
    this.offset.rotateAround(this.X_AXIS, this.angle_x);
    this.offset.rotateAround(this.Y_AXIS, -this.angle_y);

    this.position = this.position.copyOf(this.target);
    this.position.add(this.offset);

  }

  this.setDistance = function (distance) {

    this.distance = distance;

  }

  this.setAngleX = function (angle) {

    this.angle_x = angle;

  }

}

Timer = function (time_in_seconds, repeat, callback) {

  this.currentTime = 0;
  this.time_in_seconds = time_in_seconds;
  this.repeat = repeat;
  this.callback = callback;
  this.finished = false;

  this.tick = function (deltaTime) {

    if (this.finished) {

      return;

    }

    this.currentTime += deltaTime;

    if (this.currentTime >= this.time_in_seconds) {

      if (!this.repeat) {

        this.finished = true;

      } else {

        this.currentTime -= this.time_in_seconds;

      }

      if (this.callback) {

        this.callback();

      }

    }

  }

};

Engine = {

  Constants: {

    FIXED_TIME_STEP: 1 / 60,
    ENEMY_SPAWN_TIME: 0.5,
    MeshInfo: new Map()

  },

  State: {

    IsSetup: false,
    Accumulator: 0,
    Type: EngineStateType.LOADING

  },

  Systems: {

    Physics: null,
    Controller: null,
    Input: null,
    Output: null,
    SignalBus: null,
    Camera: null,
    Timers: []

  },

  Data: {

    Entities: []

  },

  Container: {

    TemporaryVector: new Vector3()

  }

};

Engine.setup = function (plugin_node_object) {

  Engine.Systems.Output = new OutputSystem(plugin_node_object);
  Engine.Systems.Physics = new PhysicsSystem(4, 10);
  Engine.Systems.Controller = new ControllerSystem();
  Engine.Systems.Input = new InputSystem(plugin_node_object);
  Engine.Systems.Camera = new Camera(10, Util.degreesToRadians(30));
  Engine.Systems.SignalBus = new SignalBusSystem();

}


Engine.load_meshes = function () {

  const mesh_identifiers = Object.values(MeshIdentifier);

  for (var i = 0; i < mesh_identifiers.length; i++) {

    const identifier = mesh_identifiers[i];
    const mesh_verticies = Engine.Systems.Input.getMeshData(identifier);
    const mesh_as_vectors = Vector3.arrayFromFloatArray(mesh_verticies);

    Engine.Constants.MeshInfo.set(identifier, { Verticies: mesh_as_vectors, AABB: new AABB(mesh_as_vectors) });

  }

}

Engine.render_entities = function (alpha) {

  const mesh_identifiers = Object.values(MeshIdentifier);

  for (var i = 0; i < mesh_identifiers.length; i++) {

    const identifier = mesh_identifiers[i];

    const entities_with_mesh = Engine.Data.Entities.filter(x => x.type === identifier);

    const array_size = Math.max(1, entities_with_mesh.length)

    const interpolated_positions = new Array(array_size);
    const interpolated_rotations = new Array(array_size);
    const scales = new Array(array_size);

    interpolated_positions[0] = new Vector3();
    interpolated_rotations[0] = new Vector3();
    scales[0] = 0;

    for (var j = 0; j < entities_with_mesh.length; j++) {

      const entity = entities_with_mesh[j];

      interpolated_positions[j] = Vector3.interpolate_vectors(alpha, entity.physics_body.positionOld, entity.physics_body.position);
      interpolated_rotations[j] = Vector3.interpolate_rotation_vectors(alpha, entity.physics_body.rotationOld, entity.physics_body.rotation);
      scales[j] = entity.physics_body.scale;

    }

    Engine.Systems.Output.render_mesh(identifier, interpolated_positions, interpolated_rotations, scales);

  }

}

Engine.loop = function() {

  Engine.Systems.Timers = Engine.Systems.Timers.filter(x => !x.finished);

  const deltaTime = Engine.Systems.Input.getData(InputDataIdentifier.DELTA_TIME) / 1000;

  for (var i = 0; i < Engine.Systems.Timers.length; i++) {

    Engine.Systems.Timers[i].tick(deltaTime);

  }

  Engine.State.Accumulator += deltaTime;

  while (Engine.State.Accumulator >= Engine.Constants.FIXED_TIME_STEP) {

    Engine.Systems.Controller.step(Engine.Data.Entities);
    Engine.Systems.Physics.step(Engine.Data.Entities, Engine.Constants.FIXED_TIME_STEP);

    Engine.State.Accumulator -= Engine.Constants.FIXED_TIME_STEP;

  }

  const alpha = Engine.State.Accumulator / Engine.Constants.FIXED_TIME_STEP;

  Engine.render_entities(alpha);
  
  
}

Engine.create_entity = function (mesh_identifier, controller, scale, position) {

  const collider = new AABBCollider(Engine.Constants.MeshInfo.get(mesh_identifier).AABB);
  const body = new PhysicsBody(collider, scale);
  body.position = position ? position : body.position;

  const entity = new Entity(mesh_identifier, body, controller);
  Engine.Data.Entities.push(entity);

  return entity;

}

//Plugin Node Run 

const plugin_node_object = this;

function update_active_camera(alpha) {

  const player_body = Engine.Data.Entities.filter(x => x.type === MeshIdentifier.PLAYER)[0].physics_body;
  const player_render_position = Vector3.interpolate_vectors(alpha, player_body.positionOld, player_body.position);
  const player_render_rotation_y = Vector3.interpolate_vectors(alpha, player_body.rotationOld, player_body.rotation).y;

  Engine.Systems.Camera.update(player_render_position, player_render_rotation_y);
  Engine.Systems.Output.set_camera(Engine.Systems.Camera);

}

function setup_scene() {

  const player = Engine.create_entity(MeshIdentifier.PLAYER, new PlayerController(), 0.5);

  for (var i = 0; i < 100; i++) {

    Engine.create_entity(MeshIdentifier.ENEMY, new EnemyController(player), 0.5, new Vector3((Math.random() - 0.5) * 500, 0, (Math.random() - 0.5) * 500));

  }

  const enemy_spawn_timer = new Timer(Engine.Constants.ENEMY_SPAWN_TIME, true, () => Engine.create_entity(MeshIdentifier.ENEMY, new EnemyController(player), 0.5, new Vector3((Math.random() - 0.5) * 500, 0, (Math.random() - 0.5) * 500)));
  Engine.Systems.Timers.push(enemy_spawn_timer)

  Engine.State.IsSetup = true;

}

function game_loop() {

  Engine.loop();
  const alpha = Engine.State.Accumulator / Engine.Constants.FIXED_TIME_STEP;
  update_active_camera(alpha);
  
}

if (!Engine.State.IsSetup) {

  Engine.setup(plugin_node_object);
  Engine.Systems.Output.setEngineState(Engine.State.Type);
  Engine.State.Type = EngineStateType.LOADING

}

if (Engine.State.Type === EngineStateType.LOADING) {

  Engine.load_meshes();
  
  setup_scene();
  Engine.State.Type = EngineStateType.GAME

}

if (Engine.State.Type === EngineStateType.GAME) {

  game_loop();

}

Engine.Systems.Output.setEngineState(Engine.State.Type);