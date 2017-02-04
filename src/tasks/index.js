var CronJob = require('cron').CronJob;

module.exports = function(app) {
    var resetSignJob = new CronJob({
        cronTime: '00 00 00 * * 0-6',
        onTick: function() {
            
        },
        start: false,
        // timeZone: 'America/Los_Angeles'
    });
    resetSignJob.start();

    var rebootSystemJob = new CronJob({
        cronTime: '00 00 03 * * 0-6',
        onTick: function() {
            
        },
        start: false,
        // timeZone: 'America/Los_Angeles'
    });
    rebootSystemJob.start();
};
