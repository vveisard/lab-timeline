# `lib-timeline`

This library is only concerned with the state (time and status) of timeline and sections within a timeline; It is up to you to determine "what do" with the time.

# Summary

This library does not concern:

- scheduling
- animation
- messaging
- tracks
- blending

It's up to you to decide what do with the time!

# Concepts

Timeline contains timeline sections. From here on, we'll refer to "timeline sections" as "sections".

Sections have a _left bound_ and a _right bound_.

"time" is unitless parameter.

Time has a direction.

you can determine the _time in_ the section given a timeline time, time direction, section left bound, and section right bound.

Both timelines and their section have _status_:

- Before
- In
- After

# Usage

Developers can use the _time in_ a section to drive animation.

There are generally two ways to use this library:

- you can use timeline state direclty in your render layer in an update (animation frame)
- you can write the next timeline state to a store, and update objects in your render layer in effects

# Cookbook

## Reveal characters in string

If you are revealing characters in a string, you may be inclined to schedule each piece of text (word, sentence, etc) as its own section. Alternatively, you can reveal characters using a function.

- x is the run time of the section
- y is number of characters revealed

In most cases, this reveal function is linear and the slope is "characters per unit of time"

If you want to do something juicey (like this)[https://youtu.be/v3FSsNA78iI?t=89] your "reveal function" could be a step function.

# Future Work

## Reverse time

There is no reverse time; it's unclear what
