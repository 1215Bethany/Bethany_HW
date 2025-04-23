// # author : Azhe
// # github : https://github.com/LouisAzhe
// # time: 20230704

// 使用window.addEventListener("DOMContentLoaded", function() { ... })來確保程式碼在DOM完全加載後執行。這樣，當DOM完全加載後，按鈕元素就可以正確地綁定點擊事件監聽器。
window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btc").addEventListener("click", function() {
        fetch('http://127.0.0.1:9001/somedata', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {

                console.log(data); //顯印出來看看是否與API連接成功

                // d3.js 畫圖開始

                // 設定畫布大小和邊距
                const margin = { top: 20, right: 30, bottom: 30, left: 60 };
                const width = 600 - margin.left - margin.right;
                const height = 400 - margin.top - margin.bottom;

                // 創建SVG元素
                const svg = d3.select("#chart")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

                // 設定日期解析格式
                const parseDate = d3.timeParse("%Y-%m-%d");

                // 設定比例尺
                const xScale = d3.scaleTime()
                    .range([0, width])
                    .domain(d3.extent(data, d => parseDate(d.Date)));

                const yScale = d3.scaleLinear()
                    .range([height, 0])
                    .domain([0, d3.max(data, d => d.Close)]);

                // 定義折線產生器
                const line = d3.line()
                    .x(d => xScale(parseDate(d.Date)))
                    .y(d => yScale(d.Close));

                // 繪製X軸
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(xScale));

                // 繪製Y軸
                svg.append("g")
                    .call(d3.axisLeft(yScale));

                // 繪製折線圖
                svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 2)
                    .attr("d", line);
                // d3.js 結束

                const tableBody = document.querySelector("#table tbody");
                tableBody.innerHTML = "";

                data.forEach(record => {
                    const row = document.createElement("tr");

                    Object.values(record).forEach(value => {
                        const cell = document.createElement("td");
                        cell.textContent = value;
                        row.appendChild(cell);
                    });

                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error(error));
    });
});

// jquery語法
$(document).ready(function(){
    $('#btc').click(function () {
        $('#change').text('按鈕已點擊，可以看到一些圖表跟效果!');
    });
});