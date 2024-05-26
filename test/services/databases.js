const {default: mongoose} = require("mongoose");

module.exports = {
    mongoose: {
        connect: () => {
            mongoose.connect(process.env.MONGO_URI, {autoIndex: true});
            console.log("Connected to the database");
        }
    }
}