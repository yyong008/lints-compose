const config = {
  npmManager: "",
};

export const setConfig = (k, v) => {
  config[k] = v;
};

export const getConfig = () => {
  return config;
};
