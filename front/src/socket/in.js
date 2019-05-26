import _ from 'lodash';

import {actions as gameActions} from '../game';

function parseClientAction(state, action) {
  console.log(JSON.stringify(action));
  switch (_.get(action, 'type')) {
    default:
      return undefined;
  }
}

function parseServerAction(state, action) {
  switch (_.get(action, 'type')) {
    case 'START_GAME': {
      const {
        name,
        playerId,
        players,
        startPlayerId,
      } = action.payload;

      return gameActions.start({
        name,
        playerId,
        players,
        startPlayerId,
      });
    }
    default:
      return undefined;
  }
}

export function parsePayload(state, payload) {
  if (!payload) {
    return undefined;
  }

  switch (payload.globalAction) {
    case 'CLIENT_ACTION':
      return parseClientAction(state, _.get(payload, 'clientAction'));
    case 'SERVER_ACTION':
      return parseServerAction(state, _.get(payload, 'serverAction'));
    default:
      return undefined;
  }
}

export default function parseMessage(state, rawAction) {
  const action = JSON.parse(rawAction);
  const withoutMeta = parsePayload(state, action);

  if (!withoutMeta) {
    return undefined;
  }

  const meta = {
    isSocket: true,
    direction: 'IN'
  };

  return Object.assign(withoutMeta, {meta});
}
