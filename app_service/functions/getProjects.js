exports =  async function(){
  const public_key = context.values.get("api_public_key")
  const private_key = context.values.get("api_private_key")

  let response = await context.http.get({
    "scheme": "https",
    "host": "cloud.mongodb.com",
    "path": `/api/atlas/v1.0/groups`,
    "query": {"itemsPerPage": ["500"]},
    "username": public_key,
    "password": private_key,
    "digestAuth": true
    })
  
  let response_body = EJSON.parse(response.body.text())
  let all_projects = response_body.results.map((result) => {return result.id})

  return all_projects
};