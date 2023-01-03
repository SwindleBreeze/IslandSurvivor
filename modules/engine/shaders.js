const vertex = `#version 300 es

layout (location = 0) in vec4 aPosition;
layout (location = 3) in vec2 aTexCoord;

uniform mat4 uModelViewProjection;

out vec2 vTexCoord;

void main() {
    vTexCoord = aTexCoord;
    gl_Position = uModelViewProjection * aPosition;
}
`;

const fragment = `#version 300 es
precision mediump float;
precision mediump sampler2D;

uniform sampler2D uBaseColorTexture;
uniform vec4 uBaseColorFactor;

in vec2 vTexCoord;

out vec4 oColor;

void main() {
    vec4 baseColor = texture(uBaseColorTexture, vTexCoord);
    oColor = uBaseColorFactor * baseColor;
}
`;

const rig = `#version 300 es

layout (location = 0) in vec4 aPosition;
layout (location = 3) in vec2 aTexCoord;
layout (location = 4) in uvec4 a_joints;
layout (location = 5) in vec4 a_weights;

uniform mat4 uModelViewProjection;
uniform mat4 uJointMatrices[50];

out vec2 vTexCoord;

vec4 skinning(uvec4 joints, vec4 weights) {
    vec4 skinned = vec4(0.0);
    for (int i = 0; i < 4; i++) {
        skinned += weights[i] * uJointMatrices[joints[i]] * aPosition;
    }
    return skinned;
}

void main() {
    vTexCoord = aTexCoord;
    gl_Position = uModelViewProjection * skinning(a_joints, a_weights);
}`

export const shaders = {
    simple: { vertex, fragment, rig }
};
