exports = function(arg){

  const public_key = context.values.get("api_public_key")
  const private_key = context.values.get("api_private_key")

  const response = context.http.get({
    "scheme": "https",
    "host": "cloud.mongodb.com",
    "path": `/api/atlas/v1.0/groups`,
    "username": public_key,
    "password": private_key,
    "digestAuth": true
    })

  console.log(response)
  return response
};