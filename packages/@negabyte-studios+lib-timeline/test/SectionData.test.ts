import { expect, it, describe } from "bun:test";
//
import { SectionData } from "../source/code/index.ts";

describe(SectionData.validate.name, () => {
  // TODO happy

  it("throws when startTime is NaN ", () => {
    expect(() =>
      SectionData.validate({
        minimumBoundTime: Number.NaN,
        maximumBoundTime: 0,
      })
    ).toThrow();
  });

  it("throws when endTime is NaN ", () => {
    expect(() =>
      SectionData.validate({
        minimumBoundTime: 0,
        maximumBoundTime: Number.NaN,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      SectionData.validate({
        minimumBoundTime: Number.POSITIVE_INFINITY,
        maximumBoundTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      SectionData.validate({
        minimumBoundTime: Number.NEGATIVE_INFINITY,
        maximumBoundTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      SectionData.validate({
        minimumBoundTime: 0,
        maximumBoundTime: Number.POSITIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      SectionData.validate({
        minimumBoundTime: 0,
        maximumBoundTime: Number.NEGATIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime < 0 ", () => {
    expect(() =>
      SectionData.validate({
        minimumBoundTime: 0,
        maximumBoundTime: -1,
      })
    ).toBeDefined();
  });

  it("throws when startTime < 0 ", () => {
    expect(() =>
      SectionData.validate({
        minimumBoundTime: -1,
        maximumBoundTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime > endTime ", () => {
    expect(() =>
      SectionData.validate({
        minimumBoundTime: 1,
        maximumBoundTime: 0,
      })
    ).toBeDefined();
  });
});
