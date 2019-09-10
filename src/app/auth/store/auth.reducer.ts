import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
  user: User;
  loading: boolean;
  errorMessage: string;
}

const initialState: State = {
  user: null,
  loading: false,
  errorMessage: null
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.id,
        action.payload.token,
        action.payload.expireIn
      );
      return {
        ...state,
        user,
        loading: false,
        errorMessage: null
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    case AuthActions.LOGIN_START:
      return {
        ...state,
        errorMessage: null,
        loading: true
      };
    case AuthActions.LOGIN_FAIL:
      return {
        ...state,
        user: null,
        loading: false,
        errorMessage: action.payload
      };
    default:
      return {
        ...state
      };
  }
}
