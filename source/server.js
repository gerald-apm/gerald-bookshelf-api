const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        // eslint-disable-next-line max-len
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '172.17.245.149',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    server.route(routes);

    await server.start();
    console.log(`Backend Bookshelf berjalan pada ${server.info.uri}`);
};

init();
