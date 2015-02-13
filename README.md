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
Go back to root directory and launch server

    cd ..
    ./serve.sh

Now open a web browser and go to :
[http://localhost:8000/samples/BB-is-watching-you/BB-is-watching-you.html](http://localhost:8000/samples/BB-is-watching-you/BB-is-watching-you.html)

Allow the camera (worked on chromium but not firefox for me) and enjoy.

You want more?
--------------
Use the following command to download some audio files ( here a girl voice saying "hello you!").
Rename them from output0.mp3 to output5.mp3 and put them in the directory

    wget -q -U Mozilla -O output.mp3 "http://translate.google.com/translate_tts?ie=UTF-8&tl=en&q=Hello you!"

Alternatively, just launch the script download.sh to get the joke I did to my flatmate!

    ./download.sh
