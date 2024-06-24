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
 * Run time for clip params.
 */
enum ClipParamsRunType {
  RunTime,
  RunCount,
}

/**
 * Params for a clip in a timeline.
 * Has a start run time, and an end
 */
interface ClipParams {
  readonly clipRunType: ClipParamsRunType;
  /**
   * Time (of the timeline) when the clip should start.
   */
  readonly startTime: number;

  /**
   * Time (of the timeline) when the clip should end.
   * ie, the time (greater or equals) when the clip should start.
   */
  readonly endTime: number;
}

namespace ClipParams {
  export function validate(
    self: ClipParams,
    clipName?: string
  ): Error | undefined {
    if (self.endTime !== undefined && self.endTime < self.startTime) {
      return new Error(`Invalid argument! ${clipName}: endTime < startTime`);
    }

    if (self.startTime < 0) {
      return new Error(`Invalid argument! ${clipName}: startTime < 0`);
    }

    if (self.endTime < 0) {
      return new Error(`Invalid argument! ${clipName}: endTime < 0`);
    }

    if (Number.isNaN(self.startTime)) {
      return new Error(`Invalid argument! ${clipName}: startTime Number.isNaN`);
    }

    if (Number.isNaN(self.endTime)) {
      return new Error(`Invalid argument! ${clipName}: endTime Number.isNaN`);
    }

    if (!Number.isFinite(self.startTime)) {
      return new Error(
        `Invalid argument! ${clipName}: startTime !Number.isFinite`
      );
    }

    if (!Number.isFinite(self.endTime)) {
      return new Error(
        `Invalid argument! ${clipName}: endTime !Number.isFinite`
      );
    }

    return undefined;
  }
}

export { ClipParamsRunType, ClipParams };

// @region-end

// @region-start

/**
 * Parameters for a timeline.
 */
interface TimelineParams {
  /**
   * Parameters for clips in this timeline, by clip index.
   */
  readonly clipParams: Array<ClipParams>;
}

/**
 * Functions for {@link TimelineWorld}.
 */
namespace TimelineParams {
  /**
   * throws an error if any clip is invalid.
   */
  export function create(someClipParams: Array<ClipParams>): TimelineParams {
    // validate clips
    for (let i = 0; i < someClipParams.length; i++) {
      // TODO move to "validateClipParams" function
      const iClipParam = someClipParams[i];

      continue;
    }

    return {
      clipParams: someClipParams,
    };
  }
}

export { TimelineParams };

// @region-end

// @region-start

/**
 * State for a clip in a timeline.
 */
interface ClipState {
  readonly timeStatus: TimeStatus;

  readonly timeState: TimeState;
}

namespace ClipState {
  /**
   * Range of [0-1].
   */
  export function getNormalizedClipTime(
    clipState: ClipState,
    clipParams: ClipParams
  ): number {
    switch (clipParams.clipRunType) {
      case ClipParamsRunType.RunCount: {
        if (clipState.timeState.runCount === null) {
          throw new Error(`Invalid state!`);
        }

        return (
          (clipState.timeState.runCount - clipParams.startTime) /
          (clipParams.endTime - clipParams.startTime)
        );
      }
      case ClipParamsRunType.RunTime: {
        if (clipState.timeState.runTime === null) {
          throw new Error(`Invalid state!`);
        }

        return (
          (clipState.timeState.runTime - clipParams.startTime) /
          (clipParams.endTime - clipParams.startTime)
        );
      }
    }
  }
}

export { ClipState };

// @region-end

// @region-start

/**
 * State for a timeline.
 */
interface TimelineState {
  readonly timeStatus: TimeStatus;
  readonly timeState: TimeState;
  /**
   * State for clips in this timeline, by clip index.
   */
  readonly clipStates: Array<ClipState>;
}

/**
 * Functions for {@link TimelineState}.
 */
namespace TimelineState {
  export function create(clipAmount: number): TimelineState {
    const clipStates: Array<ClipState> = new Array(clipAmount);
    for (let iClipIndex = 0; iClipIndex < clipAmount; iClipIndex++) {
      clipStates[iClipIndex] = {
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
      clipStates: clipStates,
    };
  }

  /**
   * Update state of timeline, including all clips.
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
    // TODO refactor each operation to its own function (advanceTimelineTime, updateClip, advanceClipTime, etc)

    if (deltaTime === 0) {
      return undefined;
    }

    if (
      baseTimelineState.clipStates.length !== timelineParams.clipParams.length
    ) {
      throw new Error(
        `Invalid argument! clip count in params and state are mismatched.`
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

    // update clips
    for (
      let iClipIndex = 0;
      iClipIndex < baseTimelineState.clipStates.length;
      iClipIndex++
    ) {
      const iClipParams = timelineParams.clipParams[iClipIndex];
      const iBaseClipState = baseTimelineState.clipStates[iClipIndex];
      let iVarClipState = iBaseClipState;

      // start clip
      if (iVarClipState.timeStatus === TimeStatus.None) {
        if (
          (iClipParams.clipRunType === ClipParamsRunType.RunTime &&
            varTimelineState.timeState.runTime! >= iClipParams.startTime) ||
          (iClipParams.clipRunType === ClipParamsRunType.RunCount &&
            varTimelineState.timeState.runCount! >= iClipParams.startTime)
        ) {
          iVarClipState = {
            timeStatus: TimeStatus.Running,
            timeState: {
              runTime: 0,
              runCount: 0,
            },
          };

          varTimelineState = {
            ...varTimelineState,
            clipStates: [
              ...varTimelineState.clipStates.slice(0, iClipIndex),
              iVarClipState,
              ...varTimelineState.clipStates.slice(iClipIndex + 1),
            ],
          };
        }
      }

      // run clip
      if (iVarClipState.timeStatus === TimeStatus.Running) {
        // advance clip time
        iVarClipState = {
          ...iVarClipState,
          timeState: {
            ...iVarClipState.timeState,
            runTime: Math.min(
              iVarClipState.timeState.runTime! + deltaTime,
              iClipParams.endTime
            ),
            runCount: iVarClipState.timeState.runCount! + 1,
          },
        };

        // complete clip
        if (
          (iClipParams.clipRunType === ClipParamsRunType.RunTime &&
            varTimelineState.timeState.runTime! >= iClipParams.endTime) ||
          (iClipParams.clipRunType === ClipParamsRunType.RunCount &&
            varTimelineState.timeState.runCount! >= iClipParams.endTime)
        ) {
          iVarClipState = {
            ...iVarClipState,
            timeStatus: TimeStatus.Completed,
          };
        }

        varTimelineState = {
          ...varTimelineState,
          clipStates: [
            ...varTimelineState.clipStates.slice(0, iClipIndex),
            iVarClipState,
            ...varTimelineState.clipStates.slice(iClipIndex + 1),
          ],
        };
      }
    }

    // complete timeline if
    // - every clip is completed
    if (
      varTimelineState.clipStates.every(
        (iClipState) => iClipState.timeStatus === TimeStatus.Completed
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
