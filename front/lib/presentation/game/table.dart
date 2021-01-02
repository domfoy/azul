import 'package:flutter/material.dart';

import 'package:azul_client/presentation/game/lib.dart';

class CommonBoard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Flexible(
            flex: 1,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Flexible(flex: 1, child: Factory()),
                Flexible(flex: 1, child: Factory()),
                Flexible(flex: 1, child: Factory()),
                Flexible(flex: 1, child: Factory()),
                Flexible(flex: 1, child: Factory()),
              ],
            )),
        Flexible(flex: 1, child: TableCenter())
      ],
    );
  }
}

class TableCenter extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    List<Widget> row = [];
    for (var i = 0; i < 2 * 5; i++) {
      row.add(Flexible(flex: 1, child: Tile()));
    }
    return Container(
        padding: EdgeInsets.all(8),
        color: Colors.green[800],
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Flexible(
                flex: 1,
                child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: row)),
            Flexible(
                flex: 1,
                child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: row)),
          ],
        ));
  }
}

class Factory extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AspectRatio(
        aspectRatio: 1,
        child: Container(
            color: Colors.blueGrey,
            padding: EdgeInsets.all(8),
            child: Column(
              children: [
                Flexible(
                    flex: 1,
                    child: Container(
                        child: Row(
                      children: [
                        Flexible(flex: 1, child: Tile()),
                        Flexible(flex: 1, child: Tile()),
                      ],
                    ))),
                Flexible(
                    flex: 1,
                    child: Container(
                        child: Row(
                      children: [
                        Flexible(flex: 1, child: Tile()),
                        Flexible(flex: 1, child: Tile()),
                      ],
                    )))
              ],
            )));
  }
}
