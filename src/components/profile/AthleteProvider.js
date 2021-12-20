export const getAthlete = () => {
    return fetch(`https://kinetic--server.herokuapp.com/athletes`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const patchAthlete = (id, obj) => {
    return fetch(`https://kinetic--server.herokuapp.com/athletes/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
}

export const updateAthlete = (athlete, id) => {
    return fetch(`https://kinetic--server.herokuapp.com/athletes/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(athlete)
    })
}
