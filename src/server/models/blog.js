var mongoose = require("mongoose");
var blogSchema = mongoose.Schema({
    title: {type: String, required: true },
    description: String,
    author: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date, default: Date.now },
    tags: { type: [String], index: true}
});

module.exports = mongoose.model('Blog', blogSchema);