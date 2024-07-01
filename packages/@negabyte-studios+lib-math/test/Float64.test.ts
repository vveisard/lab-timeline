import { expect, it, describe } from "bun:test";
import { Float64, RangeOverflowBehavior } from "@negabyte-studios/lib-math";

describe(Float64.getRangePositiveIn.name, () => {
  it("when overflow behavior is None and value is less than bound", () => {
    const inAmount = Float64.getRangePositiveIn(
      3,
      5,
      10,
      RangeOverflowBehavior.Nothing,
      RangeOverflowBehavior.Nothing
    );

    expect(inAmount).toBeNull();
  });
  it("when overflow behavior is None and value is greater than bound", () => {
    const inAmount = Float64.getRangePositiveIn(
      12,
      5,
      10,
      RangeOverflowBehavior.Nothing,
      RangeOverflowBehavior.Nothing
    );

    expect(inAmount).toBeNull();
  });

  it("when overflow behavior is Free and value is less than bound", () => {
    const inAmount = Float64.getRangePositiveIn(
      3,
      5,
      10,
      RangeOverflowBehavior.Free,
      RangeOverflowBehavior.Free
    );

    expect(inAmount).toBe(-2);
  });
  it("when overflow behavior is Free and value is greater than bound", () => {
    const inAmount = Float64.getRangePositiveIn(
      13,
      5,
      10,
      RangeOverflowBehavior.Free,
      RangeOverflowBehavior.Free
    );

    expect(inAmount).toBe(8);
  });

  it("when overflow behavior is Clamp and value is less than bound", () => {
    const inAmount = Float64.getRangePositiveIn(
      3,
      5,
      10,
      RangeOverflowBehavior.Clamp,
      RangeOverflowBehavior.Clamp
    );

    expect(inAmount).toBe(5);
  });

  it("when overflow behavior is Clamp and value is greater than bound", () => {
    const inAmount = Float64.getRangePositiveIn(
      12,
      5,
      10,
      RangeOverflowBehavior.Clamp,
      RangeOverflowBehavior.Clamp
    );

    expect(inAmount).toBe(5);
  });

  it("when overflow behavior is Wrap and value is less than minimum bound", () => {
    const inAmount = Float64.getRangePositiveIn(
      2,
      5,
      10,
      RangeOverflowBehavior.Wrap,
      RangeOverflowBehavior.Wrap
    );

    expect(inAmount).toBe(2);
  });
  it("when overflow behavior is Wrap and value is equal to minimum bound", () => {
    const inAmount = Float64.getRangePositiveIn(
      5,
      5,
      10,
      RangeOverflowBehavior.Wrap,
      RangeOverflowBehavior.Wrap
    );

    expect(inAmount).toBe(0);
  });
  it("when overflow behavior is Wrap and value is equal to maximum bound", () => {
    const inAmount = Float64.getRangePositiveIn(
      10,
      5,
      10,
      RangeOverflowBehavior.Wrap,
      RangeOverflowBehavior.Wrap
    );

    expect(inAmount).toBe(0);
  });
  it("when overflow behavior is Wrap and value is greater than bound", () => {
    const inAmount = Float64.getRangePositiveIn(
      12,
      5,
      10,
      RangeOverflowBehavior.Wrap,
      RangeOverflowBehavior.Wrap
    );

    expect(inAmount).toBe(2);
  });
});

describe(Float64.getRangeNegativeIn.name, () => {
  it("when overflow behavior is None and value is less than bound", () => {
    const inAmount = Float64.getRangeNegativeIn(
      3,
      5,
      10,
      RangeOverflowBehavior.Nothing,
      RangeOverflowBehavior.Nothing
    );

    expect(inAmount).toBeNull();
  });
  it("when overflow behavior is None and value is greater than bound", () => {
    const inAmount = Float64.getRangeNegativeIn(
      12,
      5,
      10,
      RangeOverflowBehavior.Nothing,
      RangeOverflowBehavior.Nothing
    );

    expect(inAmount).toBeNull();
  });

  it("when overflow behavior is Free and value is less than bound", () => {});
  it("when overflow behavior is Free and value is greater than bound", () => {
    const inAmount = Float64.getRangeNegativeIn(
      12,
      5,
      10,
      RangeOverflowBehavior.Nothing,
      RangeOverflowBehavior.Free
    );
  });

  it("when overflow behavior is Wrap and value is less than minimum bound", () => {
    const inAmount = Float64.getRangeNegativeIn(
      4,
      5,
      10,
      RangeOverflowBehavior.Wrap,
      RangeOverflowBehavior.Wrap
    );

    expect(inAmount).toBe(1);
  });
  it("when overflow behavior is Wrap and value is equal to minimum bound", () => {
    const inAmount = Float64.getRangeNegativeIn(
      5,
      5,
      10,
      RangeOverflowBehavior.Wrap,
      RangeOverflowBehavior.Wrap
    );

    expect(inAmount).toBe(5);
  });
  it("when overflow behavior is Wrap and value is equal to maximum bound", () => {
    const inAmount = Float64.getRangeNegativeIn(
      10,
      5,
      10,
      RangeOverflowBehavior.Wrap,
      RangeOverflowBehavior.Wrap
    );

    expect(inAmount).toBe(0);
  });
  it("when overflow behavior is Wrap and value is greater than bound", () => {
    const inAmount = Float64.getRangeNegativeIn(
      11,
      3,
      10,
      RangeOverflowBehavior.Wrap,
      RangeOverflowBehavior.Wrap
    );

    expect(inAmount).toBe(6);
  });
});
