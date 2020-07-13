const ioredis = require('ioredis');
var redis = new ioredis(6379);

module.exports = {
    save(args) {
      redis.hmset(`customer:${args.id}`, args);
    },
  
     async get(args) {
      let idFormat = 'customer:' + args.id
      let customer = await redis.hgetall(idFormat)
      return customer;
    },

    update(args) {
      redis.hmset(`customer:${args.id}`, args);
    }

}