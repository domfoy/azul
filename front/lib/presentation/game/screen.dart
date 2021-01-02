import 'package:flutter/material.dart';

import 'package:azul_client/presentation/game/player.dart';
import 'package:azul_client/presentation/game/table.dart';

class GameScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Spacer(),
        Flexible(
            flex: 1,
            child: Column(children: [
              Expanded(child: PlayerBoard()),
              Flexible(
                  flex: 2,
                  fit: FlexFit.loose,
                  child: Container(child: CommonBoard())),
              Flexible(flex: 2, fit: FlexFit.loose, child: PlayerBoard())
            ])),
        Spacer(),
      ],
    );
  }
}
