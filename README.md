# BB-is-watching-you
A big smilley in a web page looking at you thanks to the webcam. See the [online demo](http://www.nautilabs.com/js-cam-motion/samples/BB-is-watching-you/BB-is-watching-you.html)

Installation
-------------

First clone or download js-cam-motion library

    git clone https://github.com/tjerkw/js-cam-motion.git
  
Then go to samples file and clone BB-is-watching-you

    cd js-cam-motion
    cd samples
    git clone https://github.com/baptistelabat/BB-is-watching-you.git

Use
-------
Go back to the js-cam-motion root directory and launch a local web server

    cd ..
    python3 -m http.server 8000

Now open a web browser and go to :
[http://localhost:8000/samples/BB-is-watching-you/BB-is-watching-you.html](http://localhost:8000/samples/BB-is-watching-you/BB-is-watching-you.html)

Click "Start the camera", allow the camera and enjoy (tested on Chromium; Firefox should work too).

Browser security notes:
- Browsers only give camera access to secure pages: open the page from `http://localhost` or over `https://`.
  Opening the file directly (`file://`) or from another machine over plain `http://` will not work.
- The camera prompt and the sounds only start after a click, as required by browser autoplay policies.
- `compat.js` adapts js-cam-motion (written for the old `getUserMedia` API) to the modern
  `navigator.mediaDevices.getUserMedia` API, and only asks for the camera, not the microphone.

You want more?
--------------
Use the following command to download some audio files ( here a girl voice saying "hello you!").
Rename them from output0.mp3 to output5.mp3 and put them in the directory

    curl -sG -A Mozilla -o output0.mp3 "https://translate.google.com/translate_tts" -d ie=UTF-8 -d client=tw-ob -d tl=en --data-urlencode "q=Hello you!"

Alternatively, just launch the script download.sh to get the joke I did to my flatmate!

    ./download.sh
    
Aknowledgements
--------------
Emin Kura for sharing its [smilley following mouse](http://eminkura.com/blog/2012/03/04/following-eyes-with-html5-canvas/)
[Tjerk Wolterink](https://github.com/tjerkw) for sharing js-cam-motion

