# STORY refactor getRelativeIn

## TODO add RangeData.getRelativeIn(value, bound, direction)

## TODO add tests for RangeData.get

---

# STORY as a user of @vegabyte-studios/base-lib-math

I want to add "bounds behavior" to RangeData functions which describes how time behaves when out of bounds of range

## TODO create BoundBehavior enum

- None (when overflowing in this direction, time is `null`)
- Free (when overflowing in this direction, inTime has no constraints)
- Clamp (when overflowing in this direction, inTime is clamped to [0, duration])
- Wrap (when overflowing in this direction, inTime is wrapped to the range of [0, duration])

## TODO write tests for BoundBehavior in math test for Float64

---

# STORY as a developer, I want to use web-dev-server for examples

---

# STORY as a package consumer of @vegabyte-studios/base-lib-math, I want looping section usage example

---

# ACTION create and add to new @vegabyte-studios "project" monorepo

---

# ACTION put the rest of these functions into

create the following story in GitLab

```markdown
# STORY consider using records not arrays

---

# STORY RangeData.getRelativeIn

## TODO add RangeData.getRelativeIn(self, value, direction)

## TODO add tests

---

# STORY RangeData.getRelativeOut

## TODO add RangeData.getRelativeOut(self, value, direction)

## TODO add tests for RangeData.get
```
