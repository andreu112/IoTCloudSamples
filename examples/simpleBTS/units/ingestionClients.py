import yaml
import os, errno
import json

def load_config(path):
    config = None
    with open(path, 'r') as config_file:
        config = yaml.load(config_file)
    return config

def createIngestionClientConfigs(ingestionConfigs):
    config = {}
    config['brokers'] = []
<<<<<<< HEAD
    config['data'] = 'default'
=======
    config['data'] = ingestionConfigs['data']
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
    count = 0
    for broker in ingestionConfigs['brokers']:
        brokerConfig = {}
        brokerConfig['username'] = 'xxx'
        brokerConfig['password'] = 'xxx'
        brokerConfig['clientId'] = broker['brokerId']+'_'+str(count) 
        brokerConfig['host'] = broker['brokerId']
        brokerConfig['port'] = 1883
        brokerConfig['topics'] = broker['topics'][:]
        config['brokers'].append(brokerConfig)
        count += 1
    return config

def write_config_files(ingestionClients):
    try:
        os.makedirs('ingestionClients')
    except OSError as e:
        if e.errno != errno.EEXIST:
            raise

    for i in range(len(ingestionClients)):
        with open('ingestionClients/ingestionclient_'+str(i)+'.yml', 'w') as outfile:
            yaml.dump(ingestionClients[i], outfile)

<<<<<<< HEAD

def write_compose(ingestionClients):
    command_base = ['npm', 'start']
    services = {}
    for i in range(len(ingestionClients)):
        service = {}
        command = command_base[:]
        name = 'ingestionclient_'+str(i)
        
        service['environment'] = ['CONFIG='+name+'.yml']
        service['command'] = command
        service['build'] = './ingestionClients'
=======
def write_big_query_config(config, topics):
    for table in config['tables']:
        table['topics'] = list(topics)
    with open('ingestionClients/config.bigQuery.yml', 'w') as outfile:
        yaml.dump(config, outfile)


def write_compose(ingestionClients):
    services = {}
    for i in range(len(ingestionClients)):
        service = {}
        volumes = []
        name = 'ingestionclient_'+str(i)
        volumes.append('./ingestionClients/'+name+'.yml:/ingestionClient/config.yml')
        volumes.append('./ingestionClients/config.bigQuery.yml:/ingestionClient/dataPlugins/bigQuery/config.yml')
        volumes.append('./ingestionClients/keyfile.json:/ingestionClient/dataPlugins/bigQuery/keyfile.json')
        volumes.append('/tmp/'+name+':/tmp')

        service['volumes'] = volumes
        service['image'] = 'rdsea/ingestion'
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
        services[name] = service
    return services



def provision (config):
    ingestionClients = []
<<<<<<< HEAD
    for ingestionConfigs in config['ingestionClients']:
        ingestionClients.append(createIngestionClientConfigs(ingestionConfigs))
=======
    topics = set()

    for ingestionConfigs in config['ingestionClients']:
        ingestionClients.append(createIngestionClientConfigs(ingestionConfigs))
        for broker in ingestionConfigs['brokers']:
            topics.update(broker['topics'][:])

    write_big_query_config(config['bigQuery'], topics)
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
    
    write_config_files(ingestionClients)
    return write_compose(ingestionClients)
