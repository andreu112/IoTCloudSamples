var express = require('express');
var app = express();

var PUMBA_PATH=process.env.PUMBA_PATH || "./pumma"
const exec = require('child_process').exec;

function call_process(command, callback) {
  const child = exec(command,
      (error, stdout, stderr) => {
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
          if (error !== null) {
              console.log(`exec error: ${error}`);
          }
      callback(stdout)      ;
  });
}

app.post("/netem/:subcmd", function(req, res){  
  general_opts = "";
  subcmd_opts = "";
  for (const key in req.query) {
    console.log(key, req.query[key])
    switch (key) {
      case "duration": 
      case "interface":
      case "target":
        general_opts += ` --${key} ${req.query[key]}`;
      default:
        subcmd_opts +=  ` --${key} ${req.query[key]}`;
    }
    full_cmd = `${PUMBA_PATH} ${general_opts} netem ${req.params.subcmd} ${subcmd_opts}`;
    console.log("Command: " + full_cmd);
    call_process(full_cmd);    
  }
})

app.get("/netem", function(req, res){
  call_process(PUMBA_PATH + " netem -h", function(stdout){
    console.log(stdout);
    res.writeHead(200, {'Content-Type': 'plain/text'});
    res.end(stdout);
  });   
})

var server = app.listen(8080, function(){
  console.log("Listenning at: http://%s:%s", server.address().address, server.address().port);  
});


