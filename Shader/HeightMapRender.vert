#version 300 es
precision highp float;

out vec2 tc;
out vec3 fn;
out vec3 pos;

in vec3 position;
in vec2 texcoord;
in vec3 normal;

uniform mat4 projection;
uniform mat4 modelview;


uniform sampler2D heightMap;
uniform sampler2D heightMapDetails;

uniform int HeightMapHeight;
uniform int HeightMapWidth;

uniform float heightMax;
uniform float heightMin;

uniform mat4 modelviewTransposedInverse;



void main()
{

    vec2 texelSize = vec2(1.0 / float(HeightMapWidth), 1.0 / float(HeightMapHeight));

    float normalized_height = texture(heightMap, texcoord).r;
    float h = normalized_height * (heightMax - heightMin) + heightMin;
  
    vec3 displacedPosition = position + normal * h;
    
    float hLeft  = texture(
        heightMap,
        texcoord - vec2(texelSize.x, 0.0)
    ).r;

    float hRight = texture(
        heightMap,
        texcoord + vec2(texelSize.x, 0.0)
    ).r;

    float hDown  = texture(
        heightMap,
        texcoord - vec2(0.0, texelSize.y)
    ).r;

    float hUp    = texture(
        heightMap,
        texcoord + vec2(0.0, texelSize.y)
    ).r;
    

    hLeft  *= (heightMax - heightMin);
    hLeft  += heightMin;
    hRight *= (heightMax - heightMin);
    hRight += heightMin;

    float dx = hRight - hLeft;

    hDown  *= (heightMax - heightMin);
    hDown  += heightMin;
    hUp    *= (heightMax - heightMin);
    hUp    += heightMin;

    float dy = hUp - hDown;

    vec3 normal = normalize(vec3( -dx / (2.0 * texelSize.x), dy / (2.0 * texelSize.y), 1.0));
    vec3 transformed_normal = normalize(vec3(modelviewTransposedInverse * vec4(normal, 0.0)));
    
    fn = transformed_normal;

    vec4 new_pos = projection *
                   modelview *
                   vec4(displacedPosition, 1.0);


    tc = texcoord;
    gl_Position = new_pos;
    pos = new_pos.xyz;
}