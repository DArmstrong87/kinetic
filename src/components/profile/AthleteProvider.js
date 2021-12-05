export const getAthlete = () => {
    return fetch(`http://localhost:8000/athletes`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}