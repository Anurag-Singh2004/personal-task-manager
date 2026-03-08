const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  title: {type: String, required: true},
  completed: {type: Boolean, default: false}
});
//userId: Links the task to a User(user.js) via reference (ObjectId), and it's required.

module.exports = mongoose.model('Task', taskSchema);