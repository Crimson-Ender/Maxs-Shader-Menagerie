#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable
layout(triangles) in;
layout(triangle_strip, max_vertices=256) out;

uniform float uShrink;
in vec3 vN[3];
out float   glLightIntensity;
const vec3 LightPosition = vec3(  0., 0., 0. );

//pass through values

in  vec3  vL[3];	  // vector from point to light
in  vec3  vE[3];	  // vector from point to eye0
in float  vNz[];  //z-component of normal
in vec3   vBTNx[3], vBTNy[3], vBTNz[3];

out  vec3  gN[3];	  // normal vector
out  vec3  gL[3];	  // vector from point to light
out  vec3  gE[3];	  // vector from point to eye0
out float gNz[];  //z-component of normal

// gL[0] :: vL[0];
// gE[0] :: vE[0];
// gN[0] :: vN[0];

// gL[1] = vL[1];
// gE[1] = vE[1];
// gN[1] = vN[1];

// gL[2] = vL[2];
// gE[2] = vE[2];
// gN[2] = vN[2];


vec3 V[3];
vec3 CG;

void produceVertex(int v){
    gNz[v] = vNz[v];
    gL[v] = vL[v];
    gE[v] = vE[v];
    gN[v] = vN[v];
    gl_Position = gl_ProjectionMatrix * vec4(CG + uShrink * (V[v]-CG),1.);
    EmitVertex();
}

void main(){
     V[0] = gl_PositionIn[0].xyz;
     V[1] = gl_PositionIn[1].xyz;
     V[2] = gl_PositionIn[2].xyz;
     CG = (V[0]+V[1]+V[2])/3.;
     produceVertex(0);
     produceVertex(1);
     produceVertex(2);
}