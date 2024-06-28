type Float64 = number;

namespace Float64 {
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
