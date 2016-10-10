# This script is generated by SensorGatewayUtil.sh to run the custom sensor. The data is embbeded at the end of this file. 
# This script enables the sensor to run in a gateway, which is compatible with iCOMOT
# The settings of the sensor is:
#    Dataset = gps1279.csv
#    Maxlines = 0
#    Columns = 2,3 
#    Protocol = mqtt 
#    Frequency = 5
# This script requires sensor.tar.gz in the same folder. If not, please uncomment following line.
# wget https://github.com/tuwiendsg/iCOMOT/raw/master/examples/sensors/sensor.tar.gz

if [ ! -f ./sensor.tar.gz ]; then
	echo "Sensor artifact does not found!" | tee /tmp/sensor.err
  exit 1;
fi

# prepare sensor artifact for the iCOMOT-compatible gateway
mkdir /tmp/sensor
mv ./sensor.tar.gz /tmp/sensor
cd /tmp/sensor
tar -xvzf ./sensor.tar.gz
touch sensor.pid
chmod 777 sensor.pid
rm sensor.tar.gz

# replace the data
sed '1,/^START OF DATA/d' $0 > data.csv
mv data.csv config-files/data.csv

# configure the sensor in META-INF

sed -i 's#<bean id="producer" class="at.ac.tuwien.infosys.cloudconnectivity.dryrun.Dryrun" />#<bean id="producer" class="at.ac.tuwien.infosys.cloudconnectivity.mqtt.MQProducer" />#' config-files/META-INF/wire.xml
sed -i 's#<property name="updateRate" value=.*#<property name="updateRate" value="5"/>#' config-files/META-INF/wire.xml

# With the distributed version, sensor is not started.
# bash ./container_run_bg.sh
exit 0

START OF DATA
gps1279,location,10.71181,106.73685
gps1279,location,10.71208,106.73702
gps1279,location,10.71339,106.73705
gps1279,location,10.71406,106.737
gps1279,location,10.71492,106.73695
gps1279,location,10.7165,106.73686
gps1279,location,10.71838,106.73678
gps1279,location,10.7204,106.73664
gps1279,location,10.72106,106.73646
