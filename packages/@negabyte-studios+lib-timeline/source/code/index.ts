// @region-start

import { RangeData, RangeState } from "@negabyte-studios/lib-math";

// @region-end

// @region-start

/**
 * State for a section in a timeline.
 */
interface SectionState {
  readonly timeState: RangeState;
}

namespace SectionState {
  /**
   * Create new {@link SectionState}.
   */
  export function create(
    sectionRangeDatas: RangeData,
    timelineTime: number
  ): SectionState {
    return {
      timeState: RangeState.create(sectionRangeDatas, timelineTime),
    };
  }
}

// @region-end

// @region-start

/**
 * State for a timeline.
 */
interface TimelineState {
  readonly time: number;
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
    sectionRangeDatas: Array<RangeData>,
    timelineTime: number
  ): TimelineState {
    const sectionStates = sectionRangeDatas.map((i) =>
      SectionState.create(i, timelineTime)
    );

    return {
      time: timelineTime,
      sectionStates: sectionStates,
    };
  }
}

export { TimelineState };

// @region-end
