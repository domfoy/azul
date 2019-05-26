import specificPlayerBoard from './generic';

const mapStateToProps = ({game: {players, startPlayerId}}) => ({player: players[startPlayerId - 1]});

export default specificPlayerBoard(mapStateToProps);
