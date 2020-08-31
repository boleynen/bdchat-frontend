const base_url = "https://bd-chat.herokuapp.com";

let sendMsgBtn = document.querySelector("#send-message");
let input = document.querySelector(".chatbox__input");

let message = input.value;

let chatbox = document.querySelector(".chatbox__output");

let username = localStorage.getItem('username')
let token = localStorage.getItem('token')



// GET CHAT MESSAGES ------------------------------------------------------------------------
   // FETCH CURRENT USER TO GET CORRECT DATE
   const getChats = 
    fetch(base_url + "/account/user/"+token, {
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then(result => {
            return result.json();
    }).then(date => {
        let finalDate = date.substring(0,10);
        // FETCH ALL CHAT MESSAGES FROM USERS WITH SAME BIRTHDAY
        fetch(base_url + `/api/v1/chat/${finalDate}`, {
            'headers': {
                'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(result => {
            return result.json();
        }).then(json =>{
            // INSERT INTO HTML
            if(json.status === "success"){
                let chatMessage = json.data.chat
                chatMessage.forEach(chat => {
                    // IF I SEND THIS MESSAGE, GIVE THIS CLASS
                    if(chat.user === username){
                        let chatMsg = 
                        `<li class="chatbox__output-send message">
                            <div>
                                <p class="user">${chat.user}</p>
                                <p class="textmessage bold">${chat.message}</p>
                            </div>
                        </li>`
                        chatbox.insertAdjacentHTML("beforeend", chatMsg);
                    // IF I RECEIVED THIS MESSAGE, GIVE THAT CLASS
                    }else{
                        let chatMsg = 
                        `<li class="chatbox__output-received message">
                            <div>
                                <p class="user">${chat.user}</p>
                                <p class="textmessage bold">${chat.message}</p>
                            </div>
                        </li>`
                        chatbox.insertAdjacentHTML("beforeend", chatMsg);
                    }

                });
            }

            if(json.status === "error"){
                console.log(json.message);
            }
        })

    }).catch(err => {
            console.log(err);
    });


// POST CHAT MESSAGES ------------------------------------------------------------------------

let appendChat = (json) => {
    let chatMsg = ` <li class="chatbox__output-send message">
                        <div>
                            <p class="user">${json.data.chat.user}</p>
                            <p class="textmessage bold">${json.data.chat.message}</p>
                        </div>
                    </li>`;   
    chatbox.insertAdjacentHTML("beforeend", chatMsg);

}
 

// FETCH IF CLICKED ON BUTTON
    const postChats = 
    sendMsgBtn.addEventListener("click", function(e){
        e.preventDefault();
        fetch(base_url + "/api/v1/chat", {
            method: "post",
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                "message": input.value
            })  
        }).then(result =>{
            return result.json();
        }).then(json =>{

            // INSERT INTO HTML WITH appendChat()
            if(json.status === "success"){
                input.value="";
                input.focus();

                primus.write({
                    "action": "chatmessage",
                    "data": json
                })

                appendChat(json);

            }if(json.status === "error"){
                console.log(json.message);
            }
        }).catch(error => {
            console.log("Error: ", error);
            alert(error);

        })
    });

          // PRIMUS LIVE 
          let primus = Primus.connect(base_url, {
            reconnect: {
            max: Infinity,
            min: 500,
            retries: 10
            }
        });
    

    Promise.all([getChats, postChats]).then((values) => {
        // console.log(values)
    })
