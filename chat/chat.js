const tabledata=document.getElementById('tabledata');
const token=localStorage.getItem('token');

// setInterval(() =>{
//     getChats();
// }, 5000)

window.addEventListener('DOMContentLoaded',()=>{
    getChats();
})

async function getChats(){
    tabledata.innerHTML='';
    const localmessages=JSON.parse(localStorage.getItem('messages'));
    var lastmessageid;
    if(localmessages.length>0){
        lastmessageid=localmessages[localmessages.length-1].id;
    }
    console.log(lastmessageid)
    const response=await axios.get(`${API_ENDPOINT}chat/get-messages`,{params: {lastmessageid : lastmessageid},headers:{"authorization": token}});
    console.log(response)
    const messages=[...localmessages,...response.data.messages]
    localStorage.setItem('messages',JSON.stringify(messages))
    for(var i=0;i<messages.length;i++){
        showChats(messages[i]);
    }
}

function showChats(myObj){
    var history=''
    if(myObj.typeofrequest=='1'){
        history=myObj.name+' '+myObj.chat;
    }
    else if(myObj.typeofrequest=='2'){
        history=myObj.name+' : '+myObj.chat;
    }
    var newRow=document.createElement("tr");
    var newCell=document.createElement("td");
    newCell.textContent=history;
    newRow.appendChild(newCell);
    tabledata.appendChild(newRow);
}

async function send(e){
 try{
    const chat_=document.getElementById('idk2').value;
    await axios.post(`${API_ENDPOINT}chat/insert-message`,{
        chat: chat_,
        typeofrequest: '2'
    },{headers:{"authorization": token}})
    getChats();
 }
 catch(err){
    console.log('Something went wrong ', err);
 }
}