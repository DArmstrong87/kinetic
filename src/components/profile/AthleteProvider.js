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
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json"
        },
        method: "PATCH",
        body: JSON.stringify(obj)
    })
}