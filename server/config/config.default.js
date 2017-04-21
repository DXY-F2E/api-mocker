module.exports = appInfo => {
    const config = {
        mongoose: {
            url: 'mongodb://localhost/api-mock'
        }
    };

  // should change to your own
    config.keys = `${appInfo.name}_1490324849354_6879`;
    return config;
};
