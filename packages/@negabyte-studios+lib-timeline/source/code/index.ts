// @region-start

import { Float64 } from "@negabyte-studios/lib-math";

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
  BeforeStart,
  /**
   * time is after end bound.
   * When time direction is right, time is right of the right bound.
   * When time direction is left, time is left of the left bound.
   */
  AfterEnd,
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
 * Data for a section in a timeline.
 */
interface SectionData {
  /**
   * Time (in the timeline) of the left bound.
   */
  readonly leftBoundTime: number;

  /**
   * Time (in the timeline) of the right bound.
   */
  readonly rightBoundTime: number;
}

namespace SectionData {
  export function getLeftTime(
    self: SectionData,
    timelineTime: TimeDirection
  ): number {
    return timelineTime - self.leftBoundTime;
  }
  export function getRightTime(
    self: SectionData,
    timelineTime: TimeDirection
  ): number {
    return self.rightBoundTime - timelineTime;
  }

  export function validate(
    self: SectionData,
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

export { SectionData };

// @region-end

// @region-start

/**
 * State of time for a {@link SectionState}.
 */
interface SectionTimeState {
  readonly status: TimeStatus;
  /**
   * Amount of time into the section, measured from the "start" bound.
   * negative when time is before this section.
   */
  readonly inTime: number;

  /**
   * Amount of time into the section, measured from the left bound of this section.
   * Negative: time is left of the left bound
   */
  readonly leftTime: number;

  /**
   * Amount of time into the section, measured from the right bound of this section.
   * Negative: time is right of the right bound
   */
  readonly rightTime: number;
}

namespace SectionTimeState {
  /**
   * Create {@link SectionTimeState} from a {@link SectionData}.
   */
  export function create(
    sectionData: SectionData,
    timelineTime: number,
    timeDirection: TimeDirection
  ): SectionTimeState {
    const leftTime = SectionData.getLeftTime(sectionData, timelineTime);
    const rightTime = SectionData.getRightTime(sectionData, timelineTime);

    switch (timeDirection) {
      case TimeDirection.Right: {
        // time is left of left bound
        if (timelineTime < sectionData.leftBoundTime) {
          return {
            status: TimeStatus.BeforeStart,
            leftTime: leftTime,
            rightTime: rightTime,
            inTime: leftTime,
          };
        }

        // time is at left bound
        if (timelineTime === sectionData.leftBoundTime) {
          return {
            status: TimeStatus.In,
            inTime: leftTime,
            leftTime: leftTime,
            rightTime: rightTime,
          };
        }

        // time is at right bound
        if (timelineTime === sectionData.rightBoundTime) {
          return {
            status: TimeStatus.In,
            leftTime: leftTime,
            rightTime: rightTime,
            inTime: leftTime,
          };
        }

        // time is right of right bound
        if (timelineTime > sectionData.rightBoundTime) {
          return {
            status: TimeStatus.AfterEnd,
            leftTime: leftTime,
            rightTime: rightTime,
            inTime: leftTime,
          };
        }

        // time is between bounds
        return {
          status: TimeStatus.In,
          leftTime: leftTime,
          rightTime: rightTime,
          inTime: leftTime,
        };
      }
      case TimeDirection.Left: {
        if (timelineTime > sectionData.rightBoundTime) {
          return {
            status: TimeStatus.BeforeStart,
            leftTime: leftTime,
            rightTime: rightTime,
            inTime: rightTime,
          };
        }

        if (timelineTime < sectionData.leftBoundTime) {
          return {
            status: TimeStatus.AfterEnd,
            leftTime: leftTime,
            rightTime: rightTime,
            inTime: rightTime,
          };
        }

        if (timelineTime === sectionData.leftBoundTime) {
          return {
            status: TimeStatus.In,
            leftTime: leftTime,
            rightTime: rightTime,
            inTime: rightTime,
          };
        }

        if (timelineTime === sectionData.rightBoundTime) {
          return {
            status: TimeStatus.In,
            leftTime: leftTime,
            rightTime: rightTime,
            inTime: rightTime,
          };
        }

        return {
          status: TimeStatus.In,
          leftTime: leftTime,
          rightTime: rightTime,
          inTime: rightTime,
        };
      }
      default: {
        throw new Error(`Invalid state!`);
      }
    }
  }
}

/**
 * State for a section in a timeline.
 */
interface SectionState {
  readonly timeState: SectionTimeState;
}

namespace SectionState {
  /**
   * Create new {@link SectionState}.
   */
  export function create(
    sectionDatas: SectionData,
    timelineTime: number,
    timelineTimeDirection: TimeDirection
  ): SectionState {
    return {
      timeState: SectionTimeState.create(
        sectionDatas,
        timelineTime,
        timelineTimeDirection
      ),
    };
  }
}

export { SectionState, SectionTimeState };

// @region-end

// @region-start

/**
 * State for a timeline.
 */
interface TimelineState {
  readonly time: number;
  readonly timeDirection: TimeDirection;
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
    sectionDatas: Array<SectionData>,
    timelineTime: number,
    timelineTimeDirection: TimeDirection
  ): TimelineState {
    const sectionStates = sectionDatas.map((i) =>
      SectionState.create(i, timelineTime, timelineTimeDirection)
    );

    return {
      time: timelineTime,
      timeDirection: timelineTimeDirection,
      sectionStates: sectionStates,
    };
  }
}

export { TimelineState };

// @region-end
