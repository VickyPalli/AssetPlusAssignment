var mongoose = require("mongoose");

var postSchema = mongoose.Schema(
    {
        // @AssetPlus: Describe schema here
        title: String,
        description: String,
        imageData: String,
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema)