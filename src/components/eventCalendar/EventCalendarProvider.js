export const getAthleteEvents = () => {
    return fetch("http://localhost:8000/athleteevents", {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const deleteEvent = (id) => {
    return fetch(`http://localhost:8000/events/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        },
        method: "DELETE"
    })
}

export const getOrganizerEvents = () => {
    return fetch("http://localhost:8000/organizerevents", {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}