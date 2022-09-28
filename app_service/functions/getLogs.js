exports = async function(){
  const zlib = require("zlib")
  const group_id = '5f8880d666acb94471fd87c9'
  const hostname = 'dmalikm10-shard-00-00.us76j.mongodb.net'
  const public_key = context.values.get("api_public_key")
  const private_key = context.values.get("api_private_key")
  
  const response = await context.http.get({
    "scheme": "https",
    "host": "cloud.mongodb.com",
    "path": `/api/atlas/v1.0/groups/${group_id}/clusters/${hostname}/logs/mongodb.gz`,
    //"headers" : { "Accept-Encoding": [ "gzip,deflate" ] },
    "username": public_key,
    "password": private_key,
    "digestAuth": true
    })

  //return zlib.inflateSync(Buffer.from(response.body.toString(), 'base64'));
  // zlib.gunzipSync(Buffer.from(data, 'base64')).toString('utf8');
  
  const data = response.body.toBase64();
  const buff = Buffer.from(data, 'base64')

  return buff.toString()

};