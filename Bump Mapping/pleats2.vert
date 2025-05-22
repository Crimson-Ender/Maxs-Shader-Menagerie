#version 330 compatibility

// out variables to be interpolated in the rasterizer and sent to each fragment shader:

out  vec2  vST;	  // (s,t) texture coordinates
out  vec3  vN;	  // normal vector
out  vec3  vL;	  // vector from point to light
out  vec3  vE;	  // vector from point to eye
out  vec3  vMC;   // model coordinates

// where the light is

uniform float 	uLightX, uLightY, uLightZ; //light position

vec3 LightPosition = vec3(  uLightX, uLightY, uLightZ );
const float pi = 3.1415926535;
const float Y0 = 1.;

//project 3 exclusive variables

  
uniform float   uA; //controls amplitude of the sine wave for the pleats
uniform float 	uP; //controls the period of the sine wave for the pleats

void
main( )
{
	vST = gl_MultiTexCoord0.st;
	float z = uA * (Y0-gl_Vertex.y)*sin(2.*pi*gl_Vertex.x/uP);
	vec4 vert = gl_Vertex;
	vert.z = z;

	//get the normal vectors of the displaced surface

	float dzdx = (Y0-vert.y) * (2.*pi/uP) * cos(2.*pi*vert.x/uP);
	float dzdy = -uA * sin(2.*pi*vert.x/uP);

	vMC = vert.xyz;

	vec3 Tx = vec3(1.,0.,dzdx);
	vec3 Ty = vec3(0.,1.,dzdy);
	vec3 normal = normalize(cross(Tx,Ty));
	vN = normal;
	vec4 ECposition = gl_ModelViewMatrix * vert;
	vL = LightPosition - ECposition.xyz;	    // vector from the point
							// to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;       // vector from the point
							// to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * vert;
	
}
