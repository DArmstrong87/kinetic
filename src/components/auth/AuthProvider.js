export const registerUser = (new_user) => {
    return fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(new_user)
    })
        .then(res => res.json())
}