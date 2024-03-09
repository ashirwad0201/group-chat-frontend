const tabledata=document.getElementById('tabledata');
const token=localStorage.getItem('token');
const grouptoken=localStorage.getItem('grouptoken')
const groupname=localStorage.getItem('groupname')
const invitebutton=document.getElementById('invite');
const groupheading=document.getElementById('grpname')

groupheading.textContent=groupname
// setInterval(() =>{
//     getChats();
// }, 5000)

window.addEventListener('DOMContentLoaded',async ()=>{
    const response=await axios.get(`${API_ENDPOINT}group/isgroupadmin`,{headers:{"authorization": token,"groupauthorize": grouptoken}});
    if(response.data.isAdmin){
        invitebutton.style.display='block';
        groupheading.classList.add('member-left-margin')
    }
    getChats();
})

async function getChats(){
    tabledata.innerHTML='';
    const localmessages=JSON.parse(localStorage.getItem(groupname));
    console.log(localmessages)
    var lastmessageid;
    if(localmessages && localmessages.length>0){
        lastmessageid=localmessages[localmessages.length-1].id;
    }
    console.log(lastmessageid)
    const response=await axios.get(`${API_ENDPOINT}chat/get-messages`,{params: {lastmessageid : lastmessageid},headers:{"authorization": token,"groupauthorize": grouptoken}});
    console.log(response)
    let messages=[];
    if(localmessages){
        messages=[...localmessages,...response.data.messages]
    }
    else{
        messages=response.data.messages;
    }
    localStorage.setItem(groupname,JSON.stringify(messages))
    for(var i=0;i<messages.length;i++){
        showChats(messages[i]);
    }
}

function showChats(myObj){
    var history=''
    var newRow=document.createElement("tr");
    var newCell=document.createElement("td");
    if(myObj.typeofrequest=='1'){
        history=myObj.name+' '+myObj.chat;
        newCell.className="td-center"
    }
    else if(myObj.typeofrequest=='2'){
        history=myObj.name+' : '+myObj.chat;
        if(myObj.name=='You'){
            newCell.className="td-right"
        }
        else{
            newCell.className="td-left"
        }
    }
    newCell.textContent=history;
    newRow.appendChild(newCell);
    tabledata.appendChild(newRow);
}

async function send(e){
 try{
    e.preventDefault();
    const chat_=document.getElementById('idk2').value;
    document.getElementById('idk2').value='';
    await axios.post(`${API_ENDPOINT}chat/insert-message`,{
        chat: chat_,
        typeofrequest: '2'
    },{headers:{"authorization": token,"groupauthorize": grouptoken}})
    getChats();
 }
 catch(err){
    console.log('Something went wrong ', err);
 }
}

async function sendInvite(e){
    try{
        e.preventDefault();
        var email_=document.getElementById('idk4').value;
        let myObj={
            email: email_
        }
        if(email_!=''){
            const response=await axios.post(`${API_ENDPOINT}invite/invitemember`,myObj,{headers:{"authorization": token,"groupauthorize": grouptoken}})
            alert(response.data.message)
        }
        else{
            alert("Unable to send invite");
        }
    }
    catch(err){
        console.log('Something went wrong ', err);
    } 
}