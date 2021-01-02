import 'package:flutter/material.dart';

class Tile extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AspectRatio(
        aspectRatio: 1,
        child: Container(
            color: Colors.orange,
            child: FractionallySizedBox(
                heightFactor: 0.75,
                widthFactor: 0.75,
                child: Container(color: Colors.brown))));
  }
}
