# Introduction

this is a service for data transformation based on node-red.
the idea is that the provider offers "node-red service" as a resource. One consumer can request a resource then submit workflows to the resource to perform data transformation. Therefore during runtime, such resources can be used for interoperability.

Supported by the [Inter-IoT project](http://www.inter-iot-project.eu/).

## Configuration

### Kubernetes requirements and setup

We have tested with Google Cloud Platform Kubernetes and Minikube/Kubernetes  in a single server. Note the following settings:

* all kube* commandlines should be in the execution path of the service
* $export MINIKUBE_NODEPORT=True for minikube without loadbalancer: in this case an external ip cannot be exposed, we will use nodeport for exposing service information. In this case the command "minikube" must be in the execution path.

### Node-red container

The service will use a default node-red container. However, this can be replaced by a customized one:

The default node-red container is "nodered/node-red-docker", specified in the configTemplates/deployTemplate.js:

'''
"containers": [
  {
    "name": "nodereddatatranformer",
    "image": "nodered/node-red-docker",'
'''    

this is the default image that can be downloaded from docker hub and made available to Kubernetes.

To use the service with a customized node-red container image:

* Change the image name suitable to the customized node-red image
* Make sure that Kubernetes can access the container image. See the [guideline here](https://kubernetes.io/docs/concepts/containers/images/)
* If you use minikube: just download the container image and add it into the server running minikube

### Configure MongoDB

MongoDB is used to store information about resources. The URL of MongoDB must be set through environment variable, such as

$export MONGODB_URL=

Alternatively, the source code of data/db.js can be modified to hardcode the URL.

### Running services

`npm start`

### Examples

Check if the service is available:

* curl -X GET http://[hostname]:3004/datatransformer

Create a new data transformer:

* curl -X POST http://[hostname]:3004/datatransformer

List existing transformer resources:

* curl -X GET http://[hostname]:3004/datatransformer/list

Get detailed information about a transformer with the id =datatransformer1528623333334:

* curl -X GET http://daredevil:3004/datatransformer/datatransformer1528623333334

Remove a transformer with the id = datatransformer1528623333334
* curl -X DELETE http://daredevil:3004/datatransformer/datatransformer1528623333334


## Authors

Hong-Linh Truong
Lingfan Gao
Michael Hammerer
