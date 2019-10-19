import {reducer} from '../../index';
import tests from '../actions';

describe('todos reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });
});

describe('actions', () => {
  tests.map(({
    name,
    initialState,
    actionPayload,
    expectedState
    // eslint-disable-next-line array-callback-return
  }) => {
    it(name, () => {
      const state = reducer(initialState, actionPayload);

      expect(state).toEqual(expectedState);
    });
  });
});
