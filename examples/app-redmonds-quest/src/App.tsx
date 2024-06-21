import { createSignal, onMount, type Component } from "solid-js";
import { DeepMutable, produce, unwrap } from "solid-js/store";
//
import { Point2dFloat64, Float64 } from "@negabyte-studios/lib-math";
import { TimelineState, TimelineParams } from "@negabyte-studios/lib-timeline";
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

    const graphicsWorld = GraphicsWorld.create(graphicsWorldResources, {
      entities: {
        characters: {
          ids: ["redmond"],
          states: {
            redmond: {
              position: [0, 0],
            },
          },
        },
      },
      tasks: [
        {
          taskType: GraphicsTaskTypeEnum.AnimateCharacterPosition,
          targetCharacterEntityId: "redmond",
          positionStart: [0, 0],
          positionEnd: [100, 100],
        },
      ],
      timeline: TimelineState.create(1),
    });

    const timelineParams = TimelineParams.create([
      {
        startTime: 2500,
        endTime: 7500,
      },
    ]);

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

        // we are not checking status of the task, so this will constantly set the position
        switch (iTimelineClipTaskParam.taskType) {
          case GraphicsTaskTypeEnum.AnimateCharacterPosition: {
            graphicsWorld.store.setEntitiesState(
              produce<DeepMutable<GraphicsWorldEntitiesState>>(
                (state) =>
                  (state.characters.states[
                    iTimelineClipTaskParam.targetCharacterEntityId
                  ].position = Point2dFloat64.interpolatePosition(
                    iTimelineClipTaskParam.positionStart,
                    iTimelineClipTaskParam.positionEnd,
                    Float64.getProgress(
                      timelineParams.clips[iTimelineClipIndex].startTime,
                      timelineParams.clips[iTimelineClipIndex].endTime,
                      iTimelineClipState.time.runTime
                    )
                  ))
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

      console.log(
        JSON.stringify(graphicsWorld.store.timelineState, undefined, 2),
        JSON.stringify(graphicsWorld.store.entitiesState, undefined, 2)
      );

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
