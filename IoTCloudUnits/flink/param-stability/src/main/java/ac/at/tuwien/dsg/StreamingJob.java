package ac.at.tuwien.dsg;

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ac.at.tuwien.dsg.functions.JSONMapper;
import ac.at.tuwien.dsg.functions.StandardDeviationFunction;
import ac.at.tuwien.dsg.functions.TimestampAndWatermarkGenerator;
import ac.at.tuwien.dsg.models.BTSParam;
import ac.at.tuwien.dsg.models.UnstableParam;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.timestamps.AscendingTimestampExtractor;
import org.apache.flink.streaming.api.windowing.assigners.SlidingEventTimeWindows;
import org.apache.flink.streaming.api.windowing.time.Time;


import java.util.LinkedList;

public class StreamingJob {

	public static void main(String[] args) throws Exception {
		// set up the streaming execution environment
		final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();


		LinkedList<String> topics = new LinkedList<>();
		topics.add("test");

		MqttSource source = new MqttSource("tcp://localhost:1883", "test", topics.toArray(new String[topics.size()]));
		DataStream<String> mqttStream = env.addSource(source);

        StandardDeviationFunction function = new StandardDeviationFunction();
        function.setPercentage(5);

        JSONMapper jsonMapper = new JSONMapper();
		// convert the json string to POJO
        // use the reading time as a watermark
		DataStream<BTSParam> paramStream =  mqttStream
                .flatMap(jsonMapper)
                .assignTimestampsAndWatermarks(new TimestampAndWatermarkGenerator());

		// key the stream by parameter
        // set a sliding window with offset of half the window size
		DataStream<UnstableParam> unstableParamDataStream =  paramStream
                .keyBy("parameterId")
                .timeWindow(Time.seconds(1))
                // .window(SlidingEventTimeWindows.of(Time.seconds(2), Time.seconds(1)))
                .apply(function);

		unstableParamDataStream.print();
		// execute program
		env.execute("Flink Streaming Java API Skeleton");
	}
}