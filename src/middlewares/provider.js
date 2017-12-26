import { ProviderActions } from '../actions/state';
import { ACTIONS_CONST } from '../constants';

export default store => next => (payload) => {
  const state = store.getState();
  const providers = state.find('providers');
  const { type, id } = payload;

  switch (type) {
    case ACTIONS_CONST.PROVIDER_SELECT: {
      const provider = providers.where({ id });
      const providerId = !provider ? providers.get()[0].id : id;

      next(ProviderActions.select(providerId));
      break;
    }

    default:
      next(payload);
  }
};
