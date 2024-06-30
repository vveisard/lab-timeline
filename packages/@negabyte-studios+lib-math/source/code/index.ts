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
 * Data for a range of some number line.
 */
interface RangeData {
  /**
   * bound of the range the negative direction of an axis.
   */
  readonly minimumBound: Float64;

  /**
   * bound of the range the positive direction of an axis.
   */
  readonly maximumBound: Float64;
}

namespace RangeData {
  /**
   * Get the amount a value is in a range, in the positive direction, measured from the minimum bound.
   */
  export function getPositiveIn(self: RangeData, value: Float64): number {
    return value - self.minimumBound;
  }

  /**
   * Get the amount a value is in a range, in the negative direction, measured from the maximum bound.
   */
  export function getNegativeIn(self: RangeData, value: Float64): number {
    return self.maximumBound - value;
  }

  export function validate(self: RangeData, name?: string): Error | undefined {
    if (
      self.maximumBound !== undefined &&
      self.maximumBound < self.minimumBound
    ) {
      return new Error(
        `Invalid argument! ${name}: rightBoundTime < leftBoundTime`
      );
    }

    if (self.minimumBound < 0) {
      return new Error(`Invalid argument! ${name}: leftBoundTime < 0`);
    }

    if (self.maximumBound < 0) {
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

export { RangeData };

// @region-end

// @region-start

/**
 * State of time for a {@link SectionState}.
 * @remarks
 * Derived state.
 */
interface RangeState {
  /**
   * Position of the time relative to this range.
   */
  readonly position: AbsoluteAxisRangePosition;
  /**
   * Amount of time into the range, measured from the minimum bound of this range.
   * Negative: time is less than the minimum bound
   */
  readonly inPositive: number;

  /**
   * Amount of time into the range, measured from the maximum bound of this range.
   * Negative: time is greater than the maximum bound
   */
  readonly inNegative: number;
}

namespace RangeState {
  /**
   * Create {@link RangeState} from a {@link SectionRangeData}.
   */
  export function create(
    rangeData: RangeData,
    timelineTime: number
  ): RangeState {
    const positiveTime = RangeData.getPositiveIn(rangeData, timelineTime);
    const negativeTime = RangeData.getNegativeIn(rangeData, timelineTime);
    const position = Float64.getAbsoluteRangePosition(
      timelineTime,
      rangeData.minimumBound,
      rangeData.maximumBound
    );

    return {
      position: position,
      inPositive: positiveTime,
      inNegative: negativeTime,
    };
  }
}

export { RangeState };

// @region-end

// @region-start

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
