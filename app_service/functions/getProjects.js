function request(public_key, private_key, page=1){
  return context.http.get({
    "scheme": "https",
    "host": "cloud.mongodb.com",
    "path": `/api/atlas/v1.0/groups`,
    "query": {"itemsPerPage": ["500"],"pageNum": [page.toString()]},
    "username": public_key,
    "password": private_key,
    "digestAuth": true
    })
}

exports =  async function(){
  const public_key = context.values.get("api_public_key")
  const private_key = context.values.get("api_private_key")

  let page = 1
  let response = await request(public_key, private_key, page)
  let response_body = EJSON.parse(response.body.text())
  let all_projects = response_body.results.map((result) => {return result.id})

  const num_results = response_body.totalCount
  let num_pages = Math.ceil(num_results/500)

  while(page < num_pages){
        page++
        response = await request(public_key, private_key, page)
        response_body = EJSON.parse(response.body.text())
        all_projects.push(response_body.results.map((result) => {return result.id}))
  }
  
  return all_projects
};