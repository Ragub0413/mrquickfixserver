import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

import joborderRoute from './router/joborder.mjs';
import employeeRoute from './router/employee.mjs';
import fileRoute from './router/filedocument.mjs';
import verification  from './router/otps.mjs';
import projectRoute from './router/project.mjs';
import serviceRoute from './router/services.mjs';
import contentRouter from './router/contents.mjs'
import notificationRouter from './router/notification.mjs'

const app = express();
app.use(express.json());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));
// app.use(express.bodyParser({limit: '50mb'}));
app.use(cors());
app.use(express.static('public'));
       

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});
app.get('/helloline', (req, res) => {
    res.send('nextline!');
  });

app.use('/joborderinquiry',joborderRoute);
app.use('/mrquickfixemployee',employeeRoute);
app.use('/fileUpload',fileRoute);
app.use('/verification', verification);
app.use('/projects',projectRoute);
app.use('/servicesmrquickph', serviceRoute);
app.use('/contentMangement',contentRouter)
app.use('/notify',notificationRouter);

  const CONNECTION_DB = process.env.ATLAS_URI || "mongodb+srv://mrquick:adminsidemrquick111@cloudsourcing.kmb2zsa.mongodb.net/MrQuick?retryWrites=true&w=majority&appName=CloudSourcing";

  const PORT = 5000;
  mongoose.connect(CONNECTION_DB, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(()=>app.listen(PORT, ()=>console.log(`Server running on port: ${PORT}`)))
      .catch((error) => console.log(`${error} did not connect`));
  
  // app.listen(5000,()=>{
  //     console.log("start server");
  // });
   