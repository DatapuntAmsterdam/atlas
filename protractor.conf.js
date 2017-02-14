exports.config = {
    baseUrl: 'http://localhost:8000/',
    framework: 'jasmine',
    specs: ['e2e/before-after.js', 'e2e/*.test.js'],
    capabilities: {
        browserName: 'phantomjs',
        'phantomjs.binary.path': './node_modules/phantomjs/bin/phantomjs'
    },
    onPrepare: function () {
        global.dp = require('./e2e/helpers/datapunt');

        // dp.navigate requires that other helpers are already loaded, just making sure the others are initialized first
        global.dp.navigate = require('./e2e/helpers/navigate');
    }
};
