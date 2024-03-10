const tabledata=document.getElementById('tabledata');
const token=localStorage.getItem('token');
const grouptoken=localStorage.getItem('grouptoken')
const groupname=localStorage.getItem('groupname')
const invitebutton=document.getElementById('invite');
const groupheading=document.getElementById('grpname')
let isAdmin=false;

groupheading.textContent=groupname
// setInterval(() =>{
//     getChats();
// }, 5000)

window.addEventListener('DOMContentLoaded',async ()=>{
    const response=await axios.get(`${API_ENDPOINT}group/isgroupadmin`,{headers:{"authorization": token,"groupauthorize": grouptoken}});
    if(response.data.isAdmin){
        invitebutton.style.display='block';
        groupheading.classList.add('member-left-margin')
        isAdmin=true;
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
    if(myObj.typeofrequest=='1' || myObj.typeofrequest=='3'){
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

document.getElementById('showMembersButton').addEventListener('click', function(e) {
    e.preventDefault();
    showGroupMembers();
});

async function showGroupMembers() {
    try {
        const response = await axios.get(`${API_ENDPOINT}group/members`,{headers:{"authorization": token,"groupauthorize": grouptoken}});
        console.log(response)
        let membersList = document.getElementById('membersList');

        membersList.innerHTML = '';

        response.data.members.forEach(member => {
            let listItem = document.createElement('div');
            listItem.classList.add('member-item', 'd-flex', 'justify-content-between', 'align-items-center');

            let memberInfo = document.createElement('span');
            memberInfo.textContent = member.name + ' ' + member.phone + (member.isAdmin ? ' (Admin)' : '');
            listItem.appendChild(memberInfo);

            if(isAdmin){
                let buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('d-inline-flex');
                if(!member.isAdmin){
                    let makeAdminButton = document.createElement('button');
                    makeAdminButton.textContent = 'Make Admin';
                    makeAdminButton.classList.add('btn-sm', 'btn-info', 'make-admin-button','mr-10');
                    makeAdminButton.addEventListener('click', ()=>{
                        makeAdmin(member.id,member.name);
                    });
                    buttonsContainer.appendChild(makeAdminButton);                    
                }
                if (!member.isCurrUser) {
                    let removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.classList.add('btn-sm', 'btn-primary', 'remove-button');
                    removeButton.addEventListener('click', ()=>{
                        removeMember(member.id,member.name)
                    });
                    buttonsContainer.appendChild(removeButton);
                }
                listItem.appendChild(buttonsContainer);
            }

            membersList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching group members:', error);
    }
}

async function removeMember(userid,name){
    try{
        let myObj={
            id: userid,
            name: name
        }
        console.log(myObj)
        if(confirm(`Are you sure to remove ${name}?`)){
            const response=await axios.post(`${API_ENDPOINT}group/removemember`,myObj,{headers:{"authorization": token,"groupauthorize": grouptoken}})
            showGroupMembers();
            getChats();
            alert(response.data.message)
        }
    }
    catch(err){
        console.log('Something went wrong ', err);
    }     
}

async function makeAdmin(userid,name){
    try{
        let myObj={
            id: userid,
            name: name
        }
        // console.log(myObj)
        if(confirm(`Are you sure to make ${name} admin?`)){
            const response=await axios.post(`${API_ENDPOINT}group/makeadmin`,myObj,{headers:{"authorization": token,"groupauthorize": grouptoken}})
            showGroupMembers();
            alert(response.data.message)
        }
    }
    catch(err){
        console.log('Something went wrong ', err);
    }     
}

document.getElementById('exitGroupLink').addEventListener('click', function(e) {
    e.preventDefault();
    exitGroup();
});

async function exitGroup() {
    try {
        if(confirm('Are you sure to leave the group?')){
            const response = await axios.post(`${API_ENDPOINT}group/exit`, {}, { headers: { "authorization": token, "groupauthorize": grouptoken }}); 
            alert(response.data.message);
            window.location.href='../groups/groups.html'            
        }

    } catch (error) {
        console.error('Error exiting group:', error);
    }
}