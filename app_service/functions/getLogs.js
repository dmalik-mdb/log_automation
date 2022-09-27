exports = async function(){

  const group_id = '5f8880d666acb94471fd87c9'
  const hostname = 'dmalikm10-shard-00-01.us76j.mongodb.net'
  const public_key = context.values.get("public_key")
  const private_key = context.values.get("private_key")
  
  const response = await context.http.get({
    "scheme": "https",
    "host": "cloud.mongodb.com",
    "path": `/api/atlas/v1.0/groups/${group_id}/clusters/${hostname}/logs/mongodb-audit-log.gz`,
    "username": public_key,
    "password": private_key,
    "digestAuth": true
    })

  // Instantiate an S3 service client
  const s3_service = context.services.get('s3').s3('us-east-1');

  var date = new Date();
  var yyyy = date.getFullYear();
  var mm = date.getMonth() + 1
  var dd = date.getDate()
  var timestamp = date.getTime()
  
  const putObjectOutput = await s3_service.PutObject({
      'Bucket': 'dmalik-2',
      'Key': 'logs/'+ yyyy + '/' + mm + '/' + dd + '/' + timestamp + '_mongodb-audit-log.json.gz',
      'ContentType': 'application/gzip',
      'Body': response.body
    })
    .then(putObjectOutput => {
      console.log(putObjectOutput);
      // putObjectOutput: {
      //   ETag: <string>, // The object's S3 entity tag
      // }
    })
    .catch(console.error);

  const datalake = context.services.get("datalake-2");
  const logs_raw_collection = datalake.db("logging").collection("logs_raw");
  const pipeline = [
        {
          '$merge': {
          'into': {
            'atlas': {
              'projectId': group_id,
              'clusterName': 'DMalikM10', 
              'db': 'logs', 
              'coll': 'audit_deduped'
            }
          }, 
          'on': [
            'atype', 'uuid'
          ], 
          'whenMatched': 'keepExisting', 
          'whenNotMatched': 'insert'
          }
        }
    ]; 
  
  return logs_raw_collection.aggregate(pipeline)
};