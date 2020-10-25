import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';

import 'package:flutter/material.dart';
import 'package:spritewidget/spritewidget.dart';

enum Actions { Increment }

int counterReducer(int state, dynamic action) {
  if (action == Actions.Increment) {
    return state + 1;
  }

  return state;
}

class RedCircle extends Node {
  RedCircle(this.radius);

  double radius;

  @override
  void paint(Canvas canvas) {
    canvas.drawCircle(
      Offset(500, 100),
      radius,
      new Paint()..color = const Color(0xffff0000)
    );
  }
}

class AppState extends State<AzulApp> {
  Store<int> store;
  NodeWithSize spriteRoot;

  @override
  void initState() {
    super.initState();
    store = Store<int>(counterReducer, initialState: 0);

    spriteRoot = new NodeWithSize(const Size(1024.0, 1024.0));

    var circle = new RedCircle(10);
    spriteRoot.addChild(circle);
  }

  @override
  Widget build(BuildContext context) {
  	return new SpriteWidget(spriteRoot);
  }
}

class AzulApp extends StatefulWidget {
  @override
  AppState createState() => new AppState();
}

void main() {
  runApp(AzulApp());
}