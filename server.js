//dependencies
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const https = require("https");

//path to our proto file
const PROTO_FILE = "./service_def.proto";

//options needed for loading Proto file
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };
  
  const host = "0.0.0.0:5000";
  const pkgDefs = protoLoader.loadSync(PROTO_FILE, options);
  
  //load Definition into gRPC
  const userProto = grpc.loadPackageDefinition(pkgDefs);
  
  //create gRPC server
  const server = new grpc.Server();
  
  //implement Lights
  server.addService(userProto.Lights.service, {
    //implment Switch Light - DEBUG MODE -
    SwitchLight: (input, callback) => {
        try {
        
        let url;
            /* HOMEY API */
            https.get(`https://webhook.homey.app/62cbc64f9685c30bd64964fa/light?tag=office&state=toggle`, resp => {
            let data = "";

            // A chunk of data has been recieved.
            resp.on("data", chunk => {
            data += chunk;
            console.log("API Result from Homey:"+data); 
            callback(null, { light_details: data.toString()});
            });
            
           
            })
            .on("error", err => {
                console.log("Error: " + err.message);
            });
                /* END */


         

        } catch (error) {
          callback(error, null);
        }
      }
  });
  

//implement Time
let date_ob = new Date();
server.addService(userProto.Time.service, {
        //implment Time - DEBUG MODE -
        GetCurrentTime: (input, callback) => {
            try {
                let full_date = date_ob.getFullYear() + "-" + date_ob.getMonth() + "-" + date_ob.getDay() + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds();
              callback(null, { full_date: full_date,});
            } catch (error) {
              callback(error, null);
            }
          }
      });
      
  
  //start the Server
  server.bindAsync(
    //port to serve on
    host,
    //authentication settings
    grpc.ServerCredentials.createInsecure(),
    //server start callback 
    (error, port) => {
      console.log(`listening on port ${port}`);
      server.start();
    }
  );