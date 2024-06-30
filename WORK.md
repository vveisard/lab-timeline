# STORY delete all useless code and

I've realized that it's all useless. I can achieve everything explicitly with section data

## TODO in lib math, delete RangeState

including tests

## TODO in lib timline, delete all code

---

# STORY as a user of @vegabyte-studios/math

I want to add "bounds behavior" to RangeData which describes how time behaves when out of bounds of section
This bound behavior

## TODO create BoundBehavior enum

- None (when overflowing in this direction, time is `null`)
- Free (when overflowing in this direction, inTime has no constraints)
- Clamp (when overflowing in this direction, inTime is clamped to [0, duration])
- Wrap (when overflowing in this direction, inTime is wrapped to the range of [0, duration])

## TODO write tests for BoundBehavior in math test

---

## TODO add bound behavior param for getPositiveTime, and getNegativeTime

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
