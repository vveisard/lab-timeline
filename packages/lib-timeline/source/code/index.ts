/**
 * Status for an object with time.
 */
enum TimeStatus {
  None,
  Running,
  Completed,
}

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

/**
 * Params for a clip in a timeline.
 */
interface ClipParams {
  /**
   * Time (wrt the timeline) when the clip should start.
   */
  readonly startTime: number;

  /**
   * Time (wrt timeline) when the clip should end.
   * ie, the time (greater or equals) when the clip should start.
   */
  readonly endTime: number;
}

/**
 * State for a clip in a timeline.
 */
interface ClipState {
  readonly status: TimeStatus;

  readonly time: TimeState;
}

/**
 * Parameters for a timeline.
 */
interface TimelineParams {
  /**
   * Parameters for clips in this timeline, by clip index.
   */
  readonly clips: Array<ClipParams>;
}

// @region-start

/**
 * State for a timeline.
 */
interface TimelineState {
  readonly status: TimeStatus;
  readonly time: TimeState;
  /**
   * State for clips in this timeline, by clip index.
   */
  readonly clips: Array<ClipState>;
}

/**
 * Functions for {@link TimelineState}.
 */
namespace TimelineState {
  export function create(clipAmount: number): TimelineState {
    const clipStates = new Array(clipAmount);
    for (let i = 0; i < clipAmount; i++) {
      clipStates[i] = {
        status: TimeStatus.None,
        time: {
          runningTime: null,
          runningUpdateCount: null,
        },
      };
    }

    return {
      status: TimeStatus.None,
      time: {
        runTime: null,
        runCount: null,
      },
      clips: clipStates,
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
    params: TimelineParams,
    deltaTime: number
  ): TimelineState | undefined {
    // TODO consider using draft library (immer or structura) for immutable state updates
    // TODO refactor each operation to its own function (advanceTimelineTime, updateClip, advanceClipTime, etc)

    if (deltaTime === 0) {
      return undefined;
    }

    if (baseTimelineState.clips.length !== params.clips.length) {
      throw new Error(
        `Invalid argument! clip count in params and state are mismatched.`
      );
    }

    let varTimelineState: TimelineState = structuredClone(baseTimelineState);

    // start timeline
    if (varTimelineState.status === TimeStatus.None) {
      varTimelineState = {
        ...varTimelineState,
        status: TimeStatus.Running,
        time: {
          ...varTimelineState.time,
          runTime: 0,
          runCount: 0,
        },
      };
    }

    // advance timeline
    varTimelineState = {
      ...varTimelineState,
      time: {
        ...varTimelineState.time,
        runTime: varTimelineState.time.runTime! + deltaTime,
        runCount: varTimelineState.time.runCount! + 1,
      },
    };

    // update clips
    for (
      let iClipIndex = 0;
      iClipIndex < baseTimelineState.clips.length;
      iClipIndex++
    ) {
      const iClipParams = params.clips[iClipIndex];
      const iBaseClipState = baseTimelineState.clips[iClipIndex];
      let iVarClipState = iBaseClipState;

      // start clip
      if (iVarClipState.status === TimeStatus.None) {
        if (varTimelineState.time.runTime! >= iClipParams.startTime) {
          iVarClipState = {
            status: TimeStatus.Running,
            time: {
              runTime: 0,
              runCount: 0,
            },
          };

          varTimelineState = {
            ...varTimelineState,
            clips: [
              ...varTimelineState.clips.slice(0, iClipIndex),
              iVarClipState,
              ...varTimelineState.clips.slice(iClipIndex + 1),
            ],
          };
        }
      }

      // run clip
      if (iVarClipState.status === TimeStatus.Running) {
        // advance clip time
        iVarClipState = {
          ...iVarClipState,
          time: {
            ...iVarClipState.time,
            runTime: iVarClipState.time.runTime! + deltaTime,
            runCount: iVarClipState.time.runCount! + 1,
          },
        };

        // complete clip
        if (varTimelineState.time.runTime! >= iClipParams.endTime) {
          iVarClipState = {
            ...iVarClipState,
            status: TimeStatus.Completed,
          };
        }

        varTimelineState = {
          ...varTimelineState,
          clips: [
            ...varTimelineState.clips.slice(0, iClipIndex),
            iVarClipState,
            ...varTimelineState.clips.slice(iClipIndex + 1),
          ],
        };
      }
    }

    // complete timeline if
    // - every clip is completed
    if (
      varTimelineState.clips.every(
        (iClipState) => iClipState.status === TimeStatus.Completed
      )
    ) {
      varTimelineState = {
        ...varTimelineState,
        status: TimeStatus.Completed,
      };
    }

    return varTimelineState;
  }
}

export { type TimelineParams, TimelineState };

// @region-end

// @region-start

/**
 * World for a timeline.
 */
interface TimelineWorld {
  /**
   * Parameters for the timeline.
   */
  readonly params: TimelineParams;

  /**
   * State for the timeline.
   * @remarks
   * May be synced from upstream.
   */
  readonly state: TimelineState;
}

/**
 * Functions for {@link TimelineWorld}.
 */
namespace TimelineWorld {
  export function create(clipParams: Array<ClipParams>): TimelineWorld {
    // validate clips
    for (let i = 0; i < clipParams.length; i++) {
      // TODO move to "validateClipParams" function
      const iClipParam = clipParams[i];

      if (iClipParam.endTime < iClipParam.startTime) {
        throw new Error(
          `Invalid argument! Clip at index ${i}: endTime < startTime`
        );
      }

      if (iClipParam.startTime < 0) {
        throw new Error(`Invalid argument! Clip at index ${i}: startTime < 0`);
      }

      if (iClipParam.endTime < 0) {
        throw new Error(`Invalid argument! Clip at index ${i}: endTime < 0`);
      }

      if (Number.isNaN(iClipParam.startTime)) {
        throw new Error(
          `Invalid argument! Clip at index ${i}: startTime Number.isNaN`
        );
      }

      if (Number.isNaN(iClipParam.endTime)) {
        throw new Error(
          `Invalid argument! Clip at index ${i}: endTime Number.isNaN`
        );
      }

      if (!Number.isFinite(iClipParam.startTime)) {
        throw new Error(
          `Invalid argument! Clip at index ${i}: startTime !Number.isFinite`
        );
      }

      if (!Number.isFinite(iClipParam.endTime)) {
        throw new Error(
          `Invalid argument! Clip at index ${i}: endTime !Number.isFinite`
        );
      }

      continue;
    }

    return {
      state: TimelineState.create(clipParams.length),
      params: {
        clips: clipParams,
      },
    };
  }
}

export { TimelineWorld };

// @region-end

export { TimeStatus, type ClipParams, type TimeState, type ClipState };
