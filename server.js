var Habitat = require("habitat");
var Hapi = require("hapi");
var generate_policy = require("s3-post-policy");

Habitat.load();
var env = new Habitat();

var config = {
  port: env.get('PORT'),
  id: env.get('AWS_ID'),
  secret: env.get('AWS_SECRET'),
  region: env.get('AWS_REGION'),
  bucket: env.get('AWS_BUCKET'),
};

var server = new Hapi.Server();
server.connection({ port: config.port });

server.route({
  method: "GET",
  path: "/",
  handler: {
    file: "public/index.html"
  }
});

server.route({
  method: "GET",
  path: "/requesturl",
  handler: function (request, reply) {
    reply(generate_policy({
      id: config.id,
      secret: config.secret,
      region: config.region,
      bucket: config.bucket,
      date: new Date(),
      policy: {
        expiration: new Date(Date.now() + 60 * 1000),
        conditions: [
          {'Cache-Control': 'max-age=31536000'},
          [ "starts-with", "$Content-Type", "" ],
          [ "starts-with", "$key", "jon/" ],
        ]
      }
    }));
  }
});

server.start();
