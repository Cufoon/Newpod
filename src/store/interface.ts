import type { ActionState, Action } from './action';

export interface GlobalState {
  account_id: string;
  auth: number;
}

export type ActionData<K extends Action = Action, P extends any[] | [any] = any[]> = {
  type: K;
  payload?: ActionState[K];
  param?: P;
  process?: (prev: ActionState[K], ...args: P) => ActionState[K];
};

export type PureStateUpdater = <K extends Action>(
  state: GlobalState,
  type: K,
  payload?: ActionState[K]
) => GlobalState;

export type ReducerType<K extends Action = Action, P extends any[] | [any] = any[]> = (
  state: GlobalState,
  action: ActionData<K, P>
) => GlobalState;

// 为了更好的在 dispatch 时进行智能提示
export type DispatchType = <K extends Action = Action, P extends any[] | [any] = any[]>(
  action: ActionData<K, P>
) => void;

export type ActionSetHandler<T extends Action> = (
  state: GlobalState,
  payload: ActionState[T]
) => GlobalState;

export type ActionGetHandler<T extends Action> = (state: GlobalState) => ActionState[T];
