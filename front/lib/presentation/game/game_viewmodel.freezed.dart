// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies

part of 'game_viewmodel.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

/// @nodoc
class _$GameViewModelTearOff {
  const _$GameViewModelTearOff();

// ignore: unused_element
  _GameViewModel call({BuiltList<int> playerScores}) {
    return _GameViewModel(
      playerScores: playerScores,
    );
  }
}

/// @nodoc
// ignore: unused_element
const $GameViewModel = _$GameViewModelTearOff();

/// @nodoc
mixin _$GameViewModel {
  BuiltList<int> get playerScores;

  $GameViewModelCopyWith<GameViewModel> get copyWith;
}

/// @nodoc
abstract class $GameViewModelCopyWith<$Res> {
  factory $GameViewModelCopyWith(
          GameViewModel value, $Res Function(GameViewModel) then) =
      _$GameViewModelCopyWithImpl<$Res>;
  $Res call({BuiltList<int> playerScores});
}

/// @nodoc
class _$GameViewModelCopyWithImpl<$Res>
    implements $GameViewModelCopyWith<$Res> {
  _$GameViewModelCopyWithImpl(this._value, this._then);

  final GameViewModel _value;
  // ignore: unused_field
  final $Res Function(GameViewModel) _then;

  @override
  $Res call({
    Object playerScores = freezed,
  }) {
    return _then(_value.copyWith(
      playerScores: playerScores == freezed
          ? _value.playerScores
          : playerScores as BuiltList<int>,
    ));
  }
}

/// @nodoc
abstract class _$GameViewModelCopyWith<$Res>
    implements $GameViewModelCopyWith<$Res> {
  factory _$GameViewModelCopyWith(
          _GameViewModel value, $Res Function(_GameViewModel) then) =
      __$GameViewModelCopyWithImpl<$Res>;
  @override
  $Res call({BuiltList<int> playerScores});
}

/// @nodoc
class __$GameViewModelCopyWithImpl<$Res>
    extends _$GameViewModelCopyWithImpl<$Res>
    implements _$GameViewModelCopyWith<$Res> {
  __$GameViewModelCopyWithImpl(
      _GameViewModel _value, $Res Function(_GameViewModel) _then)
      : super(_value, (v) => _then(v as _GameViewModel));

  @override
  _GameViewModel get _value => super._value as _GameViewModel;

  @override
  $Res call({
    Object playerScores = freezed,
  }) {
    return _then(_GameViewModel(
      playerScores: playerScores == freezed
          ? _value.playerScores
          : playerScores as BuiltList<int>,
    ));
  }
}

/// @nodoc
class _$_GameViewModel extends _GameViewModel with DiagnosticableTreeMixin {
  _$_GameViewModel({this.playerScores}) : super._();

  @override
  final BuiltList<int> playerScores;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'GameViewModel(playerScores: $playerScores)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'GameViewModel'))
      ..add(DiagnosticsProperty('playerScores', playerScores));
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) ||
        (other is _GameViewModel &&
            (identical(other.playerScores, playerScores) ||
                const DeepCollectionEquality()
                    .equals(other.playerScores, playerScores)));
  }

  @override
  int get hashCode =>
      runtimeType.hashCode ^ const DeepCollectionEquality().hash(playerScores);

  @override
  _$GameViewModelCopyWith<_GameViewModel> get copyWith =>
      __$GameViewModelCopyWithImpl<_GameViewModel>(this, _$identity);
}

abstract class _GameViewModel extends GameViewModel {
  _GameViewModel._() : super._();
  factory _GameViewModel({BuiltList<int> playerScores}) = _$_GameViewModel;

  @override
  BuiltList<int> get playerScores;
  @override
  _$GameViewModelCopyWith<_GameViewModel> get copyWith;
}
