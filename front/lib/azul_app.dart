import 'package:redux/redux.dart';
import 'package:flutter/material.dart';

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
  Store<int> store;

  @override
  void initState() {
    super.initState();
    store = Store<int>(counterReducer, initialState: 0);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Welcome to Flutter',
        home: Container(color: Colors.brown, child: GameScreen()));
  }
}
