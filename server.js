const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors=require('cors');
const authRoutes = require('./App-backend/Routes/AuthRoutes');
const buzzRoutes=require('./App-backend/Routes/BuzzRoutes');
const complaintRoutes=require('./App-backend/Routes/ComplaintRoutes');
const adminRoutes=require('./App-backend/Routes/AdminRoutes');
const departmentRoutes=require('./App-backend/Routes/DepartmentRoutes');
const auth = require("./App-backend/Controller/AuthController");
const midware = require("./App-backend/Midwares/Midwares");
const dotenv=require('dotenv');
dotenv.config();

const app = express();
const port = 3030;
app.use(cors({
  origin:'*'
}
));

app.use(bodyParser.json());
app.use(authRoutes);
app.use("/images", express.static('Images'));
app.use('/buzz',midware.verifyTokenMiddleware,buzzRoutes);
app.use('/complaint',midware.verifyTokenMiddleware,complaintRoutes);
app.use('/admin',midware.verifyTokenMiddleware, adminRoutes);
app.use('/department',midware.verifyTokenMiddleware,departmentRoutes);
app.use(auth.handleUnknownRequests);
app.use(midware.errorHandlingMiddleware);

const connection=process.env.DB_CONNECTION_STRING;
mongoose.connect(connection, {
  useNewUrlParser: "true",
  useFindAndModify:false,
  useUnifiedTopology:true
}).catch((error)=>{console.log(error)});

mongoose.connection.on("error", err => {
  console.log("err", err)
});

mongoose.connection.on("connected", (err, res) => {
  console.log("Mongoose is connected")
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))