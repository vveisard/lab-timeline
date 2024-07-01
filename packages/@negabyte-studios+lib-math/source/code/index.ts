/**
 * Absolute position of a value in a range of an axis.
 */
enum AbsoluteAxisRangePosition {
  LessThanMinimumBound = -2,
  EqualToMinimumBound = -1,
  Between = 0,
  EqualToMaximumBound = 1,
  GreaterThanMaximumBound = 2,
}

/**
 * Relative position of a value in a range of an axis.
 */
enum RelativeAxisRangePosition {
  LessThanStartBound = -2,
  EqualToStartBound = -1,
  Between = 0,
  EqualToEndBound = 1,
  GreaterThanEndBound = 2,
}

/**
 * Direction on an axis.
 */
enum AxisDirection {
  Positive = 1,
  Negative = -1,
}

export { AbsoluteAxisRangePosition, RelativeAxisRangePosition, AxisDirection };

// @region-begin

// @region-start

/**
 * How a value in a range should behave outside of the bounds.
 */
enum RangeOverflowBehavior {
  /**
   * Outside of the range, the value will be `null`.
   */
  Nothing,
  /**
   * Outside of the range, the value will be unrestricted.
   */
  Free,
  /**
   * Outside of the range, the value will be clamped to the last value.
   */
  Clamp,
  /**
   * Outside of the range, the value will be wrapped to to the range.
   */
  Wrap,
}

interface RangeBoundData {
  readonly value: Float64;
  readonly overflowBehavior: RangeOverflowBehavior;
}

/**
 * Data for a range of some axis.
 */
interface RangeData {
  /**
   * bound of the range the negative direction of an axis.
   */
  readonly minimumBound: RangeBoundData;

  /**
   * bound of the range the positive direction of an axis.
   */
  readonly maximumBound: RangeBoundData;
}

namespace RangeData {
  export function validate(self: RangeData, name?: string): Error | undefined {
    if (
      self.maximumBound !== undefined &&
      self.maximumBound < self.minimumBound
    ) {
      return new Error(
        `Invalid argument! ${name}: rightBoundTime < leftBoundTime`
      );
    }

    if (self.minimumBound.value < 0) {
      return new Error(`Invalid argument! ${name}: leftBoundTime < 0`);
    }

    if (self.maximumBound.value < 0) {
      return new Error(`Invalid argument! ${name}: rightBoundTime < 0`);
    }

    if (Number.isNaN(self.minimumBound)) {
      return new Error(`Invalid argument! ${name}: leftBoundTime Number.isNaN`);
    }

    if (Number.isNaN(self.maximumBound)) {
      return new Error(
        `Invalid argument! ${name}: rightBoundTime Number.isNaN`
      );
    }

    if (!Number.isFinite(self.minimumBound)) {
      return new Error(
        `Invalid argument! ${name}: leftBoundTime !Number.isFinite`
      );
    }

    if (!Number.isFinite(self.maximumBound)) {
      return new Error(
        `Invalid argument! ${name}: rightBoundTime !Number.isFinite`
      );
    }

    return undefined;
  }
}

export { RangeData, RangeOverflowBehavior };

// @region-end

// @region-start

type Float64 = number;

namespace Float64 {
  /**
   * Wraps value in range of [{@link rangeMinimumBound}, {@link rangeMaximumBound}).
   */
  export function wrapPositive(
    value: Float64,
    rangeMinimumBound: Float64,
    rangeMaximumBound: Float64
  ) {
    const rangeSize = rangeMaximumBound - rangeMinimumBound;
    const wrappedValue =
      ((((value - rangeMinimumBound) % rangeSize) + rangeSize) % rangeSize) +
      rangeMinimumBound;
    return wrappedValue;
  }

  /**
   * Wraps value in range of ({@link rangeMinimumBound}, {@link rangeMaximumBound}].
   */
  export function wrapNegative(
    value: Float64,
    rangeMinimumBound: Float64,
    rangeMaximumBound: Float64
  ) {
    // Ensure lowerBound is exclusive
    rangeMinimumBound = rangeMinimumBound + 1;

    // Calculate the range
    let range = rangeMaximumBound - rangeMinimumBound + 1;

    // Normalize the value within the range of [0, range-1]
    let normalized = (value - rangeMinimumBound) % range;
    if (normalized < 0) {
      normalized += range;
    }

    // Return the wrapped value by adding back the lowerBound
    return normalized + rangeMinimumBound;
  }

  /**
   * Get absolute position of value in a range.
   */
  export function getRangeAbsolutePosition(
    value: Float64,
    minimumRangeBound: Float64,
    maximumRangeBound: Float64
  ): AbsoluteAxisRangePosition {
    // value is less than minimum bound
    if (value < minimumRangeBound) {
      return AbsoluteAxisRangePosition.LessThanMinimumBound;
    }

    // value is equal to minimum bound
    if (value === minimumRangeBound) {
      return AbsoluteAxisRangePosition.EqualToMinimumBound;
    }

    // value is equal to maximum bound
    if (value === maximumRangeBound) {
      return AbsoluteAxisRangePosition.EqualToMaximumBound;
    }

    // value is greater than maximum bound
    if (value > maximumRangeBound) {
      return AbsoluteAxisRangePosition.GreaterThanMaximumBound;
    }

    return AbsoluteAxisRangePosition.Between;
  }

  /**
   * Get relative position of value in a range.
   */
  export function getRangeRelativePosition(
    value: Float64,
    minimumRangeBound: Float64,
    maximumRangeBound: Float64,
    axisDirection: AxisDirection
  ): RelativeAxisRangePosition {
    switch (axisDirection) {
      case AxisDirection.Positive: {
        // time is left of minimum bound
        if (value < minimumRangeBound) {
          return RelativeAxisRangePosition.LessThanStartBound;
        }

        // time is at minimum bound
        if (value === minimumRangeBound) {
          return RelativeAxisRangePosition.EqualToStartBound;
        }

        // time is at maximum bound
        if (value === maximumRangeBound) {
          return RelativeAxisRangePosition.EqualToEndBound;
        }

        // time is right of maximum bound
        if (value > maximumRangeBound) {
          return RelativeAxisRangePosition.GreaterThanEndBound;
        }

        // time is between bounds
        return RelativeAxisRangePosition.Between;
      }
      case AxisDirection.Negative: {
        // time is left of minimum bound
        if (value < minimumRangeBound) {
          return RelativeAxisRangePosition.GreaterThanEndBound;
        }

        // time is at minimum bound
        if (value === minimumRangeBound) {
          return RelativeAxisRangePosition.EqualToEndBound;
        }

        // time is at maximum bound
        if (value === maximumRangeBound) {
          return RelativeAxisRangePosition.EqualToStartBound;
        }

        // time is right of maximum bound
        if (value > maximumRangeBound) {
          return RelativeAxisRangePosition.LessThanStartBound;
        }

        // time is between bounds
        return RelativeAxisRangePosition.Between;
      }
      default: {
        throw new Error(`Invalid state!`);
      }
    }
  }

  /**
   * Get the positive in amount for a value in a range.
   * in the positive direction, measured from the minimum bound.
   */
  export function getRangePositiveIn(
    value: Float64,
    rangeMinimumBoundValue: Float64,
    rangeMaximumBoundValue: Float64,
    rangeMinimumOverflowBehavior: RangeOverflowBehavior,
    rangeMaximumOverflowBehavior: RangeOverflowBehavior
  ): Float64 | null {
    if (value < rangeMinimumBoundValue) {
      switch (rangeMinimumOverflowBehavior) {
        case RangeOverflowBehavior.Nothing:
          return null;
        case RangeOverflowBehavior.Free:
          return value - rangeMinimumBoundValue;
        case RangeOverflowBehavior.Clamp:
          return rangeMaximumBoundValue - rangeMinimumBoundValue;
        case RangeOverflowBehavior.Wrap:
          return (
            Float64.wrapPositive(
              value,
              rangeMinimumBoundValue,
              rangeMaximumBoundValue
            ) - rangeMinimumBoundValue
          );
        default:
          throw new Error(`Not implemented!`);
      }
    }

    if (value === rangeMinimumBoundValue) {
      return 0;
    }

    if (value === rangeMaximumBoundValue) {
      switch (rangeMaximumOverflowBehavior) {
        case RangeOverflowBehavior.Nothing:
        case RangeOverflowBehavior.Free:
        case RangeOverflowBehavior.Clamp:
          return rangeMaximumBoundValue - rangeMinimumBoundValue;
        case RangeOverflowBehavior.Wrap:
          return 0;
        default:
          throw new Error(`Not implemented!`);
      }
    }

    if (value > rangeMaximumBoundValue) {
      switch (rangeMaximumOverflowBehavior) {
        case RangeOverflowBehavior.Nothing:
          return null;
        case RangeOverflowBehavior.Free:
          return value - rangeMinimumBoundValue;
        case RangeOverflowBehavior.Clamp:
          return rangeMaximumBoundValue - rangeMinimumBoundValue;
        case RangeOverflowBehavior.Wrap:
          return (
            Float64.wrapPositive(
              value,
              rangeMinimumBoundValue,
              rangeMaximumBoundValue
            ) - rangeMinimumBoundValue
          );

        default:
          throw new Error(`Not implemented!`);
      }
    }

    return value - rangeMinimumBoundValue;
  }

  /**
   * Get the negative in amount for a value in a range.
   * in the negative direction, measured from the maximum bound.
   */
  export function getRangeNegativeIn(
    value: Float64,
    rangeMinimumBoundValue: Float64,
    rangeMaximumBoundValue: Float64,
    rangeMinimumOverflowBehavior: RangeOverflowBehavior,
    rangeMaximumOverflowBehavior: RangeOverflowBehavior
  ): Float64 | null {
    if (value < rangeMinimumBoundValue) {
      switch (rangeMinimumOverflowBehavior) {
        case RangeOverflowBehavior.Nothing:
          return null;
        case RangeOverflowBehavior.Free:
          return rangeMaximumBoundValue - value;
        case RangeOverflowBehavior.Clamp:
          return rangeMaximumBoundValue - rangeMinimumBoundValue;
        case RangeOverflowBehavior.Wrap:
          return (
            rangeMaximumBoundValue -
            Float64.wrapNegative(
              value,
              rangeMinimumBoundValue,
              rangeMaximumBoundValue
            )
          );
        default:
          throw new Error(`Not implemented!`);
      }
    }

    if (value === rangeMinimumBoundValue) {
      return rangeMaximumBoundValue - rangeMinimumBoundValue;
    }

    if (value === rangeMaximumBoundValue) {
      switch (rangeMaximumOverflowBehavior) {
        case RangeOverflowBehavior.Nothing:
        case RangeOverflowBehavior.Free:
        case RangeOverflowBehavior.Clamp:
          return 0;
        case RangeOverflowBehavior.Wrap:
          return 0;
        default:
          throw new Error(`Not implemented!`);
      }
    }

    if (value > rangeMaximumBoundValue) {
      switch (rangeMaximumOverflowBehavior) {
        case RangeOverflowBehavior.Nothing:
          return null;
        case RangeOverflowBehavior.Free:
          return rangeMaximumBoundValue - value;
        case RangeOverflowBehavior.Clamp:
          return rangeMaximumBoundValue - rangeMinimumBoundValue;
        case RangeOverflowBehavior.Wrap:
          return (
            rangeMaximumBoundValue -
            Float64.wrapNegative(
              value,
              rangeMinimumBoundValue,
              rangeMaximumBoundValue
            )
          );
        default:
          throw new Error(`Not implemented!`);
      }
    }

    return value - rangeMinimumBoundValue;
  }

  /**
   * Get the normalized progress (interpolant) between two bounds.
   * Unrestricted range of [0, 1]
   */
  export function getRangePositiveProgress(
    value: Float64,
    minBound: Float64,
    maxBound: Float64
  ): Float64 {
    return (value - minBound) / (maxBound - minBound);
  }

  export function interpolate(
    start: Float64,
    end: Float64,
    interpolant: Float64
  ) {
    return start * (1 - interpolant) + end * interpolant;
  }

  export function clamp(self: Float64, min: Float64, max: Float64) {
    return Math.min(Math.max(self, min), max);
  }
}

export { Float64 };

type Point2dFloat64 = [Float64, Float64];

namespace Point2dFloat64 {
  /**
   * Interpolate between start and end position.
   */
  export function interpolatePositionClamped(
    startPosition: Point2dFloat64,
    endPosition: Point2dFloat64,
    interpolant: Float64
  ): Point2dFloat64 {
    return [
      Float64.interpolate(startPosition[0], endPosition[0], interpolant),
      Float64.interpolate(startPosition[1], endPosition[1], interpolant),
    ];
  }
}

export { Point2dFloat64 };
