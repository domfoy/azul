import 'package:flutter/foundation.dart';

import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:built_collection/built_collection.dart';

import 'package:azul_client/model/player.dart';

part 'app_state.freezed.dart';

@freezed
abstract class AppState implements _$AppState {
  const AppState._();
  const factory AppState({int id, BuiltList<Player> players}) = _AppState;

  factory AppState.init() {
    var players = [
      Player(
        id: 1,
        name: 'Player 1',
        score: 0,
      ),
      Player(
        id: 2,
        name: 'Player 2',
        score: 0,
      )
    ].build();

    return AppState(id: 1, players: players);
  }
}
