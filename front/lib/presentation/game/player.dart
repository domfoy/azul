import 'package:flutter_redux/flutter_redux.dart';
import 'package:flutter/material.dart';

import 'package:azul_client/model/player.dart';
import 'package:azul_client/redux/app_state.dart';
import 'package:azul_client/redux/player/actions.dart';
import 'package:azul_client/presentation/game/lib.dart';

class PlayerBoard extends StatelessWidget {
  final int id;

  const PlayerBoard({this.id});

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, Player>(
        converter: (store) =>
            store.state.players.firstWhere((player) => player.id == this.id),
        builder: (context, viewModel) => Container(
                child: IntrinsicWidth(
                    child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Flexible(
                    flex: 5,
                    child: Container(
                        color: Colors.blue,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Flexible(flex: 10, child: PatternBoard()),
                            Spacer(flex: 1),
                            Flexible(flex: 10, child: Wall()),
                          ],
                        ))),
                Flexible(
                    flex: 1,
                    child: Container(
                        alignment: Alignment.center,
                        color: Colors.lightGreenAccent,
                        child: IntrinsicHeight(
                            child: Container(
                                color: Colors.cyan,
                                child: Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Flexible(
                                        flex: 1,
                                        child:
                                            FloorLine(playerId: viewModel.id)),
                                    Flexible(
                                        flex: 1,
                                        child: AspectRatio(
                                            aspectRatio: 1,
                                            child:
                                                Score(score: viewModel.score))),
                                  ],
                                ))))),
              ],
            ))));
  }
}

class Wall extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    List<Widget> rows = [];
    for (var i = 0; i < 5; i++) {
      List<Widget> tiles = [];

      for (var j = 0; j < 5; j++) {
        tiles.add(Flexible(flex: 1, child: Tile()));
      }

      rows.add(Flexible(
          flex: 1,
          child:
              Row(mainAxisAlignment: MainAxisAlignment.end, children: tiles)));
    }

    return AspectRatio(
        aspectRatio: 1,
        child: Column(
          children: rows,
        ));
  }
}

class PatternBoard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    List<Widget> rows = [];
    for (var i = 0; i < 5; i++) {
      List<Widget> tiles = [];

      for (var j = 0; j <= i; j++) {
        tiles.add(Flexible(flex: 1, child: Tile()));
      }

      rows.add(Flexible(
          flex: 1,
          child:
              Row(mainAxisAlignment: MainAxisAlignment.end, children: tiles)));
    }

    return AspectRatio(
        aspectRatio: 1,
        child: Column(
          children: rows,
        ));
  }
}

class FloorLine extends StatelessWidget {
  final int playerId;
  FloorLine({this.playerId});

  @override
  Widget build(BuildContext context) {
    List<Widget> tiles = [];

    for (var j = 0; j < 7; j++) {
      tiles.add(Flexible(flex: 1, child: Tile()));
    }

    return GestureDetector(
        onTap: () {
          StoreProvider.of<AppState>(context).dispatch(
              PlayerScoreUpdatedAction(playerId: this.playerId, scoreDiff: 1));
        },
        child:
            Row(mainAxisAlignment: MainAxisAlignment.center, children: tiles));
  }
}

class Score extends StatelessWidget {
  final int score;

  const Score({this.score});

  @override
  Widget build(BuildContext context) {
    return Container(
        color: Colors.indigo, child: FittedBox(child: Text(score.toString())));
  }
}
