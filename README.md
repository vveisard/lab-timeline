# `lib-timeline`

This tracks _only_ time; It is up to you to determine "what do do" with the time.

# Summary

This library does not contain:

- scheduler
- animations
- messaging

It's up to you to decide what do with the timeline, and to complete tasks yourself.

# Usage

1. `create`
2. `update`

Bring your own scheduler and messaging solution.

# API

Tasks which do not have an `timeEnd` must be manually ended.

# Cookbook

## VN dialog engine

If you are making a dialog engine, you be inclined to schedule each character as its own task. Alternatively, you can reveal characters using a function.

In most cases, this reveal function is linear

- x is task run time
- y is number of characters revealed
- the slope is "characters per second"

If you want to do (something juicey)[https://youtu.be/v3FSsNA78iI?t=89] your "reveal function" could be a step function.
