#version 330 compatibility

//uniform variables for the magic lens

uniform float uSc;		//S texture coordinate of the center of the magic len
uniform float uTc;		//T texture coordinate of the center of the magic lens
uniform float uRad;		//radius of the magic lens

//uniform variables for the image effects

uniform float uMag;		//magnification factor
uniform float uWhirl;	//coefficient for the whirl effects
uniform float uMosaic; 	//coefficient for the mosaic effects

//texture
uniform sampler2D 	uImageUnit;
in vec2				vST;

void main(){

	vec2 st = vST - vec2(uSc, uTc);

	//use pythagorean theorem to calculate the circular shape of the magic lens
	//check if the fragment is outside of the magic lens, render normally if outside, apply effect if it is inside the magic lens

	if((pow(st.s,2)+pow(st.t,2))>pow(uRad,2)){

		//fragment is outside the magic lens
		vec3 rgb = texture(uImageUnit, vST).rgb;	
		gl_FragColor = vec4(rgb, 1);

	}else{
		//fragment is within the magic lens
		//magnify whatever is within the magic lens by the the magnification factor variable
		float r = length(st);
		float r_prime = r*uMag;

		//apply the whirl effect to whatever is within the magic lens
		float theta = atan(st.t, st.s); 
		float theta_prime = theta - uWhirl * r_prime;

		//restore s and t
		st = r_prime * vec2(cos(theta_prime),sin(theta_prime));
		st += vec2(uSc,uTc);

		int numins = int(st.s/(uMosaic));
		int numint = int(st.t/(uMosaic));
		float sc = numins * uMosaic + uMosaic/2;
		float tc = numint * uMosaic + uMosaic/2;
		st.s = sc;
		st.t = tc;


		vec3 rgb = texture(uImageUnit, st).rgb;	
		
		//FOR DEBUG PURPORSES: output the negative of the current fragment's color to test the 
		//gl_FragColor = vec4(1-rgb.r,1-rgb.g,1-rgb.b, 1);

		gl_FragColor=vec4(rgb,1);
	}


}