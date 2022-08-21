const API_URL = 'http://localhost:8000/v1'

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`)
  return  await response.json()
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${API_URL}/launches`)
  const fetchedLaunches =  await response.json()
  return fetchedLaunches.sort((a,b) => {
    return a.flightNumber - b.flightNumber
  })
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.

  try {
    return await fetch(`${API_URL}/launches`,{
      headers:{
        "Content-Type":"application/json"
      },
      method:"POST",
      body:JSON.stringify(launch)
    })
  } catch (error) {
    return {
      ok: false
    }
  }

}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.

  try {
    return fetch(`${API_URL}/launches/${id}`,{
      method:"delete"
    })
  } catch (error) {
    console.log(error)
    return {
      ok:false
    }
  }


}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};