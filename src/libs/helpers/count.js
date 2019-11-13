import vue from './../../App';

export const CountHelpers = {
  countPrice(d, p) {
    let price;
    if (!Number.isNaN(p)) {
      price = d * p;
      vue.store.commit('countPrice', price);
    } else {
      price = 0;
      vue.store.commit('countPrice', price);
    }
  },
  formatGPUStatus(value) {
    switch (value) {
      case true: return 'Loaded';
      case false: return 'Idled';
    }
  }
}

