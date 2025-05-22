// make this 120 for the mac:
#version 330 compatibility

// out variables to be interpolated in the rasterizer and sent to each fragment shader:

//sending values to be interpolated via the rasterizer and then to the fragment shader

out  vec3  vNormal;	  // normal vector
out  vec3  vEyeDir;	  // vector from point to light
out  vec3  vMC;		  // vector with model coordinates

// where the light is:

const vec3 LightPosition = vec3(  0., 5., 5. );

void main( ) {
	vec4 newVertex = gl_Vertex;
	vMC = newVertex.xyz;
	vec3 ECPosition = (gl_ModelViewProjectionMatrix * newVertex).xyz;
	vEyeDir = -ECPosition.xyz - vec3(0.,0.,0.); //vector from eye position to the point
	vNormal = normalize(gl_NormalMatrix * gl_Normal);
	gl_Position = gl_ModelViewProjectionMatrix * newVertex;

}
