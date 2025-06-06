#version 330 compatibility


//set up uniform variables for the fragment shader

uniform sampler3D 		Noise3;
uniform float 			uNoiseAmp;
uniform float			uNoiseFreq;
uniform float 			uEta;
uniform float			uMix;
uniform float			uWhiteMix;
uniform samplerCube 	uReflectUnit;
uniform samplerCube 	uRefractUnit;

//values from the vertex shader that were interpolated through the rasterizer

in vec3 				vNormal;
in vec3					vEyeDir;
in vec3					vMC;

const vec3 WHITE = vec3(1.,1.,1.);

vec3 perturbNormal3(float angx, float angy, float angz, vec3 n){

	//function to perturb the surface normals for the noise

	float cx = cos(angx);
	float sx = sin(angx);
	float cy = cos(angx);
	float sy = sin(angy);
	float cz = cos(angz);
	float sz = sin(angz);

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

	//rotate about z
		xp 	= n.x*cz - n.y*sz;
	n.y		= n.x*sz + n.y*cz;
	n.x 	= xp;
	//n.z = n.z;


	return normalize(n);

}


void
main( )
{
	vec3 Normal = vNormal;			// fill in later
	vec3 Eye = vEyeDir;				// fill in later


	//get the noise data from the noise texture file

	vec4 nvx = texture(Noise3, uNoiseFreq*vMC);
	vec4 nvy = texture(Noise3, uNoiseFreq*vec3(vMC.xy, vMC.z+0.33));
	vec4 nvz = texture(Noise3, uNoiseFreq*vec3(vMC.xy, vMC.z+0.67));

	float angx = nvx.r + nvx.g + nvx.b + nvx.a;			//-1. -> 3.
	angx = angx-2.;										//-1. -> 1.
	angx *= uNoiseAmp;

	float angy = nvy.r + nvy.g + nvy.b + nvy.a;			//-1. -> 3
	angy = angy-2.;										//-1. -> 1.
	angy *= uNoiseAmp;

	float angz = nvz.r + nvz.g + nvz.b + nvz.a;			//-1. -> 3
	angz = angz-2.;										//-1. -> 1.
	angz *= uNoiseAmp;

	Normal = perturbNormal3(angx, angy, angz, Normal);
	Normal = normalize(gl_NormalMatrix * Normal);

	vec3 reflectVector = reflect(Eye, Normal);		
	vec3 reflectColor = texture(uReflectUnit, reflectVector).rgb;	

	vec3 refractVector = refract(Eye, Normal, uEta);	
	refractVector.xy *= -1;
	vec3 refractColor;

	if(all(equal(refractVector, vec3(0.,0.,0.)))){
		refractColor = reflectColor;
	}else{
		refractColor= texture(uRefractUnit, refractVector).rgb;
		refractColor = mix(refractColor, WHITE, uWhiteMix);
	}
	
	vec3 color = mix(refractColor, reflectColor, uMix);
	color = mix(color, WHITE, uWhiteMix);
	
	gl_FragColor = vec4(color, 1.); //fill in later

}

