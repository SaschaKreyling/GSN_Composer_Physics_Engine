#version 300 es
precision highp float;

in vec3 position;
in vec2 texcoord;
in vec3 normal;

out vec2 tc;
out vec3 fn;
out vec3 pos;

uniform mat4 projection;
uniform mat4 modelview;
uniform mat4 modelviewTransposedInverse;

uniform sampler2D heightMap;
uniform int HeightMapWidth;
uniform int HeightMapHeight;
uniform float heightMax;
uniform float heightMin;
uniform float worldSize; // world-space extent of the terrain (x, y)


float sampleHeight(vec2 uv)
{
    vec2 flipped = vec2(uv.x, 1.0 - uv.y);
    return textureLod(heightMap, flipped, 0.0).r * (heightMax - heightMin) + heightMin;
}

void main()
{
    vec2 texelSize = 0.999 * vec2(1.0 / float(HeightMapWidth), 1.0 / float(HeightMapHeight));

    float h = sampleHeight(texcoord);
    vec3 displacedPosition = position + normal * h;

    float hL = sampleHeight(texcoord - vec2(texelSize.x, 0.0));
	float hR = sampleHeight(texcoord + vec2(texelSize.x, 0.0));
float hD = sampleHeight(texcoord - vec2(0.0, texelSize.y));
float hU = sampleHeight(texcoord + vec2(0.0, texelSize.y));

vec2 slope = vec2(hR - hL, hU - hD) / (2.0 * texelSize);   // dh per unit UV
vec3 hfNormal = normalize(vec3(-slope, 1.0));

    fn = normalize(mat3(modelviewTransposedInverse) * hfNormal);

    vec4 viewPos = modelview * vec4(displacedPosition, 1.0);
    pos = viewPos.xyz;
    tc = texcoord;
    gl_Position = projection * viewPos;
}