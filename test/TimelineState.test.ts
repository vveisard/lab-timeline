import { expect, it, describe } from "bun:test";
//
import {
  TimeStatus,
  TimelineState,
  type TimelineParams,
} from "../source/code/index.ts";

describe("TimelineState.update", () => {
  it("happily completes track and timeline", () => {
    const timelineParams: TimelineParams = {
      tracks: [
        {
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
    expect(finalTimelineState!.status).toBe(TimeStatus.Completed);

    expect(finalTimelineState!.tracks[0].status).toBe(TimeStatus.Completed);
    expect(finalTimelineState!.tracks[0].time.runCount).toBe(1);
    expect(finalTimelineState!.tracks[0].time.runTime).toBe(1);
  });

  it("happily completes track 0, continues track 1, and continues timeline", () => {
    const timelineParams: TimelineParams = {
      tracks: [
        {
          startTime: 0,
          endTime: 1,
        },
        {
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
    expect(finalTimelineState!.status).toBe(TimeStatus.Running);

    expect(finalTimelineState!.tracks[0].status).toBe(TimeStatus.Completed);
    expect(finalTimelineState!.tracks[0].time.runCount).toBe(1);
    expect(finalTimelineState!.tracks[0].time.runTime).toBe(1);

    expect(finalTimelineState!.tracks[1].status).toBe(TimeStatus.Running);
    expect(finalTimelineState!.tracks[1].time.runCount).toBe(1);
    expect(finalTimelineState!.tracks[1].time.runTime).toBe(1);
  });

  it("sadly throws when params mismatched", () => {
    const timelineParams: TimelineParams = {
      tracks: [
        {
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
