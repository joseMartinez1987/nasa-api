const mongoose = require("mongoose");

const MONGO_URL = `mongodb+srv://nasa:NR2jiQeHwVCZQgzW@cluster0.wof8q.mongodb.net/nasa-project?retryWrites=true&w=majority`



mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect () {
   return  mongoose.connect(MONGO_URL)
}

async function mongDisconnect()  {
    mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongDisconnect
}
