import "package:redux/redux.dart";

import "package:azul_client/redux/app_state.dart";
import "package:azul_client/redux/player/reducer.dart";

final appReducer = combineReducers<AppState>([...playerReducers]);
