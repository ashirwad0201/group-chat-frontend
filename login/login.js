async function onLogin(e){
    try{
        e.preventDefault();
        var email_=document.getElementById('idx1').value;
        var password_=document.getElementById('idx2').value;
       
        let myObj={
            email: email_,
            password: password_
        };
        if(email_!='' && password_!='' ){
            const res= await axios.post(`${API_ENDPOINT}admin/login-user`,myObj)
                alert(res.data.message)
                localStorage.setItem('token', res.data.token)
                const token=localStorage.getItem('token');
                await axios.post(`${API_ENDPOINT}chat/insert-message`,{
                    chat: 'joined',
                    typeofrequest: '1'
                },{headers:{"authorization": token}})
                window.location.href="../chat/chat.html"               
        }
        else{
            alert('Please fill the empty fields!') 
        }
    }
    catch(err){
      console.log('Something went wrong',err)
      alert(err.response.data.message)
    }     
}