const setToLocalStorage = (name, value) => {
  localStorage.setItem(name, value);
};

const removeToLocalStorage = (name) => {
  localStorage.removeItem(name);
};

export { setToLocalStorage, removeToLocalStorage };
