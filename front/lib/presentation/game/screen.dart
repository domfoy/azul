import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';

import 'package:azul_client/presentation/game/player.dart';
import 'package:azul_client/presentation/game/table.dart';
import 'package:azul_client/redux/app_state.dart';

class GameScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, AppState>(
        converter: (store) => store.state,
        builder: (context, viewModel) => Row(
              children: [
                Spacer(),
                Flexible(
                    flex: 1,
                    child: Column(children: [
                      Expanded(child: PlayerBoard(id: viewModel.players[0].id)),
                      Flexible(
                          flex: 2,
                          fit: FlexFit.loose,
                          child: Container(child: CommonBoard())),
                      Flexible(
                          flex: 2,
                          fit: FlexFit.loose,
                          child: PlayerBoard(id: viewModel.players[1].id))
                    ])),
                Spacer(),
              ],
            ));
  }
}
