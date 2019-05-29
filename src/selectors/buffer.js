import { createSelector } from 'reselect';

export default createSelector(
  state =>
    Object.values(state.buffer.entities).map(({ bid, name }) => ({
      bid,
      name,
    })),
  state => state.server.chantypes,
  (buffers, chantypes) => {
    const channels = buffers.filter(({ name }) =>
      chantypes.includes(name.charAt(0)),
    );
    const directs = buffers.filter(
      ({ name }) => !chantypes.includes(name.charAt(0)),
    );

    return {
      channels,
      directs,
    };
  },
);
