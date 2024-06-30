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

type Float64 = number;

namespace Float64 {
  /**
   * Get absolute position of value in a range.
   */
  export function getAbsoluteRangePosition(
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
  export function getRelativeRangePosition(
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
   * Get the normalized progress (interpolant) between two bounds.
   */
  export function getProgress(
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
