class Storage {
  constructor(storage, setterMethod, getterMethod) {
    this.storage = storage;
    this.setter = setterMethod;
    this.getter = getterMethod;
  }

  get(prop) {
    this.storage[this.getter](prop);
  }

  set(prop, value) {
    this.storage[this.setter](prop, value);
  }
}
const storage = new Storage(localStorage, 'setItem', 'getItem');

export default storage;
