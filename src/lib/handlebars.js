const {format} = require('timeago.js');




const helpers = { };




helpers.timeago =  (timestamp,) => {
    return format(timestamp,'vi');
}
helpers.sosanh = (id_user,id_user_comment) => {
    if (id_user=== id_user_comment){
        return true;
    }
    return false;
}
module.exports = helpers;