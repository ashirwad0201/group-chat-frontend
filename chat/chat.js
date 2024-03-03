const tabledata=document.getElementById('tabledata');
const token=localStorage.getItem('token');

window.addEventListener('DOMContentLoaded',()=>{
    getChats();
})

async function getChats(){
    tabledata.innerHTML='';
    const response=await axios.get(`${API_ENDPOINT}chat/get-messages`,{headers:{"authorization": token}});
    console.log(response)
    for(var i=0;i<response.data.messages.length;i++){
        showChats(response.data.messages[i]);
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