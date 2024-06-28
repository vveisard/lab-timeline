// @region-start

/**
 * Relative to the time direction.
 */
enum TimeStatus {
  /**
   * Time is at or between bounds.
   */
  In,
  /**
   * Time is before start bound.
   * When time direction is right, time is right of the right bound.
   * When time direction is left, time is left of the left bound.
   */
  Before,
  /**
   * time is after end bound.
   * When time direction is right, time is right of the right bound.
   * When time direction is left, time is left of the left bound.
   */
  After,
}

export { TimeStatus };

// @region-end

// @region-start

enum TimeDirection {
  Right,
  Left,
}

export { TimeDirection };

// @region-end

// @region-start

/**
 * State for an object with time.
 */
interface TimeState {
  readonly status: TimeStatus;
  /**
   * Amount of time in this section from the "start" bound.
   * `null` when not into this section.
   */
  readonly inTime: number | null;
}

namespace TimeState {
  /**
   * Create {@link TimeState} from a {@link SectionParams}.
   */
  export function create(
    sectionParams: SectionParams,
    time: number,
    timeDirection: number
  ): TimeState {
    switch (timeDirection) {
      case TimeDirection.Right: {
        if (time < sectionParams.leftBoundTime) {
          return {
            status: TimeStatus.Before,
            inTime: null,
          };
        }

        if (time === sectionParams.leftBoundTime) {
          return {
            status: TimeStatus.In,
            inTime: 0,
          };
        }

        if (time === sectionParams.rightBoundTime) {
          return {
            status: TimeStatus.In,
            inTime: sectionParams.rightBoundTime - sectionParams.leftBoundTime,
          };
        }

        if (time > sectionParams.rightBoundTime) {
          return {
            status: TimeStatus.After,
            inTime: sectionParams.rightBoundTime - sectionParams.leftBoundTime,
          };
        }

        return {
          status: TimeStatus.In,
          inTime: time - sectionParams.leftBoundTime,
        };
      }
      case TimeDirection.Left: {
        if (time > sectionParams.rightBoundTime) {
          return {
            status: TimeStatus.Before,
            inTime: null,
          };
        }

        if (time < sectionParams.leftBoundTime) {
          return {
            status: TimeStatus.After,
            inTime: sectionParams.rightBoundTime - sectionParams.leftBoundTime,
          };
        }

        if (time === sectionParams.leftBoundTime) {
          return {
            status: TimeStatus.In,
            inTime: sectionParams.leftBoundTime,
          };
        }

        if (time === sectionParams.rightBoundTime) {
          return {
            status: TimeStatus.In,
            inTime: 0,
          };
        }

        return {
          status: TimeStatus.In,
          inTime: sectionParams.rightBoundTime - time,
        };
      }
      default: {
        throw new Error(`Invalid state!`);
      }
    }
  }
}

export { TimeState };

// @region-end

// @region-start

/**
 * Params for a section in a timeline.
 * Has a start run time, and an end
 */
interface SectionParams {
  /**
   * Time (of the timeline) of the left bound.
   */
  readonly leftBoundTime: number;

  /**
   * Time (of the timeline) of the right bound.
   */
  readonly rightBoundTime: number;
}

namespace SectionParams {
  export function validate(
    self: SectionParams,
    sectionName?: string
  ): Error | undefined {
    if (
      self.rightBoundTime !== undefined &&
      self.rightBoundTime < self.leftBoundTime
    ) {
      return new Error(
        `Invalid argument! ${sectionName}: rightBoundTime < leftBoundTime`
      );
    }

    if (self.leftBoundTime < 0) {
      return new Error(`Invalid argument! ${sectionName}: leftBoundTime < 0`);
    }

    if (self.rightBoundTime < 0) {
      return new Error(`Invalid argument! ${sectionName}: rightBoundTime < 0`);
    }

    if (Number.isNaN(self.leftBoundTime)) {
      return new Error(
        `Invalid argument! ${sectionName}: leftBoundTime Number.isNaN`
      );
    }

    if (Number.isNaN(self.rightBoundTime)) {
      return new Error(
        `Invalid argument! ${sectionName}: rightBoundTime Number.isNaN`
      );
    }

    if (!Number.isFinite(self.leftBoundTime)) {
      return new Error(
        `Invalid argument! ${sectionName}: leftBoundTime !Number.isFinite`
      );
    }

    if (!Number.isFinite(self.rightBoundTime)) {
      return new Error(
        `Invalid argument! ${sectionName}: rightBoundTime !Number.isFinite`
      );
    }

    return undefined;
  }
}

export { SectionParams };

// @region-end

// @region-start

/**
 * State for a section in a timeline.
 */
interface SectionState {
  readonly timeState: TimeState;
}

namespace SectionState {
  /**
   * Create state of a section in a timeline.
   */
  export function create(
    sectionParams: SectionParams,
    timelineTime: number,
    timelineTimeDirection: TimeDirection
  ): SectionState {
    return {
      timeState: TimeState.create(
        sectionParams,
        timelineTime,
        timelineTimeDirection
      ),
    };
  }
}

export { SectionState };

// @region-end

// @region-start

/**
 * State for a timeline.
 */
interface TimelineState {
  readonly timeState: TimeState;
  readonly sectionStates: Array<SectionState>;
}

/**
 * Functions for {@link TimelineState}.
 */
namespace TimelineState {
  /**
   * Create state of a timeline.
   */
  export function create(
    sectionParams: Array<SectionParams>,
    timelineTime: number,
    timelineTimeDirection: TimeDirection
  ): TimelineState {
    const sectionStates = sectionParams.map((i) =>
      SectionState.create(i, timelineTime, timelineTimeDirection)
    );

    if (sectionStates.every((i) => i.timeState.status === TimeStatus.After)) {
      return {
        timeState: {
          inTime: timelineTime,
          status: TimeStatus.After,
        },
        sectionStates: sectionStates,
      };
    }

    if (sectionStates.every((i) => i.timeState.status === TimeStatus.Before)) {
      return {
        timeState: {
          inTime: timelineTime,
          status: TimeStatus.Before,
        },
        sectionStates: sectionStates,
      };
    }

    return {
      timeState: {
        inTime: timelineTime,
        status: TimeStatus.In,
      },
      sectionStates: sectionStates,
    };
  }
}

export { TimelineState };

// @region-end
