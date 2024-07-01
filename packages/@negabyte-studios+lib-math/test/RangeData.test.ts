import { expect, it, describe } from "bun:test";
import { RangeOverflowBehavior, RangeData } from "@negabyte-studios/lib-math";
//

// TODO refactor this to math

describe(RangeData.validate.name, () => {
  // TODO happy

  it("throws when startTime is NaN ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: {
          value: Number.NaN,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
        maximumBound: {
          value: 0,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
      })
    ).toThrow();
  });

  it("throws when endTime is NaN ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: {
          value: 0,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
        maximumBound: {
          value: Number.NaN,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: {
          value: Number.POSITIVE_INFINITY,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
        maximumBound: {
          value: 0,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: {
          value: Number.NEGATIVE_INFINITY,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
        maximumBound: {
          value: 0,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: {
          value: 0,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
        maximumBound: {
          value: Number.POSITIVE_INFINITY,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: {
          value: 0,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
        maximumBound: {
          value: Number.NEGATIVE_INFINITY,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
      })
    ).toBeDefined();
  });

  it("throws when endTime < 0 ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: {
          value: 0,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
        maximumBound: {
          value: -1,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
      })
    ).toBeDefined();
  });

  it("throws when startTime < 0 ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: {
          value: -1,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
        maximumBound: {
          value: 0,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
      })
    ).toBeDefined();
  });

  it("throws when startTime > endTime ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: {
          value: 1,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
        maximumBound: {
          value: 0,
          overflowBehavior: RangeOverflowBehavior.Nothing,
        },
      })
    ).toBeDefined();
  });
});
