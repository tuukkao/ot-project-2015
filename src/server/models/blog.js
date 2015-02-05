var mongoose = require("mongoose");
var blogSchema = mongoose.Schema({
    title: {type: String, required: true },
    description: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    created_at: { type: Date, default: Date.now },
    tags: { type: [String], index: true}
});

module.exports = mongoose.model('Blog', blogSchema);