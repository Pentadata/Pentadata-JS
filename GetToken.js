export const pfetch = (async (method, token, refresh_token) => {
    let _token = await getToken(token, refresh_token)
    if(_token){
        return method(_token)
    }
})

const getToken = (async (token, refreshToken) => {
    //Gets date now in seconds
    let nowInSeconds = Date.now() / 1000;

    //Parse Token
    const payload = JSON.parse(atob(token.split('.')[1]));

    //Check if token is still valid
    if (payload.exp >= nowInSeconds) {
        return (token);
    }

    //Parse refresh token
    const refresh_payload = JSON.parse(atob(refreshToken.split('.')[1]));

    //Check if token is expired
    if (refresh_payload.exp < nowInSeconds) {
        return null;
    } 
    
    //Send request using refresh token to get new token
    let response = await fetch(`https://api.pentadatainc.com/subscribers/refresh`, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${refreshToken}`
        })
    })
        .catch(error => {
            console.log("Error refreshing token", error);
        })
    let data = await response.json();
    if (data.token) {
        return (data.token);
    }

    return null;
});
