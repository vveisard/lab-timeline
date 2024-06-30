# STORY add "position" property to TimeSectionState

Absolute axis position

---

# STORY

I want a "TimelineTimeState" struct
will contain "value" and "direction"

## TODO refactor all functions to take this struct

---

# STORY as a user of @vegabyte-studios/math

I want to add "bounds behavior" to section data which describes how time behaves when out of bounds of section
This bound behavior

## TODO create BoundBehavior enum

- None (when overflowing in this direction, time is `null`)
- Free (when overflowing in this direction, inTime has no constraints)
- Clamp (when overflowing in this direction, inTime is clamped to [0, duration])
- Wrap (when overflowing in this direction, inTime is wrapped to the range of [0, duration])

## TODO write tests for BoundBehavior in math test

---

## TODO add bound behavior param for getLeftTime, and getRightTime

---

# STORY as a user of @vegabyte-studios/base-lib-time, I want BoundBehaviorMode

## TODO add bound behavior for leftBoundBehavior and rightBoundBehavior for SectionData

---

# STORY as a developer, I want to use web-dev-server

---

# ACTION add to @yeano monorepo

---

# STORY

## DESIGN

As a user, I want a TimelineState.update function, so that I can efficiently update a TimelineState using immutable state update

---

# STORY TimelineState.updateStore function

## DESIGN

As a user, I want a TimelineState.updateStore function, so that I can efficiently update a Store<TimelineState> using a set store function

---

# STORY consider using records not arrays
