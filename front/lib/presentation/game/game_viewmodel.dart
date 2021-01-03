import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:built_collection/built_collection.dart';
import 'package:flutter/foundation.dart';
import 'package:redux/redux.dart';

import 'package:azul_client/redux/app_state.dart';

part 'game_viewmodel.freezed.dart';

@freezed
abstract class GameViewModel implements _$GameViewModel {
  const GameViewModel._();

  factory GameViewModel({BuiltList<int> playerScores}) = _GameViewModel;

  static GameViewModel fromStore(Store<AppState> store) {
    final playerScores = store.state.players.map((player) => player.score);

    return GameViewModel(playerScores: playerScores);
  }
}
