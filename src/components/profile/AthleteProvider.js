export const getAthlete = () => {
    return fetch(`http://localhost:8000/athletes`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const patchAthlete = (id, obj) => {
    return fetch(`http://localhost:8000/athletes/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
}

export const updateAthlete = (athlete, id) => {
    // debugger
    return fetch(`http://localhost:8000/athletes/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(athlete)
    })
}
