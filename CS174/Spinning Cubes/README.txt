Roland Zeng
204150508
CS174A Assignment 3: Textured Cubes

BIG NOTE: THIS DOES NOT WORK ON GOOGLE CHROME. I tested and made it work on Internet Explorer.

I did not use MV to implement this. I followed the Mozilla online tutorials which used the sylvester.js library.
Source: https://developer.mozilla.org/en-US/docs/Web/WebGL/Using_textures_in_WebGL

However, I still wrote a large majority of the code myself. The stuff I wrote has been commented thoroughly.

REQUIRED SECTION
------------------
1. Done. Note that my canvas is a bit smaller (640 x 480) since there was no explicit requirement and it looked better. 

2. Got two square images (mac & windows) onto texture maps. See Image folder

3. First cube is mac!

4. Second cube is windows! However I did not manage to get shrinking working, though I'm still using mip map filtering. 

5. First cube uses nearest-neighbor filtering. Second cube uses mip mapping. See lines 180 and 188. 

6. Both cubes are in view of camera 

7. 'i' zooms in, 'o' zooms out.

EXTRA CREDIT
----------------
1. 'r' starts/stops rotation. mac cube rotates around y axis, windows cube rotates around x axis. The windows cube rotates at half the speed of the mac cube (mac: 10rpm, windows: 5rpm)