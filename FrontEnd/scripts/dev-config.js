let login = document.querySelector('#login-btn');
// https://aerico-ims.dev/api/search?term=${searchVal}&filter=${filter}

if (login) {
    login.addEventListener('click', async (e)=> {
        window.location.replace('./pages/ui-hub.html'); 
    });
}


let logoutButton = document.querySelector("#logout-btn");
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {

        window.location.replace('../index.html');
    });
}
// https://aerico-ims.dev/api/logout
