var mongoose = require("mongoose");
var postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
    created_at: { type: Date, default: Date.now, index: true },
    modified_at: { type: Date, default: Date.now },
    parent_blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [ {
        comment: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        created_at: {type: Date, default: Date.now },
        modified_at: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Post', postSchema);
