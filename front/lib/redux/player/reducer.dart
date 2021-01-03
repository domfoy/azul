import 'package:redux/redux.dart';

import 'package:azul_client/redux/app_state.dart';
import 'package:azul_client/redux/player/actions.dart';

final playerReducers = <AppState Function(AppState, dynamic)>[
  TypedReducer<AppState, PlayerScoreUpdatedAction>(_onPlayerScoreUpdated),
];

AppState _onPlayerScoreUpdated(
    AppState state, PlayerScoreUpdatedAction action) {
  final newPlayers = state.players.rebuild((players) => players
    ..map((player) {
      if (player.id == action.playerId) {
        return player.copyWith(score: player.score + action.scoreDiff);
      }

      return player;
    }));

  return state.copyWith(players: newPlayers);
}
