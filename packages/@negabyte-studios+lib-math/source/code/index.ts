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
  export function interpolate(start: Float64, end: Float64, t: Float64) {
    t = Math.max(0, Math.min(1, t));
    return start * (1 - t) + end * t;
  }
}

export { Float64 };

type Point2dFloat64 = [Float64, Float64];

namespace Point2dFloat64 {
  /**
   * Interpolate between start and end position.
   */
  export function interpolatePosition(
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
