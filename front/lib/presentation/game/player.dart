import 'package:flutter/material.dart';

import 'package:azul_client/presentation/game/lib.dart';

class PlayerBoard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
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
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Flexible(flex: 1, child: FloorLine()),
                            Flexible(
                                flex: 1,
                                child: AspectRatio(
                                    aspectRatio: 1, child: Score())),
                          ],
                        ))))),
      ],
    )));
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
  @override
  Widget build(BuildContext context) {
    List<Widget> tiles = [];

    for (var j = 0; j < 7; j++) {
      tiles.add(Flexible(flex: 1, child: Tile()));
    }

    return Row(mainAxisAlignment: MainAxisAlignment.center, children: tiles);
  }
}

class Score extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
        color: Colors.indigo, child: FittedBox(child: Text("100")));
  }
}
