import { expect, test, describe } from "bun:test";
//
import {
  AbsoluteAxisRangePosition,
  AxisDirection,
  RelativeAxisRangePosition,
} from "@negabyte-studios/lib-math";
//
import { SectionData, SectionTimeState } from "../source/code/index.ts";

describe(SectionTimeState.create.name, () => {
  // time direction is positive

  test(`when time direction is positive and time is less than bounds`, () => {
    const sectionDatas: SectionData = {
      minimumBoundTime: 10,
      maximumBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      5,
      AxisDirection.Positive
    );

    expect(sectionTimeState.positiveTime).toBe(-5);
    expect(sectionTimeState.negativeTime).toBe(15);
    expect(sectionTimeState.inTime).toBe(-5);
    expect(sectionTimeState.inPosition).toBe(
      RelativeAxisRangePosition.LessThanStartBound
    );
  });

  test(`when time direction is positive and time is at minimum bound`, () => {
    const sectionDatas: SectionData = {
      minimumBoundTime: 10,
      maximumBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      10,
      AxisDirection.Positive
    );

    expect(sectionTimeState.positiveTime).toBe(0);
    expect(sectionTimeState.negativeTime).toBe(10);
    expect(sectionTimeState.inTime).toBe(0);
    expect(sectionTimeState.inPosition).toBe(
      RelativeAxisRangePosition.EqualToStartBound
    );
  });

  test(`when time direction is positive and time is between bounds`, () => {
    const sectionDatas: SectionData = {
      minimumBoundTime: 10,
      maximumBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      12,
      AxisDirection.Positive
    );

    expect(sectionTimeState.positiveTime).toBe(2);
    expect(sectionTimeState.negativeTime).toBe(8);
    expect(sectionTimeState.inTime).toBe(2);
    expect(sectionTimeState.inPosition).toBe(RelativeAxisRangePosition.Between);
  });

  test(`when time direction is positive and time is at maximum bound`, () => {
    const sectionDatas: SectionData = {
      minimumBoundTime: 10,
      maximumBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      20,
      AxisDirection.Positive
    );

    expect(sectionTimeState.positiveTime).toBe(10);
    expect(sectionTimeState.negativeTime).toBe(0);
    expect(sectionTimeState.inTime).toBe(10);
    expect(sectionTimeState.inPosition).toBe(
      RelativeAxisRangePosition.EqualToEndBound
    );
  });

  test(`when time direction is positive and time is greater than bounds`, () => {
    const sectionDatas: SectionData = {
      minimumBoundTime: 10,
      maximumBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      25,
      AxisDirection.Positive
    );

    expect(sectionTimeState.positiveTime).toBe(15);
    expect(sectionTimeState.negativeTime).toBe(-5);
    expect(sectionTimeState.inTime).toBe(15);
    expect(sectionTimeState.inPosition).toBe(
      RelativeAxisRangePosition.GreaterThanEndBound
    );
  });

  // time direction is negative

  test(`when time direction is negative and time is less than bounds`, () => {
    const sectionDatas: SectionData = {
      minimumBoundTime: 10,
      maximumBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      5,
      AxisDirection.Negative
    );

    expect(sectionTimeState.positiveTime).toBe(-5);
    expect(sectionTimeState.negativeTime).toBe(15);
    expect(sectionTimeState.inTime).toBe(15);
    expect(sectionTimeState.inPosition).toBe(
      RelativeAxisRangePosition.GreaterThanEndBound
    );
  });

  test(`when time direction is negative and time is at minimum bound`, () => {
    const sectionDatas: SectionData = {
      minimumBoundTime: 10,
      maximumBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      10,
      AxisDirection.Negative
    );

    expect(sectionTimeState.positiveTime).toBe(0);
    expect(sectionTimeState.negativeTime).toBe(10);
    expect(sectionTimeState.inTime).toBe(10);
    expect(sectionTimeState.inPosition).toBe(
      RelativeAxisRangePosition.EqualToEndBound
    );
  });

  test(`when time direction is negative and time is between bounds`, () => {
    const sectionDatas: SectionData = {
      minimumBoundTime: 10,
      maximumBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      12,
      AxisDirection.Negative
    );

    expect(sectionTimeState.positiveTime).toBe(2);
    expect(sectionTimeState.negativeTime).toBe(8);
    expect(sectionTimeState.inTime).toBe(8);
    expect(sectionTimeState.inPosition).toBe(RelativeAxisRangePosition.Between);
  });

  test(`when time direction is negative and time is at maximum bound`, () => {
    const sectionDatas: SectionData = {
      minimumBoundTime: 10,
      maximumBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      20,
      AxisDirection.Negative
    );

    expect(sectionTimeState.positiveTime).toBe(10);
    expect(sectionTimeState.negativeTime).toBe(0);
    expect(sectionTimeState.inTime).toBe(0);
    expect(sectionTimeState.inPosition).toBe(
      RelativeAxisRangePosition.EqualToStartBound
    );
  });

  test(`when time direction is negative and time is right of bounds`, () => {
    const sectionDatas: SectionData = {
      minimumBoundTime: 10,
      maximumBoundTime: 20,
    };

    const sectionTimeState = SectionTimeState.create(
      sectionDatas,
      25,
      AxisDirection.Negative
    );

    expect(sectionTimeState.positiveTime).toBe(15);
    expect(sectionTimeState.negativeTime).toBe(-5);
    expect(sectionTimeState.inTime).toBe(-5);
    expect(sectionTimeState.inPosition).toBe(
      RelativeAxisRangePosition.LessThanStartBound
    );
  });
});
