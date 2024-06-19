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
 * Params for a track in a timeline.
 */
interface TrackParams {
  /**
   * Time (wrt the timeline) when the track should start.
   */
  readonly startTime: number;

  /**
   * Time (wrt timeline) when the track should end.
   * ie, the time (greater or equals) when the track should start.
   */
  readonly endTime: number;
}

/**
 * State for a track in a timeline.
 */
interface TrackState {
  readonly status: TimeStatus;

  readonly time: TimeState;
}

/**
 * State for a timeline.
 */
interface TimelineState {
  readonly status: TimeStatus;
  readonly time: TimeState;
  /**
   * State for tracks in this timeline, by track index.
   */
  readonly tracks: Array<TrackState>;
}

/**
 * Parameters for a timeline.
 */
interface TimelineParams {
  /**
   * Parameters for tracks in this timeline, by track index.
   */
  readonly tracks: Array<TrackParams>;
}

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
 * Functions for {@link TimelineState}.
 */
namespace TimelineState {
  export function create(trackAmount: number): TimelineState {
    const trackStates = new Array(trackAmount);
    for (let i = 0; i < trackAmount; i++) {
      trackStates[i] = {
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
      tracks: trackStates,
    };
  }

  /**
   * Update state of timeline, including all tracks.
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
    // TODO refactor each operation to its own function (advanceTimelineTime, updateTrack, advanceTrackTime, etc)

    if (deltaTime === 0) {
      return undefined;
    }

    let varTimelineState: TimelineState = structuredClone(baseTimelineState);

    // start timeline
    if (varTimelineState.status === TimeStatus.None) {
      varTimelineState = {
        ...varTimelineState,
        status: TimeStatus.Completed,
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

    // update tracks
    for (
      let iTrackIndex = 0;
      iTrackIndex < baseTimelineState.tracks.length;
      iTrackIndex++
    ) {
      const iTrackParams = params.tracks[iTrackIndex];
      const iBaseTrackState = baseTimelineState.tracks[iTrackIndex];
      let iVarTrackState = iBaseTrackState;

      // start track
      if (iVarTrackState.status === TimeStatus.None) {
        if (varTimelineState.time.runTime! >= iTrackParams.startTime) {
          iVarTrackState = {
            status: TimeStatus.Running,
            time: {
              runTime: 0,
              runCount: 0,
            },
          };

          varTimelineState = {
            ...varTimelineState,
            tracks: [
              ...varTimelineState.tracks.slice(0, iTrackIndex),
              iVarTrackState,
              ...varTimelineState.tracks.slice(iTrackIndex + 1),
            ],
          };
        }
      }

      // run track
      if (iVarTrackState.status === TimeStatus.Running) {
        // advance track time
        iVarTrackState = {
          ...iVarTrackState,
          time: {
            ...iVarTrackState.time,
            runTime: iVarTrackState.time.runTime! + deltaTime,
            runCount: iVarTrackState.time.runCount! + 1,
          },
        };

        // complete track
        if (iVarTrackState.time.runTime! >= iTrackParams.endTime) {
          iVarTrackState = {
            ...iVarTrackState,
            status: TimeStatus.Completed,
          };
        }

        varTimelineState = {
          ...varTimelineState,
          tracks: [
            ...varTimelineState.tracks.slice(0, iTrackIndex),
            iVarTrackState,
            ...varTimelineState.tracks.slice(iTrackIndex + 1),
          ],
        };
      }
    }

    // complete timeline if
    // - every track is completed
    if (
      baseTimelineState.tracks.every((i) => i.status === TimeStatus.Completed)
    ) {
      varTimelineState = {
        ...varTimelineState,
        status: TimeStatus.Completed,
      };
    }

    return varTimelineState;
  }
}

/**
 * Functions for {@link TimelineWorld}.
 */
namespace TimelineWorld {
  export function create(...tracksParams: Array<TrackParams>): TimelineWorld {
    // validate tracks
    for (let i = 0; i < tracksParams.length; i++) {
      const iTrackParam = tracksParams[i];

      if (iTrackParam.endTime < iTrackParam.startTime) {
        throw new Error(
          `Invalid argument! Track at index ${i}: endTime < startTime`
        );
      }

      continue;
    }

    return {
      state: TimelineState.create(tracksParams.length),
      params: {
        tracks: tracksParams,
      },
    };
  }
}

export {
  TimeStatus,
  type TimelineWorld,
  type TrackParams,
  type TimeState,
  type TrackState,
};
