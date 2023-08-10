import common from './webpack.base';

const makeConfigure = () => {
  const config = common({ isDev: false });
  console.log(JSON.stringify(config));
  return config;
};

export default makeConfigure();
