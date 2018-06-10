
import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import deployTemplate from './configTemplates/deployTemplate';
import serviceTemplate from './configTemplates/serviceTemplate';
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';
import DataTransformer from './data/models/datatransformer';

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);

export function createDataTransformer(config){
    return provisionDataTransformer().then((timestamp) => {
        let datatransformer = new DataTransformer({
            location: 'creating...',
            createdAt: timestamp,
            datatransformerId: `datatransformer${timestamp}`,
        });
        return datatransformer.save();
    });
}

export function deleteDataTransformer(datatransformerId){
    let query = {
        datatransformerId,
    };
    return DataTransformer.findOneAndRemove(datatransformerId).then(() => {
        let execs = [];
        execs.push(exec(`kubectl delete deployments ${datatransformerId}`).catch((err) => err));
        execs.push(exec(`kubectl delete services ${datatransformerId}`).catch((err) => err));
        return Promise.all(execs);
    }).then((execs) => {
        execs.forEach((exec) => {
            console.log(exec.stdout);
            console.log(exec.stderr);
        });
    })
}

// also updates the external ip by using kubectl
// TODO find a better way to check external ip than parsing stdout !
export function getDataTransformers(datatransformerId){
    let query = {};
    if(datatransformerId) query.datatransformerId = datatransformerId;
    let datatransformers = [];
    return DataTransformer.find(query).then((res) => {
        datatransformers = res;
        let kubectl = []; // promise executions of kubetcl;
        datatransformers.forEach((datatransformer) => {
            console.log(datatransformer);
            kubectl.push(exec(`kubectl get services ${datatransformer.datatransformerId}`).catch((err) => err)); // return error obj otherwise other promises won't resolve
        });
        return Promise.all(kubectl);
    }).then((execs) => {
        let externalIps = [];
        execs.forEach((exec) => {
            externalIps.push(extractExternalIpKubectlGetServicesOutput(exec.stdout));
        });

        let saves = []
        datatransformers.forEach((datatransformer, index) => {
            console.log(externalIps);
            datatransformer.location = externalIps[index];
            saves.push(datatransformer.save());
        });
    }).then(() => {
        return datatransformers;
    });
}

// TODO try to get rid of this way of obtaining external IP
function extractExternalIpKubectlGetServicesOutput(stdout){
    try{
        let lines = stdout.split(/\r?\n/);
        let tokens = lines[1].split(/\s+/);
        return tokens[3];
    }catch(err){
        return 'N/A';
    }

}

// provisions testrig and returns timestamp it was provisioned
function provisionDataTransformer(){
    let timestamp = (new Date()).getTime();
    let datatransformerId = `datatransformer${timestamp}`
    let datatransformerDeploy = JSON.parse(JSON.stringify(deployTemplate, null, 2));
    datatransformerDeploy.metadata.name = datatransformerId;
    datatransformerDeploy.spec.template.metadata.labels.app = datatransformerId;

    return writeFile(`/tmp/deploy-${datatransformerId}.json`, JSON.stringify(datatransformerDeploy), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deploy-${datatransformerId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning datatransformer');
        }
        console.log(res.stdout);
        return exposeDataTransformer(timestamp);
    }).then(() => {
        return timestamp;
    })
}


// exposes the testrig publicly though google container engine service
function exposeDataTransformer(timestamp){
    let datatransformerId = `datatransformer${timestamp}`;
    let datatransformerService = serviceTemplate;
    datatransformerService.metadata.labels.app = datatransformerId;
    datatransformerService.metadata.name = datatransformerId;
    datatransformerService.spec.selector.app = datatransformerId;
    return writeFile(`/tmp/service-${datatransformerId}.json`, JSON.stringify(datatransformerService), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/service-${datatransformerId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred exposing data transformer');
        }
        console.log(res.stdout);
        return timestamp;
    });
}