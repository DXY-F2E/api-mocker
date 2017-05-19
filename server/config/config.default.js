module.exports = appInfo => {
    const config = {
        mongoose: {
            url: 'mongodb://localhost/api-mock'
        },
        keys: `${appInfo.name}_1490324849354_6879`,
        md5Key: '52851cb05258c8d98da1672d95729e53',
        cookieKey: '591e7709eb277373342ac137',
        cors: {
            credentials: true
        },
        middleware: ['auth']
    };
    return config;
};
