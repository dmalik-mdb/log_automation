exports = async function(){

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

  console.log(context.values.get("aws_access_key_id"))
  console.log(context.values.get("aws_secret_access_key"))
  const data = response.body.text()
 
  const S3 = require('aws-sdk/clients/s3'); // require calls must be in exports function

  const s3 = new S3({
    accessKeyId: context.values.get("aws_access_key_id"),
    secretAccessKey: context.values.get("aws_secret_access_key"),
    region: "us-west-1",
  });
  
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()
  const timestamp = date.getTime()

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  // const putResult = await s3.putObject({
  //   Bucket: "logs-data-lake-bucket",
  //   Key: 'raw/'+ group_id + '/' + hostname + '/' + yyyy + '/' + mm + '/' + dd + '/' + timestamp + '_mongodb.json.gz',
  //   ContentType: 'application/gzip',
  //   Body: data,
  // }).promise()
  
};