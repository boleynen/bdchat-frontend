const base_url = "https://bd-chat.herokuapp.com";

let btnLogin= document.querySelector("#btn-login");

if(btnLogin){
    btnLogin.addEventListener("click", function(e){

        e.preventDefault(); 

        let username    = document.querySelector(".input-login-user").value;
        let password    = document.querySelector(".input-login-pass").value;

        fetch(base_url + '/account/login', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Methods': 'Content-Type'
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then(response => {
            return response.json();
        }).then(json => {
            if(json.status === "success"){
                let token = json.data.token;

                localStorage.setItem("token", token);
                localStorage.setItem("username", username);

                window.location.href = "index.html";
                
            }else{
                alert("Login failed .. 😥😥");
            }
        }).catch(error => {
            console.log("Error: ", error);
            alert(error);

        })
    })
}
