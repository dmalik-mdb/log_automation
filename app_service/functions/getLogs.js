exports = async function(){

  const group_id = '5f8880d666acb94471fd87c9'
  const hostname = 'dmalikm10-shard-00-00.us76j.mongodb.net'
  const public_key = context.values.get("api_public_key")
  const private_key = context.values.get("api_private_key")
  
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()
  const end_timestamp = Math.floor(date.getTime()/1000)
  const start_timestamp = end_timestamp - 3600

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
  
 const data = response.body.toBase64()
 
  const AWS = require('aws-sdk');
  AWS.config.update({
    accessKeyId: context.values.get("aws_access_key_id"),
    secretAccessKey: context.values.get("aws_secret_access_key"),
    sessionToken: context.values.get("aws_session_token"),
  	region: "us-west-1"
  });
  
  // Create S3 service object
  const s3 = new AWS.S3({apiVersion: '2006-03-01'});

  var uploadParams = {
    Bucket: "logs-data-lake-bucket", 
    Key:'raw/'+ group_id + '/' + hostname + '/' + yyyy + '/' + mm + '/' + dd + '/' + start_timestamp + '_' + end_timestamp + '_mongodb.gz', 
    Body: data,
    ContentType: "application/json",
    ContentEncoding: "gzip",
  };

  // call S3 to retrieve upload file to specified bucket
  s3.upload (uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Upload Success", data.Location);
    }
});

};