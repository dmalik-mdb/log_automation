exports = async function(){
  const pako = require("pako")
  const atob = require("atob")
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
  // pako.ungzip(atob(data), { to: 'string' });
  const data = response.body.toBase64();
  
  // convert the incoming base64 -> binary
  const strData = atob(data);
  console.log(strData)
  // split it into an array rather than a "string"
  //const charData = strData.split('').map(function(x){return x.charCodeAt(0); });

  // convert to binary
  //const binData = new Uint8Array(charData);

  // inflate
  //const result = pako.inflate(binData, { to: 'string', chunkSize: 1024 });

  
  return true

};