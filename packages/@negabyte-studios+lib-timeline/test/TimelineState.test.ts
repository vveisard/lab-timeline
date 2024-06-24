import { expect, it, describe } from "bun:test";
//
import {
  ClipParamsRunType,
  TimeStatus,
  TimelineState,
  type TimelineParams,
} from "../source/code/index.ts";

describe("TimelineState.update", () => {
  it("happily completes clip and timeline", () => {
    const timelineParams: TimelineParams = {
      clipParams: [
        {
          clipRunType: ClipParamsRunType.RunTime,
          startTime: 0,
          endTime: 1,
        },
      ],
    };

    const baseTimelineState = TimelineState.create(1);
    const finalTimelineState = TimelineState.update(
      baseTimelineState,
      timelineParams,
      1
    );

    expect(finalTimelineState).toBeDefined();
    expect(finalTimelineState).not.toBe(baseTimelineState);
    expect(finalTimelineState!.timeStatus).toBe(TimeStatus.Completed);

    expect(finalTimelineState!.clipStates[0].timeStatus).toBe(
      TimeStatus.Completed
    );
    expect(finalTimelineState!.clipStates[0].timeState.runCount).toBe(1);
    expect(finalTimelineState!.clipStates[0].timeState.runTime).toBe(1);
  });

  it("happily completes clip 0, continues clip 1, and continues timeline", () => {
    const timelineParams: TimelineParams = {
      clipParams: [
        {
          clipRunType: ClipParamsRunType.RunTime,
          startTime: 0,
          endTime: 1,
        },
        {
          clipRunType: ClipParamsRunType.RunTime,
          startTime: 1,
          endTime: 2,
        },
      ],
    };

    const baseTimelineState = TimelineState.create(2);
    const finalTimelineState = TimelineState.update(
      baseTimelineState,
      timelineParams,
      1
    );

    expect(finalTimelineState).toBeDefined();
    expect(finalTimelineState).not.toBe(baseTimelineState);
    expect(finalTimelineState!.timeStatus).toBe(TimeStatus.Running);

    expect(finalTimelineState!.clipStates[0].timeStatus).toBe(
      TimeStatus.Completed
    );
    expect(finalTimelineState!.clipStates[0].timeState.runCount).toBe(1);
    expect(finalTimelineState!.clipStates[0].timeState.runTime).toBe(1);

    expect(finalTimelineState!.clipStates[1].timeStatus).toBe(
      TimeStatus.Running
    );
    expect(finalTimelineState!.clipStates[1].timeState.runCount).toBe(1);
    expect(finalTimelineState!.clipStates[1].timeState.runTime).toBe(1);
  });

  it("sadly throws when params mismatched", () => {
    const timelineParams: TimelineParams = {
      clipParams: [
        {
          clipRunType: ClipParamsRunType.RunTime,
          startTime: 0,
          endTime: 1,
        },
      ],
    };

    const baseTimelineState = TimelineState.create(2);
    expect(() =>
      TimelineState.update(baseTimelineState, timelineParams, 1)
    ).toThrow();
  });
});
