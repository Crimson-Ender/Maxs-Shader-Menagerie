
#version 330 compatibility

// you can set these 4 uniform variables dynamically or hardwire them:

uniform float	uKa, uKd, uKs;	// coefficients of each type of lighting
uniform float	uShininess;	// specular exponent

uniform float	uAd, uBd;
uniform float	uTol;

// these variables are for the noise exercise in project 2

uniform sampler3D Noise3;
uniform float uNoiseFreq, uNoiseAmp;
in  vec3  vMC;			// model coordinates

// interpolated from the vertex shader:
in  vec2  vST;                  // texture coords
in  vec3  vN;                   // normal vector
in  vec3  vL;                   // vector from point to light
in  vec3  vE;                   // vector from point to eye

const vec3 OBJECTCOLOR          = vec3( 1, 1, 1 );           // color to make the object
const vec3 ELLIPSECOLOR         = vec3( 1, 0.1, 0.1 );           // color to make the ellipse
const vec3 SPECULARCOLOR        = vec3( 1., 1., 1. );

void
main( )
{
    vec3 myColor = OBJECTCOLOR;
	vec2 st = vST;

    //get the noise data from the texture coordinates we passed in from the vertex shader

    vec4 nv = texture(Noise3, uNoiseFreq * vMC);
    float n = nv.r+ nv.g +nv.b +nv.a;
    n = n-2;
    n *= uNoiseAmp;

	// blend OBJECTCOLOR and ELLIPSECOLOR by using the ellipse equation to decide how close
	// 	this fragment is to the ellipse border:

    float Ar = uAd/2;
    float Br = uBd/2;

    int numins = int( st.s / uAd );
	int numint = int( st.t / uBd );

    float Sc = numins * uAd + Ar;
    float Tc = numint * uBd + Br;


	//<< do the rest of the ellipse equation to compute d >>

    float ds = (st.s - Sc);
    float dt = (st.t - Tc);
    float oldDist = sqrt(ds*ds + dt*dt);
    float newDist = oldDist +n;
    float scale = newDist / oldDist;

    ds *= scale;
    ds /= Ar;
    dt  *= scale;
    dt /= Br;

    float d = ds*ds + dt*dt;
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