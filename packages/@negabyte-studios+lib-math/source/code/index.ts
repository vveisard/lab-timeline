type Float64 = number;

namespace Float64 {
  /**
   * aka interpolant
   * @see
   */
  export function getProgress(
    min: Float64,
    max: Float64,
    value: Float64
  ): Float64 {
    return value / (max - min);
  }
  export function interpolate(start: Float64, end: Float64, t: Float64) {
    t = Math.max(0, Math.min(1, t));
    return start * (1 - t) + end * t;
  }
}

export { Float64 };

type Point2dFloat64 = [Float64, Float64];

namespace Point2dFloat64 {
  export function interpolatePosition(
    start: Point2dFloat64,
    end: Point2dFloat64,
    t: Float64
  ): Point2dFloat64 {
    return [
      Float64.interpolate(start[0], end[0], t),
      Float64.interpolate(start[1], end[1], t),
    ];
  }
}

export { Point2dFloat64 };
