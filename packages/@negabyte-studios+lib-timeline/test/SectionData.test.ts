import { expect, it, describe } from "bun:test";
//
import { SectionData } from "../source/code/index.ts";

describe(SectionData.validate.name, () => {
  // TODO happy

  it("throws when startTime is NaN ", () => {
    expect(() =>
      SectionData.validate({
        leftBoundTime: Number.NaN,
        rightBoundTime: 0,
      })
    ).toThrow();
  });

  it("throws when endTime is NaN ", () => {
    expect(() =>
      SectionData.validate({
        leftBoundTime: 0,
        rightBoundTime: Number.NaN,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      SectionData.validate({
        leftBoundTime: Number.POSITIVE_INFINITY,
        rightBoundTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      SectionData.validate({
        leftBoundTime: Number.NEGATIVE_INFINITY,
        rightBoundTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      SectionData.validate({
        leftBoundTime: 0,
        rightBoundTime: Number.POSITIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      SectionData.validate({
        leftBoundTime: 0,
        rightBoundTime: Number.NEGATIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime < 0 ", () => {
    expect(() =>
      SectionData.validate({
        leftBoundTime: 0,
        rightBoundTime: -1,
      })
    ).toBeDefined();
  });

  it("throws when startTime < 0 ", () => {
    expect(() =>
      SectionData.validate({
        leftBoundTime: -1,
        rightBoundTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime > endTime ", () => {
    expect(() =>
      SectionData.validate({
        leftBoundTime: 1,
        rightBoundTime: 0,
      })
    ).toBeDefined();
  });
});
