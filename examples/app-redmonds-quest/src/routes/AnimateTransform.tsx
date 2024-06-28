import { createSignal, onMount, type Component } from "solid-js";
import {
  DeepMutable,
  createStore,
  produce,
  type SetStoreFunction,
  type Store,
} from "solid-js/store";
//
import { Point2dFloat64, Float64 } from "@negabyte-studios/lib-math";
import type { EntityCollection, EntityId } from "@negabyte-studios/lib-entity";
import {
  SectionData,
  TimeDirection,
  TimelineState,
  TimeStatus,
} from "@negabyte-studios/lib-timeline";

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

type GraphicsTaskEntityState = AnimateCharacterPositionUsingTimelineTaskState;

interface GraphicsWorldStore {
  readonly entitiesState: Store<GraphicsWorldEntitiesState>;
  readonly setEntitiesState: SetStoreFunction<GraphicsWorldEntitiesState>;
  readonly timelineState: Store<TimelineState | null>;
  readonly setTimelineState: SetStoreFunction<TimelineState | null>;
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
  readonly timelineState: TimelineState | null;
}

namespace GraphicsWorld {
  export function create(
    worldResources: GraphicsWorldResources,
    worldState: GraphicsWorldState
  ): GraphicsWorld {
    const [entitiesStore, setEntitiesStore] =
      createStore<GraphicsWorldEntitiesState>(worldState.entitiesState);

    const [timelineState, setTimelineState] = createStore<TimelineState>(
      worldState.timelineState
    );

    return {
      resources: worldResources,
      store: {
        entitiesState: entitiesStore,
        setEntitiesState: setEntitiesStore,
        timelineState: timelineState,
        setTimelineState: setTimelineState,
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

    const timelineSectionDatas = [
      {
        leftBoundTime: 1000,
        rightBoundTime: 2000,
      },
      {
        leftBoundTime: 1250,
        rightBoundTime: 2250,
      },
      {
        leftBoundTime: 3000,
        rightBoundTime: 3500,
      },
    ] satisfies ReadonlyArray<SectionData>;

    const firstTimelineState = TimelineState.create(
      timelineSectionDatas,
      0,
      TimeDirection.Right
    );

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
      timelineState: firstTimelineState,
    });

    function handleAnimationFrame() {
      const nextTimelineState = TimelineState.create(
        timelineSectionDatas,
        graphicsWorld.store.timelineState.time + 1000 / 60,
        TimeDirection.Right
      );

      // render using next timeline state
      for (const iTaskEntityId of graphicsWorld.store.entitiesState.tasks.ids) {
        const iTaskEntityState =
          graphicsWorld.store.entitiesState.tasks.states[iTaskEntityId];

        const iTaskTargetTimelineSectionState =
          graphicsWorld.store.timelineState.sectionStates[
            iTaskEntityState.targetTimelineSectionIndex
          ];

        switch (iTaskEntityState.taskType) {
          case GraphicsTaskTypeEnum.AnimateCharacterPositionUsingTimeline: {
            const iTaskTargetTimelineSectionDatas =
              timelineSectionDatas[iTaskEntityState.targetTimelineSectionIndex];

            if (
              iTaskTargetTimelineSectionState.timeState.status ===
              TimeStatus.BeforeStart
            ) {
              continue;
            }

            const iNextTaskTimelineSectionProgress = Float64.clamp(
              Float64.getProgress(
                nextTimelineState.time,
                iTaskTargetTimelineSectionDatas.leftBoundTime,
                iTaskTargetTimelineSectionDatas.rightBoundTime
              ),
              0,
              1.0
            );

            const iNextTaskPosition = Point2dFloat64.interpolatePositionClamped(
              iTaskEntityState.positionStart,
              iTaskEntityState.positionEnd,
              iNextTaskTimelineSectionProgress
            );

            graphicsWorld.store.setEntitiesState(
              produce<DeepMutable<GraphicsWorldEntitiesState>>(
                (state) =>
                  (state.characters.states[
                    iTaskEntityState.targetCharacterEntityId
                  ].position = iNextTaskPosition)
              )
            );

            break;
          }
          default: {
            throw new Error(`Invalid state!`);
          }
        }
      }

      graphicsWorld.store.setTimelineState(nextTimelineState);

      GraphicsWorld.clearCanvas(graphicsWorld);
      GraphicsWorld.renderCanvas(graphicsWorld);

      // timeline is over, do not update any more
      if (
        nextTimelineState.sectionStates.every(
          (i) => i.timeState.status === TimeStatus.AfterEnd
        )
      ) {
        return;
      }

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
