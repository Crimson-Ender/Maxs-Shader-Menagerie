#version 330 compatibility

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec4    uColor;		 // object color
uniform float   uShininess;	 // specular exponent
uniform sampler3D Noise3;

// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform float   uS0, uT0, uD;

// in variables from the vertex shader and interpolated in the rasterizer:

in  vec3  vN;		   // normal vector
in  vec3  vL;		   // vector from point to light
in  vec3  vE;		   // vector from point to eye
in  vec2  vST;		   // (s,t) texture coordinates
in  vec3  vMC;		   // model coordinates

uniform vec4 uSpecularColor;

//project 3B exclusive variables
uniform float uNoiseAmp, uNoiseFreq;

vec3 perturbNormal(float angx, float angy, vec3 n){
	float cx = cos(angx);
	float sx = sin(angx);
	float cy = cos(angx);
	float sy = sin(angy);

	//rotate about x
	float yp = n.y*cx - n.z*sx;			//y
	n.z = n.y*sx + n.z*cx;				///z
	n.y = yp;
	//n.x = n.x;

	//rotate about y
	float xp = n.x*cy - n.z*sy;
	n.z = -n.x*sy + n.z*cy;
	n.x	= xp;
	//n.y = n.y;

	return normalize(n);

}




void
main()
{
	float s = vST.s;
	float t = vST.t;

	//add noise to the sheet

	vec4 nvx = texture(Noise3, uNoiseFreq*vMC);
	float angx = nvx.r + nvx.g + nvx.b + nvx.a - 2.;    //-1 to +1
	angx *= uNoiseAmp;

	vec4 nvy = texture(Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5));
	float angy = nvy.r + nvy.g + nvy.b + nvy.a -2.;
	angy *= uNoiseAmp;



	// determine the color using the square-boundary equations:

	// if( uS0-uD/2. <= s  &&  s <= uS0+uD/2.  &&  uT0-uD/2. <= t  &&  t <= uT0+uD/2. )
	// {
	// 	myColor = vec3( 1., 1., 1. );;
	// }

	// apply the per-fragmewnt lighting to uColor:

	vec3 Normal = perturbNormal(angx, angy, vN);
	Normal = normalize(gl_NormalMatrix * Normal);
	vec3 Light  = normalize(vL);
	vec3 Eye    = normalize(vE);

	vec3 ambient = uKa * uColor.rgb;

	float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * dd * uColor.rgb;

	float ss = 0.;
	if( dot(Normal,Light) > 0. )	      // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		ss = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * ss * uSpecularColor.rgb;
	gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}

