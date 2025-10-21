const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
    projectSlug : { type: String, required: true, unique: true },
    userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectName : { type: String, required: true },
    desciption : { type: String },
    rootFolderId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    files: { type: mongoose.Schema.Types.Mixed, default: {} }, // Store file tree and contents as JSON
    createdAt : { type: Date, default: Date.now },
    updatedAt : { type: Date, default: Date.now },

    settings:{
        framework:{type:String,default:'react'},
        autoSave :{type:Boolean,default:true},
    }
})

module.exports = mongoose.model('Project', projectSchema);