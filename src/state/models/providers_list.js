import { State } from 'quantizer';
import ProviderModel from './provider';

const addPrefixToRepeatedNames = (list) => {
  const repeatedNames = {};

  list.forEach((p) => {
    const { _name } = p;
    const itemName = repeatedNames[_name];

    if (itemName) {
      itemName.repeated += 1;
      itemName.left += 1;
    } else {
      repeatedNames[_name] = {
        repeated: 1,
        left: 1,
      };
    }
  });

  return list.map((p) => {
    const { _name } = p;
    const itemName = repeatedNames[_name];

    if (itemName.repeated === 1) {
      return p;
    }

    itemName.left -= 1;
    return Object.assign(p, {
      name: `${p.name} (${itemName.repeated - itemName.left})`,
    });
  });
};

export default class ProviderListModel extends State.List {

  constructor(value) {
    super(value, ProviderModel);
  }

  add(result) {
    const provider = this
      .where({ id: result.id });

    if (provider) {
      provider.merge(result);
    } else {
      this.push(result);
    }

    this.setList(this.get());
  }

  setList(list) {
    this.set(addPrefixToRepeatedNames(list));
  }

  select(id) {
    this.map((provider) => {
      provider.merge({ selected: false });

      if (provider.get('id') === id) {
        provider.merge({ selected: true });
      }
      return true;
    });
  }
}
