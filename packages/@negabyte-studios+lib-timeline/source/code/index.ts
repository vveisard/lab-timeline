// @region-start

/**
 * Status for an object with time.
 */
enum TimeStatus {
  None,
  Running,
  Completed,
}

export { TimeStatus };

// @region-end

// @region-start

/**
 * State for an object with time.
 */
interface TimeState {
  /**
   * Amount of time this object has been "run".
   * `null` when not {@link TimeStatus.None}.
   */
  readonly runTime: number | null;
  /**
   * Amount of times this object has been "run".
   * ie, frames.
   * `null` when not {@link TimeStatus.None}.
   */
  readonly runCount: number | null;
}

export { type TimeState };

// @region-end

// @region-start

/**
 * Run time for section params.
 */
enum SectionParamsRunType {
  RunTime,
  RunCount,
}

/**
 * Params for a section in a timeline.
 * Has a start run time, and an end
 */
interface SectionParams {
  readonly sectionRunType: SectionParamsRunType;
  /**
   * Time (of the timeline) when the section should start.
   */
  readonly startTime: number;

  /**
   * Time (of the timeline) when the section should end.
   * ie, the time (greater or equals) when the section should start.
   */
  readonly endTime: number;
}

namespace SectionParams {
  export function validate(
    self: SectionParams,
    sectionName?: string
  ): Error | undefined {
    if (self.endTime !== undefined && self.endTime < self.startTime) {
      return new Error(`Invalid argument! ${sectionName}: endTime < startTime`);
    }

    if (self.startTime < 0) {
      return new Error(`Invalid argument! ${sectionName}: startTime < 0`);
    }

    if (self.endTime < 0) {
      return new Error(`Invalid argument! ${sectionName}: endTime < 0`);
    }

    if (Number.isNaN(self.startTime)) {
      return new Error(
        `Invalid argument! ${sectionName}: startTime Number.isNaN`
      );
    }

    if (Number.isNaN(self.endTime)) {
      return new Error(
        `Invalid argument! ${sectionName}: endTime Number.isNaN`
      );
    }

    if (!Number.isFinite(self.startTime)) {
      return new Error(
        `Invalid argument! ${sectionName}: startTime !Number.isFinite`
      );
    }

    if (!Number.isFinite(self.endTime)) {
      return new Error(
        `Invalid argument! ${sectionName}: endTime !Number.isFinite`
      );
    }

    return undefined;
  }
}

export { SectionParamsRunType, SectionParams };

// @region-end

// @region-start

/**
 * Parameters for a timeline.
 */
interface TimelineParams {
  /**
   * Parameters for sections in this timeline, by section index.
   */
  readonly sectionParams: Array<SectionParams>;
}

/**
 * Functions for {@link TimelineWorld}.
 */
namespace TimelineParams {
  /**
   * throws an error if any section is invalid.
   */
  export function create(
    someSectionParams: Array<SectionParams>
  ): TimelineParams {
    // validate sections
    for (let i = 0; i < someSectionParams.length; i++) {
      // TODO move to "validateSectionParams" function
      const iSectionParam = someSectionParams[i];

      continue;
    }

    return {
      sectionParams: someSectionParams,
    };
  }
}

export { TimelineParams };

// @region-end

// @region-start

/**
 * State for a section in a timeline.
 */
interface SectionState {
  readonly timeStatus: TimeStatus;

  readonly timeState: TimeState;
}

namespace SectionState {
  /**
   * Range of [0-1].
   */
  export function getNormalizedSectionTime(
    sectionState: SectionState,
    sectionParams: SectionParams
  ): number {
    switch (sectionParams.sectionRunType) {
      case SectionParamsRunType.RunCount: {
        if (sectionState.timeState.runCount === null) {
          throw new Error(`Invalid state!`);
        }

        return (
          (sectionState.timeState.runCount - sectionParams.startTime) /
          (sectionParams.endTime - sectionParams.startTime)
        );
      }
      case SectionParamsRunType.RunTime: {
        if (sectionState.timeState.runTime === null) {
          throw new Error(`Invalid state!`);
        }

        return (
          (sectionState.timeState.runTime - sectionParams.startTime) /
          (sectionParams.endTime - sectionParams.startTime)
        );
      }
    }
  }
}

export { SectionState };

// @region-end

// @region-start

/**
 * State for a timeline.
 */
interface TimelineState {
  readonly timeStatus: TimeStatus;
  readonly timeState: TimeState;
  /**
   * State for sections in this timeline, by section index.
   */
  readonly sectionStates: Array<SectionState>;
}

/**
 * Functions for {@link TimelineState}.
 */
namespace TimelineState {
  export function create(sectionAmount: number): TimelineState {
    const sectionStates: Array<SectionState> = new Array(sectionAmount);
    for (
      let iSectionIndex = 0;
      iSectionIndex < sectionAmount;
      iSectionIndex++
    ) {
      sectionStates[iSectionIndex] = {
        timeStatus: TimeStatus.None,
        timeState: {
          runTime: null,
          runCount: null,
        },
      };
    }

    return {
      timeStatus: TimeStatus.None,
      timeState: {
        runTime: null,
        runCount: null,
      },
      sectionStates: sectionStates,
    };
  }

  /**
   * Update state of timeline, including all sections.
   * Immutable state update.
   * @param deltaTime amount of time to increment all time by.
   * @returns next timeline state, or `undefined` if no-op.
   */
  export function update(
    baseTimelineState: TimelineState,
    timelineParams: TimelineParams,
    deltaTime: number
  ): TimelineState | undefined {
    // TODO consider using draft library (immer or structura) for immutable state updates
    // TODO refactor each operation to its own function (advanceTimelineTime, updateSection, advanceSectionTime, etc)

    if (deltaTime === 0) {
      return undefined;
    }

    if (
      baseTimelineState.sectionStates.length !==
      timelineParams.sectionParams.length
    ) {
      throw new Error(
        `Invalid argument! section count in params and state are mismatched.`
      );
    }

    let varTimelineState: TimelineState = structuredClone(baseTimelineState);

    // start timeline
    if (varTimelineState.timeStatus === TimeStatus.None) {
      varTimelineState = {
        ...varTimelineState,
        timeStatus: TimeStatus.Running,
        timeState: {
          ...varTimelineState.timeState,
          runTime: 0,
          runCount: 0,
        },
      };
    }

    // advance timeline
    if (varTimelineState.timeStatus === TimeStatus.Running) {
      varTimelineState = {
        ...varTimelineState,
        timeState: {
          ...varTimelineState.timeState,
          runTime: varTimelineState.timeState.runTime! + deltaTime,
          runCount: varTimelineState.timeState.runCount! + 1,
        },
      };
    }

    // update sections
    for (
      let iSectionIndex = 0;
      iSectionIndex < baseTimelineState.sectionStates.length;
      iSectionIndex++
    ) {
      const iSectionParams = timelineParams.sectionParams[iSectionIndex];
      const iBaseSectionState = baseTimelineState.sectionStates[iSectionIndex];
      let iVarSectionState = iBaseSectionState;

      // start section
      if (iVarSectionState.timeStatus === TimeStatus.None) {
        if (
          (iSectionParams.sectionRunType === SectionParamsRunType.RunTime &&
            varTimelineState.timeState.runTime! >= iSectionParams.startTime) ||
          (iSectionParams.sectionRunType === SectionParamsRunType.RunCount &&
            varTimelineState.timeState.runCount! >= iSectionParams.startTime)
        ) {
          iVarSectionState = {
            timeStatus: TimeStatus.Running,
            timeState: {
              runTime: 0,
              runCount: 0,
            },
          };

          varTimelineState = {
            ...varTimelineState,
            sectionStates: [
              ...varTimelineState.sectionStates.slice(0, iSectionIndex),
              iVarSectionState,
              ...varTimelineState.sectionStates.slice(iSectionIndex + 1),
            ],
          };
        }
      }

      // run section
      if (iVarSectionState.timeStatus === TimeStatus.Running) {
        // advance section time
        iVarSectionState = {
          ...iVarSectionState,
          timeState: {
            ...iVarSectionState.timeState,
            runTime: Math.min(
              iVarSectionState.timeState.runTime! + deltaTime,
              iSectionParams.endTime
            ),
            runCount: iVarSectionState.timeState.runCount! + 1,
          },
        };

        // complete section
        if (
          (iSectionParams.sectionRunType === SectionParamsRunType.RunTime &&
            varTimelineState.timeState.runTime! >= iSectionParams.endTime) ||
          (iSectionParams.sectionRunType === SectionParamsRunType.RunCount &&
            varTimelineState.timeState.runCount! >= iSectionParams.endTime)
        ) {
          iVarSectionState = {
            ...iVarSectionState,
            timeStatus: TimeStatus.Completed,
          };
        }

        varTimelineState = {
          ...varTimelineState,
          sectionStates: [
            ...varTimelineState.sectionStates.slice(0, iSectionIndex),
            iVarSectionState,
            ...varTimelineState.sectionStates.slice(iSectionIndex + 1),
          ],
        };
      }
    }

    // complete timeline if
    // - every section is completed
    if (
      varTimelineState.sectionStates.every(
        (iSectionState) => iSectionState.timeStatus === TimeStatus.Completed
      )
    ) {
      varTimelineState = {
        ...varTimelineState,
        timeStatus: TimeStatus.Completed,
      };
    }

    return varTimelineState;
  }
}

export { TimelineState };

// @region-end
