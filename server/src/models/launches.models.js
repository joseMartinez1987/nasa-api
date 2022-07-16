const launchesDatabase = require('./launches.mongo')


// const launches =  require('./launches.mongo')


// const launches = new Map()

let latestFligtNumber = 100

const launch = {
  flightNumber: 100,
  mission:"Kepler Exploration X",
  rocket:" Explorer IS1",
  launchDate: new Date('December 27, 2030'),
  target:"Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  succes:true
}

saveLaunch(launch)

// launches.set(launch.flightNumber, launch)

function existsLaunchWithId(launchId){
  return launches.has(Number(launchId))
}


async function  getAllLaunches () {
  // return Array.from(launches.values())
    return await launchesDatabase.find({}, {'__v':0, '_id':0})

}

async function saveLaunch(launch) {
  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true
  })
}

function addNewLaunch(launch) {  latestFligtNumber++
  launches.set(latestFligtNumber, Object.assign(launch, Object.assign({
    succes:true,
    upcoming: true,
    flightNumber: latestFligtNumber,
    customer: ["ZTM", "NASA"]
  })))
}


function abortLaunchById(launchId) {
  // launches.delete(launchId)
  const aborted = launches.get(launchId)
  aborted.upcoming = false
  aborted.success = false
  return aborted
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById
}
