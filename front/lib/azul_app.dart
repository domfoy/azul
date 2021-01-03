import 'package:redux/redux.dart';
import "package:flutter_redux/flutter_redux.dart";
import 'package:flutter/material.dart';

import 'package:azul_client/redux/app_state.dart';
import 'package:azul_client/redux/app_reducer.dart';
import 'package:azul_client/presentation/game/screen.dart';

enum Actions { Increment }

int counterReducer(int state, dynamic action) {
  if (action == Actions.Increment) {
    return state + 1;
  }

  return state;
}

class AzulApp extends StatefulWidget {
  @override
  _AppState createState() => new _AppState();
}

class _AppState extends State<AzulApp> {
  Store<AppState> store;

  @override
  void initState() {
    super.initState();
    store = Store<AppState>(appReducer, initialState: AppState.init());
  }

  @override
  Widget build(BuildContext context) {
    return StoreProvider(
        store: store,
        child: MaterialApp(
            title: 'Welcome to Flutter',
            home: Container(color: Colors.brown, child: GameScreen())));
  }
}
