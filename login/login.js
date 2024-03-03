async function onlogin(e){
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
                // window.location.href="../ExpenseTracker/expense.html"               
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