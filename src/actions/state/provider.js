import { ACTIONS_CONST } from '../../constants';

export const add = data => ({
  type: ACTIONS_CONST.PROVIDER_ADD,
  data,
});

export const setList = list => ({
  type: ACTIONS_CONST.PROVIDER_SET_LIST,
  list,
});

export const update = (result, id) => ({
  type: ACTIONS_CONST.PROVIDER_UPDATE,
  result,
  id,
});

export const select = id => ({
  type: ACTIONS_CONST.PROVIDER_SELECT,
  id,
});

export const reload = id => ({
  type: ACTIONS_CONST.PROVIDER_RELOAD,
  id,
});
