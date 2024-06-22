import { createSignal, onMount, type Component } from "solid-js";
import { DeepMutable, produce, unwrap } from "solid-js/store";
//
import { Point2dFloat64, Float64 } from "@negabyte-studios/lib-math";
import {
  TimelineState,
  TimelineParams,
  TimeStatus,
} from "@negabyte-studios/lib-timeline";
//
import {
  GraphicsTaskTypeEnum,
  GraphicsWorld,
  type GraphicsWorldEntitiesState,
  type GraphicsWorldResources,
} from "./graphics.ts";

const App: Component = () => {
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
        startTime: 1000,
        endTime: 2000,
      },
      {
        startTime: 1250,
        endTime: 2250,
      },
      {
        startTime: 3000,
        endTime: 3500,
      },
    ]);

    const graphicsWorld = GraphicsWorld.create(graphicsWorldResources, {
      entities: {
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
      },
      tasks: [
        {
          taskType: GraphicsTaskTypeEnum.AnimateCharacterPositionTimelineClip,
          targetCharacterEntityId: "bluford",
          positionStart: [0, 0],
          positionEnd: [100, 100],
        },
        {
          taskType: GraphicsTaskTypeEnum.AnimateCharacterPositionTimelineClip,
          targetCharacterEntityId: "redmond",
          positionStart: [0, 0],
          positionEnd: [100, 0],
        },
        {
          taskType: GraphicsTaskTypeEnum.AnimateCharacterPositionTimelineClip,
          targetCharacterEntityId: "redmond",
          positionStart: [100, 0],
          positionEnd: [100, 100],
        },
      ],
      timeline: TimelineState.create(timelineParams.clips.length),
    });

    function handleAnimationFrame() {
      const nextTimelineState = TimelineState.update(
        unwrap(graphicsWorld.store.timelineState),
        timelineParams,
        1000 / 60
      );

      graphicsWorld.store.setTimelineState(nextTimelineState);

      // set character entity state using timeline and tasks
      for (
        let iTimelineClipIndex = 0;
        iTimelineClipIndex < graphicsWorld.store.timelineState.clips.length;
        iTimelineClipIndex++
      ) {
        const iTimelineClipState =
          graphicsWorld.store.timelineState.clips[iTimelineClipIndex];
        const iTimelineClipTaskParam =
          graphicsWorld.store.tasksParams[iTimelineClipIndex];

        if (iTimelineClipState.status === TimeStatus.None) {
          continue;
        }

        switch (iTimelineClipTaskParam.taskType) {
          case GraphicsTaskTypeEnum.AnimateCharacterPositionTimelineClip: {
            const taskTimelineClipProgress = Float64.getProgress(
              timelineParams.clips[iTimelineClipIndex].startTime,
              timelineParams.clips[iTimelineClipIndex].endTime,
              iTimelineClipState.time.runTime
            );

            const nextPosition = Point2dFloat64.interpolatePosition(
              iTimelineClipTaskParam.positionStart,
              iTimelineClipTaskParam.positionEnd,
              taskTimelineClipProgress
            );

            graphicsWorld.store.setEntitiesState(
              produce<DeepMutable<GraphicsWorldEntitiesState>>(
                (state) =>
                  (state.characters.states[
                    iTimelineClipTaskParam.targetCharacterEntityId
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
      <canvas ref={setCanvasElement} width={256} height={192} />
    </>
  );
};

export default App;
