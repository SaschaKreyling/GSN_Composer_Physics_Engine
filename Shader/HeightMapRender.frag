#version 300 es
precision highp float;

out vec4 outColor;

in vec3 pos;
in vec2 tc;
in vec3 fn;

uniform int gsnMeshGroup;

uniform vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 objectColor;

void main() {
    
    float ambientStrength = 0.5;
    vec3 ambient = ambientStrength * lightColor;

    vec3 norm = normalize(fn);
    vec3 lightDir = normalize(lightPos - pos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;

    vec3 result = (ambient + diffuse) * objectColor;
    outColor = vec4(result, 1.0);

}