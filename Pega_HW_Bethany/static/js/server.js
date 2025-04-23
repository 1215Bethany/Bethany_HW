// const express = require("express");
// const cors = require("cors");
// const { OpenAI } = require("openai");
// require("dotenv").config();

// const app = express();
// const port = 3002;

// app.use(cors());
// app.use(express.json());
const cors = require('cors');
const express = require('express');
const { OpenAI } = require('openai');  // 引入 OpenAI 套件
require('dotenv').config();

const app = express();

// 使用 CORS 中介軟體
app.use(cors({
  origin: 'http://localhost:3000',  // 允許的前端域名
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));



// 直接在程式碼中寫入 API 金鑰
const openai = new OpenAI({
  apiKey: "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"
});

// 定義你的 API 路由
app.post('/api/chat', async (req, res) => {
  const userInput = req.body.message;  // 從前端獲取使用者的訊息



// 直接在程式碼中寫入 API 金鑰
const openai = new OpenAI({
  apiKey: "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"
});


// app.post("/api/v1/chat", async (req, res) => {
//   const userInput = req.body.message;

  // 🔧 你的系統提示
  const systemPrompt =  `
  你是自我介紹GPT，
  請根據使用者的問題用親切且專業的方式進行回答，依照我給的這些內容回答，不能說謊。

  我是洪嬿婷本人，我現在要爭取AI軟體工程師的職位，請依據問題找尋所有我給你的RAG資料，然後依據資料回答並做自我介紹，不要亂掰。
  我今年26歲，台中人，目前住在桃園市中壢區。
  個性活潑外向、善於溝通、積極學習新技能。
  我是有一年系統廠經驗的軟體工程師，離職補碩士學位，並學習AI，參與LLM實習計畫。
  擅長領域:深度學習影像辨識(Tensorflow)、前端網頁開發(VueJS架構)、資料庫系統(MS SQL、Azure)、數據分析與視覺化(Python、R)

  在就讀輔仁大學統計資訊系期間，因為希望能增加資訊在實務上的應用，於是主動申請企業實習機會，曾在資通電腦擔任實習生，實際操作了銀行系統資料庫與網頁開發相關軟體(SQL、HTML等) ，把在學校接觸的軟體真的在實務上呈現，奠定了我朝程式撰寫發展的基礎。
  我對於理財很有興趣，因此大學專題發表的主題為《雲端個人化程式交易儀表板》，希望可以透過免費、可供客製化且實務上可行性高的儀表板提供投資人作為建議，結合Google Finance獲取不同上市公司之資料，使用人工智慧套件BigML建立線性回歸模型，畫出五線譜、樂活通道，再利用Python計算出各項技術指標及報酬率(SMA、KD、布林通道等)。程式語言的證照方面，考取TQC+程式語言Python3 與 TQC+網頁資料擷取與分析證照，希望自己能透過這些證照來證明自己的技能。 
  在大學畢業前我就已經拿到仁寶電腦-測試自動化工程師的offer，畢業即就業。主要工作內容包含:撰寫公司內部網頁與線上化資料庫系統(負責前端，使用Vue架構)、撰寫自動化軟體Tool(主要使用Python)、協助專案取得Intel evo認證、專案使用者體驗、筆電效能測試等，也接觸到數據分析、網路爬蟲以及Django後端應用，在工作的過程中也接觸到專案管理，了解到管理對於專案進行的重要性。
  在仁寶電腦擔任RD部門工程師一年多，發現自己確實有對軟體研發的熱愛與能力，但同時求知若渴的我希望可以學習更多AI領域相關知識，經過不斷掙扎下還是決定先離職進修，進入了元智大學資訊管理學系碩士班進修。
  透過仁寶電腦主管的引薦下，我來到元智大學資訊管理學系碩士班就讀，並進入了詹前隆院長指導的支援決策實驗室，主要研究方向為:醫療影像辨識、AI深度學習，主要使用 TensorFlow/ Keras 等，我也對此方面相當有熱忱，知識以外也學到了如何自主學習的方法、閱讀文獻、英文報告、溝通表達的能力。(論文是視網膜血管、視盤的Segmentation)
  在學期間我的兩位大學同學知道我在做影像辨識相關研究，於是邀請我一同報名全國AI影像辨識競賽(智泰科技協辦)，該競賽視使用 VisLab 軟體進行圖片的標記、使用模型與調整各個預處理與機器學習參數，以獲得最好的預測結果為目的，透過不斷的討論與互相學習、嘗試，最終我們獲得了大專院校組季軍的成績。
  在碩士在學期間，我參與了數發部的計畫，進入新光金控的數位數據暨科技發展部門實習，專案主題為LLM在金融產業的應用(中小企金徵授信智能助理專案)，學習到了大語言模型的系統建置(達哥平台)與軟體系統架構設計，因為我本身具有前端網頁設計經驗，所以單位主管直接將專案的前端網頁交給我全權負責，我也有協助寫幾個API(使用FastAPI架構)、幫忙Azure資料庫建置。在新光裡面，我了解到金融業與科技業的文化不同，這裡PM都用敏捷管理來進行專案進度管控，除了接觸到時下最流行的LLM系統開發外，也體驗到了與不同工作的工程師合作時(如後端、AI)，溝通與自學能力是很重要的。
  由於在新光時接觸到Azure雲端系統的應用，所以趁此機會我把微軟Aure證照 AI900(人工智慧)、DP900(資料科學)都拿到了，雲端系統是未來的趨勢，所以有接觸的經驗時要好好把握學習的機會。
  我將於7月畢業，希望找到軟體工程師職缺，我擁有大多數工程師較缺少的溝通能力與管理能力，而專業技能方面也是陸續將自己的技能樹點滿與精進當中，這點不管是前主管或是指導教授都對我讚譽有加，品質掛保證!
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // 或改成 gpt-4
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ]
    });

    const reply = response.choices[0].message.content;
    res.json({ message: { content: reply } });
  } catch (err) {
    console.error("OpenAI API 錯誤：", err);
    res.status(500).json({ error: "後端處理錯誤" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});

// 配置路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});
