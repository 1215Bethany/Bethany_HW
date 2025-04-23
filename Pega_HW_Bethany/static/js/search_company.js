src="./chart.js"
window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btn_search").addEventListener("click", function() {
        company_name = document.getElementById("company_name").value;
        //https://skfhantigreenwashinggene.azurewebsites.net //http://127.0.0.1:9010
        fetch("http://127.0.0.1:9010/CompanyEscoreData/?company_name="+company_name, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                var all_data = JSON.parse(data);
                console.log(all_data);
                //以下為E的部分的數據接取&數據計算&呼叫雷達圖
                var Escore_data = [];
                Escore_data.push(parseFloat((all_data['egg1_np'])+parseFloat(all_data['egg2_np'])+parseFloat(all_data['egg3_np']))/parseFloat(3));
                Escore_data.push(parseFloat(all_data['energy_np']));
                Escore_data.push(parseFloat(all_data['water_np']));
                Escore_data.push((parseFloat(all_data['waste1_np'])+parseFloat(all_data['waste2_np']))/parseFloat(2));
                Escore_data.push((parseFloat(all_data['natural_p'])+parseFloat(all_data['biology']))/parseFloat(2));
                console.log(Escore_data);
                chartRadar('E',company_name,Escore_data);
                //以上為E的部分的數據接取&數據計算&呼叫雷達圖

                //以下為S的部分的數據接取&數據計算&呼叫雷達圖
                var Sscore_data = [];
                Sscore_data.push(parseFloat((all_data['Avg_ben_z_np'])+parseFloat(all_data['Avg_pay1_z_np'])+parseFloat(all_data['Avg_pay2_z_np'])+parseFloat(all_data['Med_pay_z_np'])+parseFloat(all_data['wrate1_z_np'])+parseFloat(all_data['acc_rate_z_np']))/parseFloat(6));
                Sscore_data.push(parseFloat(all_data['safety_c']));
                Sscore_data.push(parseFloat(all_data['Attend_rate_z_np']));
                Sscore_data.push(parseFloat(all_data['product_c']));
                console.log(Sscore_data);
                chartRadar('S',company_name,Sscore_data);
                //以上為S的部分的數據接取&數據計算&呼叫雷達圖

                //以下為G的部分的數據接取&數據計算&呼叫雷達圖
                var Gscore_data = [];
                Gscore_data.push(parseFloat((all_data['seats_z_np'])+parseFloat(all_data['seats_ind_z_np'])+parseFloat(all_data['wrate2_z_np'])+parseFloat(all_data['Attend_rate_z_np'])+parseFloat(all_data['Study_rate_z_np'])+parseFloat(all_data['reward1_rate_z_np']))/parseFloat(6));
                Gscore_data.push(parseFloat(all_data['meet_num_z_np']));
                Gscore_data.push(parseFloat(all_data['risk']));
                console.log(Gscore_data);
                chartRadar('G',company_name,Gscore_data);
                //以上為G的部分的數據接取&數據計算&呼叫雷達圖
            })
        });
 });
