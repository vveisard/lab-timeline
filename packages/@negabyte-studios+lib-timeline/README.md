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

Timeline and sections have _time state_.

The state of a timeline and its sections are updated using an `update` function. As a developer, you will invoke `update` using a schedule.

Both timelines and their section have _status_:

- None
- Running
- Completed

"run time" which is the amount of time the object has been "running" and _run count_ which is the amount of times the object has been updated while its status is "run".

A section has params which describe when the section "starts" and "ends".

From the time state, the start time and end time params, you can determine _progress_ for the section.

Developers can use the progress of a section to drive animation.

# Usage

"time" is unitless.

This library is state-driven; there are no events. We encourage you to use a reactive state library and "subscribe" to state changes using effects. Personally we reccomend [solid-js](https://www.solidjs.com/).

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
