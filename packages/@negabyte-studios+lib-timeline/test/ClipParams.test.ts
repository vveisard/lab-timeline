import { expect, it, describe } from "bun:test";
//
import { AnySectionParams } from "../source/code/index.ts";

describe(AnySectionParams.validate.name, () => {
  // TODO happy

  it("throws when startTime is NaN ", () => {
    expect(() =>
      AnySectionParams.validate({
        startRunTime: Number.NaN,
        endRunTime: 0,
      })
    ).toThrow();
  });

  it("throws when endTime is NaN ", () => {
    expect(() =>
      AnySectionParams.validate({
        startRunTime: 0,
        endRunTime: Number.NaN,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      AnySectionParams.validate({
        startRunTime: Number.POSITIVE_INFINITY,
        endRunTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      AnySectionParams.validate({
        startRunTime: Number.NEGATIVE_INFINITY,
        endRunTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      AnySectionParams.validate({
        startRunTime: 0,
        endRunTime: Number.POSITIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      AnySectionParams.validate({
        startRunTime: 0,
        endRunTime: Number.NEGATIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime < 0 ", () => {
    expect(() =>
      AnySectionParams.validate({
        startRunTime: 0,
        endRunTime: -1,
      })
    ).toBeDefined();
  });

  it("throws when startTime < 0 ", () => {
    expect(() =>
      AnySectionParams.validate({
        startRunTime: -1,
        endRunTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime > endTime ", () => {
    expect(() =>
      AnySectionParams.validate({
        startRunTime: 1,
        endRunTime: 0,
      })
    ).toBeDefined();
  });
});
