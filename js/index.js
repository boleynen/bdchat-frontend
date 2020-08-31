const base_url = "https://bd-chat.herokuapp.com";

window.onload = () => {


    let username = localStorage.getItem('username')
    let token = localStorage.getItem('token')

    if(!token){
        window.location.href = 'login.html'
      }

    // FETCH CURRENT USER TO GET CORRECT DATE 
    fetch(base_url + "/account/user/"+token, {
        'headers': {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then(result => {
        return result.json();
    }).then(date => {

        // FETCH ALL USERS WITH SAME BIRTHDAY
        fetch(base_url + "/account/birthday/"+date, {
            'headers': {
                'Content-Type': 'application/json'
            }

        }).then(response => {
            return response.json();
        }).then(response => {
            // INSERT USERS INTO HTML
            let namesArr = response.data.usernames
            let ListPeopleOnline = document.querySelector(".chatbox__ul");
            let amountOfUsers = namesArr.length;

            let amountPeopleOutput = document.querySelector("#userAmount");
            let amountPeople = document.createTextNode(amountOfUsers-1);
            amountPeopleOutput.appendChild(amountPeople);

            namesArr.forEach(name => {
                if(name != username){
                    let listItem = document.createElement("li");
                    listItem.setAttribute("class", "chatbox__li");
                    let textnode = document.createTextNode(name);
                    listItem.appendChild(textnode);
                    ListPeopleOnline.appendChild(listItem);
                }

            });

            

        })
        
    }).catch(error => {
        console.log(error);
    });
}

      // PRIMUS LIVE 
      let primus = Primus.connect('http://localhost:3000', {
        reconnect: {
        max: Infinity,
        min: 500,
        retries: 10
        }
    });