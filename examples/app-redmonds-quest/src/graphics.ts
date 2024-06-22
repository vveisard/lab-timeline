import { createStore, type SetStoreFunction, type Store } from "solid-js/store";
//
import type { EntityCollection, EntityId } from "@negabyte-studios/lib-entity";
import type { Point2dFloat64 } from "@negabyte-studios/lib-math";
import type { TimelineState } from "@negabyte-studios/lib-timeline";
//

/**
 * State of a character entity in the graphics world.
 */
interface CharacterGraphicsEntityState {
  readonly position: Point2dFloat64;
  readonly color: CanvasFillStrokeStyles["fillStyle"];
}

interface GraphicsWorldEntitiesState {
  readonly characters: EntityCollection<CharacterGraphicsEntityState>;
}

enum GraphicsTaskTypeEnum {
  AnimateCharacterPositionTimelineClip,
}

interface BaseGraphicsTaskParams {
  readonly taskType: GraphicsTaskTypeEnum;
}

interface AnimateCharacterPositionTaskParams extends BaseGraphicsTaskParams {
  readonly taskType: GraphicsTaskTypeEnum.AnimateCharacterPositionTimelineClip;
  readonly targetCharacterEntityId: EntityId;
  readonly positionStart: Point2dFloat64;
  readonly positionEnd: Point2dFloat64;
}

type GraphicsTaskParams = AnimateCharacterPositionTaskParams;

type GraphicsWorldTasksParams = Array<GraphicsTaskParams>;

interface GraphicsWorldStore {
  readonly entitiesState: Store<GraphicsWorldEntitiesState>;
  readonly setEntitiesState: SetStoreFunction<GraphicsWorldEntitiesState>;
  readonly tasksParams: Store<GraphicsWorldTasksParams>;
  readonly setTasksParams: SetStoreFunction<GraphicsWorldTasksParams>;
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
  readonly entities: GraphicsWorldEntitiesState;
  readonly tasks: GraphicsWorldTasksParams | null;
  readonly timeline: TimelineState | null;
}

namespace GraphicsWorld {
  export function create(
    worldResources: GraphicsWorldResources,
    worldState: GraphicsWorldState
  ): GraphicsWorld {
    const [entitiesStore, setEntitiesStore] =
      createStore<GraphicsWorldEntitiesState>(worldState.entities);

    const [taskParams, setTaskParams] = createStore<GraphicsWorldTasksParams>(
      worldState.tasks
    );

    const [timelineState, setTimelineState] = createStore<TimelineState>(
      worldState.timeline
    );

    return {
      resources: worldResources,
      store: {
        entitiesState: entitiesStore,
        setEntitiesState: setEntitiesStore,
        tasksParams: taskParams,
        setTasksParams: setTaskParams,
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

export {
  type CharacterGraphicsEntityState,
  type GraphicsWorldEntitiesState,
  type GraphicsWorldStore,
  type GraphicsWorldResources,
  GraphicsWorld,
  GraphicsTaskTypeEnum,
};
