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

Messages (French voice)
--------------
When the smiley sees you move, it says a message with the browser's speech synthesis, in French,
going through the 5 messages one after the other, with at least 3 seconds between two messages.

Open [messages.html](https://baptistelabat.github.io/BB-is-watching-you/messages.html)
(also linked from the main page as "Edit the messages") to:
- write the 5 messages (leave one empty to skip it) and listen to them,
- choose a French voice among the ones installed on your computer,
- save them in this browser, or copy a link that carries the messages to use them on another device.

The available voices depend on the browser and the operating system. If no French voice is installed,
the browser uses its default voice.

On Linux, the browser gets its voices from speech-dispatcher:
- check that it speaks: `spd-say -l fr bonjour` (if not, install `speech-dispatcher-espeak-ng`),
- Google Chrome / Chromium must be started with `--enable-speech-dispatcher`
  (close all its windows first), e.g. `google-chrome --enable-speech-dispatcher`,
- Firefox installed as a snap or Flatpak may not reach speech-dispatcher from its sandbox.

Aknowledgements
--------------
Emin Kura for sharing its [smilley following mouse](http://eminkura.com/blog/2012/03/04/following-eyes-with-html5-canvas/)
[Tjerk Wolterink](https://github.com/tjerkw) for sharing js-cam-motion

