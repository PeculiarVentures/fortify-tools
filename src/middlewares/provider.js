import { ProviderActions } from '../actions/state';
import { ACTIONS_CONST } from '../constants';

export default store => next => (payload) => {
  const state = store.getState();
  const providers = state.find('providers');
  const { type, id } = payload;

  switch (type) {
    case ACTIONS_CONST.PROVIDER_SELECT: {
      const provider = providers.where({ id });
      let _id = id;

      if (!provider) {
        _id = providers.get()[0].id;
      }

      next(ProviderActions.select(_id));
      break;
    }

    default:
      next(payload);
  }
};
