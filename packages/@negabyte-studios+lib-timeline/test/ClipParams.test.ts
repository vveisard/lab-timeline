import { expect, it, describe } from "bun:test";
//
import { ClipParams } from "../source/code/index.ts";

describe(ClipParams.validate.name, () => {
  // TODO happy

  it("throws when startTime is NaN ", () => {
    expect(() =>
      ClipParams.validate({
        startTime: Number.NaN,
        endTime: 0,
      })
    ).toThrow();
  });

  it("throws when endTime is NaN ", () => {
    expect(() =>
      ClipParams.validate({
        startTime: 0,
        endTime: Number.NaN,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      ClipParams.validate({
        startTime: Number.POSITIVE_INFINITY,
        endTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      ClipParams.validate({
        startTime: Number.NEGATIVE_INFINITY,
        endTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      ClipParams.validate({
        startTime: 0,
        endTime: Number.POSITIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      ClipParams.validate({
        startTime: 0,
        endTime: Number.NEGATIVE_INFINITY,
      })
    ).toBeDefined();
  });

  it("throws when endTime < 0 ", () => {
    expect(() =>
      ClipParams.validate({
        startTime: 0,
        endTime: -1,
      })
    ).toBeDefined();
  });

  it("throws when startTime < 0 ", () => {
    expect(() =>
      ClipParams.validate({
        startTime: -1,
        endTime: 0,
      })
    ).toBeDefined();
  });

  it("throws when startTime > endTime ", () => {
    expect(() =>
      ClipParams.validate({
        startTime: 1,
        endTime: 0,
      })
    ).toBeDefined();
  });
});
