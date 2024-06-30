import { expect, test, describe } from "bun:test";
//
import {
  AbsoluteAxisRangePosition,
  RangeState,
  type RangeData,
} from "@negabyte-studios/lib-math";
//

describe(RangeState.create.name, () => {
  test(`when time is less than bounds`, () => {
    const rangeDatas: RangeData = {
      minimumBound: 10,
      maximumBound: 20,
    };

    const rangeState = RangeState.create(rangeDatas, 5);

    expect(rangeState.inPositive).toBe(-5);
    expect(rangeState.inNegative).toBe(15);
    expect(rangeState.position).toBe(
      AbsoluteAxisRangePosition.LessThanMinimumBound
    );
  });

  test(`when time is at minimum bound`, () => {
    const rangeDatas: RangeData = {
      minimumBound: 10,
      maximumBound: 20,
    };

    const rangeState = RangeState.create(rangeDatas, 10);

    expect(rangeState.inPositive).toBe(0);
    expect(rangeState.inNegative).toBe(10);
    expect(rangeState.position).toBe(
      AbsoluteAxisRangePosition.EqualToMinimumBound
    );
  });

  test(`when time is between bounds`, () => {
    const rangeDatas: RangeData = {
      minimumBound: 10,
      maximumBound: 20,
    };

    const rangeState = RangeState.create(rangeDatas, 12);

    expect(rangeState.inPositive).toBe(2);
    expect(rangeState.inNegative).toBe(8);
    expect(rangeState.position).toBe(AbsoluteAxisRangePosition.Between);
  });

  test(`when time is at maximum bound`, () => {
    const rangeDatas: RangeData = {
      minimumBound: 10,
      maximumBound: 20,
    };

    const rangeState = RangeState.create(rangeDatas, 20);

    expect(rangeState.inPositive).toBe(10);
    expect(rangeState.inNegative).toBe(0);
    expect(rangeState.position).toBe(
      AbsoluteAxisRangePosition.EqualToMaximumBound
    );
  });

  test(`when time is greater than bounds`, () => {
    const rangeDatas: RangeData = {
      minimumBound: 10,
      maximumBound: 20,
    };

    const rangeState = RangeState.create(rangeDatas, 25);

    expect(rangeState.inPositive).toBe(15);
    expect(rangeState.inNegative).toBe(-5);
    expect(rangeState.position).toBe(
      AbsoluteAxisRangePosition.GreaterThanMaximumBound
    );
  });
});
