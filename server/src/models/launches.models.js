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
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success:true
}

saveLaunch(launch)

// launches.set(launch.flightNumber, launch)

async function existsLaunchWithId(launchId){
  return await launchesDatabase.find({
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

  const planet = await planets.findOne({
    kepler_name: launch.target
  })

  const getAllPlanets =  await planets.find({})

  if(!planet) {
     throw new Error ('no matching planet found')
     
  }

  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true
  })
}

 async function scheduleNewLaunch(launch) {

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
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
}
