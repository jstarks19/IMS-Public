let login = document.querySelector('#login-btn');
// https://aerico-ims.dev/api/search?term=${searchVal}&filter=${filter}

if (login) {
    login.addEventListener('click', async (e)=> {
        let formData = document.querySelectorAll('#index-login-box input');
        // https://aerico-ims.dev/api/login
        const response = await fetch(`http://localhost:3000/login`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({username: formData[0].value, password: formData[1].value}), // body data type must match "Content-Type" header
        });

        const finalResp = await response;
        console.log(finalResp.status);
        const text = await finalResp.text();
        console.log(text);
        if (finalResp.status == 200) {
            
            window.location.replace('./pages/ui-hub.html');
        }
    });
}


let logoutButton = document.querySelector("#logout-btn");
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        const result = await fetch(`http:localhost:3000/logout`, {credentials: "include"});
        console.log(result);
        const finalRes = await result.text();
        console.log(finalRes);
        window.location.replace('../index.html');
    });
}
// https://aerico-ims.dev/api/logout
