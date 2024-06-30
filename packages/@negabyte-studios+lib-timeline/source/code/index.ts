// @region-start

import {
  AxisDirection,
  Float64,
  type RelativeAxisRangePosition,
} from "@negabyte-studios/lib-math";

// @region-end

// @region-start

/**
 * Data for a section in a timeline.
 */
interface SectionData {
  /**
   * Time (in the timeline) of the bound in the negative direction of an axis.
   */
  readonly minimumBoundTime: number;

  /**
   * Time (in the timeline) of the bound in the positive direction of an axis.
   */
  readonly maximumBoundTime: number;
}

namespace SectionData {
  export function getPositiveTime(
    self: SectionData,
    timelineTime: AxisDirection
  ): number {
    return timelineTime - self.minimumBoundTime;
  }
  export function getNegativeTime(
    self: SectionData,
    timelineTime: AxisDirection
  ): number {
    return self.maximumBoundTime - timelineTime;
  }

  export function validate(
    self: SectionData,
    sectionName?: string
  ): Error | undefined {
    if (
      self.maximumBoundTime !== undefined &&
      self.maximumBoundTime < self.minimumBoundTime
    ) {
      return new Error(
        `Invalid argument! ${sectionName}: rightBoundTime < leftBoundTime`
      );
    }

    if (self.minimumBoundTime < 0) {
      return new Error(`Invalid argument! ${sectionName}: leftBoundTime < 0`);
    }

    if (self.maximumBoundTime < 0) {
      return new Error(`Invalid argument! ${sectionName}: rightBoundTime < 0`);
    }

    if (Number.isNaN(self.minimumBoundTime)) {
      return new Error(
        `Invalid argument! ${sectionName}: leftBoundTime Number.isNaN`
      );
    }

    if (Number.isNaN(self.maximumBoundTime)) {
      return new Error(
        `Invalid argument! ${sectionName}: rightBoundTime Number.isNaN`
      );
    }

    if (!Number.isFinite(self.minimumBoundTime)) {
      return new Error(
        `Invalid argument! ${sectionName}: leftBoundTime !Number.isFinite`
      );
    }

    if (!Number.isFinite(self.maximumBoundTime)) {
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
  readonly inPosition: RelativeAxisRangePosition;
  /**
   * Amount of time into the section, measured from the "start" bound.
   * negative when time is before this section.
   */
  readonly inTime: number;

  /**
   * Amount of time into the section, measured from the minimum bound of this section.
   * Negative: time is less than the minimum bound
   */
  readonly positiveTime: number;

  /**
   * Amount of time into the section, measured from the maximum bound of this section.
   * Negative: time is greater than the maximum bound
   */
  readonly negativeTime: number;
}

namespace SectionTimeState {
  /**
   * Create {@link SectionTimeState} from a {@link SectionData}.
   */
  export function create(
    sectionData: SectionData,
    timelineTime: number,
    timelineDirection: AxisDirection
  ): SectionTimeState {
    const positiveTime = SectionData.getPositiveTime(sectionData, timelineTime);
    const negativeTime = SectionData.getNegativeTime(sectionData, timelineTime);
    const inPosition = Float64.getRelativeRangePosition(
      timelineTime,
      sectionData.minimumBoundTime,
      sectionData.maximumBoundTime,
      timelineDirection
    );

    switch (timelineDirection) {
      case AxisDirection.Positive: {
        // time is between bounds
        return {
          inPosition: inPosition,
          positiveTime: positiveTime,
          negativeTime: negativeTime,
          inTime: positiveTime,
        };
      }
      case AxisDirection.Negative: {
        // time is between bounds
        return {
          inPosition: inPosition,
          positiveTime: positiveTime,
          negativeTime: negativeTime,
          inTime: negativeTime,
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
    timelinetimelineDirection: AxisDirection
  ): SectionState {
    return {
      timeState: SectionTimeState.create(
        sectionDatas,
        timelineTime,
        timelinetimelineDirection
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
  readonly timelineDirection: AxisDirection;
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
    timelinetimelineDirection: AxisDirection
  ): TimelineState {
    const sectionStates = sectionDatas.map((i) =>
      SectionState.create(i, timelineTime, timelinetimelineDirection)
    );

    return {
      time: timelineTime,
      timelineDirection: timelinetimelineDirection,
      sectionStates: sectionStates,
    };
  }
}

export { TimelineState };

// @region-end
