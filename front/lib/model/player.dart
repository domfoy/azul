import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'player.freezed.dart';

@freezed
abstract class Player with _$Player {
  factory Player({int id, String name, int score}) = _Player;
}
