exports = async function(){

  const group_id = '5f8880d666acb94471fd87c9'
  const hostname = 'dmalikm10-shard-00-00.us76j.mongodb.net'
  const public_key = context.values.get("api_public_key")
  const private_key = context.values.get("api_private_key")
  
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()
  const end_timestamp = date.getTime()
  const start_timestamp = end_timestamp - 86400

  const response = await context.http.get({
    "scheme": "https",
    "host": "cloud.mongodb.com",
    "path": `/api/atlas/v1.0/groups/${group_id}/clusters/${hostname}/logs/mongodb.gz`,
    //"headers" : { "Accept-Encoding": [ "gzip,deflate" ] },
    "query": { "startDate": [start_timestamp.toString()], "endDate": [end_timestamp.toString()] },
    "username": public_key,
    "password": private_key,
    "digestAuth": true
    })
  
  
  const data = response.body
 
  const AWS = require('aws-sdk');
  AWS.config.update({
    accessKeyId: context.values.get("aws_access_key_id"),
    secretAccessKey: context.values.get("aws_secret_access_key"),
  	region: "us-west-1"
  });
  
  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  const putResult = await AWS.S3.putObject({
    Bucket: "logs-data-lake-bucket",
    Key: 'raw/'+ group_id + '/' + hostname + '/' + yyyy + '/' + mm + '/' + dd + '/' + start_timestamp + '_' + end_timestamp + '_mongodb.json.gz',
    ContentType: 'application/gzip',
    Body: data.toBase64()
  })
};