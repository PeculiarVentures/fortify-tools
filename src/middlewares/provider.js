import { ProviderActions } from '../actions/state';
import { ACTIONS_CONST } from '../constants';

export default store => next => (payload) => {
  const state = store.getState();
  const providers = state.find('providers');
  const { type, id, data, list } = payload;

  switch (type) {
    case ACTIONS_CONST.PROVIDER_SELECT: {
      const provider = providers.where({ id });
      const providerId = !provider ? providers.get()[0].id : id;

      next(ProviderActions.select(providerId));
      break;
    }

    case ACTIONS_CONST.PROVIDER_ADD: {
      next(ProviderActions.add(data));
      providers.sortBy('name');
      break;
    }

    case ACTIONS_CONST.PROVIDER_SET_LIST: {
      providers.set(list).sortBy('name');
      break;
    }

    default:
      next(payload);
  }
};
