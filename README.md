# BB-is-watching-you
A big smilley in a web page looking at you thanks to the webcam.

**[Try it online: https://baptistelabat.github.io/BB-is-watching-you/](https://baptistelabat.github.io/BB-is-watching-you/)**

Online
-------------
Once GitHub Pages is enabled for this repository (Settings > Pages > Deploy from a branch, `master` / root),
open [https://baptistelabat.github.io/BB-is-watching-you/](https://baptistelabat.github.io/BB-is-watching-you/),
click "Start the camera" and allow the camera.

Run locally
-------------
The [js-cam-motion](https://github.com/tjerkw/js-cam-motion) library is bundled in `lib/js-cam-motion`, so just clone and serve the repository:

    git clone https://github.com/baptistelabat/BB-is-watching-you.git
    cd BB-is-watching-you
    python3 -m http.server 8000

Now open a web browser and go to
[http://localhost:8000/BB-is-watching-you.html](http://localhost:8000/BB-is-watching-you.html),
click "Start the camera", allow the camera and enjoy.

Browser security notes:
- Browsers only give camera access to secure pages: open the page from `http://localhost` or over `https://`.
  Opening the file directly (`file://`) or from another machine over plain `http://` will not work.
- The camera prompt and the sounds only start after a click, as required by browser autoplay policies.
- `compat.js` adapts js-cam-motion (written for the old `getUserMedia` API) to the modern
  `navigator.mediaDevices.getUserMedia` API, and only asks for the camera, not the microphone.

You want more?
--------------
When the smiley sees you move, it plays a voice message: `output0.mp3`, then `output1.mp3`, ... up to `output5.mp3`,
then back to `output0.mp3`, with at least 3 seconds between two messages. The files are optional: without them it stays silent.

Use the following command to download some audio files ( here a girl voice saying "hello you!").
Rename them from output0.mp3 to output5.mp3 and put them in the directory

    curl -sG -A Mozilla -o output0.mp3 "https://translate.google.com/translate_tts" -d ie=UTF-8 -d client=tw-ob -d tl=en --data-urlencode "q=Hello you!"

Alternatively, just launch the script download.sh to get the joke I did to my flatmate!

    ./download.sh

To have the voices online too, commit the mp3 files and push them.
    
Aknowledgements
--------------
Emin Kura for sharing its [smilley following mouse](http://eminkura.com/blog/2012/03/04/following-eyes-with-html5-canvas/)
[Tjerk Wolterink](https://github.com/tjerkw) for sharing js-cam-motion

