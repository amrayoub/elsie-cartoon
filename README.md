
# "E" for Elsie

_Fifth letter of the alphabet; fifth attempt to get off the ground with Ionic 2. Imagine me, a flashlight, a dark forest: Where is anything? Why did I fall into this ravine again?_

Taking a bunch of pictures is easy. Grouping them together in logical units after the fact is easy... until the images become ambiguous and the "grouper" isn't the photographer. Was that three pictures of a snooker ball or one photo each of three snooker balls?

This project aims to fix that problem by forcing the photographer to make a rudimentary declaration of intent before gaining access to the camera app. The camera app is set for multi-capture but is arbitrarily limited to X photos per multi-session. When the session is finished, the photographer is once more asked to declare what s/he's doing before getting back to the camera.

The organizing context is Things in Boxes.

Example: Here's a box of things, let's do this one.

1. navigate to the "box" page
7. poke the "new box" button
7. take a picture of the box.
7. navigate to the "cam" page
7. poke the "add thing" button
7. take as many photos of the first Thing as appropriate
7. repeat #5 and #6 until all the Things have been photographed
7. start over at #2 for the next Box

## Some goals

_Having a functional app, of course, was a vehicle. Along the way I wanted to at least begin understanding how Angular 2 works and how to utilize Storage and Services._

There is no architecture, no engineering. This is a patchwork quilt of trial-and-error code (I use the term loosely), too much of which is cobbed straight outta google. Sensible and foolish approaches alike were often stopped dead in their tracks due to some still-mysterious incantation that I simply do not know. There's a lot that I do not understand. Thus my so-called solutions are needlessly convoluted. This code stinks.

* SQLite wouldn't load on the device, thus there's a key/value storage and all the jungle-gymnastics that goes along with.
* App always fails with a dumb 404-ish error on first start.
* I still don't quite _get_ Promises even after all this effort, although async/await is absolutly awesome.
* XWalk is possibly slowing things down but... my device needs it, though.
* Cordova plugins report slow startup.
* Way, way too many duplicate and/or `this.global` variables
* Duplicate work is being done all over the place
* I guess I'm trying to build an ORM; I'm probably not ready for doing that, but...

## Back in the cafe

After shooting "a roll" of pictures, what next? This:

1. Copy the `files` directory from [Android, what happened to [The Filesystem Heirarchy Standard](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard)? Seriously, you're drunk.] the _app_ directory to a server somewhere
7. Process the images, using the "jayson.txt" file which, some of the time, contains actual JSON data.
7. Find the button on the "home" page that nukes the Storage system (this is kinda important).
7. Go back for more Things in Boxes.

## -30-
I learned a lot. As I find time to think about it and read more deeply, sensible approaches ought to make their way in. Heck, someday I might even write a test.
