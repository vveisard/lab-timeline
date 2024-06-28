import { createSignal, onMount, type Component } from "solid-js";
import {
  DeepMutable,
  createStore,
  produce,
  unwrap,
  type SetStoreFunction,
  type Store,
} from "solid-js/store";
//
import { Point2dFloat64, Float64 } from "@negabyte-studios/lib-math";
import type { EntityCollection, EntityId } from "@negabyte-studios/lib-entity";
import {
  TimelineState,
  TimelineParams,
  TimeStatus,
  SectionParamsRunType,
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
  AnimateCharacterPositionTimelineSection,
}

interface BaseGraphicsTaskState {
  readonly taskType: GraphicsTaskTypeEnum;
}

interface AnimateCharacterPositionUsingTimelineSectionTaskState
  extends BaseGraphicsTaskState {
  readonly taskType: GraphicsTaskTypeEnum.AnimateCharacterPositionTimelineSection;
  /**
   * Index of the target timeline section to use.
   */
  readonly targetTimelineSectionIndex: number;
  readonly targetCharacterEntityId: EntityId;
  readonly positionStart: Point2dFloat64;
  readonly positionEnd: Point2dFloat64;
}

type GraphicsTaskEntityState =
  AnimateCharacterPositionUsingTimelineSectionTaskState;

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

const AdvancedRunTimeRoute: Component = () => {
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

    const timelineParams = TimelineParams.create([
      {
        sectionRunType: SectionParamsRunType.RunTime,
        startTime: 1000,
        endTime: 2000,
      },
      {
        sectionRunType: SectionParamsRunType.RunTime,
        startTime: 1250,
        endTime: 2250,
      },
      {
        sectionRunType: SectionParamsRunType.RunTime,
        startTime: 3000,
        endTime: 3500,
      },
    ]);

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
                GraphicsTaskTypeEnum.AnimateCharacterPositionTimelineSection,
              targetCharacterEntityId: "bluford",
              positionStart: [0, 0],
              positionEnd: [100, 100],
              targetTimelineSectionIndex: 0,
            },
            "animate-character-position-redmond-a": {
              taskType:
                GraphicsTaskTypeEnum.AnimateCharacterPositionTimelineSection,
              targetCharacterEntityId: "redmond",
              positionStart: [0, 0],
              positionEnd: [100, 0],
              targetTimelineSectionIndex: 1,
            },
            "animate-character-position-redmond-b": {
              taskType:
                GraphicsTaskTypeEnum.AnimateCharacterPositionTimelineSection,
              targetCharacterEntityId: "redmond",
              positionStart: [100, 0],
              positionEnd: [100, 100],
              targetTimelineSectionIndex: 2,
            },
          },
        },
      },
      timelineState: TimelineState.create(timelineParams.sectionParams.length),
    });

    function handleAnimationFrame() {
      const nextTimelineState = TimelineState.update(
        unwrap(graphicsWorld.store.timelineState),
        timelineParams,
        1000 / 60
      );

      graphicsWorld.store.setTimelineState(nextTimelineState);

      // set character entity state using timeline and tasks
      for (const iTaskEntityId of graphicsWorld.store.entitiesState.tasks.ids) {
        const iTaskEntityState =
          graphicsWorld.store.entitiesState.tasks.states[iTaskEntityId];

        const iTaskTargetTimelineSectionState =
          graphicsWorld.store.timelineState.sectionStates[
            iTaskEntityState.targetTimelineSectionIndex
          ];

        if (iTaskTargetTimelineSectionState.timeStatus === TimeStatus.None) {
          continue;
        }

        switch (iTaskEntityState.taskType) {
          case GraphicsTaskTypeEnum.AnimateCharacterPositionTimelineSection: {
            const iTaskTargetSectionParams =
              timelineParams.sectionParams[
                iTaskEntityState.targetTimelineSectionIndex
              ];

            const taskTimelineSectionProgress = Float64.getProgress(
              iTaskTargetSectionParams.startTime,
              iTaskTargetSectionParams.endTime,
              iTaskTargetTimelineSectionState.timeState.runTime
            );

            const nextPosition = Point2dFloat64.interpolatePosition(
              iTaskEntityState.positionStart,
              iTaskEntityState.positionEnd,
              taskTimelineSectionProgress
            );

            graphicsWorld.store.setEntitiesState(
              produce<DeepMutable<GraphicsWorldEntitiesState>>(
                (state) =>
                  (state.characters.states[
                    iTaskEntityState.targetCharacterEntityId
                  ].position = nextPosition)
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

      requestAnimationFrame(handleAnimationFrame);
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

export { AdvancedRunTimeRoute };
