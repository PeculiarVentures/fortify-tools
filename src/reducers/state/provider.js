import { ACTIONS_CONST } from '../../constants';

export default function (state, payload) {
  const { type, result, id, data, list } = payload;
  const providers = state.find('providers');

  switch (type) {
    case ACTIONS_CONST.PROVIDER_ADD: {
      providers.add(data);
      return state;
    }

    case ACTIONS_CONST.PROVIDER_SET_LIST: {
      providers.set(list);
      return state;
    }

    case ACTIONS_CONST.PROVIDER_UPDATE: {
      if (id) {
        providers.where({ id }).merge(result);
      } else {
        providers.where({ selected: true }).merge(result);
      }
      return state;
    }

    case ACTIONS_CONST.PROVIDER_SELECT: {
      providers.select(id);
      return state;
    }

    default:
      return state;
  }
}
