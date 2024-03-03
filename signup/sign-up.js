async function onSignUp(e){
    e.preventDefault();
    var name_=document.getElementById('id1').value;
    var email_=document.getElementById('id2').value;
    var phone_=document.getElementById('id3').value;
    var password_=document.getElementById('id4').value;

    let myObj={
        name: name_,
        email: email_,
        phone: phone_,
        password: password_
    }
    if(name_!='' && email_!='' && phone_!='' && password_!=''){
        try{
            const result= await axios.get(`${API_ENDPOINT}admin/get-user/${email_}`);
            if(result.data==""){
               await axios.post(`${API_ENDPOINT}admin/insert-user`,myObj)
               alert("Signed up successfully")
               window.location.href="../login/login.html"
            }
            else{
                alert('User already exists')
            }

        }
        catch(err){
            console.log(err);
        }
    }
    else{
        alert('Please fill the empty fields!')
    }
}