import { expect, it, describe } from "bun:test";
//
import {
  SectionParamsRunType,
  TimeStatus,
  TimelineState,
  type TimelineParams,
} from "../source/code/index.ts";

describe("TimelineState.update with SectionParamsRunTime.RunTime", () => {
  it("happily completes section and timeline", () => {
    const timelineParams: TimelineParams = {
      sectionParams: [
        {
          sectionRunType: SectionParamsRunType.RunTime,
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

    expect(finalTimelineState!.sectionStates[0].timeStatus).toBe(
      TimeStatus.Completed
    );
    expect(finalTimelineState!.sectionStates[0].timeState.runCount).toBe(1);
    expect(finalTimelineState!.sectionStates[0].timeState.runTime).toBe(1);
  });

  it("happily completes section 0, continues section 1, and continues timeline", () => {
    const timelineParams: TimelineParams = {
      sectionParams: [
        {
          sectionRunType: SectionParamsRunType.RunTime,
          startTime: 0,
          endTime: 1,
        },
        {
          sectionRunType: SectionParamsRunType.RunTime,
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

    expect(finalTimelineState!.sectionStates[0].timeStatus).toBe(
      TimeStatus.Completed
    );
    expect(finalTimelineState!.sectionStates[0].timeState.runCount).toBe(1);
    expect(finalTimelineState!.sectionStates[0].timeState.runTime).toBe(1);

    expect(finalTimelineState!.sectionStates[1].timeStatus).toBe(
      TimeStatus.Running
    );
    expect(finalTimelineState!.sectionStates[1].timeState.runCount).toBe(1);
    expect(finalTimelineState!.sectionStates[1].timeState.runTime).toBe(1);
  });

  it("sadly throws when params mismatched", () => {
    const timelineParams: TimelineParams = {
      sectionParams: [
        {
          sectionRunType: SectionParamsRunType.RunTime,
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
