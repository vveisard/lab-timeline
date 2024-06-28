import { expect, test, describe } from "bun:test";
//
import {
  SectionData,
  TimeDirection,
  TimeState,
  TimeStatus,
} from "../source/code/index.ts";

describe(`TimeState.createFromSectionDatas`, () => {
  test(`when time direction is right and time is left of bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionDatas, 5, TimeDirection.Right);

    expect(timeState.inTime).toBe(-5);
    expect(timeState.status).toBe(TimeStatus.Before);
  });

  test(`when time direction is right and time is at left bound`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionDatas, 10, TimeDirection.Right);

    expect(timeState.inTime).toBe(0);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is right and time is between bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionDatas, 12, TimeDirection.Right);

    expect(timeState.inTime).toBe(2);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is right and time is at right bound`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionDatas, 20, TimeDirection.Right);

    expect(timeState.inTime).toBe(10);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is right and time is right of bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionDatas, 25, TimeDirection.Right);

    expect(timeState.inTime).toBe(10);
    expect(timeState.status).toBe(TimeStatus.After);
  });

  test(`when time direction is left and time is left of bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionDatas, 5, TimeDirection.Left);

    expect(timeState.inTime).toBe(10);
    expect(timeState.status).toBe(TimeStatus.After);
  });

  test(`when time direction is left and time is at left bound`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionDatas, 10, TimeDirection.Left);

    expect(timeState.inTime).toBe(10);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is left and time is between bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionDatas, 12, TimeDirection.Left);

    expect(timeState.inTime).toBe(8);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is left and time is at right bound`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionDatas, 20, TimeDirection.Left);

    expect(timeState.inTime).toBe(0);
    expect(timeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is left and time is right of bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const timeState = TimeState.create(sectionDatas, 25, TimeDirection.Left);

    expect(timeState.inTime).toBe(-5);
    expect(timeState.status).toBe(TimeStatus.Before);
  });
});
