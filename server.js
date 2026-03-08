const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const User = require('./backend/models/User');
const Task = require('./backend/models/Task');

const app =express();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully ");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB ", error);
  });

//Register
app.post('/register', async (req, res)=>{
  const {username, password} = req.body;
  try{
    const user = new User({username, password});
    await user.save();// instead of these two lines you can use : const user = await User.create({ username, password })
    res.json({message: 'User registered successfully'});
  }catch(err){
    res.status(400).json({message: 'User already exists'});
  }
});

//Login
app.post('/login', async (req,res)=>{
  const {username, password}= req.body;
  const user = await User.findOne({username});

  if(!user || user.password!== password){
    return res.status(401).json({message: 'Invalid credentials'});
  }
  
  const token = jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({token});
});

// Middleware to authenticate token
function authenticateToken(req,res,next){
  const auhtHeader = req.headers['authorization'];
  const token = auhtHeader && auhtHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, JWT_SECRET, (err,user)=>{
    if(err) return res.status(403).json({message: 'Invalid token'});
    req.user = user;
    next();
  });
}

//Get tasks
app.get('/tasks', authenticateToken, async (req,res)=>{
  const tasks = await Task.find({userId: req.user.id }); // req.user is added in request body in authenticate middleware function above
  res.json(tasks);
});


// Create task
app.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    const task = await Task.create({ userId: req.user.id, title });
    console.log('Task created successfully')
    res.json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: 'Failed to create task', details: err.message });
  }
});
/* 
why not 'completed' field which is in userSchema of task? Because 'completed' is	Automatically set to false by default in schema
it is also set using toggleTask function in script.js
--------------------------------------------------
const { title } = req.body:
Take the title value that the client (frontend) sent inside the body of the HTTP request.
----------------------------------------------------
await Task.create({ userId: req.user.id, title });

Create a new Task in the database with:
  =>the title (like "Complete homework", "Buy groceries", etc.)
  =>and the userId (the ID of the logged-in user)

--------------------------------------------------

where does title come from?
It comes from your frontend script.js file — when you do something like this:

fetch('http://localhost:3000/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  },
  body: JSON.stringify({ title: "Complete homework" })  // << here you send the title
});
You are sending { title: "Complete homework" } in the body of your POST request.

*/

//Update task ( SEE toggleTask function in script.js) 
app.put('/tasks/:id', authenticateToken, async (req,res)=>{
  const {title, completed} = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id }, //The req.user.id comes from the JWT token that was validated by your authenticateToken middleware.
    { title, completed }, //	Sets the new title and/or completed status.
    { new: true } //	Tells Mongoose to return the updated task, not the old one.
  );
  res.json(task);
});
/*
=> req.params contains route parameters, which are dynamic values embedded in the URL
-----------------------------------------------

=> How can req.body have both title and completed fields if only completed is sent from frontend in toggleTask?
ans:  If the frontend only sends completed, the title will be undefined, but the backend will ignore it because Mongoose only updates the fields that are passed.

The title won’t be affected because it’s not included in the request body, so the task's title will remain the same.

so i can also write const {completed} = req.body;

---------------------------------------------------
What is the difference between _id and userId
ans: 
  _id: Uniquely identifies this specific task in the database. No two tasks will have the same _id.

  userId: Refers to the user who owns this task. You use this to ensure tasks are only visible to the user who created them, as you do in the route
*/

//Delete task
app.delete('/tasks/:id',authenticateToken, async (req,res)=>{
  await Task.findOneAndDelete({_id: req.params.id, userId: req.user.id});
  res.json({message: 'Task deleted'});
});


const PORT = 5000;
app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
