# Pumba for changing Network behavior

This module is a wrapper for https://alexei-led.github.io/post/pumba_docker_chaos_testing/

 - Pumba can run on host or in a separate Docker container
 - Pumba changes the network behavior (e.g. delay, loss, corrupt)
 - This wrapper exposes Pumba function via REST API

## Requirement
 - Docker
 - Pumba (if running Pumba on host)

## How to run
 - Set the environment PUMBA_PATH to the pumma binary file or Docker file (edit and `source` the `configure.sh`)
 - Run the node.js server: `$node index.js`
 - Invoke Pumba via REST API

## Pumba wrapper
The node.js module wraps the "pumba netem" subcommands. The API can be called as following:
 - REST path: `/netem/:subcommand` 
 - Arguments are passed via query parameters.
 - Documentation: https://github.com/alexei-led/pumba#network-emulation-netem-command

**Sample calls:**
 - POST http://localhost:8080/netem/delay?duration=1m&time=3000

