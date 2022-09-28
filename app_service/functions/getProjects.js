function request(page=1){
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
  let response = await request(page)
  let all_pages = [response]
  
  const num_results = response.totalCount
  let num_pages = Math.ceil(num_results/500)+1
  
  while(page <= num_pages){
        page++
        response = await request(page)
        all_pages.push(response)
    }
    
  return all_pages
};