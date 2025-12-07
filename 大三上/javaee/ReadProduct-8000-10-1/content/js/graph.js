/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 270.0, "series": [{"data": [[0.0, 1.0], [0.1, 2.0], [0.2, 2.0], [0.3, 2.0], [0.4, 2.0], [0.5, 2.0], [0.6, 2.0], [0.7, 2.0], [0.8, 2.0], [0.9, 2.0], [1.0, 2.0], [1.1, 2.0], [1.2, 2.0], [1.3, 2.0], [1.4, 2.0], [1.5, 2.0], [1.6, 2.0], [1.7, 2.0], [1.8, 2.0], [1.9, 2.0], [2.0, 2.0], [2.1, 2.0], [2.2, 2.0], [2.3, 2.0], [2.4, 2.0], [2.5, 2.0], [2.6, 2.0], [2.7, 2.0], [2.8, 2.0], [2.9, 2.0], [3.0, 2.0], [3.1, 2.0], [3.2, 2.0], [3.3, 2.0], [3.4, 2.0], [3.5, 2.0], [3.6, 2.0], [3.7, 2.0], [3.8, 2.0], [3.9, 2.0], [4.0, 2.0], [4.1, 2.0], [4.2, 2.0], [4.3, 2.0], [4.4, 2.0], [4.5, 2.0], [4.6, 2.0], [4.7, 2.0], [4.8, 2.0], [4.9, 2.0], [5.0, 2.0], [5.1, 2.0], [5.2, 2.0], [5.3, 2.0], [5.4, 2.0], [5.5, 2.0], [5.6, 2.0], [5.7, 2.0], [5.8, 2.0], [5.9, 2.0], [6.0, 2.0], [6.1, 2.0], [6.2, 2.0], [6.3, 2.0], [6.4, 2.0], [6.5, 2.0], [6.6, 2.0], [6.7, 2.0], [6.8, 2.0], [6.9, 2.0], [7.0, 2.0], [7.1, 2.0], [7.2, 3.0], [7.3, 3.0], [7.4, 3.0], [7.5, 3.0], [7.6, 3.0], [7.7, 3.0], [7.8, 3.0], [7.9, 3.0], [8.0, 3.0], [8.1, 3.0], [8.2, 3.0], [8.3, 3.0], [8.4, 3.0], [8.5, 3.0], [8.6, 3.0], [8.7, 3.0], [8.8, 3.0], [8.9, 3.0], [9.0, 3.0], [9.1, 3.0], [9.2, 3.0], [9.3, 3.0], [9.4, 3.0], [9.5, 3.0], [9.6, 3.0], [9.7, 3.0], [9.8, 3.0], [9.9, 3.0], [10.0, 3.0], [10.1, 3.0], [10.2, 3.0], [10.3, 3.0], [10.4, 3.0], [10.5, 3.0], [10.6, 3.0], [10.7, 3.0], [10.8, 3.0], [10.9, 3.0], [11.0, 3.0], [11.1, 3.0], [11.2, 3.0], [11.3, 3.0], [11.4, 3.0], [11.5, 3.0], [11.6, 3.0], [11.7, 3.0], [11.8, 3.0], [11.9, 3.0], [12.0, 3.0], [12.1, 3.0], [12.2, 3.0], [12.3, 3.0], [12.4, 3.0], [12.5, 3.0], [12.6, 3.0], [12.7, 3.0], [12.8, 3.0], [12.9, 3.0], [13.0, 3.0], [13.1, 3.0], [13.2, 3.0], [13.3, 3.0], [13.4, 3.0], [13.5, 3.0], [13.6, 3.0], [13.7, 3.0], [13.8, 3.0], [13.9, 3.0], [14.0, 3.0], [14.1, 3.0], [14.2, 3.0], [14.3, 3.0], [14.4, 3.0], [14.5, 3.0], [14.6, 3.0], [14.7, 3.0], [14.8, 3.0], [14.9, 3.0], [15.0, 3.0], [15.1, 3.0], [15.2, 3.0], [15.3, 3.0], [15.4, 3.0], [15.5, 3.0], [15.6, 3.0], [15.7, 3.0], [15.8, 3.0], [15.9, 3.0], [16.0, 3.0], [16.1, 3.0], [16.2, 3.0], [16.3, 3.0], [16.4, 3.0], [16.5, 3.0], [16.6, 3.0], [16.7, 3.0], [16.8, 3.0], [16.9, 3.0], [17.0, 3.0], [17.1, 3.0], [17.2, 3.0], [17.3, 3.0], [17.4, 3.0], [17.5, 3.0], [17.6, 3.0], [17.7, 3.0], [17.8, 3.0], [17.9, 3.0], [18.0, 3.0], [18.1, 3.0], [18.2, 3.0], [18.3, 3.0], [18.4, 3.0], [18.5, 3.0], [18.6, 3.0], [18.7, 4.0], [18.8, 4.0], [18.9, 4.0], [19.0, 4.0], [19.1, 4.0], [19.2, 4.0], [19.3, 4.0], [19.4, 4.0], [19.5, 4.0], [19.6, 4.0], [19.7, 4.0], [19.8, 4.0], [19.9, 4.0], [20.0, 4.0], [20.1, 4.0], [20.2, 4.0], [20.3, 4.0], [20.4, 4.0], [20.5, 4.0], [20.6, 4.0], [20.7, 4.0], [20.8, 4.0], [20.9, 4.0], [21.0, 4.0], [21.1, 4.0], [21.2, 4.0], [21.3, 4.0], [21.4, 4.0], [21.5, 4.0], [21.6, 4.0], [21.7, 4.0], [21.8, 4.0], [21.9, 4.0], [22.0, 4.0], [22.1, 4.0], [22.2, 4.0], [22.3, 4.0], [22.4, 4.0], [22.5, 4.0], [22.6, 4.0], [22.7, 4.0], [22.8, 4.0], [22.9, 4.0], [23.0, 4.0], [23.1, 4.0], [23.2, 4.0], [23.3, 4.0], [23.4, 4.0], [23.5, 4.0], [23.6, 4.0], [23.7, 4.0], [23.8, 4.0], [23.9, 4.0], [24.0, 4.0], [24.1, 4.0], [24.2, 4.0], [24.3, 4.0], [24.4, 4.0], [24.5, 4.0], [24.6, 4.0], [24.7, 4.0], [24.8, 4.0], [24.9, 4.0], [25.0, 4.0], [25.1, 4.0], [25.2, 4.0], [25.3, 4.0], [25.4, 4.0], [25.5, 4.0], [25.6, 4.0], [25.7, 4.0], [25.8, 4.0], [25.9, 4.0], [26.0, 4.0], [26.1, 4.0], [26.2, 4.0], [26.3, 4.0], [26.4, 4.0], [26.5, 4.0], [26.6, 4.0], [26.7, 4.0], [26.8, 4.0], [26.9, 5.0], [27.0, 5.0], [27.1, 5.0], [27.2, 5.0], [27.3, 5.0], [27.4, 5.0], [27.5, 5.0], [27.6, 5.0], [27.7, 5.0], [27.8, 5.0], [27.9, 5.0], [28.0, 5.0], [28.1, 5.0], [28.2, 5.0], [28.3, 5.0], [28.4, 5.0], [28.5, 5.0], [28.6, 5.0], [28.7, 5.0], [28.8, 5.0], [28.9, 5.0], [29.0, 5.0], [29.1, 5.0], [29.2, 5.0], [29.3, 5.0], [29.4, 5.0], [29.5, 5.0], [29.6, 5.0], [29.7, 5.0], [29.8, 5.0], [29.9, 5.0], [30.0, 5.0], [30.1, 5.0], [30.2, 5.0], [30.3, 5.0], [30.4, 5.0], [30.5, 5.0], [30.6, 5.0], [30.7, 5.0], [30.8, 5.0], [30.9, 5.0], [31.0, 5.0], [31.1, 5.0], [31.2, 5.0], [31.3, 5.0], [31.4, 5.0], [31.5, 5.0], [31.6, 5.0], [31.7, 5.0], [31.8, 5.0], [31.9, 5.0], [32.0, 5.0], [32.1, 5.0], [32.2, 5.0], [32.3, 5.0], [32.4, 5.0], [32.5, 5.0], [32.6, 5.0], [32.7, 5.0], [32.8, 5.0], [32.9, 5.0], [33.0, 6.0], [33.1, 6.0], [33.2, 6.0], [33.3, 6.0], [33.4, 6.0], [33.5, 6.0], [33.6, 6.0], [33.7, 6.0], [33.8, 6.0], [33.9, 6.0], [34.0, 6.0], [34.1, 6.0], [34.2, 6.0], [34.3, 6.0], [34.4, 6.0], [34.5, 6.0], [34.6, 6.0], [34.7, 6.0], [34.8, 6.0], [34.9, 6.0], [35.0, 6.0], [35.1, 6.0], [35.2, 6.0], [35.3, 6.0], [35.4, 6.0], [35.5, 6.0], [35.6, 6.0], [35.7, 6.0], [35.8, 6.0], [35.9, 6.0], [36.0, 6.0], [36.1, 6.0], [36.2, 6.0], [36.3, 6.0], [36.4, 6.0], [36.5, 6.0], [36.6, 6.0], [36.7, 6.0], [36.8, 6.0], [36.9, 6.0], [37.0, 6.0], [37.1, 6.0], [37.2, 6.0], [37.3, 6.0], [37.4, 6.0], [37.5, 6.0], [37.6, 6.0], [37.7, 6.0], [37.8, 6.0], [37.9, 6.0], [38.0, 6.0], [38.1, 6.0], [38.2, 6.0], [38.3, 6.0], [38.4, 6.0], [38.5, 6.0], [38.6, 7.0], [38.7, 7.0], [38.8, 7.0], [38.9, 7.0], [39.0, 7.0], [39.1, 7.0], [39.2, 7.0], [39.3, 7.0], [39.4, 7.0], [39.5, 7.0], [39.6, 7.0], [39.7, 7.0], [39.8, 7.0], [39.9, 7.0], [40.0, 7.0], [40.1, 7.0], [40.2, 7.0], [40.3, 7.0], [40.4, 7.0], [40.5, 7.0], [40.6, 7.0], [40.7, 7.0], [40.8, 7.0], [40.9, 7.0], [41.0, 7.0], [41.1, 7.0], [41.2, 7.0], [41.3, 7.0], [41.4, 7.0], [41.5, 7.0], [41.6, 7.0], [41.7, 7.0], [41.8, 7.0], [41.9, 7.0], [42.0, 7.0], [42.1, 7.0], [42.2, 7.0], [42.3, 7.0], [42.4, 7.0], [42.5, 8.0], [42.6, 8.0], [42.7, 8.0], [42.8, 8.0], [42.9, 8.0], [43.0, 8.0], [43.1, 8.0], [43.2, 8.0], [43.3, 8.0], [43.4, 8.0], [43.5, 8.0], [43.6, 8.0], [43.7, 8.0], [43.8, 8.0], [43.9, 8.0], [44.0, 8.0], [44.1, 8.0], [44.2, 8.0], [44.3, 8.0], [44.4, 8.0], [44.5, 8.0], [44.6, 8.0], [44.7, 8.0], [44.8, 8.0], [44.9, 8.0], [45.0, 8.0], [45.1, 8.0], [45.2, 8.0], [45.3, 8.0], [45.4, 8.0], [45.5, 8.0], [45.6, 8.0], [45.7, 8.0], [45.8, 9.0], [45.9, 9.0], [46.0, 9.0], [46.1, 9.0], [46.2, 9.0], [46.3, 9.0], [46.4, 9.0], [46.5, 9.0], [46.6, 9.0], [46.7, 9.0], [46.8, 9.0], [46.9, 9.0], [47.0, 9.0], [47.1, 9.0], [47.2, 9.0], [47.3, 9.0], [47.4, 9.0], [47.5, 9.0], [47.6, 9.0], [47.7, 9.0], [47.8, 9.0], [47.9, 9.0], [48.0, 9.0], [48.1, 9.0], [48.2, 9.0], [48.3, 9.0], [48.4, 9.0], [48.5, 9.0], [48.6, 9.0], [48.7, 9.0], [48.8, 9.0], [48.9, 9.0], [49.0, 9.0], [49.1, 10.0], [49.2, 10.0], [49.3, 10.0], [49.4, 10.0], [49.5, 10.0], [49.6, 10.0], [49.7, 10.0], [49.8, 10.0], [49.9, 10.0], [50.0, 10.0], [50.1, 10.0], [50.2, 10.0], [50.3, 10.0], [50.4, 10.0], [50.5, 10.0], [50.6, 10.0], [50.7, 10.0], [50.8, 10.0], [50.9, 10.0], [51.0, 10.0], [51.1, 10.0], [51.2, 10.0], [51.3, 10.0], [51.4, 10.0], [51.5, 10.0], [51.6, 10.0], [51.7, 10.0], [51.8, 10.0], [51.9, 10.0], [52.0, 11.0], [52.1, 11.0], [52.2, 11.0], [52.3, 11.0], [52.4, 11.0], [52.5, 11.0], [52.6, 11.0], [52.7, 11.0], [52.8, 11.0], [52.9, 11.0], [53.0, 11.0], [53.1, 11.0], [53.2, 11.0], [53.3, 11.0], [53.4, 11.0], [53.5, 11.0], [53.6, 11.0], [53.7, 11.0], [53.8, 11.0], [53.9, 11.0], [54.0, 11.0], [54.1, 11.0], [54.2, 11.0], [54.3, 11.0], [54.4, 11.0], [54.5, 11.0], [54.6, 11.0], [54.7, 12.0], [54.8, 12.0], [54.9, 12.0], [55.0, 12.0], [55.1, 12.0], [55.2, 12.0], [55.3, 12.0], [55.4, 12.0], [55.5, 12.0], [55.6, 12.0], [55.7, 12.0], [55.8, 12.0], [55.9, 12.0], [56.0, 12.0], [56.1, 12.0], [56.2, 12.0], [56.3, 12.0], [56.4, 12.0], [56.5, 12.0], [56.6, 12.0], [56.7, 12.0], [56.8, 12.0], [56.9, 13.0], [57.0, 13.0], [57.1, 13.0], [57.2, 13.0], [57.3, 13.0], [57.4, 13.0], [57.5, 13.0], [57.6, 13.0], [57.7, 13.0], [57.8, 13.0], [57.9, 13.0], [58.0, 13.0], [58.1, 13.0], [58.2, 13.0], [58.3, 13.0], [58.4, 13.0], [58.5, 13.0], [58.6, 13.0], [58.7, 13.0], [58.8, 13.0], [58.9, 14.0], [59.0, 14.0], [59.1, 14.0], [59.2, 14.0], [59.3, 14.0], [59.4, 14.0], [59.5, 14.0], [59.6, 14.0], [59.7, 14.0], [59.8, 14.0], [59.9, 14.0], [60.0, 14.0], [60.1, 14.0], [60.2, 14.0], [60.3, 15.0], [60.4, 15.0], [60.5, 15.0], [60.6, 15.0], [60.7, 15.0], [60.8, 15.0], [60.9, 15.0], [61.0, 15.0], [61.1, 15.0], [61.2, 15.0], [61.3, 15.0], [61.4, 15.0], [61.5, 15.0], [61.6, 16.0], [61.7, 16.0], [61.8, 16.0], [61.9, 16.0], [62.0, 16.0], [62.1, 16.0], [62.2, 16.0], [62.3, 16.0], [62.4, 16.0], [62.5, 16.0], [62.6, 16.0], [62.7, 16.0], [62.8, 17.0], [62.9, 17.0], [63.0, 17.0], [63.1, 17.0], [63.2, 17.0], [63.3, 17.0], [63.4, 17.0], [63.5, 17.0], [63.6, 17.0], [63.7, 17.0], [63.8, 17.0], [63.9, 17.0], [64.0, 17.0], [64.1, 18.0], [64.2, 18.0], [64.3, 18.0], [64.4, 18.0], [64.5, 18.0], [64.6, 18.0], [64.7, 18.0], [64.8, 18.0], [64.9, 18.0], [65.0, 18.0], [65.1, 19.0], [65.2, 19.0], [65.3, 19.0], [65.4, 19.0], [65.5, 19.0], [65.6, 19.0], [65.7, 19.0], [65.8, 19.0], [65.9, 19.0], [66.0, 20.0], [66.1, 20.0], [66.2, 20.0], [66.3, 20.0], [66.4, 20.0], [66.5, 20.0], [66.6, 20.0], [66.7, 20.0], [66.8, 20.0], [66.9, 21.0], [67.0, 21.0], [67.1, 21.0], [67.2, 21.0], [67.3, 21.0], [67.4, 21.0], [67.5, 21.0], [67.6, 21.0], [67.7, 22.0], [67.8, 22.0], [67.9, 22.0], [68.0, 22.0], [68.1, 22.0], [68.2, 22.0], [68.3, 22.0], [68.4, 22.0], [68.5, 22.0], [68.6, 23.0], [68.7, 23.0], [68.8, 23.0], [68.9, 23.0], [69.0, 23.0], [69.1, 23.0], [69.2, 24.0], [69.3, 24.0], [69.4, 24.0], [69.5, 24.0], [69.6, 24.0], [69.7, 24.0], [69.8, 24.0], [69.9, 25.0], [70.0, 25.0], [70.1, 25.0], [70.2, 25.0], [70.3, 25.0], [70.4, 25.0], [70.5, 25.0], [70.6, 25.0], [70.7, 26.0], [70.8, 26.0], [70.9, 26.0], [71.0, 26.0], [71.1, 26.0], [71.2, 27.0], [71.3, 27.0], [71.4, 27.0], [71.5, 27.0], [71.6, 27.0], [71.7, 27.0], [71.8, 27.0], [71.9, 28.0], [72.0, 28.0], [72.1, 28.0], [72.2, 28.0], [72.3, 28.0], [72.4, 28.0], [72.5, 28.0], [72.6, 29.0], [72.7, 29.0], [72.8, 29.0], [72.9, 29.0], [73.0, 29.0], [73.1, 30.0], [73.2, 30.0], [73.3, 30.0], [73.4, 30.0], [73.5, 30.0], [73.6, 30.0], [73.7, 30.0], [73.8, 30.0], [73.9, 30.0], [74.0, 31.0], [74.1, 31.0], [74.2, 31.0], [74.3, 31.0], [74.4, 31.0], [74.5, 32.0], [74.6, 32.0], [74.7, 32.0], [74.8, 32.0], [74.9, 32.0], [75.0, 33.0], [75.1, 33.0], [75.2, 33.0], [75.3, 33.0], [75.4, 34.0], [75.5, 34.0], [75.6, 34.0], [75.7, 34.0], [75.8, 35.0], [75.9, 35.0], [76.0, 35.0], [76.1, 36.0], [76.2, 36.0], [76.3, 36.0], [76.4, 37.0], [76.5, 37.0], [76.6, 38.0], [76.7, 38.0], [76.8, 38.0], [76.9, 39.0], [77.0, 39.0], [77.1, 39.0], [77.2, 40.0], [77.3, 40.0], [77.4, 41.0], [77.5, 41.0], [77.6, 41.0], [77.7, 42.0], [77.8, 42.0], [77.9, 42.0], [78.0, 42.0], [78.1, 43.0], [78.2, 43.0], [78.3, 43.0], [78.4, 43.0], [78.5, 43.0], [78.6, 44.0], [78.7, 44.0], [78.8, 44.0], [78.9, 44.0], [79.0, 44.0], [79.1, 45.0], [79.2, 45.0], [79.3, 45.0], [79.4, 45.0], [79.5, 46.0], [79.6, 46.0], [79.7, 47.0], [79.8, 47.0], [79.9, 47.0], [80.0, 48.0], [80.1, 48.0], [80.2, 49.0], [80.3, 49.0], [80.4, 49.0], [80.5, 50.0], [80.6, 51.0], [80.7, 51.0], [80.8, 51.0], [80.9, 52.0], [81.0, 52.0], [81.1, 53.0], [81.2, 53.0], [81.3, 53.0], [81.4, 53.0], [81.5, 54.0], [81.6, 54.0], [81.7, 54.0], [81.8, 54.0], [81.9, 55.0], [82.0, 55.0], [82.1, 55.0], [82.2, 55.0], [82.3, 56.0], [82.4, 56.0], [82.5, 56.0], [82.6, 57.0], [82.7, 57.0], [82.8, 57.0], [82.9, 58.0], [83.0, 58.0], [83.1, 58.0], [83.2, 59.0], [83.3, 59.0], [83.4, 59.0], [83.5, 59.0], [83.6, 59.0], [83.7, 59.0], [83.8, 60.0], [83.9, 60.0], [84.0, 60.0], [84.1, 60.0], [84.2, 60.0], [84.3, 61.0], [84.4, 61.0], [84.5, 61.0], [84.6, 62.0], [84.7, 62.0], [84.8, 63.0], [84.9, 63.0], [85.0, 64.0], [85.1, 64.0], [85.2, 64.0], [85.3, 65.0], [85.4, 65.0], [85.5, 66.0], [85.6, 66.0], [85.7, 66.0], [85.8, 67.0], [85.9, 67.0], [86.0, 68.0], [86.1, 68.0], [86.2, 69.0], [86.3, 69.0], [86.4, 69.0], [86.5, 70.0], [86.6, 71.0], [86.7, 71.0], [86.8, 72.0], [86.9, 72.0], [87.0, 73.0], [87.1, 73.0], [87.2, 74.0], [87.3, 75.0], [87.4, 75.0], [87.5, 77.0], [87.6, 77.0], [87.7, 79.0], [87.8, 79.0], [87.9, 80.0], [88.0, 80.0], [88.1, 81.0], [88.2, 82.0], [88.3, 82.0], [88.4, 83.0], [88.5, 84.0], [88.6, 85.0], [88.7, 85.0], [88.8, 86.0], [88.9, 87.0], [89.0, 88.0], [89.1, 89.0], [89.2, 90.0], [89.3, 91.0], [89.4, 91.0], [89.5, 92.0], [89.6, 92.0], [89.7, 93.0], [89.8, 93.0], [89.9, 95.0], [90.0, 95.0], [90.1, 96.0], [90.2, 97.0], [90.3, 98.0], [90.4, 99.0], [90.5, 100.0], [90.6, 101.0], [90.7, 101.0], [90.8, 102.0], [90.9, 103.0], [91.0, 104.0], [91.1, 104.0], [91.2, 104.0], [91.3, 106.0], [91.4, 106.0], [91.5, 107.0], [91.6, 107.0], [91.7, 108.0], [91.8, 109.0], [91.9, 110.0], [92.0, 111.0], [92.1, 112.0], [92.2, 113.0], [92.3, 114.0], [92.4, 114.0], [92.5, 115.0], [92.6, 115.0], [92.7, 117.0], [92.8, 118.0], [92.9, 119.0], [93.0, 120.0], [93.1, 120.0], [93.2, 121.0], [93.3, 122.0], [93.4, 123.0], [93.5, 125.0], [93.6, 126.0], [93.7, 126.0], [93.8, 127.0], [93.9, 128.0], [94.0, 129.0], [94.1, 130.0], [94.2, 131.0], [94.3, 132.0], [94.4, 133.0], [94.5, 133.0], [94.6, 134.0], [94.7, 135.0], [94.8, 136.0], [94.9, 138.0], [95.0, 138.0], [95.1, 140.0], [95.2, 140.0], [95.3, 141.0], [95.4, 142.0], [95.5, 143.0], [95.6, 144.0], [95.7, 145.0], [95.8, 146.0], [95.9, 146.0], [96.0, 147.0], [96.1, 148.0], [96.2, 149.0], [96.3, 150.0], [96.4, 151.0], [96.5, 153.0], [96.6, 155.0], [96.7, 156.0], [96.8, 158.0], [96.9, 160.0], [97.0, 161.0], [97.1, 162.0], [97.2, 164.0], [97.3, 165.0], [97.4, 166.0], [97.5, 167.0], [97.6, 169.0], [97.7, 170.0], [97.8, 171.0], [97.9, 173.0], [98.0, 174.0], [98.1, 175.0], [98.2, 178.0], [98.3, 181.0], [98.4, 183.0], [98.5, 185.0], [98.6, 189.0], [98.7, 192.0], [98.8, 194.0], [98.9, 197.0], [99.0, 200.0], [99.1, 203.0], [99.2, 206.0], [99.3, 209.0], [99.4, 213.0], [99.5, 217.0], [99.6, 224.0], [99.7, 227.0], [99.8, 230.0], [99.9, 242.0], [100.0, 270.0]], "isOverall": false, "label": "Products", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 82.0, "minX": 0.0, "maxY": 7234.0, "series": [{"data": [[0.0, 7234.0], [100.0, 684.0], [200.0, 82.0]], "isOverall": false, "label": "Products", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 200.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 4.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 7996.0, "series": [{"data": [[0.0, 7996.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [[3.0, 4.0]], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 3.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 4.166666666666669, "minX": 1.764862045E12, "maxY": 157.849925705795, "series": [{"data": [[1.764862045E12, 9.810344827586208], [1.764862046E12, 4.166666666666669], [1.764862048E12, 16.74975562072336], [1.764862047E12, 11.51351351351352], [1.764862049E12, 19.108153078203006], [1.76486205E12, 38.71622641509437], [1.764862052E12, 11.494986326344586], [1.764862051E12, 157.849925705795], [1.764862053E12, 5.49253731343283]], "isOverall": false, "label": "线程组", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.764862053E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 3.4971428571428564, "minX": 1.0, "maxY": 194.0, "series": [{"data": [[2.0, 3.7922437673130163], [3.0, 3.6412337662337624], [4.0, 3.9112627986348136], [5.0, 4.938172043010747], [6.0, 6.114649681528659], [7.0, 6.660194174757281], [8.0, 7.069852941176468], [9.0, 7.703703703703704], [10.0, 9.215686274509807], [11.0, 9.82914572864322], [12.0, 10.325443786982246], [13.0, 11.032467532467528], [14.0, 12.164556962025317], [15.0, 11.525179856115107], [16.0, 12.569230769230765], [17.0, 12.786324786324785], [18.0, 13.126126126126126], [19.0, 12.669565217391305], [20.0, 15.022222222222222], [21.0, 14.104166666666668], [22.0, 16.192771084337355], [23.0, 15.722222222222227], [24.0, 15.999999999999996], [25.0, 17.280701754385966], [26.0, 20.689655172413794], [27.0, 21.696428571428566], [28.0, 25.211267605633804], [29.0, 23.999999999999996], [30.0, 23.47368421052631], [31.0, 23.199999999999996], [33.0, 23.624999999999996], [32.0, 24.049180327868847], [34.0, 26.980392156862745], [35.0, 26.361111111111114], [36.0, 29.733333333333334], [37.0, 27.363636363636363], [39.0, 33.13636363636363], [38.0, 35.52631578947369], [40.0, 34.925925925925924], [41.0, 28.727272727272723], [43.0, 32.55882352941176], [42.0, 29.366666666666664], [45.0, 34.088235294117645], [44.0, 27.86956521739131], [47.0, 32.78787878787878], [46.0, 34.32352941176471], [49.0, 31.324324324324326], [48.0, 33.34482758620689], [51.0, 36.48275862068965], [50.0, 34.565217391304344], [52.0, 32.52], [53.0, 34.26666666666666], [54.0, 33.481481481481474], [55.0, 37.04166666666667], [56.0, 36.449999999999996], [57.0, 36.26315789473685], [58.0, 38.699999999999996], [59.0, 45.583333333333336], [61.0, 45.090909090909086], [60.0, 43.06666666666667], [62.0, 48.5], [63.0, 45.1], [65.0, 45.75], [64.0, 53.0], [66.0, 47.111111111111114], [67.0, 54.75], [71.0, 39.3], [70.0, 45.42857142857142], [69.0, 51.33333333333333], [68.0, 42.375], [72.0, 41.166666666666664], [75.0, 49.18181818181818], [74.0, 45.0], [73.0, 64.28571428571429], [76.0, 37.72727272727273], [77.0, 45.099999999999994], [79.0, 38.166666666666664], [78.0, 44.888888888888886], [80.0, 44.39999999999999], [81.0, 43.84615384615384], [82.0, 46.727272727272734], [83.0, 52.25000000000001], [87.0, 59.909090909090914], [86.0, 54.45454545454545], [85.0, 56.75], [84.0, 66.57142857142857], [90.0, 54.76923076923077], [89.0, 58.714285714285715], [88.0, 67.27272727272727], [91.0, 63.57142857142857], [95.0, 69.2], [94.0, 87.70000000000002], [93.0, 70.38461538461539], [92.0, 64.73333333333332], [96.0, 79.0], [99.0, 67.88888888888889], [98.0, 68.06666666666666], [97.0, 103.0], [103.0, 69.75], [102.0, 78.38461538461539], [101.0, 77.93333333333334], [100.0, 80.76470588235294], [104.0, 72.44444444444444], [106.0, 86.2], [107.0, 72.08333333333333], [105.0, 94.55555555555554], [108.0, 88.44444444444444], [110.0, 68.28571428571429], [109.0, 76.0], [111.0, 73.0], [113.0, 63.8], [114.0, 84.90909090909092], [115.0, 71.9], [112.0, 77.25], [116.0, 73.71428571428572], [117.0, 77.75], [119.0, 75.0], [118.0, 86.66666666666667], [120.0, 64.83333333333334], [121.0, 92.28571428571429], [123.0, 73.66666666666667], [122.0, 97.6], [126.0, 70.41176470588235], [125.0, 73.84615384615384], [124.0, 70.69999999999999], [127.0, 71.91666666666667], [129.0, 71.17647058823529], [128.0, 77.94117647058823], [132.0, 72.00000000000001], [131.0, 73.89999999999999], [130.0, 81.80000000000001], [133.0, 95.0], [135.0, 130.5], [134.0, 165.0], [138.0, 149.5], [143.0, 151.0], [142.0, 178.5], [141.0, 168.5], [137.0, 149.0], [144.0, 145.66666666666666], [145.0, 116.0], [150.0, 139.0909090909091], [151.0, 124.5], [149.0, 121.0], [148.0, 155.0], [147.0, 122.6], [146.0, 146.5], [153.0, 131.05555555555557], [152.0, 135.35714285714286], [154.0, 146.0], [155.0, 153.20000000000005], [156.0, 158.75], [157.0, 148.33333333333334], [159.0, 137.17647058823533], [158.0, 136.33333333333331], [160.0, 146.07692307692312], [161.0, 128.55555555555557], [162.0, 146.125], [163.0, 132.23076923076928], [165.0, 143.71428571428572], [166.0, 130.0], [167.0, 157.0], [164.0, 142.89999999999998], [169.0, 164.2857142857143], [168.0, 145.71428571428572], [175.0, 139.25], [174.0, 139.70000000000002], [173.0, 151.66666666666669], [172.0, 122.66666666666666], [171.0, 159.33333333333331], [170.0, 166.42857142857144], [176.0, 148.3846153846154], [180.0, 139.0714285714286], [182.0, 135.5], [183.0, 135.53846153846155], [181.0, 136.08333333333334], [179.0, 147.99999999999997], [178.0, 159.88888888888889], [177.0, 180.88888888888889], [184.0, 128.8888888888889], [189.0, 159.8], [191.0, 117.45454545454544], [190.0, 144.16666666666666], [188.0, 126.33333333333333], [187.0, 156.125], [186.0, 142.56249999999997], [185.0, 106.0], [197.0, 147.0], [199.0, 104.0], [198.0, 93.5], [196.0, 142.0], [195.0, 147.25], [194.0, 153.33333333333334], [193.0, 154.6], [192.0, 156.2857142857143], [206.0, 99.2], [207.0, 108.5], [205.0, 82.5], [204.0, 100.0], [203.0, 126.5], [202.0, 97.66666666666667], [201.0, 122.0], [200.0, 98.66666666666667], [210.0, 95.44444444444444], [209.0, 106.33333333333333], [211.0, 109.66666666666667], [212.0, 103.2], [213.0, 113.33333333333333], [214.0, 106.0], [215.0, 102.0], [208.0, 116.0], [217.0, 93.66666666666667], [218.0, 104.0], [219.0, 116.5], [216.0, 100.33333333333333], [223.0, 137.0], [222.0, 128.66666666666666], [221.0, 130.0], [220.0, 121.0], [224.0, 134.8], [226.0, 124.0], [225.0, 131.33333333333334], [231.0, 145.0], [230.0, 140.5], [229.0, 116.5], [228.0, 129.0], [227.0, 144.33333333333334], [233.0, 129.57142857142858], [234.0, 140.71428571428572], [235.0, 115.28571428571428], [236.0, 130.0], [232.0, 131.83333333333334], [239.0, 148.0], [238.0, 129.0], [237.0, 82.0], [241.0, 129.0], [246.0, 140.42857142857144], [247.0, 145.20000000000002], [245.0, 148.33333333333334], [244.0, 92.0], [243.0, 126.0], [240.0, 119.75], [242.0, 152.0], [250.0, 131.91666666666666], [251.0, 137.60000000000002], [249.0, 153.0], [252.0, 125.69230769230768], [253.0, 111.5], [255.0, 131.00000000000003], [254.0, 125.25], [248.0, 120.99999999999999], [259.0, 136.5], [256.0, 139.16666666666669], [257.0, 166.66666666666669], [258.0, 145.77777777777777], [260.0, 127.5], [262.0, 182.0], [261.0, 194.0], [263.0, 72.0], [264.0, 103.25], [265.0, 97.0], [266.0, 141.0], [267.0, 68.66666666666667], [1.0, 3.4971428571428564]], "isOverall": false, "label": "Products", "isController": false}, {"data": [[41.579749999999976, 30.07975000000002]], "isOverall": false, "label": "Products-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 267.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 28884.0, "minX": 1.764862045E12, "maxY": 2221542.0, "series": [{"data": [[1.764862045E12, 195736.0], [1.764862046E12, 867733.0], [1.764862048E12, 1710095.0], [1.764862047E12, 1452421.0], [1.764862049E12, 1994840.0], [1.76486205E12, 2181849.0], [1.764862052E12, 1818720.0], [1.764862051E12, 2221542.0], [1.764862053E12, 777122.0]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.764862045E12, 28884.0], [1.764862046E12, 132966.0], [1.764862048E12, 254727.0], [1.764862047E12, 221112.0], [1.764862049E12, 299298.0], [1.76486205E12, 329925.0], [1.764862052E12, 273153.0], [1.764862051E12, 335154.0], [1.764862053E12, 116781.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.764862053E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 4.6886993603411495, "minX": 1.764862045E12, "maxY": 111.55052005943526, "series": [{"data": [[1.764862045E12, 12.146551724137932], [1.764862046E12, 4.838951310861425], [1.764862048E12, 11.642228739002928], [1.764862047E12, 11.904279279279269], [1.764862049E12, 12.930116472545759], [1.76486205E12, 25.47169811320752], [1.764862052E12, 11.418413855970842], [1.764862051E12, 111.55052005943526], [1.764862053E12, 4.6886993603411495]], "isOverall": false, "label": "Products", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.764862053E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 4.66524520255863, "minX": 1.764862045E12, "maxY": 111.48588410104013, "series": [{"data": [[1.764862045E12, 11.974137931034486], [1.764862046E12, 4.801498127340827], [1.764862048E12, 11.59335288367546], [1.764862047E12, 11.856981981981987], [1.764862049E12, 12.855241264559064], [1.76486205E12, 25.433207547169847], [1.764862052E12, 11.387420237010028], [1.764862051E12, 111.48588410104013], [1.764862053E12, 4.66524520255863]], "isOverall": false, "label": "Products", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.764862053E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.2634457611668185, "minX": 1.764862045E12, "maxY": 5.275862068965517, "series": [{"data": [[1.764862045E12, 5.275862068965517], [1.764862046E12, 0.928838951310862], [1.764862048E12, 0.4134897360703814], [1.764862047E12, 0.5382882882882879], [1.764862049E12, 0.3286189683860231], [1.76486205E12, 0.3471698113207548], [1.764862052E12, 0.2634457611668185], [1.764862051E12, 0.27488855869242207], [1.764862053E12, 0.28997867803837896]], "isOverall": false, "label": "Products", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.764862053E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 1.0, "minX": 1.764862045E12, "maxY": 270.0, "series": [{"data": [[1.764862045E12, 49.0], [1.764862046E12, 22.0], [1.764862048E12, 44.0], [1.764862047E12, 91.0], [1.764862049E12, 72.0], [1.76486205E12, 76.0], [1.764862052E12, 146.0], [1.764862051E12, 270.0], [1.764862053E12, 19.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.764862045E12, 39.3], [1.764862046E12, 9.0], [1.764862048E12, 26.0], [1.764862047E12, 24.0], [1.764862049E12, 26.0], [1.76486205E12, 55.0], [1.764862052E12, 27.399999999999977], [1.764862051E12, 181.29999999999995], [1.764862053E12, 9.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.764862045E12, 49.0], [1.764862046E12, 16.649999999999977], [1.764862048E12, 38.0], [1.764862047E12, 80.11000000000001], [1.764862049E12, 56.99000000000001], [1.76486205E12, 64.0], [1.764862052E12, 115.03999999999996], [1.764862051E12, 235.0], [1.764862053E12, 18.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.764862045E12, 45.0], [1.764862046E12, 11.0], [1.764862048E12, 31.0], [1.764862047E12, 54.549999999999955], [1.764862049E12, 36.0], [1.76486205E12, 59.0], [1.764862052E12, 61.200000000000045], [1.764862051E12, 205.64999999999986], [1.764862053E12, 12.0]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.764862045E12, 2.0], [1.764862046E12, 2.0], [1.764862048E12, 1.0], [1.764862047E12, 2.0], [1.764862049E12, 2.0], [1.76486205E12, 2.0], [1.764862052E12, 1.0], [1.764862051E12, 7.0], [1.764862053E12, 1.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.764862045E12, 5.0], [1.764862046E12, 4.0], [1.764862048E12, 9.0], [1.764862047E12, 6.0], [1.764862049E12, 9.0], [1.76486205E12, 22.0], [1.764862052E12, 4.0], [1.764862051E12, 106.0], [1.764862053E12, 4.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.764862053E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 4.0, "minX": 116.0, "maxY": 106.0, "series": [{"data": [[534.0, 4.0], [1097.0, 4.0], [1202.0, 9.0], [1325.0, 22.0], [1346.0, 106.0], [888.0, 6.0], [116.0, 5.0], [469.0, 4.0], [1023.0, 9.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[1097.0, 15.5], [1202.0, 16.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1346.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 4.0, "minX": 116.0, "maxY": 106.0, "series": [{"data": [[534.0, 4.0], [1097.0, 4.0], [1202.0, 9.0], [1325.0, 22.0], [1346.0, 106.0], [888.0, 6.0], [116.0, 4.5], [469.0, 4.0], [1023.0, 9.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[1097.0, 15.0], [1202.0, 16.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1346.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 119.0, "minX": 1.764862045E12, "maxY": 1389.0, "series": [{"data": [[1.764862045E12, 119.0], [1.764862046E12, 560.0], [1.764862048E12, 1023.0], [1.764862047E12, 859.0], [1.764862049E12, 1228.0], [1.76486205E12, 1339.0], [1.764862052E12, 1016.0], [1.764862051E12, 1389.0], [1.764862053E12, 467.0]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.764862053E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 2.0, "minX": 1.764862045E12, "maxY": 1346.0, "series": [{"data": [[1.764862045E12, 116.0], [1.764862046E12, 534.0], [1.764862048E12, 1023.0], [1.764862047E12, 888.0], [1.764862049E12, 1200.0], [1.76486205E12, 1325.0], [1.764862052E12, 1095.0], [1.764862051E12, 1346.0], [1.764862053E12, 469.0]], "isOverall": false, "label": "200", "isController": false}, {"data": [[1.764862049E12, 2.0], [1.764862052E12, 2.0]], "isOverall": false, "label": "500", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.764862053E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 2.0, "minX": 1.764862045E12, "maxY": 1346.0, "series": [{"data": [[1.764862049E12, 2.0], [1.764862052E12, 2.0]], "isOverall": false, "label": "Products-failure", "isController": false}, {"data": [[1.764862045E12, 116.0], [1.764862046E12, 534.0], [1.764862048E12, 1023.0], [1.764862047E12, 888.0], [1.764862049E12, 1200.0], [1.76486205E12, 1325.0], [1.764862052E12, 1095.0], [1.764862051E12, 1346.0], [1.764862053E12, 469.0]], "isOverall": false, "label": "Products-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.764862053E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 2.0, "minX": 1.764862045E12, "maxY": 1346.0, "series": [{"data": [[1.764862045E12, 116.0], [1.764862046E12, 534.0], [1.764862048E12, 1023.0], [1.764862047E12, 888.0], [1.764862049E12, 1200.0], [1.76486205E12, 1325.0], [1.764862052E12, 1095.0], [1.764862051E12, 1346.0], [1.764862053E12, 469.0]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [[1.764862049E12, 2.0], [1.764862052E12, 2.0]], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.764862053E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

