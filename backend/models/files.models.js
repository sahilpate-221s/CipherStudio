const mongoose= require('mongoose');


const fileSchema = new mongoose.Schema({

    projectId : { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    parentId : { type: mongoose.Schema.Types.ObjectId, ref: 'File' ,default:null },
    name:{type:String},
    type:{type:String,enum:['file','folder'],required:true},

    // only applicable for files
    content: { type: String }, // Store file content directly in DB
    language:{type:String},
    sizeInBytes:{type:Number,default:0},

    createdAt : { type: Date, default: Date.now },
    updatedAt : { type: Date, default: Date.now },

})

module.exports = mongoose.model('File', fileSchema);