# STORY

## TODO refactor TimeStatus to Math getRange(value) which returns (-2, -1, 0, 1, 2)

## TODO refactor SectionTimeState.create to use getTimeStatus

---

# STORY

## TODO implement getOutTime and update tests

## TODO implement get

---

# STORY

I want a "TimelineTimeState" struct
will contain "value" and "direction"

## TODO refactor all functions to take this

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
