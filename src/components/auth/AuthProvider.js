export const registerUser = (new_user) => {
    return fetch("https://kinetic--server.herokuapp.com/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(new_user)
    })
        .then(res => res.json())
}