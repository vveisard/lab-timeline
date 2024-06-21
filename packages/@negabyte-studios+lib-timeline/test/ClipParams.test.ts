import { expect, it, describe } from "bun:test";
//
import { ClipParams } from "../source/code/index.ts";

describe(`ClipParams.validateSome`, () => {
  // TODO happy

  it("throws when startTime is NaN ", () => {
    expect(() =>
      ClipParams.validateSome([
        {
          startTime: Number.NaN,
          endTime: 0,
        },
      ])
    ).toThrow();
  });

  it("throws when endTime is NaN ", () => {
    expect(() =>
      ClipParams.validateSome([
        {
          startTime: 0,
          endTime: Number.NaN,
        },
      ])
    ).toThrow();
  });

  it("throws when startTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      ClipParams.validateSome([
        {
          startTime: Number.POSITIVE_INFINITY,
          endTime: 0,
        },
      ])
    ).toThrow();
  });

  it("throws when startTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      ClipParams.validateSome([
        {
          startTime: Number.NEGATIVE_INFINITY,
          endTime: 0,
        },
      ])
    ).toThrow();
  });

  it("throws when endTime is Number.POSITIVE_INFINITY ", () => {
    expect(() =>
      ClipParams.validateSome([
        {
          startTime: 0,
          endTime: Number.POSITIVE_INFINITY,
        },
      ])
    ).toThrow();
  });

  it("throws when endTime is Number.NEGATIVE_INFINITY ", () => {
    expect(() =>
      ClipParams.validateSome([
        {
          startTime: 0,
          endTime: Number.NEGATIVE_INFINITY,
        },
      ])
    ).toThrow();
  });

  it("throws when endTime < 0 ", () => {
    expect(() =>
      ClipParams.validateSome([
        {
          startTime: 0,
          endTime: -1,
        },
      ])
    ).toThrow();
  });

  it("throws when startTime < 0 ", () => {
    expect(() =>
      ClipParams.validateSome([
        {
          startTime: -1,
          endTime: 0,
        },
      ])
    ).toThrow();
  });

  it("throws when startTime > endTime ", () => {
    expect(() =>
      ClipParams.validateSome([
        {
          startTime: 1,
          endTime: 0,
        },
      ])
    ).toThrow();
  });
});
