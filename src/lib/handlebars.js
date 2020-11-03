const {format} = require('timeago.js');




const helpers = { };




helpers.timeago =  (timestamp,) => {
    return format(timestamp,'vi');
}

module.exports = helpers;