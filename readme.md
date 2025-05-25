# "Max's Shaders Menagerie"
## by Max Baker, crimsonender99@gmail.com

A collection of assorted OpenGL (GLSL) shaders I wrote for my computer graphics shaders class. The shaders were executed in a software written by the professor called GLMan, as an homage to Pixar's RenderMan shader rending software. 

All of these projects consist of at least a vertex shader, a fragment shader, and a GLman Interface Bytestream (.glib) file. Projects VI and VII involve geometry shaders which are only compatible with more modern versions of OpenGL which are not supported on Mac systems. Some of the projects also have 3D models and texturees associated with them, which I have included in their respective folders. 

All of these programs were written and run on a Windows 11 PC using an NVidia GeForce RTX 4070 gaming GPU. These shaders should work across GPUs from different vendors like AMD and Intel, both discrete and integrated, but since the compilation of these shaders happens in the graphics driver, I cannot guarantee that everything will work *exactly* the same as it does on my system.

## I: Elliptical Dots
#### Video Demonstration: https://youtu.be/ICZeTCFRt5w

For this project, I used GLSL shaders to project a regular pattern of ellipses onto a spherical object.

## II: Noisy Elliptical Dots
#### Video Demonstration: https://youtu.be/A6QHlWrBIgc

For this project, I built off of the elliptical dots project from the previous project in order to implement a noise effect. I achieved the noise effect by first saving the 3D model coordinates of the sphere into a texture file in the vertex shader that was then used in the fragment shader to provide the noise data.

I then used that noise data to make some modifications to the ellipse formula, which used the noise data n to make the edges of the ellipses less defined and well, noisy. The two variables responsible for most of the noise calculations are uNoiseFreq and uNoiseAmp; both of which can be adjusted in GLMan or in the API, and when uNoiseAmp is turned up, the ellipses become less defined and irregularly shaped, and uNoiseFreq increases or decreases the density of the pattern. All of the variables and lighting from the previous project still works, my GLSL code didn’t change anything involving them directly.


## III-A: Displacement Mapping
#### Video Demonstration: https://youtu.be/umV05LgNZtQ

For this project, I used displacement mapping to simulate a pleating effect like you would see at the bottom of a curtain.

How I achieved this is by using a sine function in order to displace vertices along the z-axis depending on their positions relative to the top of the curtain. The amplitude and period of this sine wave are controlled by the uniform variables uA and uP respectively, which can be dynamically changed by the user in GLMan, which is what I used for this project.

I then calculated the normal vectors by using the calculus equations for the tangent vectors provided on the assignment handout page. Once I found the tangent vectors dzdx and dzdy, I arranged them in two vec3s, Tx and Ty and then found the cross product of Tx and Ty as shown below and used that cross product value to set the surface normals for the curtain.


## III-B: Bump Mapping
#### Video Demonstration: https://youtu.be/JAdJGf6m5Fs

For this project, I built off of the work what was done for Project III-A. Whereas the effects produced in Project 3A were created entirely using the vertex shader and displacement mapping, the effect demonstrated here was created entirely using the fragment shader and bump mapping. The key difference here is that unlike in Project 3A, which used mathematical functions to physically transform the vertices to create a pleating effect, this doesn’t physically transform the shape; but instead uses noise to perturb the surface normals to make a textured looking surface.

This was achieved by using a texture file to get data for the noise, similar to how we got the noise to transform the dots in Project 2. Using the texture data, we can manipulate the surface normals so the sheet appears to have a rough, noisy texture applied to it.

We then plug these angle values into a function where they are rotated about the x and y axes by using cosine and sine functions. The intensity and density of the noise - the amplitude and frequency - are controlled  by two uniform variables; uNoiseAmp and uNoiseFreq. If you crank them both all the way up, you get an image like the one to the left. The image on the previous page was created with more moderate values.

Additionally, since this was built directly off of the foundation of Project 3A and the process did not involve changing any of the shader code for the Vertex shader except for sending the model coordinates to the Fragment shader; all of the functionality of the first part remains, and you are still able to manipulate the amplitude and period of the pleats in the sheet by manipulating uniform variables uA and uP.


## IV: Cube Mapping
#### Video Demonstration: https://youtu.be/tbux3v1zzcc

For this project, I used textures and cube mapping and some built in GLSL functions in order to create reflection and refraction effects, and used bump mapping to add noise to it. The noise effects were accomplished by using the uniform variables uNoiseAmp and uNoiseFreq to apply transformations to the surface normals in the fragment shader, much like the previous assignment, creating an illusion of texture in the surface. Whether the object refracted light through it or reflected light off of it was determined by using a mix function controlled by the uniform variable uMix. uMix had a range from 0 to 1. 0 means that the object was completely refractive, and 1 means the object was completely reflective. The index of refraction for the refract function is controlled by the uniform variable uEta. The default value for uEta is 1.4; which was the value from the example GLIB script on the assignment page, and the project requirements don’t mandate that the refraction is variable, but I put it on a slider anyway because I thought it would be interesting to play around with and see what would happen if you turned it all the way down or cranked it up.

## V: 2D Image Manipulation
#### Video Demonstration: https://youtu.be/SbwjgvtUcXE

For this project, I was able to use the fragment shader in order to manipulate and apply visual effects onto a 2D image. I created a flat quadrilateral shape in the glib file which I then mapped a texture onto in the fragment shader. I chose my headshot for the texture because I thought it was funny.

The key feature of this project was the “magic lens”, a moveable and resizable circular region where the visual effects would be applied. The position of the magic lens is controlled by the uniform variables uSc and uTc, which represent the S and T texture coordinates of the center of the magic lens respectively, and then the size is controlled by the uniform variable uRad. In order to define the bounds of the magic lens, I applied the pythagorean theorem; if the square of the fragment’s current S coordinate plus the square of the fragment’s current T coordinate is greater than the square of the radius; then the fragment is outside of the magic lens, and the fragment’s texture is rendered as normal without any effect applied.

There are three visual effects that can be applied within the magic lens; magnify, whirl, and mosaic. The image above on the right has all three effects applied at once. The intensity of these effects are controlled by the uniform variables uMag, uWhirl, and uMosaic; all of them mapped to sliders that allow for the user to adjust them in GLMan. For the magnification effect, I just got the length of the area inside the magic lens and multiplied it by the magnification factor; and for whirl I found the arctangent of the s and t coordinates of the current fragment and subtracted the whirl coefficient times the magnification effect. For the mosaic, I used the equation for circular dots provided in the Stripes, Rings and Dots notes from earlier in the course.


## VI: Weird Snake
#### Video Demonstration: https://youtu.be/ylxBTGf5fCw

This project used a combination of vertex shaders, fragment shaders, and geometry shaders to create a few different effects that would be applied onto the snake object that was provided for us.

In the vertex shader; I used a sine wave equation in order to allow the snake to move in a slither motion. The slither was controlled by two uniform variables, uA, which controls the amplitude of the slither and uP which controls the period of the slither. This was basically just the pleat effect from project 3A but modified a bit so the snake wouldn’t squish flat along the Z-axis like it would have if I had just taken the equation directly from that assignment. This was relatively simple, and I really just ended up making this effect because I didn’t like how the default pose for the snake model was just completely stretched out. Didn’t feel like a very natural snake pose to me.

For the fragment shader, I decided to implement a silhouette system, so it would draw a white silhouette around the object using data interpolated in from the vertex shader. I isolated the Z-component of the model’s normal in the vertex shader and passed it along via the geometry shader and into the fragment shader. This thickness of the outline could be altered by adjusting the uniform variable uTol. I had a boolean variable that would toggle whether or not just the outline would be drawn or not (just by discarding fragments not within the outline). 


The biggest part of this project though was the geometry shader effect. Initially, I wanted to do something along the lines of the explosion effect that was demonstrated in class, but I quickly realized that the vertex limit of the GLSL geometry shader was a big issue and made it look really lame, so I opted against that. There were just not enough vertices to work with and the model was too big to make it look good (screenshot from my experiment with that below). I now understand why the shader community very quickly moved on to using tessellation shaders instead.

I also tried using hedgehog plots briefly, but I was having trouble passing in the normals into the geometry shader, so I decided to go for the shrink shader. I think it turned out pretty cool, but it was causing some issues with the per-fragment lighting and causing some nasty z-fighting; so I made a uniform variable that toggles per-fragment lighting on and off just for ease of demonstrating the effec


## VII: Geometry Shaders
#### Video Demonstration: https://youtu.be/EtXme23Iaxw

Since I am using a Windows 11 PC with a modern NVidia graphics card, I was able to utilize geometry shaders and do version A of this project. Using the geometry shader, I was able to take the 3D model of the cow and turn all of the vertices into crosses.

Conceptually this project wasn’t terribly challenging, but I was having trouble getting the math right for the crosses. I already had some practice using the geometry shader for the previous project so I already knew a bit more about how to work around the limitations of the geometry shader. In the end, the math for the crosses was way simpler than I would’ve expected, I just added or subtracted uSize to/from the XYZ coordinates of the relevant vertex before restoring it back to how it was and continuing to the next operation as demonstrated below.

The cross effect is controlled by three uniform variables that can be adjusted in GLMan; being uSize, uQuantize, and uLevel. uSize is used when generating the crosses and changes the size of the cross. uQuantize determines the density of the crosses, while uLevel determines the number of crosses. Something I noticed is that when I increased uLevel beyond 3, things start breaking down, the crosses form smaller, denser clusters when at level 2 and 3 the cow is densely populated and looks almost solid from a distance. It was strange, I figure it was because of the vertex limits of the geometry shader.
