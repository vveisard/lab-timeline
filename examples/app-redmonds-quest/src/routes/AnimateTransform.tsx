import { createSignal, onMount, type Component } from "solid-js";
import {
  DeepMutable,
  createStore,
  produce,
  type SetStoreFunction,
  type Store,
} from "solid-js/store";
//
import {
  Point2dFloat64,
  Float64,
  AbsoluteAxisRangePosition,
  type RangeData,
} from "@negabyte-studios/lib-math";
import type { EntityCollection, EntityId } from "@negabyte-studios/lib-entity";

/**
 * State of a character entity in the graphics world.
 */
interface CharacterGraphicsEntityState {
  readonly position: Point2dFloat64;
  readonly color: CanvasFillStrokeStyles["fillStyle"];
}

interface GraphicsWorldEntitiesState {
  readonly characters: EntityCollection<CharacterGraphicsEntityState>;
  readonly tasks: EntityCollection<GraphicsTaskEntityState>;
}

enum GraphicsTaskTypeEnum {
  AnimateCharacterPositionUsingTimeline,
}

interface BaseGraphicsTaskState {
  readonly taskType: GraphicsTaskTypeEnum;
}

interface AnimateCharacterPositionUsingTimelineTaskState
  extends BaseGraphicsTaskState {
  readonly taskType: GraphicsTaskTypeEnum.AnimateCharacterPositionUsingTimeline;
  /**
   * Index of the target timeline section to use.
   */
  readonly targetTimelineSectionIndex: number;
  readonly targetCharacterEntityId: EntityId;
  readonly positionStart: Point2dFloat64;
  readonly positionEnd: Point2dFloat64;
}

interface GraphicsWorldTimelineState {
  readonly time: number;
  readonly sectionRangeDatas: Array<RangeData> | null;
}

type GraphicsTaskEntityState = AnimateCharacterPositionUsingTimelineTaskState;

interface GraphicsWorldStore {
  readonly entitiesState: Store<GraphicsWorldEntitiesState>;
  readonly setEntitiesState: SetStoreFunction<GraphicsWorldEntitiesState>;
  readonly timelineState: Store<GraphicsWorldTimelineState | null>;
  readonly setTimelineState: SetStoreFunction<DeepMutable<GraphicsWorldTimelineState> | null>;
}

interface GraphicsWorldResources {
  readonly canvasRenderingContext: CanvasRenderingContext2D;
}

interface GraphicsWorld {
  readonly resources: GraphicsWorldResources;
  readonly store: GraphicsWorldStore;
}

interface GraphicsWorldState {
  readonly entitiesState: GraphicsWorldEntitiesState;
  readonly timelineState: GraphicsWorldTimelineState | null;
}

namespace GraphicsWorld {
  export function create(
    worldResources: GraphicsWorldResources,
    worldState: GraphicsWorldState
  ): GraphicsWorld {
    const [entitiesStore, setEntitiesStore] =
      createStore<GraphicsWorldEntitiesState>(worldState.entitiesState);

    const [timelineStore, setTimelineStore] =
      createStore<GraphicsWorldTimelineState>(worldState.timelineState);

    return {
      resources: worldResources,
      store: {
        entitiesState: entitiesStore,
        setEntitiesState: setEntitiesStore,
        timelineState: timelineStore,
        setTimelineState: setTimelineStore,
      },
    };
  }

  export function renderCanvas(graphicsWorld: GraphicsWorld): undefined {
    for (const [iCharacterEntityId, iCharacterEntityState] of Object.entries(
      graphicsWorld.store.entitiesState.characters.states
    )) {
      graphicsWorld.resources.canvasRenderingContext.fillStyle =
        iCharacterEntityState.color;

      graphicsWorld.resources.canvasRenderingContext.fillRect(
        ...iCharacterEntityState.position,
        5,
        5
      );
    }
  }

  export function clearCanvas(graphicsWorld: GraphicsWorld): undefined {
    graphicsWorld.resources.canvasRenderingContext.clearRect(
      0,
      0,
      graphicsWorld.resources.canvasRenderingContext.canvas.width,
      graphicsWorld.resources.canvasRenderingContext.canvas.height
    );
  }
}

const AnimateTransformExampleRoute: Component = () => {
  const [getCanvasElement, setCanvasElement] =
    createSignal<HTMLCanvasElement>();

  onMount(() => {
    const canvasElement = getCanvasElement();

    if (!canvasElement) {
      throw new Error(`Invalid state!`);
    }

    const canvasRenderingContext = canvasElement.getContext("2d");

    const graphicsWorldResources: GraphicsWorldResources = {
      canvasRenderingContext: canvasRenderingContext,
    };

    const timelineSectionRangeDatas = [
      {
        minimumBound: 1000,
        maximumBound: 2000,
      },
      {
        minimumBound: 1250,
        maximumBound: 2250,
      },
      {
        minimumBound: 3000,
        maximumBound: 3500,
      },
    ] satisfies ReadonlyArray<RangeData>;

    const graphicsWorld = GraphicsWorld.create(graphicsWorldResources, {
      entitiesState: {
        characters: {
          ids: ["bluford", "redmond"],
          states: {
            bluford: {
              position: [0, 0],
              color: "blue",
            },
            redmond: {
              position: [0, 0],
              color: "red",
            },
          },
        },
        tasks: {
          ids: [
            "animate-character-position-bluford-a",
            "animate-character-position-redmond-a",
            "animate-character-position-redmond-b",
          ],
          states: {
            "animate-character-position-bluford-a": {
              taskType:
                GraphicsTaskTypeEnum.AnimateCharacterPositionUsingTimeline,
              targetCharacterEntityId: "bluford",
              positionStart: [0, 0],
              positionEnd: [100, 100],
              targetTimelineSectionIndex: 0,
            },
            "animate-character-position-redmond-a": {
              taskType:
                GraphicsTaskTypeEnum.AnimateCharacterPositionUsingTimeline,
              targetCharacterEntityId: "redmond",
              positionStart: [0, 0],
              positionEnd: [100, 0],
              targetTimelineSectionIndex: 1,
            },
            "animate-character-position-redmond-b": {
              taskType:
                GraphicsTaskTypeEnum.AnimateCharacterPositionUsingTimeline,
              targetCharacterEntityId: "redmond",
              positionStart: [100, 0],
              positionEnd: [100, 100],
              targetTimelineSectionIndex: 2,
            },
          },
        },
      },
      timelineState: {
        time: 0,
        sectionRangeDatas: timelineSectionRangeDatas,
      },
    });

    function handleAnimationFrame() {
      const nextTimelineTime =
        graphicsWorld.store.timelineState.time + 1000 / 60;

      // render using next timeline state
      for (const iTaskEntityId of graphicsWorld.store.entitiesState.tasks.ids) {
        const iTaskEntityState =
          graphicsWorld.store.entitiesState.tasks.states[iTaskEntityId];

        const iTaskSectionRangeData =
          graphicsWorld.store.timelineState.sectionRangeDatas[
            iTaskEntityState.targetTimelineSectionIndex
          ];

        switch (iTaskEntityState.taskType) {
          case GraphicsTaskTypeEnum.AnimateCharacterPositionUsingTimeline: {
            const iTaskTimelineSectionPosition =
              Float64.getAbsoluteRangePosition(
                nextTimelineTime,
                iTaskSectionRangeData.minimumBound,
                iTaskSectionRangeData.maximumBound
              );

            if (
              iTaskTimelineSectionPosition ===
              AbsoluteAxisRangePosition.LessThanMinimumBound
            ) {
              continue;
            }

            const iNextTaskTimelineSectionTimeProgress = Float64.clamp(
              // TODO replace this with "remap" function
              Float64.getProgress(
                nextTimelineTime,
                iTaskSectionRangeData.minimumBound,
                iTaskSectionRangeData.maximumBound
              ),
              0,
              1.0
            );

            const iNextTaskSectionTimePosition =
              Point2dFloat64.interpolatePositionClamped(
                iTaskEntityState.positionStart,
                iTaskEntityState.positionEnd,
                iNextTaskTimelineSectionTimeProgress
              );

            graphicsWorld.store.setEntitiesState(
              produce<DeepMutable<GraphicsWorldEntitiesState>>(
                (state) =>
                  (state.characters.states[
                    iTaskEntityState.targetCharacterEntityId
                  ].position = iNextTaskSectionTimePosition)
              )
            );

            break;
          }
          default: {
            throw new Error(`Invalid state!`);
          }
        }
      }

      GraphicsWorld.clearCanvas(graphicsWorld);
      GraphicsWorld.renderCanvas(graphicsWorld);

      graphicsWorld.store.setTimelineState("time", nextTimelineTime);

      requestAnimationFrame(handleAnimationFrame);

      return;
    }
    requestAnimationFrame(handleAnimationFrame);
  });

  return (
    <>
      <canvas
        ref={setCanvasElement}
        width={256}
        height={192}
        style={{
          "image-rendering": "pixelated",
        }}
      />
    </>
  );
};

export { AnimateTransformExampleRoute };
