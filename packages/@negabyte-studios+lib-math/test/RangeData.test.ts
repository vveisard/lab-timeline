import { RangeData } from "@negabyte-studios/lib-math";
import { expect, it, describe } from "bun:test";
//

// TODO refactor this to math

describe(RangeData.validate.name, () => {
  // TODO happy

  it("throws when startTime is NaN ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: Number.NaN,
        maximumBound: 0,
      })
    ).toThrow();
  });

  it("throws when endTime is NaN ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: 0,
        maximumBound: Number.NaN,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: Number.POSITIVE_INFINITY,
        maximumBound: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: Number.NEGATIVE_INFINITY,
        maximumBound: 0,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: 0,
        maximumBound: Number.POSITIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: 0,
        maximumBound: Number.NEGATIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime < 0 ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: 0,
        maximumBound: -1,
      })
    ).toBeDefined();
  });

  it("throws when startTime < 0 ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: -1,
        maximumBound: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime > endTime ", () => {
    expect(() =>
      RangeData.validate({
        minimumBound: 1,
        maximumBound: 0,
      })
    ).toBeDefined();
  });
});
