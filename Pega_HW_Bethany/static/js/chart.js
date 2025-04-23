src="https://cdn.jsdelivr.net/npm/chart.js"
function chartRadar(aspect,company_name,data_list){
    var ctx = null;  //創建物件存取ESG放置chart的div
    var aspect_label = [];

    if(aspect == 'E'){
        //刷新E的chart
        document.getElementById('chartRadarE').remove();  //刪除原有的cavans
        document.getElementById('chartRadarE_div').innerHTML = '<canvas id="chartRadarE" style="height:30vh;"></canvas>';  //新增新的cavans

        ctx = document.getElementById('chartRadarE');
        aspect_label = [
          'Emission of greenhouse gases',
          'Energy management',
          'Water resources managemen',
          'Hazardous waste management',
          'Natural resources protection'
        ];
    }
    else if(aspect == 'S'){
        //刷新E的chart
        document.getElementById('chartRadarS').remove();
        document.getElementById('chartRadarS_div').innerHTML = '<canvas id="chartRadarS" style="height:30vh;"></canvas>';

        ctx = document.getElementById('chartRadarS');
        aspect_label = [
          'Human development',
          'Information security protection',
          'Employee health and safety',
          'Product safety'
        ];
    }
    else if(aspect == 'G'){
        //刷新E的chart
        document.getElementById('chartRadarG').remove();
        document.getElementById('chartRadarG_div').innerHTML = '<canvas id="chartRadarG" style="height:30vh;"></canvas>';

        ctx = document.getElementById('chartRadarG');
        aspect_label = [
          'Board of Directors',
          'Investor communication',
          'Risk and crisis management'
        ];
    }
    else{
        console.log('Aspect Error!')
    }
    //以上判斷要更動的div和內容

    data = {
      labels: aspect_label, //雷達圖的小標們,
      datasets: [{
          label: company_name,
          data: data_list,
          fill: false,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)'}
      // , {
      //     label: '公司名稱',
      //     data: [數據陣列],
      //     fill: 是否要填滿線內(True/False),
      //     backgroundColor: 'rgba(54, 162, 235, 0.2)', //被景色
      //     borderColor: 'rgb(54, 162, 235)', //線的顏色
      //     pointBackgroundColor: 'rgb(54, 162, 235)', //座標點的顏色
      //     pointBorderColor: '#fff', //座標邊的顏色
      //     pointHoverBackgroundColor: '#fff', //滑鼠觸碰時，點的顏色
      //     pointHoverBorderColor: 'rgb(54, 162, 235)'  //滑鼠觸碰時，點的邊的顏色
      // }
    ]};
    const config = {
        type: 'radar',  //種類:雷達圖
        data: data,  //上面定義的資料
        options: {  //圖的設定
            scales: {       //刻度控制項目
                r: {
                    min:0,
                    max:1
                }
            },
            plugins: {
                tooltip: {  //提示框的部份
                    callbacks: {
                        beforeFooter:function(tooltipItem,data){
                            var hv = [5,4,3,4,5]  //數據(最高)，之後透過API拉進來
                            return '最高:'+hv[tooltipItem[0].dataIndex];  //提示框中藥顯示的內容
                        },
                        footer:function(tooltipItem,data){
                            var av = [3,2,1,2,3]  //數據(平均)
                            return '平均:'+av[tooltipItem[0].dataIndex];
                        },
                        afterFooter: function(tooltipItem,data){
                            var lv = [2,1,0,1,2]  //數據(最低)
                            return '最低:'+lv[tooltipItem[0].dataIndex];
                        }
                    }
                }
            }
        },
            responsive: true, // 響應式(視窗變更)
            maintainAspectRatio: false,// 圖片比例固定與否
            elements: {
                line: {
                    borderWidth: 3 // 線條寬度
                }
              }
        };
    const myChart = new Chart(ctx, config);
}