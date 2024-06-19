# `lib-timeline`

This library is only concerned with time; It is up to you to determine "what do do" with the time.

# Summary

This library does not concern:

- scheduling
- animation
- messaging

It's up to you to decide what do with the time!

# Usage

1. `create`
2. `update`

Bring your own scheduler and messaging solution.

# API

Tracks which do not have an `timeEnd` must be manually ended.

# Cookbook

## Reveal characters in string

If you are revealing characters in a string, you be inclined to schedule each piece of text (word, sentence, etc) as its own track. Alternatively, you can reveal characters using a function.

- x is track run time
- y is number of characters revealed

In most cases, this reveal function is linear

- the slope is "characters per second"

If you want to do something juicey (like this)[https://youtu.be/v3FSsNA78iI?t=89] your "reveal function" could be a step function.
