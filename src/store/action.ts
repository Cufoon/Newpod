import type { GlobalState, ActionSetHandler, ActionGetHandler } from './interface';

export const initialState: GlobalState = {
  account_id: '',
  auth: 0
};

export const enum Action {
  CHANGE_ACCOUNT_ID = 'change_account_id',
  CHANGE_AUTH = 'change_auth',
  RESET = 'reset'
}

export type ActionState = {
  [Action.CHANGE_ACCOUNT_ID]: GlobalState['account_id'];
  [Action.CHANGE_AUTH]: GlobalState['auth'];
  [Action.RESET]: GlobalState;
};

export const actionsSet: { [index in Action]: ActionSetHandler<index> } = {
  [Action.CHANGE_ACCOUNT_ID]: (state, payload) => ({ ...state, account_id: payload }),
  [Action.CHANGE_AUTH]: (state, payload) => ({ ...state, auth: payload }),
  [Action.RESET]: () => initialState
};

export const actionsGet: { [index in Action]: ActionGetHandler<index> } = {
  [Action.CHANGE_ACCOUNT_ID]: (state) => state.account_id,
  [Action.CHANGE_AUTH]: (state) => state.auth,
  [Action.RESET]: (state) => state
};
