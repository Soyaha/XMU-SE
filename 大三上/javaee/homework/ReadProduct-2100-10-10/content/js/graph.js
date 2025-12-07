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
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 229.0, "series": [{"data": [[0.0, 1.0], [0.1, 1.0], [0.2, 1.0], [0.3, 1.0], [0.4, 1.0], [0.5, 1.0], [0.6, 1.0], [0.7, 1.0], [0.8, 2.0], [0.9, 2.0], [1.0, 2.0], [1.1, 2.0], [1.2, 2.0], [1.3, 2.0], [1.4, 2.0], [1.5, 2.0], [1.6, 2.0], [1.7, 2.0], [1.8, 2.0], [1.9, 2.0], [2.0, 2.0], [2.1, 2.0], [2.2, 2.0], [2.3, 2.0], [2.4, 2.0], [2.5, 2.0], [2.6, 2.0], [2.7, 2.0], [2.8, 2.0], [2.9, 2.0], [3.0, 2.0], [3.1, 2.0], [3.2, 2.0], [3.3, 2.0], [3.4, 2.0], [3.5, 2.0], [3.6, 2.0], [3.7, 2.0], [3.8, 2.0], [3.9, 2.0], [4.0, 2.0], [4.1, 2.0], [4.2, 2.0], [4.3, 2.0], [4.4, 2.0], [4.5, 2.0], [4.6, 2.0], [4.7, 2.0], [4.8, 2.0], [4.9, 2.0], [5.0, 2.0], [5.1, 2.0], [5.2, 2.0], [5.3, 2.0], [5.4, 2.0], [5.5, 2.0], [5.6, 2.0], [5.7, 2.0], [5.8, 2.0], [5.9, 2.0], [6.0, 2.0], [6.1, 2.0], [6.2, 2.0], [6.3, 2.0], [6.4, 2.0], [6.5, 2.0], [6.6, 2.0], [6.7, 2.0], [6.8, 2.0], [6.9, 2.0], [7.0, 2.0], [7.1, 2.0], [7.2, 2.0], [7.3, 2.0], [7.4, 2.0], [7.5, 2.0], [7.6, 2.0], [7.7, 2.0], [7.8, 2.0], [7.9, 2.0], [8.0, 2.0], [8.1, 2.0], [8.2, 2.0], [8.3, 2.0], [8.4, 2.0], [8.5, 2.0], [8.6, 2.0], [8.7, 2.0], [8.8, 2.0], [8.9, 2.0], [9.0, 2.0], [9.1, 2.0], [9.2, 2.0], [9.3, 2.0], [9.4, 2.0], [9.5, 2.0], [9.6, 2.0], [9.7, 2.0], [9.8, 2.0], [9.9, 2.0], [10.0, 2.0], [10.1, 2.0], [10.2, 2.0], [10.3, 2.0], [10.4, 2.0], [10.5, 2.0], [10.6, 2.0], [10.7, 2.0], [10.8, 2.0], [10.9, 2.0], [11.0, 3.0], [11.1, 3.0], [11.2, 3.0], [11.3, 3.0], [11.4, 3.0], [11.5, 3.0], [11.6, 3.0], [11.7, 3.0], [11.8, 3.0], [11.9, 3.0], [12.0, 3.0], [12.1, 3.0], [12.2, 3.0], [12.3, 3.0], [12.4, 3.0], [12.5, 3.0], [12.6, 3.0], [12.7, 3.0], [12.8, 3.0], [12.9, 3.0], [13.0, 3.0], [13.1, 3.0], [13.2, 3.0], [13.3, 3.0], [13.4, 3.0], [13.5, 3.0], [13.6, 3.0], [13.7, 3.0], [13.8, 3.0], [13.9, 3.0], [14.0, 3.0], [14.1, 3.0], [14.2, 3.0], [14.3, 3.0], [14.4, 3.0], [14.5, 3.0], [14.6, 3.0], [14.7, 3.0], [14.8, 3.0], [14.9, 3.0], [15.0, 3.0], [15.1, 3.0], [15.2, 3.0], [15.3, 3.0], [15.4, 3.0], [15.5, 3.0], [15.6, 3.0], [15.7, 3.0], [15.8, 3.0], [15.9, 3.0], [16.0, 3.0], [16.1, 3.0], [16.2, 3.0], [16.3, 3.0], [16.4, 3.0], [16.5, 3.0], [16.6, 3.0], [16.7, 3.0], [16.8, 3.0], [16.9, 3.0], [17.0, 3.0], [17.1, 3.0], [17.2, 3.0], [17.3, 3.0], [17.4, 3.0], [17.5, 3.0], [17.6, 3.0], [17.7, 3.0], [17.8, 3.0], [17.9, 3.0], [18.0, 3.0], [18.1, 3.0], [18.2, 3.0], [18.3, 3.0], [18.4, 3.0], [18.5, 3.0], [18.6, 3.0], [18.7, 3.0], [18.8, 3.0], [18.9, 3.0], [19.0, 3.0], [19.1, 3.0], [19.2, 3.0], [19.3, 3.0], [19.4, 3.0], [19.5, 3.0], [19.6, 3.0], [19.7, 3.0], [19.8, 3.0], [19.9, 3.0], [20.0, 3.0], [20.1, 3.0], [20.2, 3.0], [20.3, 3.0], [20.4, 3.0], [20.5, 3.0], [20.6, 3.0], [20.7, 3.0], [20.8, 3.0], [20.9, 3.0], [21.0, 3.0], [21.1, 3.0], [21.2, 3.0], [21.3, 3.0], [21.4, 3.0], [21.5, 3.0], [21.6, 3.0], [21.7, 3.0], [21.8, 3.0], [21.9, 3.0], [22.0, 3.0], [22.1, 3.0], [22.2, 3.0], [22.3, 3.0], [22.4, 3.0], [22.5, 3.0], [22.6, 3.0], [22.7, 3.0], [22.8, 3.0], [22.9, 3.0], [23.0, 3.0], [23.1, 3.0], [23.2, 3.0], [23.3, 3.0], [23.4, 3.0], [23.5, 3.0], [23.6, 3.0], [23.7, 3.0], [23.8, 3.0], [23.9, 3.0], [24.0, 3.0], [24.1, 3.0], [24.2, 3.0], [24.3, 3.0], [24.4, 3.0], [24.5, 3.0], [24.6, 4.0], [24.7, 4.0], [24.8, 4.0], [24.9, 4.0], [25.0, 4.0], [25.1, 4.0], [25.2, 4.0], [25.3, 4.0], [25.4, 4.0], [25.5, 4.0], [25.6, 4.0], [25.7, 4.0], [25.8, 4.0], [25.9, 4.0], [26.0, 4.0], [26.1, 4.0], [26.2, 4.0], [26.3, 4.0], [26.4, 4.0], [26.5, 4.0], [26.6, 4.0], [26.7, 4.0], [26.8, 4.0], [26.9, 4.0], [27.0, 4.0], [27.1, 4.0], [27.2, 4.0], [27.3, 4.0], [27.4, 4.0], [27.5, 4.0], [27.6, 4.0], [27.7, 4.0], [27.8, 4.0], [27.9, 4.0], [28.0, 4.0], [28.1, 4.0], [28.2, 4.0], [28.3, 4.0], [28.4, 4.0], [28.5, 4.0], [28.6, 4.0], [28.7, 4.0], [28.8, 4.0], [28.9, 4.0], [29.0, 4.0], [29.1, 4.0], [29.2, 4.0], [29.3, 4.0], [29.4, 4.0], [29.5, 4.0], [29.6, 4.0], [29.7, 4.0], [29.8, 4.0], [29.9, 4.0], [30.0, 4.0], [30.1, 4.0], [30.2, 4.0], [30.3, 4.0], [30.4, 4.0], [30.5, 4.0], [30.6, 4.0], [30.7, 4.0], [30.8, 4.0], [30.9, 4.0], [31.0, 4.0], [31.1, 4.0], [31.2, 4.0], [31.3, 4.0], [31.4, 4.0], [31.5, 4.0], [31.6, 4.0], [31.7, 4.0], [31.8, 4.0], [31.9, 4.0], [32.0, 4.0], [32.1, 4.0], [32.2, 4.0], [32.3, 4.0], [32.4, 4.0], [32.5, 4.0], [32.6, 4.0], [32.7, 4.0], [32.8, 4.0], [32.9, 4.0], [33.0, 4.0], [33.1, 4.0], [33.2, 4.0], [33.3, 4.0], [33.4, 5.0], [33.5, 5.0], [33.6, 5.0], [33.7, 5.0], [33.8, 5.0], [33.9, 5.0], [34.0, 5.0], [34.1, 5.0], [34.2, 5.0], [34.3, 5.0], [34.4, 5.0], [34.5, 5.0], [34.6, 5.0], [34.7, 5.0], [34.8, 5.0], [34.9, 5.0], [35.0, 5.0], [35.1, 5.0], [35.2, 5.0], [35.3, 5.0], [35.4, 5.0], [35.5, 5.0], [35.6, 5.0], [35.7, 5.0], [35.8, 5.0], [35.9, 5.0], [36.0, 5.0], [36.1, 5.0], [36.2, 5.0], [36.3, 5.0], [36.4, 5.0], [36.5, 5.0], [36.6, 5.0], [36.7, 5.0], [36.8, 5.0], [36.9, 5.0], [37.0, 5.0], [37.1, 5.0], [37.2, 5.0], [37.3, 5.0], [37.4, 5.0], [37.5, 5.0], [37.6, 5.0], [37.7, 5.0], [37.8, 5.0], [37.9, 5.0], [38.0, 5.0], [38.1, 5.0], [38.2, 6.0], [38.3, 6.0], [38.4, 6.0], [38.5, 6.0], [38.6, 6.0], [38.7, 6.0], [38.8, 6.0], [38.9, 6.0], [39.0, 6.0], [39.1, 6.0], [39.2, 6.0], [39.3, 6.0], [39.4, 6.0], [39.5, 6.0], [39.6, 6.0], [39.7, 6.0], [39.8, 6.0], [39.9, 6.0], [40.0, 6.0], [40.1, 6.0], [40.2, 6.0], [40.3, 6.0], [40.4, 6.0], [40.5, 6.0], [40.6, 6.0], [40.7, 6.0], [40.8, 6.0], [40.9, 6.0], [41.0, 6.0], [41.1, 6.0], [41.2, 6.0], [41.3, 6.0], [41.4, 6.0], [41.5, 6.0], [41.6, 6.0], [41.7, 6.0], [41.8, 6.0], [41.9, 6.0], [42.0, 6.0], [42.1, 7.0], [42.2, 7.0], [42.3, 7.0], [42.4, 7.0], [42.5, 7.0], [42.6, 7.0], [42.7, 7.0], [42.8, 7.0], [42.9, 7.0], [43.0, 7.0], [43.1, 7.0], [43.2, 7.0], [43.3, 7.0], [43.4, 7.0], [43.5, 7.0], [43.6, 7.0], [43.7, 7.0], [43.8, 7.0], [43.9, 7.0], [44.0, 7.0], [44.1, 7.0], [44.2, 7.0], [44.3, 7.0], [44.4, 7.0], [44.5, 7.0], [44.6, 7.0], [44.7, 7.0], [44.8, 7.0], [44.9, 7.0], [45.0, 7.0], [45.1, 8.0], [45.2, 8.0], [45.3, 8.0], [45.4, 8.0], [45.5, 8.0], [45.6, 8.0], [45.7, 8.0], [45.8, 8.0], [45.9, 8.0], [46.0, 8.0], [46.1, 8.0], [46.2, 8.0], [46.3, 8.0], [46.4, 8.0], [46.5, 8.0], [46.6, 8.0], [46.7, 8.0], [46.8, 8.0], [46.9, 8.0], [47.0, 8.0], [47.1, 8.0], [47.2, 8.0], [47.3, 8.0], [47.4, 9.0], [47.5, 9.0], [47.6, 9.0], [47.7, 9.0], [47.8, 9.0], [47.9, 9.0], [48.0, 9.0], [48.1, 9.0], [48.2, 9.0], [48.3, 9.0], [48.4, 9.0], [48.5, 9.0], [48.6, 9.0], [48.7, 9.0], [48.8, 9.0], [48.9, 9.0], [49.0, 9.0], [49.1, 9.0], [49.2, 9.0], [49.3, 9.0], [49.4, 9.0], [49.5, 9.0], [49.6, 9.0], [49.7, 10.0], [49.8, 10.0], [49.9, 10.0], [50.0, 10.0], [50.1, 10.0], [50.2, 10.0], [50.3, 10.0], [50.4, 10.0], [50.5, 10.0], [50.6, 10.0], [50.7, 10.0], [50.8, 10.0], [50.9, 10.0], [51.0, 10.0], [51.1, 10.0], [51.2, 10.0], [51.3, 10.0], [51.4, 10.0], [51.5, 11.0], [51.6, 11.0], [51.7, 11.0], [51.8, 11.0], [51.9, 11.0], [52.0, 11.0], [52.1, 11.0], [52.2, 11.0], [52.3, 11.0], [52.4, 11.0], [52.5, 11.0], [52.6, 11.0], [52.7, 11.0], [52.8, 11.0], [52.9, 11.0], [53.0, 11.0], [53.1, 12.0], [53.2, 12.0], [53.3, 12.0], [53.4, 12.0], [53.5, 12.0], [53.6, 12.0], [53.7, 12.0], [53.8, 12.0], [53.9, 12.0], [54.0, 12.0], [54.1, 12.0], [54.2, 12.0], [54.3, 12.0], [54.4, 12.0], [54.5, 12.0], [54.6, 13.0], [54.7, 13.0], [54.8, 13.0], [54.9, 13.0], [55.0, 13.0], [55.1, 13.0], [55.2, 13.0], [55.3, 13.0], [55.4, 13.0], [55.5, 13.0], [55.6, 13.0], [55.7, 13.0], [55.8, 13.0], [55.9, 13.0], [56.0, 14.0], [56.1, 14.0], [56.2, 14.0], [56.3, 14.0], [56.4, 14.0], [56.5, 14.0], [56.6, 14.0], [56.7, 14.0], [56.8, 14.0], [56.9, 14.0], [57.0, 14.0], [57.1, 15.0], [57.2, 15.0], [57.3, 15.0], [57.4, 15.0], [57.5, 15.0], [57.6, 15.0], [57.7, 15.0], [57.8, 15.0], [57.9, 15.0], [58.0, 15.0], [58.1, 15.0], [58.2, 16.0], [58.3, 16.0], [58.4, 16.0], [58.5, 16.0], [58.6, 16.0], [58.7, 16.0], [58.8, 16.0], [58.9, 16.0], [59.0, 16.0], [59.1, 17.0], [59.2, 17.0], [59.3, 17.0], [59.4, 17.0], [59.5, 17.0], [59.6, 17.0], [59.7, 17.0], [59.8, 17.0], [59.9, 17.0], [60.0, 17.0], [60.1, 17.0], [60.2, 18.0], [60.3, 18.0], [60.4, 18.0], [60.5, 18.0], [60.6, 18.0], [60.7, 18.0], [60.8, 18.0], [60.9, 18.0], [61.0, 18.0], [61.1, 19.0], [61.2, 19.0], [61.3, 19.0], [61.4, 19.0], [61.5, 19.0], [61.6, 19.0], [61.7, 19.0], [61.8, 19.0], [61.9, 19.0], [62.0, 19.0], [62.1, 19.0], [62.2, 20.0], [62.3, 20.0], [62.4, 20.0], [62.5, 20.0], [62.6, 20.0], [62.7, 20.0], [62.8, 20.0], [62.9, 20.0], [63.0, 21.0], [63.1, 21.0], [63.2, 21.0], [63.3, 21.0], [63.4, 21.0], [63.5, 21.0], [63.6, 21.0], [63.7, 21.0], [63.8, 21.0], [63.9, 22.0], [64.0, 22.0], [64.1, 22.0], [64.2, 22.0], [64.3, 22.0], [64.4, 22.0], [64.5, 22.0], [64.6, 22.0], [64.7, 22.0], [64.8, 22.0], [64.9, 22.0], [65.0, 23.0], [65.1, 23.0], [65.2, 23.0], [65.3, 23.0], [65.4, 23.0], [65.5, 23.0], [65.6, 23.0], [65.7, 23.0], [65.8, 23.0], [65.9, 24.0], [66.0, 24.0], [66.1, 24.0], [66.2, 24.0], [66.3, 24.0], [66.4, 24.0], [66.5, 24.0], [66.6, 24.0], [66.7, 24.0], [66.8, 25.0], [66.9, 25.0], [67.0, 25.0], [67.1, 25.0], [67.2, 25.0], [67.3, 25.0], [67.4, 25.0], [67.5, 25.0], [67.6, 25.0], [67.7, 25.0], [67.8, 26.0], [67.9, 26.0], [68.0, 26.0], [68.1, 26.0], [68.2, 26.0], [68.3, 26.0], [68.4, 26.0], [68.5, 26.0], [68.6, 26.0], [68.7, 26.0], [68.8, 27.0], [68.9, 27.0], [69.0, 27.0], [69.1, 27.0], [69.2, 27.0], [69.3, 27.0], [69.4, 27.0], [69.5, 27.0], [69.6, 27.0], [69.7, 27.0], [69.8, 27.0], [69.9, 28.0], [70.0, 28.0], [70.1, 28.0], [70.2, 28.0], [70.3, 28.0], [70.4, 28.0], [70.5, 28.0], [70.6, 28.0], [70.7, 28.0], [70.8, 28.0], [70.9, 29.0], [71.0, 29.0], [71.1, 29.0], [71.2, 29.0], [71.3, 29.0], [71.4, 29.0], [71.5, 29.0], [71.6, 29.0], [71.7, 29.0], [71.8, 29.0], [71.9, 30.0], [72.0, 30.0], [72.1, 30.0], [72.2, 30.0], [72.3, 30.0], [72.4, 30.0], [72.5, 30.0], [72.6, 30.0], [72.7, 30.0], [72.8, 30.0], [72.9, 31.0], [73.0, 31.0], [73.1, 31.0], [73.2, 31.0], [73.3, 31.0], [73.4, 31.0], [73.5, 31.0], [73.6, 31.0], [73.7, 31.0], [73.8, 31.0], [73.9, 31.0], [74.0, 32.0], [74.1, 32.0], [74.2, 32.0], [74.3, 32.0], [74.4, 32.0], [74.5, 32.0], [74.6, 32.0], [74.7, 32.0], [74.8, 32.0], [74.9, 33.0], [75.0, 33.0], [75.1, 33.0], [75.2, 33.0], [75.3, 33.0], [75.4, 33.0], [75.5, 33.0], [75.6, 33.0], [75.7, 33.0], [75.8, 33.0], [75.9, 34.0], [76.0, 34.0], [76.1, 34.0], [76.2, 34.0], [76.3, 34.0], [76.4, 34.0], [76.5, 34.0], [76.6, 34.0], [76.7, 34.0], [76.8, 34.0], [76.9, 34.0], [77.0, 35.0], [77.1, 35.0], [77.2, 35.0], [77.3, 35.0], [77.4, 35.0], [77.5, 35.0], [77.6, 35.0], [77.7, 35.0], [77.8, 35.0], [77.9, 36.0], [78.0, 36.0], [78.1, 36.0], [78.2, 36.0], [78.3, 36.0], [78.4, 36.0], [78.5, 36.0], [78.6, 36.0], [78.7, 36.0], [78.8, 37.0], [78.9, 37.0], [79.0, 37.0], [79.1, 37.0], [79.2, 37.0], [79.3, 37.0], [79.4, 37.0], [79.5, 37.0], [79.6, 37.0], [79.7, 38.0], [79.8, 38.0], [79.9, 38.0], [80.0, 38.0], [80.1, 38.0], [80.2, 38.0], [80.3, 38.0], [80.4, 39.0], [80.5, 39.0], [80.6, 39.0], [80.7, 39.0], [80.8, 39.0], [80.9, 39.0], [81.0, 39.0], [81.1, 40.0], [81.2, 40.0], [81.3, 40.0], [81.4, 40.0], [81.5, 40.0], [81.6, 40.0], [81.7, 41.0], [81.8, 41.0], [81.9, 41.0], [82.0, 41.0], [82.1, 41.0], [82.2, 41.0], [82.3, 42.0], [82.4, 42.0], [82.5, 42.0], [82.6, 42.0], [82.7, 42.0], [82.8, 42.0], [82.9, 43.0], [83.0, 43.0], [83.1, 43.0], [83.2, 43.0], [83.3, 43.0], [83.4, 43.0], [83.5, 44.0], [83.6, 44.0], [83.7, 44.0], [83.8, 44.0], [83.9, 44.0], [84.0, 44.0], [84.1, 45.0], [84.2, 45.0], [84.3, 45.0], [84.4, 45.0], [84.5, 46.0], [84.6, 46.0], [84.7, 46.0], [84.8, 46.0], [84.9, 47.0], [85.0, 47.0], [85.1, 47.0], [85.2, 47.0], [85.3, 48.0], [85.4, 48.0], [85.5, 48.0], [85.6, 48.0], [85.7, 48.0], [85.8, 49.0], [85.9, 49.0], [86.0, 49.0], [86.1, 49.0], [86.2, 50.0], [86.3, 50.0], [86.4, 50.0], [86.5, 50.0], [86.6, 51.0], [86.7, 51.0], [86.8, 51.0], [86.9, 51.0], [87.0, 52.0], [87.1, 52.0], [87.2, 52.0], [87.3, 52.0], [87.4, 53.0], [87.5, 53.0], [87.6, 53.0], [87.7, 53.0], [87.8, 54.0], [87.9, 54.0], [88.0, 54.0], [88.1, 54.0], [88.2, 54.0], [88.3, 55.0], [88.4, 55.0], [88.5, 55.0], [88.6, 55.0], [88.7, 56.0], [88.8, 56.0], [88.9, 56.0], [89.0, 56.0], [89.1, 57.0], [89.2, 57.0], [89.3, 57.0], [89.4, 58.0], [89.5, 58.0], [89.6, 58.0], [89.7, 58.0], [89.8, 59.0], [89.9, 59.0], [90.0, 59.0], [90.1, 59.0], [90.2, 60.0], [90.3, 60.0], [90.4, 60.0], [90.5, 60.0], [90.6, 61.0], [90.7, 61.0], [90.8, 61.0], [90.9, 62.0], [91.0, 62.0], [91.1, 62.0], [91.2, 63.0], [91.3, 63.0], [91.4, 63.0], [91.5, 64.0], [91.6, 64.0], [91.7, 64.0], [91.8, 65.0], [91.9, 65.0], [92.0, 66.0], [92.1, 66.0], [92.2, 66.0], [92.3, 67.0], [92.4, 67.0], [92.5, 67.0], [92.6, 67.0], [92.7, 68.0], [92.8, 68.0], [92.9, 69.0], [93.0, 69.0], [93.1, 69.0], [93.2, 70.0], [93.3, 70.0], [93.4, 71.0], [93.5, 71.0], [93.6, 71.0], [93.7, 71.0], [93.8, 72.0], [93.9, 72.0], [94.0, 72.0], [94.1, 73.0], [94.2, 73.0], [94.3, 74.0], [94.4, 74.0], [94.5, 75.0], [94.6, 75.0], [94.7, 76.0], [94.8, 76.0], [94.9, 77.0], [95.0, 77.0], [95.1, 78.0], [95.2, 78.0], [95.3, 79.0], [95.4, 79.0], [95.5, 80.0], [95.6, 81.0], [95.7, 81.0], [95.8, 82.0], [95.9, 82.0], [96.0, 83.0], [96.1, 84.0], [96.2, 85.0], [96.3, 85.0], [96.4, 86.0], [96.5, 87.0], [96.6, 87.0], [96.7, 88.0], [96.8, 89.0], [96.9, 89.0], [97.0, 90.0], [97.1, 91.0], [97.2, 92.0], [97.3, 93.0], [97.4, 93.0], [97.5, 95.0], [97.6, 96.0], [97.7, 97.0], [97.8, 99.0], [97.9, 100.0], [98.0, 101.0], [98.1, 102.0], [98.2, 104.0], [98.3, 105.0], [98.4, 107.0], [98.5, 109.0], [98.6, 112.0], [98.7, 114.0], [98.8, 116.0], [98.9, 118.0], [99.0, 121.0], [99.1, 124.0], [99.2, 127.0], [99.3, 132.0], [99.4, 135.0], [99.5, 142.0], [99.6, 147.0], [99.7, 153.0], [99.8, 165.0], [99.9, 189.0], [100.0, 229.0]], "isOverall": false, "label": "Products", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 5.0, "minX": 0.0, "maxY": 20550.0, "series": [{"data": [[0.0, 20550.0], [100.0, 445.0], [200.0, 5.0]], "isOverall": false, "label": "Products", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 200.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 46.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 20954.0, "series": [{"data": [[0.0, 20954.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [[3.0, 46.0]], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 3.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 7.055359838953188, "minX": 1.764912245E12, "maxY": 162.34394010294784, "series": [{"data": [[1.764912252E12, 13.199184921039208], [1.764912251E12, 7.055359838953188], [1.764912253E12, 8.060797665369632], [1.764912254E12, 7.245033112582786], [1.764912245E12, 109.11812627291243], [1.764912255E12, 11.781796262808907], [1.764912246E12, 162.34394010294784], [1.764912248E12, 98.69881630863676], [1.764912247E12, 94.86439865836101], [1.764912249E12, 61.906399235912176], [1.76491225E12, 30.482471516213888]], "isOverall": false, "label": "线程组", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.764912255E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 1.5714285714285714, "minX": 1.0, "maxY": 101.22340425531915, "series": [{"data": [[2.0, 1.625], [3.0, 2.076923076923077], [4.0, 2.2671232876712337], [5.0, 2.5974499089253187], [6.0, 2.881812966150312], [7.0, 3.2574931880109], [8.0, 3.889899909008187], [9.0, 4.240331491712706], [10.0, 4.927272727272729], [11.0, 5.317307692307691], [12.0, 5.653239929947466], [13.0, 5.944444444444442], [14.0, 7.052478134110782], [15.0, 7.381132075471697], [16.0, 7.762820512820514], [17.0, 8.213953488372098], [18.0, 8.760563380281685], [19.0, 8.299684542586752], [20.0, 8.4578313253012], [21.0, 11.960937500000002], [22.0, 11.214285714285712], [23.0, 9.653061224489795], [24.0, 11.263157894736842], [25.0, 12.565789473684214], [26.0, 10.619565217391305], [27.0, 12.896551724137932], [28.0, 13.543478260869566], [29.0, 14.69724770642202], [30.0, 13.409090909090908], [31.0, 13.700000000000001], [33.0, 13.18987341772152], [32.0, 16.785714285714295], [35.0, 21.0], [34.0, 12.585365853658535], [37.0, 18.700000000000006], [36.0, 18.2], [39.0, 13.675], [38.0, 12.666666666666668], [41.0, 17.428571428571427], [40.0, 17.09090909090909], [43.0, 18.4], [42.0, 20.92857142857143], [45.0, 16.08695652173913], [44.0, 25.22222222222222], [47.0, 18.088888888888892], [46.0, 16.192307692307697], [49.0, 24.714285714285715], [48.0, 23.24137931034483], [51.0, 20.868421052631575], [50.0, 24.5], [53.0, 27.192771084337352], [52.0, 25.932203389830512], [55.0, 26.75862068965517], [54.0, 25.717391304347817], [57.0, 25.46861924686192], [56.0, 28.744999999999987], [59.0, 15.446601941747577], [58.0, 20.195488721804505], [61.0, 20.934210526315784], [60.0, 20.98630136986301], [63.0, 30.461988304093566], [62.0, 26.281632653061223], [66.0, 48.95454545454546], [65.0, 40.14285714285716], [67.0, 29.86666666666667], [64.0, 33.20155038759688], [68.0, 37.770833333333336], [69.0, 39.0967741935484], [71.0, 21.420289855072465], [70.0, 31.054545454545455], [74.0, 30.7027027027027], [75.0, 23.23728813559322], [73.0, 29.07563025210084], [72.0, 32.63291139240507], [76.0, 18.49009900990099], [79.0, 19.57471264367815], [78.0, 19.59433962264152], [77.0, 17.888268156424584], [80.0, 23.151079136690637], [81.0, 26.857142857142858], [82.0, 34.25882352941176], [83.0, 37.14864864864864], [84.0, 33.515625000000014], [86.0, 32.77142857142857], [87.0, 34.8], [85.0, 29.636363636363637], [88.0, 38.48351648351649], [89.0, 45.740740740740755], [90.0, 37.981651376146814], [91.0, 36.8904109589041], [92.0, 33.04807692307693], [93.0, 30.828125], [94.0, 37.14285714285714], [95.0, 25.272727272727273], [96.0, 29.265306122448973], [99.0, 23.973684210526326], [98.0, 25.48], [97.0, 24.916666666666668], [103.0, 37.30147058823531], [102.0, 24.243243243243242], [101.0, 24.03125], [100.0, 22.29787234042553], [104.0, 36.085106382978694], [105.0, 36.65100671140939], [106.0, 33.505747126436766], [107.0, 33.05945945945948], [108.0, 43.31578947368421], [109.0, 41.23423423423423], [110.0, 48.528571428571446], [111.0, 46.557142857142864], [112.0, 47.704918032786885], [113.0, 38.94736842105265], [114.0, 67.64473684210522], [115.0, 82.77777777777777], [116.0, 77.68749999999997], [117.0, 54.67692307692308], [119.0, 55.476190476190474], [118.0, 51.195121951219505], [120.0, 50.523809523809526], [121.0, 69.9], [122.0, 49.78571428571429], [123.0, 61.052631578947356], [124.0, 66.0], [125.0, 63.30769230769231], [127.0, 55.26470588235296], [126.0, 47.222222222222214], [128.0, 50.376623376623385], [129.0, 40.77777777777778], [130.0, 44.480000000000004], [131.0, 50.41666666666667], [132.0, 68.62500000000001], [133.0, 81.85714285714286], [134.0, 69.0], [135.0, 71.16129032258064], [136.0, 68.8139534883721], [137.0, 70.31707317073169], [138.0, 67.6], [139.0, 72.52941176470588], [140.0, 72.96551724137932], [141.0, 74.14705882352939], [143.0, 73.67741935483869], [142.0, 60.0], [145.0, 60.795918367346935], [146.0, 70.0625], [147.0, 51.825], [148.0, 52.85000000000001], [149.0, 51.38235294117648], [150.0, 61.724137931034484], [151.0, 62.36111111111112], [144.0, 58.5], [152.0, 52.20000000000001], [153.0, 47.03529411764706], [154.0, 52.257731958762896], [155.0, 61.49681528662422], [157.0, 62.52606635071091], [158.0, 65.99358974358975], [159.0, 57.82857142857144], [156.0, 64.94039735099338], [160.0, 77.05555555555556], [161.0, 93.0], [162.0, 76.8888888888889], [163.0, 73.35], [164.0, 70.33333333333333], [165.0, 79.23529411764706], [166.0, 77.04545454545455], [167.0, 69.6], [168.0, 71.57894736842105], [169.0, 69.55555555555556], [170.0, 66.02419354838705], [171.0, 78.20175438596492], [172.0, 72.2716049382716], [173.0, 87.53731343283583], [174.0, 101.22340425531915], [175.0, 94.27906976744185], [177.0, 81.03225806451611], [176.0, 89.26315789473684], [178.0, 85.4], [179.0, 75.125], [1.0, 1.5714285714285714]], "isOverall": false, "label": "Products", "isController": false}, {"data": [[53.0039999999999, 22.216619047619133]], "isOverall": false, "label": "Products-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 179.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 122259.0, "minX": 1.764912245E12, "maxY": 3808529.0, "series": [{"data": [[1.764912252E12, 3275289.0], [1.764912251E12, 3315195.0], [1.764912253E12, 3432892.0], [1.764912254E12, 3272238.0], [1.764912245E12, 763528.0], [1.764912255E12, 2770473.0], [1.764912246E12, 3561507.0], [1.764912248E12, 3807127.0], [1.764912247E12, 3482243.0], [1.764912249E12, 3493655.0], [1.76491225E12, 3808529.0]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.764912252E12, 488787.0], [1.764912251E12, 494763.0], [1.764912253E12, 511944.0], [1.764912254E12, 488787.0], [1.764912245E12, 122259.0], [1.764912255E12, 413091.0], [1.764912246E12, 532113.0], [1.764912248E12, 567969.0], [1.764912247E12, 519663.0], [1.764912249E12, 521406.0], [1.76491225E12, 568218.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.764912255E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 3.3598389531957724, "minX": 1.764912245E12, "maxY": 78.6761710794298, "series": [{"data": [[1.764912252E12, 6.560876209882831], [1.764912251E12, 3.3598389531957724], [1.764912253E12, 3.760700389105052], [1.764912254E12, 3.589913397860419], [1.764912245E12, 78.6761710794298], [1.764912255E12, 5.742616033755266], [1.764912246E12, 69.94244267664952], [1.764912248E12, 36.76896098202544], [1.764912247E12, 28.091039770004755], [1.764912249E12, 29.461795606494746], [1.76491225E12, 13.322524101665184]], "isOverall": false, "label": "Products", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.764912255E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 3.3442375440362295, "minX": 1.764912245E12, "maxY": 78.36456211812617, "series": [{"data": [[1.764912252E12, 6.546612328069276], [1.764912251E12, 3.3442375440362295], [1.764912253E12, 3.74805447470817], [1.764912254E12, 3.5669893020886425], [1.764912245E12, 78.36456211812617], [1.764912255E12, 5.722724532851116], [1.764912246E12, 69.49789424426763], [1.764912248E12, 36.30819815870236], [1.764912247E12, 27.97604216578813], [1.764912249E12, 29.163323782234936], [1.76491225E12, 13.296231375985963]], "isOverall": false, "label": "Products", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.764912255E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.018339276617422316, "minX": 1.764912245E12, "maxY": 2.6211812627291264, "series": [{"data": [[1.764912252E12, 0.022414671421293976], [1.764912251E12, 0.020130850528434857], [1.764912253E12, 0.023832684824902767], [1.764912254E12, 0.018339276617422316], [1.764912245E12, 2.6211812627291264], [1.764912255E12, 0.02893309222423144], [1.764912246E12, 0.7515208235844641], [1.764912248E12, 0.1091626479614203], [1.764912247E12, 0.24532822232870163], [1.764912249E12, 0.04106972301814716], [1.76491225E12, 0.03374233128834354]], "isOverall": false, "label": "Products", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.764912255E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 1.0, "minX": 1.764912245E12, "maxY": 229.0, "series": [{"data": [[1.764912252E12, 60.0], [1.764912251E12, 23.0], [1.764912253E12, 20.0], [1.764912254E12, 17.0], [1.764912245E12, 229.0], [1.764912255E12, 31.0], [1.764912246E12, 187.0], [1.764912248E12, 109.0], [1.764912247E12, 129.0], [1.764912249E12, 89.0], [1.76491225E12, 85.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.764912252E12, 12.0], [1.764912251E12, 5.0], [1.764912253E12, 6.0], [1.764912254E12, 6.0], [1.764912245E12, 152.40000000000003], [1.764912255E12, 10.0], [1.764912246E12, 105.0], [1.764912248E12, 56.0], [1.764912247E12, 66.0], [1.764912249E12, 42.0], [1.76491225E12, 25.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.764912252E12, 26.0], [1.764912251E12, 10.0], [1.764912253E12, 12.0], [1.764912254E12, 11.0], [1.764912245E12, 200.54000000000002], [1.764912255E12, 24.40000000000009], [1.764912246E12, 148.0], [1.764912248E12, 83.0], [1.764912247E12, 95.11999999999989], [1.764912249E12, 70.05000000000018], [1.76491225E12, 39.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.764912252E12, 14.0], [1.764912251E12, 6.0], [1.764912253E12, 7.0], [1.764912254E12, 8.0], [1.764912245E12, 188.7], [1.764912255E12, 14.0], [1.764912246E12, 120.09999999999991], [1.764912248E12, 65.0], [1.764912247E12, 79.0], [1.764912249E12, 52.0], [1.76491225E12, 31.0]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.764912252E12, 1.0], [1.764912251E12, 1.0], [1.764912253E12, 1.0], [1.764912254E12, 1.0], [1.764912245E12, 12.0], [1.764912255E12, 1.0], [1.764912246E12, 12.0], [1.764912248E12, 4.0], [1.764912247E12, 1.0], [1.764912249E12, 4.0], [1.76491225E12, 1.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.764912252E12, 6.0], [1.764912251E12, 3.0], [1.764912253E12, 3.0], [1.764912254E12, 3.0], [1.764912245E12, 57.0], [1.764912255E12, 5.0], [1.764912246E12, 67.0], [1.764912248E12, 35.0], [1.764912247E12, 17.0], [1.764912249E12, 28.0], [1.76491225E12, 11.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.764912255E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 3.0, "minX": 491.0, "maxY": 134.0, "series": [{"data": [[2137.0, 67.0], [2087.0, 17.0], [2094.0, 28.0], [2056.0, 3.0], [2281.0, 35.0], [2282.0, 11.0], [1659.0, 5.0], [491.0, 57.0], [1963.0, 4.0], [1987.0, 3.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[491.0, 134.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 2282.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 3.0, "minX": 491.0, "maxY": 134.0, "series": [{"data": [[2137.0, 67.0], [2087.0, 17.0], [2094.0, 28.0], [2056.0, 3.0], [2281.0, 35.0], [2282.0, 11.0], [1659.0, 5.0], [491.0, 57.0], [1963.0, 4.0], [1987.0, 3.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[491.0, 134.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 2282.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 599.0, "minX": 1.764912245E12, "maxY": 2309.0, "series": [{"data": [[1.764912252E12, 1971.0], [1.764912251E12, 1990.0], [1.764912253E12, 2045.0], [1.764912254E12, 1970.0], [1.764912245E12, 599.0], [1.764912255E12, 1646.0], [1.764912246E12, 2178.0], [1.764912248E12, 2309.0], [1.764912247E12, 1986.0], [1.764912249E12, 2078.0], [1.76491225E12, 2228.0]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.764912255E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 46.0, "minX": 1.764912245E12, "maxY": 2282.0, "series": [{"data": [[1.764912252E12, 1963.0], [1.764912251E12, 1987.0], [1.764912253E12, 2056.0], [1.764912254E12, 1963.0], [1.764912245E12, 445.0], [1.764912255E12, 1659.0], [1.764912246E12, 2137.0], [1.764912248E12, 2281.0], [1.764912247E12, 2087.0], [1.764912249E12, 2094.0], [1.76491225E12, 2282.0]], "isOverall": false, "label": "200", "isController": false}, {"data": [[1.764912245E12, 46.0]], "isOverall": false, "label": "500", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.764912255E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 46.0, "minX": 1.764912245E12, "maxY": 2282.0, "series": [{"data": [[1.764912245E12, 46.0]], "isOverall": false, "label": "Products-failure", "isController": false}, {"data": [[1.764912252E12, 1963.0], [1.764912251E12, 1987.0], [1.764912253E12, 2056.0], [1.764912254E12, 1963.0], [1.764912245E12, 445.0], [1.764912255E12, 1659.0], [1.764912246E12, 2137.0], [1.764912248E12, 2281.0], [1.764912247E12, 2087.0], [1.764912249E12, 2094.0], [1.76491225E12, 2282.0]], "isOverall": false, "label": "Products-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.764912255E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 46.0, "minX": 1.764912245E12, "maxY": 2282.0, "series": [{"data": [[1.764912252E12, 1963.0], [1.764912251E12, 1987.0], [1.764912253E12, 2056.0], [1.764912254E12, 1963.0], [1.764912245E12, 445.0], [1.764912255E12, 1659.0], [1.764912246E12, 2137.0], [1.764912248E12, 2281.0], [1.764912247E12, 2087.0], [1.764912249E12, 2094.0], [1.76491225E12, 2282.0]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [[1.764912245E12, 46.0]], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.764912255E12, "title": "Total Transactions Per Second"}},
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

