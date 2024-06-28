# STORY refactor SectionTimeState.create to SectionData.getInTime

## TODO tests

---

# STORY add more time properties to SectionTimeState

## TODO

- rightTime: time to the right, measured from the left bound. can be negative.
- leftTime: time to the left, measured from the right bound. can be negative.
- outTime: time towards the end bound. "remaining time". can be negative.

## TODO implement getLeftTime and write tests

## TODO implement getRightTime and write tests

## TODO implement getOutTime and write tests

---

# STORY

I want to add "bounds behavior" to section data which describes how time behaves when out of bounds of section
This bound behavior

## TODO create BoundBehavior enum

- None (when overflowing in this direction, time is `null`)
- Free (when overflowing in this direction, inTime has no constraints)
- Clamp (when overflowing in this direction, inTime is clamped to [0, duration])
- Wrap (when overflowing in this direction, inTime is wrapped to the range of [0, duration])

## TODO add bound behavior param to getInTime, getOutTime, getLeftTime, and getRightTime

## TODO write tests

---

# STORY refactor use objects not arrays

---

# STORY TimelineState tests

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
