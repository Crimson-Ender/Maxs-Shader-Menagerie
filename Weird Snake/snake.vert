// make this 120 for the mac:
#version 330 compatibility

// out variables to be interpolated in the rasterizer and sent to each fragment shader:

const float PI 		= 3.14159265;
const float	TWOPI 	= 2.*PI;
const float	LENGTH 	= 5.;

uniform float uA;
uniform float uP;


out  vec2  vST;	  // (s,t) texture coordinates
out  vec3  vN;	  // normal vector
out  vec3  vL;	  // vector from point to light
out  vec3  vE;	  // vector from point to eye0
out float 	vNz;  //z-component of normal
out vec3 vBTNx, vBTNy, vBTNz;


// where the light is:

const vec3 LightPosition = vec3(  0., 0., 0. );

void
main( )
{
	vec3 displacedVert = gl_Vertex.xyz;
	displacedVert.z += uA *sin(TWOPI + uP * displacedVert.x/LENGTH);

	//bumps
	vN = normalize( gl_NormalMatrix * gl_Normal );  // normal vector
	vec3 Tg = vec3(0.,1.,0.);
	vec3 B = normalize(cross(Tg,vN));
	vec3 T = normalize(cross(vN,B));


	vST = gl_MultiTexCoord0.st;

	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;

	vNz = normalize(gl_NormalMatrix * gl_Normal).z;
	vL = LightPosition - ECposition.xyz;	    // vector from the point
							// to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;       // vector from the point
							// to the eye position
	gl_Position = gl_ModelViewMatrix * vec4(displacedVert,1.);
}
