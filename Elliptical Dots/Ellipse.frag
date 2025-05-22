
#version 330 compatibility

// you can set these 4 uniform variables dynamically or hardwire them:

uniform float	uKa, uKd, uKs;	// coefficients of each type of lighting
uniform float	uShininess;	// specular exponent

// in Project #1, these have to be set dynamically from glman sliders or keytime animations or by keyboard hits:
uniform float	uAd, uBd;
uniform float	uTol;

// interpolated from the vertex shader:
in  vec2  vST;                  // texture coords
in  vec3  vN;                   // normal vector
in  vec3  vL;                   // vector from point to light
in  vec3  vE;                   // vector from point to eye
in  vec3  vMC;			// model coordinates

// for Mac users:
//	Leave out the #version line, or use 120
//	Change the "in" to "varying"


const vec3 OBJECTCOLOR          = vec3( 1, 1, 1 );           // color to make the object
const vec3 ELLIPSECOLOR         = vec3( 0, 0.3, 1 );           // color to make the ellipse
const vec3 SPECULARCOLOR        = vec3( 1., 1., 1. );

void
main( )
{
    vec3 myColor = OBJECTCOLOR;
	vec2 st = vST;

	// blend OBJECTCOLOR and ELLIPSECOLOR by using the ellipse equation to decide how close
	// 	this fragment is to the ellipse border:

    float Ar = uAd/2;
    float Br = uBd/2;

    int numins = int( st.s / uAd );
	int numint = int( st.t / uBd );

    float Sc = numins * uAd + Ar;
    float Tc = numint * uBd + Br;


	//<< do the rest of the ellipse equation to compute d >>

    float ds = ((st.s - Sc)/Ar);
    float dt = ((st.t - Tc)/Br);
    float d = pow(ds, 2)+pow(dt, 2);


	float t = smoothstep( 1.-uTol, 1.+uTol,d );
        myColor = mix( ELLIPSECOLOR, OBJECTCOLOR, t );

	// now use myColor in the per-fragment lighting equations:

        vec3 Normal    = normalize(vN);
        vec3 Light     = normalize(vL);
        vec3 Eye       = normalize(vE);

        vec3 ambient = uKa * myColor;

        float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
        vec3 diffuse = uKd * dd * myColor;

        float s = 0.;
        if( dd > 0. )              // only do specular if the light can see the point
        {
                vec3 ref = normalize(  reflect( -Light, Normal )  );
                float cosphi = dot( Eye, ref );
                if( cosphi > 0. )
                        s = pow( max( cosphi, 0. ), uShininess );
        }
        vec3 specular = uKs * s * SPECULARCOLOR.rgb;
        gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}