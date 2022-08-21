const axios = require("axios")

const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')


// const launches =  require('./launches.mongo')


// const launches = new Map()

const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
  flightNumber: 100,
  mission:"Kepler Exploration X",
  rocket:" Explorer IS1",
  launchDate: new Date('December 27, 2030'),
  target:"Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success:true
}

saveLaunch(launch)

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
  console.log(' getting launch Data...')
  const response = await axios.post(SPACEX_API_URL, {
    query:{},
    options:{
      pagination:false,
      populate:[
        {
          path:'rocket',
          select:{
            name:1
          }
        },
        {
          path:'payloads',
          select:{
            customers:1
          }
        }
      ]
    }
  })

  if(response.status !== 200) {
    console.log('Problem downloading launches')
    throw new Error('Launch data dowload failed.')
  }


  const launcheDocs = response.data.docs

  for (const launchDoc of launcheDocs) {
    const payload = launchDoc['payloads']
    const customers = payload.flatMap((payload) => {
      return payload['customers']
    })
    console.log('customers', customers)
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers
    }
    console.log(`${launch.flightNumber},${launch.mission}`)
    saveLaunch(launch)
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber:1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  })
  if(firstLaunch) {
    console.log('Launch data already loaded')
  } else {
    await populateLaunches()
  }

}

// launches.set(launch.flightNumber, launch)

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter)
}

async function existsLaunchWithId(launchId){
  return await findLaunch({
    flightNumber:launchId
  })
}


async function  getAllLaunches () {
  // return Array.from(launches.values())
    return await launchesDatabase.find({}, {'__v':0, '_id':0})
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber')

  if(!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }
  return latestLaunch.flightNumber
}

async function saveLaunch(launch) {

  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true
  })
}

 async function scheduleNewLaunch(launch) {

  const planet = await planets.findOne({
    kepler_name: launch.target
  })


  if(!planet) {
     throw new Error ('no matching planet found')
     
  }

  const newFlightNumber = await getLatestFlightNumber() + 1

  const newLaunch = Object.assign(launch,  {
    success: true,
    upcoming: true,
    customers:['ZTM', 'NASA'],
    flightNumber: newFlightNumber
  })

   
  await saveLaunch(newLaunch)

}

async function abortLaunchById(launchId) {
  // launches.delete(launchId)
   const aborted =  await launchesDatabase.updateOne({
    flightNumber:launchId,
  },{
    upcoming:false,
    success:false
  })
  console.log(aborted)

  return aborted.modifiedCount === 1
  // const aborted = launches.get(launchId)
  // aborted.upcoming = false
  // aborted.success = false
  // return aborted
}

module.exports = {
  loadLaunchData,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
}
