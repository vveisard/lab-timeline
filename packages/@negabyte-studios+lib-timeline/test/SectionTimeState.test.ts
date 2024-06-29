import { expect, test, describe } from "bun:test";
//
import {
  SectionData,
  TimeDirection,
  SectionTimeState,
  TimeStatus,
} from "../source/code/index.ts";

describe(SectionTimeState.create.name, () => {
  test(`when time direction is right and time is left of bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      5,
      TimeDirection.Right
    );

    expect(sectionTimeState.leftTime).toBe(-5);
    expect(sectionTimeState.rightTime).toBe(15);
    expect(sectionTimeState.inTime).toBe(-5);
    expect(sectionTimeState.status).toBe(TimeStatus.BeforeStart);
  });

  test(`when time direction is right and time is at left bound`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      10,
      TimeDirection.Right
    );

    expect(sectionTimeState.leftTime).toBe(0);
    expect(sectionTimeState.rightTime).toBe(10);
    expect(sectionTimeState.inTime).toBe(0);
    expect(sectionTimeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is right and time is between bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      12,
      TimeDirection.Right
    );

    expect(sectionTimeState.leftTime).toBe(2);
    expect(sectionTimeState.rightTime).toBe(8);
    expect(sectionTimeState.inTime).toBe(2);
    expect(sectionTimeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is right and time is at right bound`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      20,
      TimeDirection.Right
    );

    expect(sectionTimeState.leftTime).toBe(10);
    expect(sectionTimeState.rightTime).toBe(0);
    expect(sectionTimeState.inTime).toBe(10);
    expect(sectionTimeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is right and time is right of bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      25,
      TimeDirection.Right
    );

    expect(sectionTimeState.leftTime).toBe(15);
    expect(sectionTimeState.rightTime).toBe(-5);
    expect(sectionTimeState.inTime).toBe(15);
    expect(sectionTimeState.status).toBe(TimeStatus.AfterEnd);
  });

  test(`when time direction is left and time is left of bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      5,
      TimeDirection.Left
    );

    expect(sectionTimeState.leftTime).toBe(-5);
    expect(sectionTimeState.rightTime).toBe(15);
    expect(sectionTimeState.inTime).toBe(15);
    expect(sectionTimeState.status).toBe(TimeStatus.AfterEnd);
  });

  test(`when time direction is left and time is at left bound`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      10,
      TimeDirection.Left
    );

    expect(sectionTimeState.leftTime).toBe(0);
    expect(sectionTimeState.rightTime).toBe(10);
    expect(sectionTimeState.inTime).toBe(10);
    expect(sectionTimeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is left and time is between bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      12,
      TimeDirection.Left
    );

    expect(sectionTimeState.leftTime).toBe(2);
    expect(sectionTimeState.rightTime).toBe(8);
    expect(sectionTimeState.inTime).toBe(8);
    expect(sectionTimeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is left and time is at right bound`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      20,
      TimeDirection.Left
    );

    expect(sectionTimeState.leftTime).toBe(10);
    expect(sectionTimeState.rightTime).toBe(0);
    expect(sectionTimeState.inTime).toBe(0);
    expect(sectionTimeState.status).toBe(TimeStatus.In);
  });

  test(`when time direction is left and time is right of bounds`, () => {
    const sectionDatas: SectionData = {
      leftBoundTime: 10,
      rightBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      25,
      TimeDirection.Left
    );

    expect(sectionTimeState.leftTime).toBe(15);
    expect(sectionTimeState.rightTime).toBe(-5);
    expect(sectionTimeState.inTime).toBe(-5);
    expect(sectionTimeState.status).toBe(TimeStatus.BeforeStart);
  });
});
