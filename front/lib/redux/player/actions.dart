class PlayerScoreUpdatedAction {
  final int playerId;
  final int scoreDiff;

  const PlayerScoreUpdatedAction({this.playerId, this.scoreDiff});
}
