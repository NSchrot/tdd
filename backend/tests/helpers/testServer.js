const app = require('../../src/app');

let server;
let startedByTests = false;

beforeAll(async () => {
    const port = process.env.PORT || 3000;

    await new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            startedByTests = true;
            resolve();
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                startedByTests = false;
                server = null;
                return resolve();
            }
            reject(err);
        });
    });
});

afterAll(async () => {
    if (server && startedByTests) {
        await new Promise((resolve, reject) => {
            server.close((err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    server = null;
    startedByTests = false;
});
