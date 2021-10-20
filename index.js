try {
    
const {Telegraf, Extra, Markup} = require("telegraf");
const token = "1840796662:AAHeCquOT3iDWQt_2ObHzXVZmbX4MAIRXkg"
const bot = new Telegraf(token);
const jfs = require("jsonfile")
let data = {
userData :[],
vakansiya:[{vakName:"sotuvchi", vakDescription: "Sotuvchilik qilish"}],
admin:"926249139",
}
try {
    data = jfs.readFileSync("data/data.json");

} catch (error) {
   
}
let homeButton = Extra.markup(Markup.keyboard(["Vakansiyalar", "Biz haqimizda"], {columns:2}).resize(true).oneTime(true)); 
let ed = false;
bot.start(msg=>{
f = false;
ed = false;
if (msg.chat.id==data.admin){
msg.replyWithHTML("<b>Admin panelga Xush kelibsiz!</b>", Extra.markup(Markup.inlineKeyboard([{
    text:"Vakansiyalarni sozlash", callback_data:"vak"
},
{text:"Bot statistikasi", callback_data:"botInfo"}
])))
return;
}

if (data.userData.find(({id})=>id==msg.chat.id)){
    data.userData.find(({id})=>id==msg.chat.id).status = ""
    msg.replyWithHTML(`<b>Assalomu alaykum ${msg.chat.first_name}. Botimizga qayta tashrif buyurganingizdan minnatdormiz!</b>. \nMenyuni tanlang`, homeButton)

} else{

    msg.replyWithHTML(`<b>Assalomu alaykum ${msg.chat.first_name}. Botimizga Hush kelibsiz!</b>. \nMenyuni tanlang`, homeButton)
    data.userData.push({id: msg.chat.id, username:msg.chat.username})
}

})


let f = false;
bot.hears("Vakansiyalar", msg=>{
let d = []
    data.vakansiya.map(e=>{
d.push(e.vakName);
})
msg.replyWithHTML("<b>Vakansiyalar bilan tanishing:</b>", Extra.markup(Markup.keyboard(d, {columns:3}).oneTime(true).resize(true)));
f = true;
delete d;



});

bot.on(["text", "contact", "photo"], async(msg)=>{
if (ed&&ind!=-1&&msg.message.text.indexOf("-")!=-1){
data.vakansiya[ind].vakName =msg.message.text.split("-")[0].toString() ;
data.vakansiya[ind].vakDescription =msg.message.text.split("-")[1].toString() ;
ed = false;
ind = false;
msg.replyWithHTML("Vakansiya bazaga kiritildi!");
msg.replyWithHTML("<b>Admin panelga Xush kelibsiz!</b>", Extra.markup(Markup.inlineKeyboard([{
    text:"Vakansiyalarni sozlash", callback_data:"vak"
},
{text:"Bot statistikasi", callback_data:"botInfo"}
])));
jfs.writeFileSync("data/data.json", data, {spaces:" "})
return;
}  else{
if (ed&&msg.message.text.indexOf("-")!=-1){
data.vakansiya.push({vakName:msg.message.text.split("-")[0].toString(),vakDescription:msg.message.text.split("-")[1].toString()  });
msg.replyWithHTML("Vakansiya bazaga kiritildi!")
ed = false;
msg.replyWithHTML("<b>Admin panelga Xush kelibsiz!</b>", Extra.markup(Markup.inlineKeyboard([{
    text:"Vakansiyalarni sozlash", callback_data:"vak"
},
{text:"Bot statistikasi", callback_data:"botInfo"}
])));

jfs.writeFileSync("data/data.json", data, {spaces:" "})
return;
}
if (ed&&ind!=-1){
    msg.replyWithHTML("Noto'g'ri formatda kiritdingiz qayta kiriting!")
    return;
}

}

if (f && data.vakansiya.findIndex(({vakName})=>vakName==msg.message.text)!=-1){
    msg.replyWithHTML(`<b>Bu vakansiya haqida:\n${ data.vakansiya.find(({vakName})=>vakName==msg.message.text).vakDescription }</b>`);
msg.replyWithHTML("<b>Ism, familiya va sharifingiz: </b>");
data.userData.find(({id})=>id==msg.chat.id).status = "ism";
data.userData.find(({id})=>id==msg.chat.id).vak = msg.message.text;
f = false;
    return;
}
if (data.userData.find(({id})=>id==msg.chat.id).status!=undefined){
switch (data.userData.find(({id})=>id==msg.chat.id).status) {
    case "ism":
        data.userData.find(({id})=>id==msg.chat.id).name = msg.message.text;
        data.userData.find(({id})=>id==msg.chat.id).status = "wasBorn";
        msg.replyWithHTML("<b>Tug'ulgan kuningiz, oyingiz, yilingiz: </b>");
return;
        break;
case "wasBorn":
    data.userData.find(({id})=>id==msg.chat.id).wasBorn = msg.message.text;
    data.userData.find(({id})=>id==msg.chat.id).status = "tgNumber";
    msg.replyWithHTML("<b>Telegram raqamingizni yuboring: </b>", Extra.markup(Markup.keyboard([{text:"Nomerni yuborish", request_contact: true}]).oneTime(true).resize(true) ));
return;
break;
case "tgNumber":
    data.userData.find(({id})=>id==msg.chat.id).tgNumber = msg.message.contact.phone_number;
    data.userData.find(({id})=>id==msg.chat.id).status = "photo";
    msg.replyWithHTML("<b>Rasmingizni yuboring:</b>");
return;
break;
case "photo":
    data.userData.find(({id})=>id==msg.chat.id).photo = await msg.message.photo[0].file_id;
    data.userData.find(({id})=>id==msg.chat.id).status = "oldJob";
    msg.replyWithHTML("<b>Bundan oldin qanday ishda, qancha muddat davomida va qancha oylikka ishlagansiz?</b>");
return;
break;

case "oldJob":
    data.userData.find(({id})=>id==msg.chat.id).oldJob = msg.message.text;
    data.userData.find(({id})=>id==msg.chat.id).status = "workExp";
    msg.replyWithHTML("<b>Ish tajribangiz(qaysi sohada va necha yil): </b>");
return;
break;
case "workExp":
    data.userData.find(({id})=>id==msg.chat.id).workExp = msg.message.text;
    data.userData.find(({id})=>id==msg.chat.id).status = "opinion";
    msg.replyWithHTML("<b>Siz qaror qabul qilishda o'zingizning fikringizga tayanasizmi? </b>", Extra.markup(Markup.keyboard(["Ha", "Yo'q"],{columns:2}).resize(true).oneTime(true)));
return;
break;
case "opinion":
    data.userData.find(({id})=>id==msg.chat.id).opinion = msg.message.text;
    data.userData.find(({id})=>id==msg.chat.id).status = "";
    msg.replyWithHTML("<b>So'rovnomani to'ldirganingizdan minnatdormiz. Tez orada siz bilan bog'lanamiz!</b>");
try {
    jfs.writeFileSync("data/data.json", data, {spaces:true});
} catch (error) {
    msg.replyWithHTML("Nosozlik. Ma'lumotlaringiz qabul qilinmadi. Qayta so'rovnomadan o'ting.")
    data.userData.splice(data.userData.findIndex(({id})=>id==msg.chat.id), 1);
    data.userData.push({id: msg.chat.id, username: msg.chat.username});
return;

}
    
let rt = data.userData.find(({id})=>id==msg.chat.id);

msg.tg.sendPhoto(data.admin,rt.photo, Extra.caption(`Vakant:
<b>Tanlagan Vakansiyasi: ${rt.vak};
Ismi: ${rt.name};
Tavallud topgan yili: ${rt.wasBorn};
UserName: @${rt.username||"UserName yo'q"};
Telegram raqami: ${rt.tgNumber};
Oldin ishlagan kasbi haqida: ${rt.oldJob};
Ish tajribasi: ${rt.workExp};
O'zi qaror qabul qiladimi? : ${rt.opinion};
Rasmi: tepada;
</b>
`).HTML(true) )

return;
break;




    default:
        break;
}

}

});




bot.action("vak", msg=>{
let key =  [];
data.vakansiya.map(e=>{
    key.push({text: e.vakName, callback_data: e.vakName})
})
    msg.replyWithHTML("Kerakli vakansiyani tanlang.\nVakansiya qo'shmoqchi bo'lsangiz quyidagi formatdan yuboring:\nVakansiya nomi-Vakansiya haqida qisqacha izoh", Extra.markup(Markup.inlineKeyboard(key, {columns:3}).resize(true)))
ed = true;
})
let btn = Extra.markup(Markup.inlineKeyboard([
    {text: "Vakansiyani tahrirlash", callback_data:"vakEdit"}
]))
let ind = -1;
bot.action(data.vakansiya.map(e=>{return e.vakName}), msg=>{

msg.replyWithHTML(`<b>Vakansiya nomi: ${data.vakansiya.find(({vakName})=>vakName==msg.callbackQuery.data).vakName};
Vakansiyaga izoh: ${data.vakansiya.find(({vakName})=>vakName==msg.callbackQuery.data).vakDescription}
</b>`, btn)
ind = data.vakansiya.findIndex(({vakName})=>vakName==msg.callbackQuery.data)
});

bot.action("vakEdit", msg=>{
    msg.replyWithHTML("Vakansiyani tahrirlash uchun quyidagi formatdan yuboring:\nVakansiya nomi-Vakansiya haqida qisqacha izoh")
ed = true;
}) 


bot.action("botInfo", msg=>{
    msg.replyWithHTML(`Bot haqida:
ID: ${msg.botInfo.id}
Bot nomi: ${msg.botInfo.first_name};
UserName: ${msg.botInfo.username};
Bot Foydalanuvchilari: ${data.userData.length} ta.
Botdagi vakansiyalar soni: ${data.vakansiya.length} ta.`)
})

bot.launch({polling:true})


} catch (error) {
    
}