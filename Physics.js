//Code for a Plugin Node in "GSN Composer" a Node based Rendering Software
//Access to 2 Functions Init and Loop 

//Plugin Node init

//Code for a Plugin Node in "GSN Composer" a Node based Rendering Software
//Access to 2 Functions Init and Loop 

//Plugin Node init

this.onTick = function () {return true};

DEBUG = false;

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

HeightMapIdentifier = {
  WORLD: "World"
};

HeightMapFieldIdentifier = {

  SIZE: " Size", 
  HEIGHTS: " Heights",
  HEIGHT_RESOLUTION: " Height Resolution",
  MINIMUM_HEIGHT: " Minimum Height",
  MAXIMUM_HEIGHT: " Maximum Height",
  CENTER_X: " Center X",
  CENTER_Y: " Center Y"

}

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
  
};

EngineStateType = {

  MENU: "Menu",
  LOADING: "Loading",
  GAME: "Game"

};

ColliderType = {

  AABB: "AABB_COLLIDER_IDENTIFIER",
  CONVEX: "CONVEX_SHAPE_COLLIDER_IDENTIFIER",
  COMBINED: "COMBINED_COLLIDER_IDENTIFIER"

};

this.addInput("Float", InputDataIdentifier.DELTA_TIME);

this.addOutput("Text", EngineDataIdentifier.STATE);

this.addOutput("Float", CameraDataIdentifier.POSITION_X);
this.addOutput("Float", CameraDataIdentifier.POSITION_Y);
this.addOutput("Float", CameraDataIdentifier.POSITION_Z);

this.addOutput("Float", CameraDataIdentifier.TARGET_X);
this.addOutput("Float", CameraDataIdentifier.TARGET_Y);
this.addOutput("Float", CameraDataIdentifier.TARGET_Z);

const key_identifiers = Object.values(InputKeyIdentifier);

for (let i = 0; i < key_identifiers.length; i++) {

  const identifier = key_identifiers[i];

  this.addInput("Boolean", identifier);

}

const mesh_identifiers = Object.values(MeshIdentifier);

for (let i = 0; i < mesh_identifiers.length; i++) {

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

const heightmap_identifiers = Object.values(HeightMapIdentifier);

for (const identifier of heightmap_identifiers) {

  this.addOutput("SignalProcessing.Data.Signal", identifier + HeightMapFieldIdentifier.HEIGHTS);

  this.addOutput("Integer", identifier + HeightMapFieldIdentifier.SIZE);
  this.addOutput("Integer", identifier + HeightMapFieldIdentifier.HEIGHT_RESOLUTION);

  this.addOutput("Float", identifier + HeightMapFieldIdentifier.MAXIMUM_HEIGHT);
  this.addOutput("Float", identifier + HeightMapFieldIdentifier.MINIMUM_HEIGHT);


  this.addOutput("Float", identifier + HeightMapFieldIdentifier.CENTER_X);
  this.addOutput("Float", identifier + HeightMapFieldIdentifier.CENTER_Y);

}

Util = function () { }

Util.radiansToDegrees = function (angle_in_radians) {

  return 180 * angle_in_radians / Math.PI;

}

Util.degreesToRadians = function (angle_in_degrees) {

  return Math.PI * angle_in_degrees / 180;

}

Util.interpolate_angle = function (alpha, a_old, a_new) {

  let difference = a_new - a_old;

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

  return this._getInput(mesh_identifier + MeshFieldIdentifier.VERTICIES);

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

OutputSystem.prototype.render_heightmap = function (heightmap) {

  const id = heightmap.identifier;

  const field_node = (field) => this.plugin_node_object.getOutputNodeByName(id + field);
 
  const output_node_heights = field_node(HeightMapFieldIdentifier.HEIGHTS);
 
  const output_node_size = field_node(HeightMapFieldIdentifier.SIZE);
  const output_node_height_resolution = field_node(HeightMapFieldIdentifier.HEIGHT_RESOLUTION);

  const output_node_max_height = field_node(HeightMapFieldIdentifier.MAXIMUM_HEIGHT);
  const output_node_min_height = field_node(HeightMapFieldIdentifier.MINIMUM_HEIGHT);
 
  const output_node_center_x = field_node(HeightMapFieldIdentifier.CENTER_X);
  const output_node_center_y = field_node(HeightMapFieldIdentifier.CENTER_Y);
 
  output_node_heights.data = heightmap.mesh_heights;
 
  output_node_size.data = heightmap.size;
  output_node_height_resolution.data = heightmap.mesh_resolution;
 
  output_node_max_height.data = heightmap.mesh_max_height / heightmap.size;
  output_node_min_height.data = heightmap.mesh_min_height / heightmap.size;

  output_node_center_x.data = heightmap.current_center.x;
  output_node_center_y.data = heightmap.current_center.z;
 
  output_node_heights.update();
 
  output_node_size.update();
  output_node_height_resolution.update();
 
  output_node_max_height.update();
  output_node_min_height.update();
 
  output_node_center_x.update();
  output_node_center_y.update();
  
};

OutputSystem.prototype.render_meshes = function (mesh_identifier, positions, rotations, scales) {

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

  for (let i = 0; i < number_of_meshes; i++) {

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

Vector3.Constants = {

  X_AXIS: Object.freeze(new Vector3(1, 0, 0)),
  Y_AXIS: Object.freeze(new Vector3(0, 1, 0)),
  Z_AXIS: Object.freeze(new Vector3(0, 0, 1))

};

Vector3.prototype.copy = function () {

  return new Vector3(this.x, this.y, this.z);

};

Vector3.prototype.equals = function (other) {

  return this.x == other.x && this.y == other.y && this.z == other.z;

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

Vector3.prototype.sub = function (other) {

  this.x -= other.x;
  this.y -= other.y;
  this.z -= other.z;

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

  return new Vector3(x, y, z);

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
  for (let i = 0, len = float_array.length; i < len; i += 3) {
    const vector = new Vector3(float_array[i], float_array[i + 2], float_array[i + 1]);
    vectors.push(vector)
  };

  return vectors

};

Vector3.dedupe_vector_array = function (vector_array, precision = 3) {

  const seen_keys = new Set();
  const unique_vectors = [];

  for (const vector of vector_array) {

    const key = vector.x.toFixed(precision) + "," + vector.y.toFixed(precision) + "," + vector.z.toFixed(precision);

    if (!seen_keys.has(key)) {
      seen_keys.add(key);
      unique_vectors.push(vector);
    }

  }

  return unique_vectors;
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

};

CollisionResult = function(has_collided, correction_vector, collision_point_a, collision_point_b) {

    this.has_collided = has_collided;
    this.correction_vector = correction_vector;

};

GJK = new function(){};

GJK._furthest_point_in_direction = function(convex_shape_collider, direction) {

  const vertice_count = convex_shape_collider.verticies.length;

  const local_direction = direction.copy()
    .rotateAround(Vector3.Constants.X_AXIS, -convex_shape_collider.rotation.x)
    .rotateAround(Vector3.Constants.Y_AXIS, -convex_shape_collider.rotation.y)
    .rotateAround(Vector3.Constants.Z_AXIS, -convex_shape_collider.rotation.z);

  let max_point = convex_shape_collider.verticies[0];
  let max_value = local_direction.dot(convex_shape_collider.verticies[0]);

  for (let i = 1; i < vertice_count; i++)  {

    const point = convex_shape_collider.verticies[i];
    const value = local_direction.dot(point);

    if(value > max_value) {

      max_point = point;
      max_value = value;

    }

  }

  const world_point = max_point.copy()
  .mult(convex_shape_collider.scale)
  .rotateAround(Vector3.Constants.Z_AXIS, convex_shape_collider.rotation.z)
  .rotateAround(Vector3.Constants.Y_AXIS, convex_shape_collider.rotation.y)
  .rotateAround(Vector3.Constants.X_AXIS, convex_shape_collider.rotation.x)
  .add(convex_shape_collider.position);

  return world_point;

};

GJK._minkowski_difference = function(convex_shape_collider_a, convex_shape_collider_b, direction) {

  const support_a = this._furthest_point_in_direction(convex_shape_collider_a, direction);
  const support_b = this._furthest_point_in_direction(convex_shape_collider_b, direction.copy().mult(-1));

  return support_a.sub(support_b);

};

GJK.Simplex = function() {

  this.points = new Array(4);
  this.size = 0;

  this.push_front = function(point) {

    this.points[3] = this.points[2];
    this.points[2] = this.points[1];
    this.points[1] = this.points[0];
    this.points[0] = point;
    
    this.size = Math.min(this.size + 1, 4);

  }

}

GJK.is_same_direciton = function(v1, v2) {

  return v1.dot(v2) > 0;
  
}

GJK._any_perpendicular = function (v) {

  const axis = Math.abs(v.x) < 0.57 ? new Vector3(1, 0, 0) : new Vector3(0, 1, 0);

  return v.cross(axis);

};

GJK.line = function(simplex, direction)
{

	const a = simplex.points[0];
	const b = simplex.points[1];

	const ab = b.copy().sub(a);
	const ao = a.copy().mult(-1);
 
	if (this.is_same_direciton(ab, ao)) {

		const d = ab.cross(ao).cross(ab);

		direction.copyOf(d.magSq() < 1e-12 ? this._any_perpendicular(ab) : d);

	} else {

		simplex.points = [a];
    simplex.size = 1;
		direction.copyOf(ao);

	}

	return false;

}

GJK.triangle = function (simplex, direction)
{

	const a = simplex.points[0];
	const b = simplex.points[1];
	const c = simplex.points[2];

	const ab = b.copy().sub(a);
	const ac = c.copy().sub(a);
	const ao = a.copy().mult(-1);
 
	const abc = ab.cross(ac);
 
	if (this.is_same_direciton(abc.cross(ac), ao)) {

		if (this.is_same_direciton(ac, ao)) {

			simplex.points = [a, c];
      simplex.size = 2;
			direction.copyOf(ac.cross(ao).cross(ac));

		}

		else {

      simplex.points = [a, b];
      simplex.size = 2;

			return this.line(simplex, direction);

		}

	}
 
	else {

		if (this.is_same_direciton(ab.cross(abc), ao)) {

      simplex.points = [a, b];
      simplex.size = 2;

			return this.line(simplex, direction);

		}

		else {

			if (this.is_same_direciton(abc, ao)) {

				direction.copyOf(abc);

			}

			else {

        simplex.points = [a, c, b];
        simplex.size = 3;
				direction.copyOf(abc.mult(-1));

			}

		}
	}

	return false;
}

GJK.tetrahedron = function(simplex, direction)
{
	const a = simplex.points[0];
	const b = simplex.points[1];
	const c = simplex.points[2];
	const d = simplex.points[3];

	const ab = b.copy().sub(a);
	const ac = c.copy().sub(a);
	const ad = d.copy().sub(a);
	const ao = a.copy().mult(-1);
 
	const abc = ab.cross(ac);
	const acd = ac.cross(ad);
	const adb = ad.cross(ab);
 
	if (this.is_same_direciton(abc, ao)) {

    simplex.points = [a, b, c];
    simplex.size = 3;

		return this.triangle(simplex, direction);

	}
		
	if (this.is_same_direciton(acd, ao)) {

    simplex.points = [a, c, d];
    simplex.size = 3;

		return this.triangle(simplex, direction);

	}
 
	if (this.is_same_direciton(adb, ao)) {

    simplex.points = [a, d, b];
    simplex.size = 3;

		return this.triangle(simplex, direction);

	}
 
	return true;

}


GJK.next_simplex = function(simplex, direction) {

  switch (simplex.size) {
    case 2:
      return this.line(simplex, direction);
      break;
    case 3:
      return this.triangle(simplex, direction);
      break;
    case 4:
      return this.tetrahedron(simplex, direction);
      break;
  }

}

GJK.build_simplex = function(convex_shape_collider_a, convex_shape_collider_b, max_iterations) {
  
  let support = this._minkowski_difference(convex_shape_collider_a, convex_shape_collider_b, new Vector3(1, 0.1, 0.1));
  const simplex = new GJK.Simplex();
  simplex.push_front(support);

  let direction = support.copy().mult(-1);
  let iterations = 0;

  while(iterations < max_iterations) {

    support = this._minkowski_difference(convex_shape_collider_a, convex_shape_collider_b, direction);

    if(support.dot(direction) <= 0) {
      return null;
    }

    simplex.push_front(support);

    if(this.next_simplex(simplex, direction)) {
      
      return simplex;

    }

    iterations += 1;

  }

  return null;

};

EPA = new function () {};

EPA.is_valid_simplex_for_expansion = function(simplex) {

  return simplex && simplex.size == 4;

}

EPA.get_verticies_from_simplex = function(simplex) {

  const vertices = [];
 
  for (let i = 0; i < 4; i++) {

    vertices.push(simplex.points[i].copy());

  }

  return vertices;

}

EPA.get_point_inside_of_simplex = function(simplex) {

  const interior = new Vector3();
 
  for (let i = 0; i < 4; i++) {

    interior.add(simplex.points[i]);

  }
 
  interior.mult(0.25);

  return interior;

}

EPA.PolytopeFace = function(vertex_a, vertex_b, vertex_c, orientation_vertex) {

  this.a = vertex_a.copy();
  this.b = vertex_b.copy();
  this.c = vertex_c.copy();

  this.distance_to_origin = Infinity;

  const unoriented_normal = this.b.copy().sub(this.a).cross(this.c.copy().sub(this.a));
  const normal_length = unoriented_normal.mag();
  
  this.is_degenerate = normal_length < 1e-9;

  if(this.is_degenerate) return;
  
  unoriented_normal.mult(1 / normal_length);

  const needs_flip = unoriented_normal.dot(this.a.copy().sub(orientation_vertex)) < 0;

  if (needs_flip) {

    const tmp = this.b;
    this.b = this.c;
    this.c = tmp;

  }

  this.normal = unoriented_normal.mult(needs_flip? -1 : 1);
  this.distance_to_origin = Math.max(0, this.normal.dot(this.a));

}

EPA.get_simplex_faces = function(simplex, interior) {

  const vertex_a = simplex.points[0];
  const vertex_b = simplex.points[1];
  const vertex_c = simplex.points[2];
  const vertex_d = simplex.points[3];

  return [
    new EPA.PolytopeFace(vertex_a, vertex_b, vertex_c, interior),
    new EPA.PolytopeFace(vertex_a, vertex_d, vertex_b, interior),
    new EPA.PolytopeFace(vertex_a, vertex_c, vertex_d, interior),
    new EPA.PolytopeFace(vertex_b, vertex_d, vertex_c, interior)
  ];

}

EPA._add_edge_or_remove_if_duplicate = function(edges, vertex_a, vertex_b) {

  for (let i = 0; i < edges.length; i++) {

      const edge_vertex_a = edges[i][0];
      const edge_vertex_b = edges[i][1];

      if (edge_vertex_a.equals(vertex_b) && edge_vertex_b.equals(vertex_a)) {

        edges.splice(i, 1);
        return;

      }
 
    }
 
    edges.push([vertex_a, vertex_b]);

}

EPA.get_boundary_of_faces = function(faces) {

  const boundary = [];

  for (let i = 0; i < faces.length; i++) {
 
    const face = faces[i];
 
    EPA._add_edge_or_remove_if_duplicate(boundary, face.a, face.b);
    EPA._add_edge_or_remove_if_duplicate(boundary, face.b, face.c);
    EPA._add_edge_or_remove_if_duplicate(boundary, face.c, face.a);
 
  }

  return boundary;

}

EPA.build_faces_from_boundary_edges_and_vertex = function(boundary, vertex, polytope_interior) {

    const faces = [];

    for (let i = 0; i < boundary.length; i++) {
 
      const edge = boundary[i];
      const face = new EPA.PolytopeFace(edge[0], edge[1], vertex, polytope_interior);
 
      if (face.is_degenerate) return null;
      
      faces.push(face);
 
    }

    return faces;

}

EPA.Polytope = function(simplex) {

  this.vertices = EPA.get_verticies_from_simplex(simplex);
  this.interior = EPA.get_point_inside_of_simplex(simplex);
  this.faces = EPA.get_simplex_faces(simplex, this.interior);
  this.is_degenerate = this.faces.some((face) => face.is_degenerate);

  this.find_closest_face_to_origin = function() {

    if(this.faces.length == 0) return null;

    let closest = null;
 
    for (let i = 0; i < this.faces.length; i++) {
 
      const face = this.faces[i];
 
      if (face.is_degenerate) continue;
      
      if (!closest || face.distance_to_origin < closest.distance_to_origin) {
        closest = face;
      }
 
    }
 
    return closest;

  }

  this.has_vertex = function(vertex) {

    return this.vertices.some((existing) => existing.copy().sub(vertex).magSq() < 1e-6);

  }

  this.add_vertex = function(vertex) {

    const visible_faces = [];
    const kept_faces = [];
 
    for (let i = 0; i < this.faces.length; i++) {
 
      const face = this.faces[i];
      const is_face_visible = face.normal.dot(vertex.copy().sub(face.a)) > 1e-7;
 
      if (is_face_visible) {

        visible_faces.push(face);

      } else {

        kept_faces.push(face);

      }
 
    }
 
    if (visible_faces.length === 0) return false;

    const visible_region_boundary_edges = EPA.get_boundary_of_faces(visible_faces);
    const new_faces = EPA.build_faces_from_boundary_edges_and_vertex(visible_region_boundary_edges, vertex, this.interior);
    
    if(!new_faces) return false;

    this.vertices.push(vertex);
    this.faces = kept_faces.concat(new_faces);

    return true;
 
  }


}

EPA.result_from_polytope_face = function(polytopeface) {

  return new CollisionResult(true, polytopeface.normal.copy().mult(-polytopeface.distance_to_origin));

}


EPA.get_collision = function(simplex, convex_shape_collider_a, convex_shape_collider_b, max_iterations) {
 
  if (!EPA.is_valid_simplex_for_expansion(simplex)) return new CollisionResult(false);

  const polytope = new EPA.Polytope(simplex);

  if (polytope.is_degenerate) return new CollisionResult(true);


  for (let iteration = 0; iteration < max_iterations; iteration++) {
 
    const closest_polytope_face = polytope.find_closest_face_to_origin();
 
    if (!closest_polytope_face) return new CollisionResult(true);

    const furthest_point_along_normal = GJK._minkowski_difference(convex_shape_collider_a, convex_shape_collider_b, closest_polytope_face.normal);
 
    const point_distance = furthest_point_along_normal.dot(closest_polytope_face.normal);

    if (point_distance - closest_polytope_face.distance_to_origin < 1e-3 || polytope.has_vertex(furthest_point_along_normal)) {

      return EPA.result_from_polytope_face(closest_polytope_face);

    }
 
    if(!polytope.add_vertex(furthest_point_along_normal)) {

      return EPA.result_from_polytope_face(closest_polytope_face);

    }

  }

  const best_face = polytope.find_closest_face_to_origin();
 
  if (!best_face) {

    return new CollisionResult(true);

  }
 
  return EPA.result_from_polytope_face(best_face);
 
};


PhysicsBody = function (collider, scale, mass) {

  this.scale = scale;

  this.mass = mass;

  this.last_position = new Vector3();
  this.acceleration = new Vector3();
  this.velocity = new Vector3();
  this.position = new Vector3();

  this.last_rotation = new Vector3();
  this.angular_acceleration = new Vector3();
  this.angular_velocity = new Vector3();
  this.rotation = new Vector3();

  this.collider = collider;

};

PhysicsBody.prototype.applyForce = function (force) {

  this.acceleration.addScaled(force, 1 / this.mass);

};

PhysicsBody.prototype.collide = function (other) {

  return this.collider.collide(other.collider);

};

AABB = function (mesh_points) {

  this.min = new Vector3(Infinity, Infinity, Infinity);
  this.max = new Vector3(-Infinity, -Infinity, -Infinity);

  if (!mesh_points) return;

  for (let i = 0; i < mesh_points.length; i++) {

    const point = mesh_points[i];

    this.min.x = Math.min(this.min.x, point.x);
    this.min.y = Math.min(this.min.y, point.y);
    this.min.z = Math.min(this.min.z, point.z);

    this.max.x = Math.max(this.max.x, point.x);
    this.max.y = Math.max(this.max.y, point.y);
    this.max.z = Math.max(this.max.z, point.z);

  };

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

  for (let i = 0; i < mesh_points.length; i++) {

    const point = mesh_points[i];

    this.min.x = Math.min(this.min.x, point.x);
    this.min.y = Math.min(this.min.y, point.y);
    this.min.z = Math.min(this.min.z, point.z);

    this.max.x = Math.max(this.max.x, point.x);
    this.max.y = Math.max(this.max.y, point.y);
    this.max.z = Math.max(this.max.z, point.z);

  }

  return this;

}

AABBCollider = function (aabb) {
  this.type = ColliderType.AABB;
  this.base_aabb = aabb;

  this.corner_points = [
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

}

AABBCollider.prototype.applyTransform = function (position, rotation, scale) {

  const transformed_corners = [];

  for (const corner of this.corner_points) {

    const transformed_corner = corner.copy()
      .mult(scale)
      .rotateAround(Vector3.Constants.Z_AXIS, rotation.z)
      .rotateAround(Vector3.Constants.Y_AXIS, rotation.y)
      .rotateAround(Vector3.Constants.X_AXIS, rotation.x)
      .add(position);

    transformed_corners.push(transformed_corner);

  };

  this.transformed_aabb.recalculate(transformed_corners);

}

AABBCollider.prototype.collide = function(other) {

  const other_aabb = other.transformed_aabb;
  const self_aabb = this.transformed_aabb;

  const overlapX = Math.min(self_aabb.max.x, other_aabb.max.x) - Math.max(self_aabb.min.x, other_aabb.min.x);
  const overlapY = Math.min(self_aabb.max.y, other_aabb.max.y) - Math.max(self_aabb.min.y, other_aabb.min.y);
  const overlapZ = Math.min(self_aabb.max.z, other_aabb.max.z) - Math.max(self_aabb.min.z, other_aabb.min.z);

  if (overlapX <= 0 || overlapY <= 0 || overlapZ <= 0) {

    return new CollisionResult(false);

  }

  const min_overlap = Math.min(overlapX, overlapY, overlapZ);

  let axis, sign;

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

   return new CollisionResult(true, axis.mult(min_overlap * sign));

}

ConvexShapeCollider = function(verticies) {

  this.type = ColliderType.CONVEX;
  this.verticies = verticies;

  this.position = new Vector3();
  this.rotation = new Vector3();
  this.scale = 0;

}

ConvexShapeCollider.prototype.applyTransform = function(position, rotation, scale) {

  this.position = position;
  this.rotation = rotation;
  this.scale = scale;
  
}

ConvexShapeCollider.prototype.collide = function(other) {

  const simplex = GJK.build_simplex(this, other, 128);
  const collision = EPA.get_collision(simplex, this, other, 128);

  return collision;
 
}

CombinedCollider = function(mesh_info) {

  this.type = ColliderType.COMBINED;

  this.aabb_collider = new AABBCollider(mesh_info.AABB);
  this.convex_shape_collider = new ConvexShapeCollider(mesh_info.Verticies);

}

CombinedCollider.prototype.applyTransform = function(position, rotation, scale) {

  this.aabb_collider.applyTransform(position, rotation, scale);
  this.convex_shape_collider.applyTransform(position, rotation, scale);
  
}

CombinedCollider.prototype.collide = function(other) {

  const aabb_collision = this.aabb_collider.collide(other.aabb_collider);

  if(aabb_collision.has_collided) {

    const convex_collision = this.convex_shape_collider.collide(other.convex_shape_collider);

    return convex_collision.has_collided && !convex_collision.correction_vector? aabb_collision : convex_collision;

  }

  return new CollisionResult(false);

}

PerlinNoise2D = function (seed = 12345, detail = 1) {

  let state = (Math.floor(seed) ^ 0x9E3779B9) >>> 0;

  const random = function () {

    state = (state + 0x6D2B79F5) >>> 0;

    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;

  };


  const base = new Uint8Array(256);

  for (let i = 0; i < 256; i++) base[i] = i;

  for (let i = 255; i > 0; i--) {

    const j = Math.floor(random() * (i + 1));
    const tmp = base[i];
    base[i] = base[j];
    base[j] = tmp;

  }

  const perm = new Uint8Array(512);

  for (let i = 0; i < 512; i++) perm[i] = base[i & 255];

  const S = Math.SQRT1_2;
  const GRAD_X = [1, -1, 0, 0, S, -S, S, -S];
  const GRAD_Y = [0, 0, 1, -1, S, S, -S, -S];

  const fade = function (t) {

    return t * t * t * (t * (t * 6 - 15) + 10);

  };

  const lerp = function (a, b, t) {

    return a + (b - a) * t;

  };

  const grad = function (hash, x, y) {

    const index = hash & 7;

    return GRAD_X[index] * x + GRAD_Y[index] * y;

  };

  this.sample_raw = function (a, b) {

    const x = a * detail;
    const y = b * detail;

    const x_floor = Math.floor(x);
    const y_floor = Math.floor(y);

    const xf = x - x_floor;
    const yf = y - y_floor;

    const xi = x_floor & 255;
    const yi = y_floor & 255;

    const u = fade(xf);
    const v = fade(yf);

    const aa = perm[perm[xi] + yi];
    const ab = perm[perm[xi] + yi + 1];
    const ba = perm[perm[xi + 1] + yi];
    const bb = perm[perm[xi + 1] + yi + 1];

    const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
    const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);

    return lerp(x1, x2, v) / 0.7071;

  };

  this.sample = function (a, b) {

    const value = this.sample_raw(a, b) * 0.5 + 0.5;

    return Math.min(1, Math.max(0, value));

  };

};

HeightMap = function (identifier, size, mesh_resolution, mesh_max_height, mesh_min_height, seed) {
 
  this.identifier = identifier;
  this.seed = seed ? seed : 12233;
 
  this.size = size;
 
  this.mesh_resolution = mesh_resolution;
  this.mesh_max_height = mesh_max_height;
  this.mesh_min_height = mesh_min_height;
 
  this.sample_spacing = size / mesh_resolution;
 
  this.low_noise = new PerlinNoise2D(this.seed, 2.37 / size);
  this.high_noise = new PerlinNoise2D(this.seed + 1, 6.13 / size);
 
  this.mesh_heights = new Float32Array(mesh_resolution * mesh_resolution);
 
  this.current_center;
  this.current_tile;
  this.has_recently_changed_tile = true; 
 
  this.update = function (target) {
 
    const snap = this.sample_spacing;
    const center_x = Math.round(target.x / snap) * snap;
    const center_z = Math.round(target.z / snap) * snap;
 
    if (this.current_tile && center_x === this.current_tile.x && center_z === this.current_tile.z) return;
 
    this.current_tile = new Vector3(center_x, 0, center_z);
    this.current_center = target.copy();
 
    this.rebuild();
    this.has_recently_changed_tile = true;
 
  };
 
  this.rebuild = function () {
 
    const res = this.mesh_resolution;
    const min_h = this.mesh_min_height;
    const range = (this.mesh_max_height - this.mesh_min_height) || 1;
 
    for (let j = 0; j < res; j++) {
 
      for (let i = 0; i < res; i++) {
 
        const x = this.current_center.x + (i + 0.5 - res / 2) * this.sample_spacing;
        const z = this.current_center.z + (j + 0.5 - res / 2) * this.sample_spacing;
 
        this.mesh_heights[i + res * j] = (this.sample_height(x, z) - min_h) / range;
 
      }
 
    }

  };
 
  this.sample_height = function (x, z) {
 
    const low = this.low_noise.sample(x, z);
    const high = this.high_noise.sample(x, z);
 
    const t = low * 0.8 + high * 0.2;
 
    return this.mesh_min_height + t * (this.mesh_max_height - this.mesh_min_height);
 
  };
 
};

HeightMapCollider = function(heightmap) {

  this.heightmap = heightmap;

  this.collide_convex = function(position, convex_shape_collider){
    
    return new CollisionResult(false);
    
  };

  this.collide_aabb = function(position, aabb_collider) {

    const collider_min_height = aabb_collider.transformed_aabb.min.y;
    const heightmap_height = this.heightmap.sample_height(position.x, position.z);

    if(collider_min_height > heightmap_height) {

      return new CollisionResult(false);
      
    }

    const upwards_correction = heightmap_height - collider_min_height;

    return new CollisionResult(true, new Vector3(0, upwards_correction, 0));

  };

  this.collide_combined = function(position, combined_shape_collider) {

    const aabb_collision = this.collide_aabb(position, combined_shape_collider.aabb_collider);

    return aabb_collision;

  };

  this.collide = function(physics_body) {

    switch(physics_body.collider.type) {
      case ColliderType.AABB:
        return this.collide_aabb(physics_body.position, physics_body.collider);
      case ColliderType.CONVEX:
        return this.collide_convex(physics_body.position, physics_body.collider);
      case ColliderType.COMBINED:
        return this.collide_combined(physics_body.position, physics_body.collider);
      default:
        return new CollisionResult(false);
    };

  };

}

Entity = function (type, physics_body, controller) {

  this.type = type;
  this.physics_body = physics_body;
  this.controller = controller;

};

PhysicsSystem = function (collision_iterations) {

  this.step = function (entities, statics, dt) {

    for (const entity of entities) {

      const body = entity.physics_body;

      body.last_position = body.last_position.copyOf(body.position);
      body.last_rotation = body.last_rotation.copyOf(body.rotation);

      body.velocity.addScaled(body.acceleration, dt);
      body.position.addScaled(body.velocity, dt);
      body.acceleration.mult(0);

      body.angular_velocity.addScaled(body.angular_acceleration, dt);
      body.rotation.addScaled(body.angular_velocity, dt);
      body.angular_acceleration.mult(0);

      body.collider.applyTransform(body.position, body.rotation, body.scale);

    }

    for(let i = 0; i < collision_iterations; i++) {

      this.resolveEntityCollisions(entities);

    }

    this.resolveStaticCollisions(entities, statics);

  }

  this.resolveStaticCollisions = function (entities, statics) {

    for(const entity of entities) {

      for(const static_body of statics) {

        const collision = static_body.collide(entity.physics_body);

        if(collision.has_collided) {

          const b1 = entity.physics_body;

          b1.position.add(collision.correction_vector);
          b1.collider.applyTransform(b1.position, b1.rotation, b1.scale);

        }

      }

    }

  };

  this.resolveEntityCollisions = function (entities) {

    for (let i = 0; i < entities.length; i++) {

      const e1 = entities[i];

      for (let j = i + 1; j < entities.length; j++) {

        const e2 = entities[j];

        const b1 = e1.physics_body;
        const b2 = e2.physics_body;

        const collision = b1.collide(b2);

        if (collision.has_collided) {

          b1.position.addScaled(collision.correction_vector, 0.5);
          b2.position.addScaled(collision.correction_vector, -0.5);

          b1.collider.applyTransform(b1.position, b1.rotation, b1.scale);
          b2.collider.applyTransform(b2.position, b2.rotation, b2.scale);

          e1.controller.on_collision(e2);
          e2.controller.on_collision(e1);

        };

      };

    };

  };

};

ControllerSystem = function() {

  this.step = function (entities) {

    for (const entity of entities) {

      entity.controller.updateBody(entity.physics_body);

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

  this.emit_signal = function(signal_name, ...args) {

    if (!this.signals.has(signal_name)) {
      console.error("Signal '" + signal_name +"' could not be found");
      return;
    }

    const listner_callbacks = this.signals.get(signal_name);

    for(let i = 0 ; i < listner_callbacks.length; i++) {

      listner_callbacks[i](...args);

    }

  }

};

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

Engine = function(plugin_node_object, run_custom_scene_setup) {

  this.FIXED_TIME_STEP = 1 / 60;
  this.PHYSICS_COLLISION_ITERATIONS = 3;

  this.MESH_INFO = new Map();

  this.Is_Initialized = false;
  this.Accumulator = 0;
  this.State = EngineStateType.LOADING;

  this.Input = new InputSystem(plugin_node_object);
  this.Output = new OutputSystem(plugin_node_object);

  this.Physics = new PhysicsSystem(this.PHYSICS_COLLISION_ITERATIONS);
  this.Controller = new ControllerSystem();
  this.Camera = new Camera(10, Util.degreesToRadians(30));
  this.SignalBus = new SignalBusSystem();
  this.Timers = [];

  this.HeightMaps = [];

  this.Entities = [];
  this.Statics = [];

  this.load_meshes = function() {

    const mesh_identifiers = Object.values(MeshIdentifier);

    for (let i = 0; i < mesh_identifiers.length; i++) {

    const identifier = mesh_identifiers[i];
    const mesh_verticies_as_float_array = this.Input.getMeshData(identifier);
    const mesh_as_vectors = Vector3.dedupe_vector_array(Vector3.arrayFromFloatArray(mesh_verticies_as_float_array));
    
    const ab = new AABB(mesh_as_vectors);
    console.log(ab);

    this.MESH_INFO.set(identifier, { Verticies: mesh_as_vectors, AABB: ab });

    }
    
    console.log(this.MESH_INFO);

  }

  this.create_heightmap = function (identifier, size, mesh_resolution, mesh_max_height, mesh_min_height, seed) {
    
    const heightMap = new HeightMap(identifier, size, mesh_resolution, mesh_max_height, mesh_min_height, seed);
    const heightMapCollider = new HeightMapCollider(heightMap);

    this.Statics.push(heightMapCollider);
    this.HeightMaps.push(heightMap);

    return heightMap;

  }

  this.render_entities = function (alpha) {
    
    const mesh_identifiers = Object.values(MeshIdentifier);

    for (const identifier of mesh_identifiers) {

      const entities_with_mesh = this.Entities.filter(x => x.type === identifier);

      const output_size = Math.max(1, entities_with_mesh.length)

      const interpolated_positions = new Array(output_size);
      const interpolated_rotations = new Array(output_size);
      const scales = new Array(output_size);

      interpolated_positions[0] = new Vector3(Infinity, Infinity, Infinity);
      interpolated_rotations[0] = new Vector3();
      scales[0] = 0;

      for (let i = 0; i < entities_with_mesh.length; i++) {

        const entity = entities_with_mesh[i];

        interpolated_positions[i] = Vector3.interpolate_vectors(alpha, entity.physics_body.last_position, entity.physics_body.position);
        interpolated_rotations[i] = Vector3.interpolate_rotation_vectors(alpha, entity.physics_body.last_rotation, entity.physics_body.rotation);
        scales[i] = entity.physics_body.scale;

      }
      
      
      this.Output.render_meshes(identifier, interpolated_positions, interpolated_rotations, scales);

    }

  };

  this.loop = function() {

    this.Timers = this.Timers.filter(x => !x.finished);

    const deltaTime = this.Input.getData(InputDataIdentifier.DELTA_TIME) / 1000;

    for (const timer of this.Timers) {

      timer.tick(deltaTime);

    }

    this.Accumulator += deltaTime;

    while (this.Accumulator >= this.FIXED_TIME_STEP) {

      this.Controller.step(this.Entities);
      this.Physics.step(this.Entities, this.Statics, this.FIXED_TIME_STEP);

      this.Accumulator -= this.FIXED_TIME_STEP;

    }

    const alpha = this.Accumulator / this.FIXED_TIME_STEP;

    const player_body = this.Entities.filter(x => x.type === MeshIdentifier.PLAYER)[0].physics_body;
    const player_render_position = Vector3.interpolate_vectors(alpha, player_body.last_position, player_body.position);
    const player_render_rotation_y = Vector3.interpolate_vectors(alpha, player_body.last_rotation, player_body.rotation).y;

    this.Camera.update(player_render_position, player_render_rotation_y);
    this.Output.set_camera(this.Camera);
    
    for(const heightmap of this.HeightMaps) {

      heightmap.update(player_body.position);

      if (heightmap.has_recently_changed_tile) {

        this.Output.render_heightmap(heightmap);
        heightmap.has_recently_changed_tile = false;

      }

    }

    this.render_entities(alpha);
    this.Output.setEngineState(this.State);

  };

  this.create_entity = function (mesh_identifier, controller, scale, mass, position) {

    const collider = new CombinedCollider(this.MESH_INFO.get(mesh_identifier));
    const body = new PhysicsBody(collider, scale, mass);
    body.position = position ? position : body.position;

    const entity = new Entity(mesh_identifier, body, controller);
    this.Entities.push(entity);

    return entity;

  };

  this.setup_scene = function() {

    run_custom_scene_setup(this);
    this.State = EngineStateType.GAME;
    this.Output.setEngineState(this.State);

  };

  this.initialize = function() {

    if(!this.Is_Initialized) {

      this.load_meshes();
      this.setup_scene();

    }

    this.Is_Initialized = true;

  }

  this.Output.setEngineState(this.State);

};

engine = null;

//Plugin Node Run 

const plugin_node_object = this;

PlayerController = function (input) {

  this.MAX_MOTOR_ACCELERATION_STRENGTH = 10;
  this.MAX_MOTOR_SPEED = 15;
  this.MAX_MOTOR_DRAG = this.MAX_MOTOR_ACCELERATION_STRENGTH / (this.MAX_MOTOR_SPEED * this.MAX_MOTOR_SPEED);
  this.GRAVITY = new Vector3(0,-1,0);

  this.updateBody = function (body) {
    
    body.applyForce(this.GRAVITY);

    if (input.isKeydown(InputKeyIdentifier.LEFT) || input.isKeydown(InputKeyIdentifier.RIGHT)) {

      const rotation_direction = new Vector3(0, input.isKeydown(InputKeyIdentifier.LEFT) ? 1 : -1, 0);
      rotation_direction.mult(input.isKeydown(InputKeyIdentifier.BACKWARD) ? -1 : 1);
      body.angular_velocity = rotation_direction;

    } else {

      body.angular_velocity.y = 0;

    }

    const current_speed_sq = body.velocity.magSq();
    const motor_drag = body.velocity.copy().setMag(-this.MAX_MOTOR_DRAG * current_speed_sq);
    motor_drag.y = 0;

    body.applyForce(motor_drag);

    if (input.isKeydown(InputKeyIdentifier.FORWARD) || input.isKeydown(InputKeyIdentifier.BACKWARD)) {

      const global_upward = new Vector3(0, 1, 0);
      const global_direction = new Vector3(0, 0, input.isKeydown(InputKeyIdentifier.FORWARD) ? 1 : -1);
      const direction = global_direction.rotateAround(global_upward, -body.rotation.y);
      const acceleration = direction.setMag(this.MAX_MOTOR_ACCELERATION_STRENGTH);

      body.applyForce(acceleration);

    };

  }

  this.on_collision = function (other) {
    
  }

};

EnemyController = function (target_entity) {

  this.MAX_MOTOR_ACCELERATION_STRENGTH = 5;
  this.MAX_MOTOR_SPEED = 5;
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

    body.rotation.y = Math.atan2(body.velocity.z, body.velocity.x) - Math.PI / 2;

  }

  this.on_collision = function(other) {

  }

};

function custom_scene_setup(engine) {

  const player = engine.create_entity(MeshIdentifier.PLAYER, new PlayerController(engine.Input), 1, 0.5);
  const height_map = engine.create_heightmap(HeightMapIdentifier.WORLD, 1000, 10000, 50, -10, 1);

  for (let i = 0; i < 10; i++) {

    engine.create_entity(MeshIdentifier.ENEMY, new EnemyController(player), 0.5, 1, new Vector3(10, 0, 0));

  }

};

if(!engine) {

  engine = new Engine(plugin_node_object, custom_scene_setup);

} else if (!engine.Is_Initialized) {

  engine.initialize();

} else {

  engine.loop();

}