import { createSignal, onMount, type Component } from "solid-js";
import {
  DeepMutable,
  createStore,
  produce,
  type SetStoreFunction,
  type Store,
} from "solid-js/store";
//
import type { EntityCollection } from "@negabyte-studios/lib-entity";
import { TimelineState } from "@negabyte-studios/lib-timeline";
import {
  AbsoluteAxisRangePosition,
  type RangeData,
} from "@negabyte-studios/lib-math";

interface DialogBoxEntityState {
  readonly text: string;
}

interface GraphicsWorldEntitiesState {
  readonly dialogBox: DialogBoxEntityState;
  readonly tasks: EntityCollection<GraphicsTaskEntityState>;
}

enum GraphicsTaskTypeEnum {
  RevealTextUsingTimeline,
}

interface BaseGraphicsTaskState {
  readonly taskType: GraphicsTaskTypeEnum;
}

interface RevealTextUsingTimelineTaskState extends BaseGraphicsTaskState {
  readonly taskType: GraphicsTaskTypeEnum.RevealTextUsingTimeline;
  /**
   * Index of the target timeline section to use.
   */
  readonly targetTimelineSectionIndex: number;

  readonly desiredText: string;
}

type GraphicsTaskEntityState = RevealTextUsingTimelineTaskState;

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
    if (graphicsWorld.store.entitiesState.dialogBox.text === null) {
      return;
    }
    graphicsWorld.resources.canvasRenderingContext.strokeText(
      graphicsWorld.store.entitiesState.dialogBox.text,
      0,
      48
    );
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

const RevealTextExampleRoute: Component = () => {
  const [getCanvasElement, setCanvasElement] =
    createSignal<HTMLCanvasElement>();

  onMount(() => {
    const canvasElement = getCanvasElement();

    if (!canvasElement) {
      throw new Error(`Invalid state!`);
    }

    const canvasRenderingContext = canvasElement.getContext("2d");
    canvasRenderingContext.font = "48px serif";

    const graphicsWorldResources: GraphicsWorldResources = {
      canvasRenderingContext: canvasRenderingContext,
    };

    const nextDialogBoxDesiredText = `Now this is a story all about how`;

    const timelineSectionRangeDatas = [
      {
        minimumBound: 60, // wait 60 frames
        maximumBound: 60 + nextDialogBoxDesiredText.length, // 1 character per frame
      },
    ] satisfies ReadonlyArray<RangeData>;

    const firstTimelineState = TimelineState.create(
      timelineSectionRangeDatas,
      0
    );

    const graphicsWorld = GraphicsWorld.create(graphicsWorldResources, {
      entitiesState: {
        dialogBox: {
          text: null,
        },
        tasks: {
          ids: ["reveal-dialog-box-text"],
          states: {
            "reveal-dialog-box-text": {
              taskType: GraphicsTaskTypeEnum.RevealTextUsingTimeline,
              targetTimelineSectionIndex: 0,
              desiredText: nextDialogBoxDesiredText,
            },
          },
        },
      },
      timelineState: firstTimelineState,
    });

    function handleAnimationFrame() {
      const nextTimelineState = TimelineState.create(
        timelineSectionRangeDatas,
        graphicsWorld.store.timelineState.time + 1
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

        switch (iTaskEntityState.taskType) {
          case GraphicsTaskTypeEnum.RevealTextUsingTimeline: {
            if (
              iTaskTargetTimelineSectionState.timeState.position ===
              AbsoluteAxisRangePosition.LessThanMinimumBound
            ) {
              continue;
            }

            const nextText = iTaskEntityState.desiredText.slice(
              0,
              iTaskTargetTimelineSectionState.timeState.inPositive
            );
            graphicsWorld.store.setEntitiesState(
              produce<DeepMutable<GraphicsWorldEntitiesState>>(
                (state) => (state.dialogBox.text = nextText)
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

      // timeline is over, do not update any more
      if (
        nextTimelineState.sectionStates.every(
          (i) =>
            i.timeState.position ===
            AbsoluteAxisRangePosition.GreaterThanMaximumBound
        )
      ) {
        return;
      }

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

export { RevealTextExampleRoute };
