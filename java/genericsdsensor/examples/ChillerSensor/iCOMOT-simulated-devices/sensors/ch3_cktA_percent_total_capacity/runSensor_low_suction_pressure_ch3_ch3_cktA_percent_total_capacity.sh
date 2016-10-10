# This script is generated by SensorGatewayUtil.sh to run the custom sensor. The data is embbeded at the end of this file.
# This script can run standalone. For deploying it on gateway, please check the distribution version (in ./ch3_cktA_percent_total_capacity-distribution)
# The settings of the sensor is:
#    Dataset = low_suction_pressure_ch3.csv
#    Maxlines = 0
#    Columns = 1,4 
#    Protocol = mqtt 
#    Frequency = 5
# This script requires sensor.tar.gz in the same folder. If not, please uncomment following line.
# wget https://github.com/tuwiendsg/iCOMOT/raw/master/examples/sensors/sensor.tar.gz

# replace the data
sed '1,/^START OF DATA/d' $0 > data.csv
mv data.csv config-files/data.csv

# configure the sensor in META-INF

sed -i 's#<bean id="producer" class="at.ac.tuwien.infosys.cloudconnectivity.dryrun.Dryrun" />#<bean id="producer" class="at.ac.tuwien.infosys.cloudconnectivity.mqtt.MQProducer" />#' config-files/META-INF/wire.xml
sed -i 's#<property name="updateRate" value=.*#<property name="updateRate" value="5"/>#' config-files/META-INF/wire.xml

# run the sensor
#java -cp 'bootstrap_container-0.0.1-SNAPSHOT-jar-with-dependencies.jar:*' container.Main
bash container_run.sh
exit 0

START OF DATA
id,name,time,ch3_cktA_percent_total_capacity
low_suction_pressure_ch3,ch3_cktA_percent_total_capacity,Apr 3 2011 04:30:01 AM,0
low_suction_pressure_ch3,ch3_cktA_percent_total_capacity,Apr 3 2011 05:00:01 AM,50
low_suction_pressure_ch3,ch3_cktA_percent_total_capacity,Apr 3 2011 05:30:01 AM,75
low_suction_pressure_ch3,ch3_cktA_percent_total_capacity,Apr 3 2011 06:00:01 AM,50
low_suction_pressure_ch3,ch3_cktA_percent_total_capacity,Apr 3 2011 06:30:01 AM,50
low_suction_pressure_ch3,ch3_cktA_percent_total_capacity,Apr 3 2011 07:00:01 AM,50
low_suction_pressure_ch3,ch3_cktA_percent_total_capacity,Apr 3 2011 07:30:01 AM,75
low_suction_pressure_ch3,ch3_cktA_percent_total_capacity,Apr 3 2011 08:00:01 AM,75
low_suction_pressure_ch3,ch3_cktA_percent_total_capacity,Apr 3 2011 08:30:01 AM,75
low_suction_pressure_ch3,ch3_cktA_percent_total_capacity,Apr 3 2011 09:00:01 AM,75
