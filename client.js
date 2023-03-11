//dependencies
//const { ExponentialRetry } = require("@google-cloud/pubsub/build/src/exponential-retry");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

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
  
  const pkgDefs = protoLoader.loadSync(PROTO_FILE, options);
  
  //load Definition into gRPC
  const result = grpc.loadPackageDefinition(pkgDefs).Lights;
  
  var args = process.argv.slice(2);
  if (args.length <= 0)
  {
    console.log("USAGE: node client.js 127.0.0.1:5000")
    process.exit(-1)
  }
  else
  console.log("Server Target: " + args);
  //create the Client
  const client = new result(
    args.toString(),
    grpc.credentials.createInsecure()
  );
  
  //make a call to GetUser
  /* client.GetUser({}, (error, user) => {
    if (error) {
      console.log(error);
    } else {
      console.log(user);
    }
  }); */

/*   client.GetCurrentTime({}, (error, user) => {
    if (error) {
      console.log(error);
    } else {
      console.log(user);
    }
  }); */

  client.SwitchLight({}, (error, user) => {
    console.log("Switch Light through gRPC API...");
    if (error) {
      console.log(error);
    } else {
        
      console.log(user);
    }
  });
