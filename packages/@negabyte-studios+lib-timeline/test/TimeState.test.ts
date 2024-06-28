import { expect, test, describe } from "bun:test";
//
import {
  SectionParams,
  TimeDirection,
  TimeState,
  TimeStatus,
} from "../source/code/index.ts";

describe(`TimeState.createFromSectionParams`, () => {
  test(`when time direction is right and time is left of bounds`, () => {
    const sectionParams: SectionParams = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionParams, 5, TimeDirection.Right);

    expect(timeState.inTime).toBe(null);
    expect(timeState.status).toBe(TimeStatus.Before);
  });

  test(`when time direction is right and time is at left bound`, () => {
    const sectionParams: SectionParams = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionParams, 10, TimeDirection.Right);

    expect(timeState.inTime).toBe(0);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is right and time is between bounds`, () => {
    const sectionParams: SectionParams = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionParams, 12, TimeDirection.Right);

    expect(timeState.inTime).toBe(2);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is right and time is at right bound`, () => {
    const sectionParams: SectionParams = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionParams, 20, TimeDirection.Right);

    expect(timeState.inTime).toBe(10);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is right and time is right of bounds`, () => {
    const sectionParams: SectionParams = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionParams, 25, TimeDirection.Right);

    expect(timeState.inTime).toBe(10);
    expect(timeState.status).toBe(TimeStatus.After);
  });

  test(`when time direction is left and time is left of bounds`, () => {
    const sectionParams: SectionParams = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionParams, 5, TimeDirection.Left);

    expect(timeState.inTime).toBe(10);
    expect(timeState.status).toBe(TimeStatus.After);
  });

  test(`when time direction is left and time is at left bound`, () => {
    const sectionParams: SectionParams = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionParams, 10, TimeDirection.Left);

    expect(timeState.inTime).toBe(10);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is left and time is between bounds`, () => {
    const sectionParams: SectionParams = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionParams, 12, TimeDirection.Left);

    expect(timeState.inTime).toBe(8);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is left and time is at right bound`, () => {
    const sectionParams: SectionParams = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionParams, 20, TimeDirection.Left);

    expect(timeState.inTime).toBe(0);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is left and time is right of bounds`, () => {
    const sectionParams: SectionParams = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionParams, 25, TimeDirection.Left);

    expect(timeState.inTime).toBe(null);
    expect(timeState.status).toBe(TimeStatus.Before);
  });
});
