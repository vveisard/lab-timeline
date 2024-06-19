# EPIC Initial

## STORY as a user, I want basic timeline implementation

I will know this is working when:

- I can create a timeline

### TODO

very basic tests. Happy path, sad path.

---

# STORY As a user, I want startCount and endCount for params, so that I can control when a task starts

Currently tasks only have "time" instead, we would like tasks to optionally have "count" instead

## DESIGN

It's unclear if both bounds can both be defined. ie, is `startTime` and `startCount` valid? what would happen? I think you should only be able to specify time or count for both bounds at once, not mix and match or combine.

---

# EPIC usage example

## STORY as a user, I want a basic usage example

### ACCEPTANCE

I will know this is working when:

I can replicate Sonic Rush Adventure cutscenes

### DESIGN

Single threaded.

- a "dialog graphics world" to contain all the character entities
- dialog 2d graphics actor state with:

  - sprite asset id
  - sprite screen transform
  - sprite screen saturation

- a "dialog frontend world" world to contain

  - dialog box title text
  - dialog box content text

- a requestAnimationFrame

  - renders the dialog graphics world to the canvas

- some series of timeline factories
  - there's no need for "instructions"

---

# STORY as a user, I want timeline "speed", so that I can control how much time is added per update
