# `lib-timeline`

This library is only concerned with the state (time and status) of timeline and clips within a timeline; It is up to you to determine "what do" with the time.

# Summary

This library does not concern:

- scheduling
- animation
- messaging
- tracks
- blending

It's up to you to decide what do with the time!

# Usage

"time" is unitless.

This library is state-driven; there are no events. We encourage you to use a reactive state library and "subscribe" to state changes using effects. Personally we reccomend [solid-js](https://www.solidjs.com/).

# Cookbook

## Reveal characters in string

If you are revealing characters in a string, you may be inclined to schedule each piece of text (word, sentence, etc) as its own clip. Alternatively, you can reveal characters using a function.

- x is the run time of the clip
- y is number of characters revealed

In most cases, this reveal function is linear and the slope is "characters per unit of time"

If you want to do something juicey (like this)[https://youtu.be/v3FSsNA78iI?t=89] your "reveal function" could be a step function.
