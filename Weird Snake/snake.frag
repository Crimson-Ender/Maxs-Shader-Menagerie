// make this 120 for the mac:
#version 330 compatibility

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec4    uColor;		 // object color
uniform vec4    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent

// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform bool 	uSilh;
uniform float 	uDeltaZ;
uniform float uDeltaX;
uniform float 	uTol;
uniform bool  	uOpaque;
uniform bool 	uFragOn;

// in variables from the vertex shader and interpolated in the rasterizer:

in  vec3  gN[3];		   // normal vector
in  vec3  gL[3];		   // vector from point to light
in  vec3  gE[3];		   // vector from point to eye
// in  vec2  gST;		   // (s,t) texture coordinates
in	float gNz[]; 			// z- component of normal
// in vec3 gBTNx, gBTNy, gvBTNz;

//experiment
in float gNx;		//x-component of normal


const vec3 SILHCOLOR = vec3(1.,1.,1.);
const float PI = 3.14159265358979;

vec3 fN = (gN[0],gN[1],gN[2]);
vec3 fL = (gL[0],gL[1],gL[2]);
vec3 fE = (gE[0],gE[1],gE[2]);
float fNz = gNz[0];

void
main( )
{

	// // apply the per-fragmewnt lighting to myColor:


	vec3 Normal = normalize(fN);
	vec3 Light  = normalize(fL);
	vec3 Eye    = normalize(fE);
	vec3 myColor = uColor.rgb;

	vec3 ambient = uKa * myColor;

	float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * dd * myColor;

	float ss = 0.;
	if( dot(Normal,Light) > 0. )	      // only do specular if the light can see the point
	{
	 	vec3 ref = normalize(  reflect( -Light, Normal )  );
	 	ss = pow( max( dot(Eye,ref),0. ), uShininess );
	 }
	 vec3 specular = uKs * ss * uSpecularColor.rgb;

	 //outlines for the object

	float deltax = 0.;
	float deltaz = 0.;
	if(uSilh && (abs(fNz) <= uTol)){
	 	gl_FragColor = vec4(SILHCOLOR, 1.);
	 	deltaz = -uDeltaZ;
	 }else{
	 	if (!uOpaque){
	  		discard;
	  	}
		if(uFragOn == true){
			gl_FragColor = vec4(ambient + diffuse + specular, 1);

		}else{
			gl_FragColor = vec4(1.,0.04,0.,1.);
		}
	}

	gl_FragDepth = gl_FragCoord.z +deltaz;
	//gl_FragColor = vec4(1.,0.04,0.,1.);
}

