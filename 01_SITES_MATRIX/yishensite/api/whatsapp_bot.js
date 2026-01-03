// 简化版 webhook 处理器（用于云函数 / Express）
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const SESSION = {}; // 内存态，生产可换 Redis

function reply(to, text){
  // 这里对接你的 WhatsApp API 提供商（如 Twilio/Cloud API）
  console.log("SEND TO:", to, text);
}

app.post("/wa/webhook", (req,res)=>{
  const from = req.body.from;
  const msg = (req.body.text || "").trim();
  SESSION[from] = SESSION[from] || { step: 0, data: {} };
  const s = SESSION[from];

  if(s.step === 0){
    reply(from, "Welcome! What product are you looking for? (Office Chair / Gaming Chair / Standing Desk / Sofa)");
    s.step = 1;
  } else if(s.step === 1){
    s.data.product = msg;
    reply(from, "Quantity?");
    s.step = 2;
  } else if(s.step === 2){
    s.data.qty = msg;
    reply(from, "Delivery country?");
    s.step = 3;
  } else if(s.step === 3){
    s.data.country = msg;
    reply(from, `Thanks! Your RFQ:\nProduct: ${s.data.product}\nQty: ${s.data.qty}\nCountry: ${s.data.country}\nWe will reply shortly.`);
    // 这里可以把 RFQ 推入你的 RFQ 引擎 / Notion / Email
    s.step = 0; s.data = {};
  }
  res.sendStatus(200);
});

app.listen(3000, ()=>console.log("WA Bot running"));
