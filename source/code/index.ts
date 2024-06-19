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
 * Params for a task in a timeline.
 */
interface BaseTimelineTaskParams {
  /**
   * Start time, relative to the start of the timeline, when the task should start.
   */
  readonly startTime: number;

  /**
   * End time, relative to the end of the timeline, when the task should end.
   * ie, the time (greater or equals) when the task should start.
   * When missing, the task does not end.
   */
  readonly endTime?: number;
}

/**
 * State for a task in a timeline.
 */
interface TimelineTaskState {
  readonly status: TimeStatus;

  readonly time: TimeState;
}

/**
 * State for a timeline.
 */
interface TimelineState {
  readonly status: TimeStatus;
  readonly time: TimeState;
  readonly tasks: Array<TimelineTaskState>;
}

/**
 * Parameters for a timeline.
 */
interface TimelineParams<TTimelineTaskParams extends BaseTimelineTaskParams> {
  readonly tasks: Array<TTimelineTaskParams>;
}

/**
 * World for a timeline.
 */
interface TimelineWorld<TTimelineTaskParams extends BaseTimelineTaskParams> {
  /**
   * Parameters for the timeline.
   */
  readonly params: TimelineParams<TTimelineTaskParams>;

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
  export function create(taskAmount: number): TimelineState {
    const taskStates = new Array(taskAmount);
    for (let i = 0; i < taskAmount; i++) {
      taskStates[i] = {
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
      tasks: taskStates,
    };
  }

  /**
   * Update state of timeline, including all tasks.
   * Immutable state update.
   * @param deltaTime amount of time to increment all time by.
   * @returns next timeline state, or `undefined` if no-op.
   */
  export function update<T1 extends BaseTimelineTaskParams>(
    state: TimelineState,
    params: TimelineParams<T1>,
    deltaTime: number
  ): TimelineState | undefined {
    if (deltaTime === 0) {
      return undefined;
    }

    // TODO update each task state (set to running, increment time, set to completed)
    // TODO update timeline state (set to running, increment time, set to completed)
    throw new Error(`Not implemented!`);
  }

  /**
   *
   * Immutable state update.
   * @throws if the task is not in the correct status or the task has an end time.
   */
  export function completeTask<T1 extends BaseTimelineTaskParams>(
    state: TimelineState,
    params: TimelineParams<T1>,
    targetTaskIndex: number
  ): TimelineState {
    // TODO throw when has task params endTime
    throw new Error(`Not implemented!`);
  }
}

/**
 * Functions for {@link TimelineWorld}.
 */
namespace TimelineWorld {
  export function create<T1 extends BaseTimelineTaskParams>(
    ...tasksParams: Array<T1>
  ): TimelineWorld<T1> {
    return {
      state: TimelineState.create(tasksParams.length),
      params: {
        tasks: tasksParams,
      },
    };
  }
}

export {
  TimeStatus,
  type TimelineWorld,
  type BaseTimelineTaskParams,
  type TimeState,
  type TimelineTaskState,
};
