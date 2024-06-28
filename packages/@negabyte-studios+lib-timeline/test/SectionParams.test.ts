import { expect, it, describe } from "bun:test";
//
import { SectionParams } from "../source/code/index.ts";

describe(SectionParams.validate.name, () => {
  // TODO happy

  it("throws when startTime is NaN ", () => {
    expect(() =>
      SectionParams.validate({
        leftBoundTime: Number.NaN,
        rightBoundTime: 0,
      })
    ).toThrow();
  });

  it("throws when endTime is NaN ", () => {
    expect(() =>
      SectionParams.validate({
        leftBoundTime: 0,
        rightBoundTime: Number.NaN,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      SectionParams.validate({
        leftBoundTime: Number.POSITIVE_INFINITY,
        rightBoundTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      SectionParams.validate({
        leftBoundTime: Number.NEGATIVE_INFINITY,
        rightBoundTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      SectionParams.validate({
        leftBoundTime: 0,
        rightBoundTime: Number.POSITIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      SectionParams.validate({
        leftBoundTime: 0,
        rightBoundTime: Number.NEGATIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime < 0 ", () => {
    expect(() =>
      SectionParams.validate({
        leftBoundTime: 0,
        rightBoundTime: -1,
      })
    ).toBeDefined();
  });

  it("throws when startTime < 0 ", () => {
    expect(() =>
      SectionParams.validate({
        leftBoundTime: -1,
        rightBoundTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime > endTime ", () => {
    expect(() =>
      SectionParams.validate({
        leftBoundTime: 1,
        rightBoundTime: 0,
      })
    ).toBeDefined();
  });
});
