import { WebGL } from ".";

export interface BaseRenderState {
	readonly gl: WebGL;
}

export type ContinuousRenderState<State extends BaseRenderState> = State & {
	readonly fps: number;
};

export type DrawFunction<State extends BaseRenderState> = (state: State) => void;

export type RenderLoopID = number;

/**
 * Renders a continuous animation
 * @param fps The speed at which to render
 * @param draw The function that renders the scene
 * @param state The information for each render
 * @returns The ID of this render loop
 */
export const startContinuousRender = <State extends ContinuousRenderState<BaseRenderState>>(
	draw: DrawFunction<State>,
	state: State,
): RenderLoopID => {
	// setInterval only
	draw(state);
	return setInterval(draw, 1000 / state.fps, state);
};

/**
 * Stops a render loop started by `startContinuousRender`
 * @param id The ID of the render loop to cancel
 */
export const stopContinuousRender = (id: RenderLoopID) => {
	clearInterval(id);
};
