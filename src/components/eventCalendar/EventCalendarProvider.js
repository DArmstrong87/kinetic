export const getAthleteEvents = () => {
    return fetch("https://kinetic--server.herokuapp.com/athleteevents", {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}
export const getPastAthleteEvents = () => {
    return fetch("https://kinetic--server.herokuapp.com/athleteevents?past", {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const deleteEvent = (id) => {
    return fetch(`https://kinetic--server.herokuapp.com/events/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        },
        method: "DELETE"
    })
}

export const getOrganizerEvents = () => {
    return fetch("https://kinetic--server.herokuapp.com/organizerevents", {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const getPastOrganizerEvents = () => {
    return fetch("https://kinetic--server.herokuapp.com/organizerevents?past", {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}