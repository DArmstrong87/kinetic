export const getEvents = () => {
    return fetch("http://localhost:8000/events", {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const getOrganizerEvents = () => {
    return fetch("http://localhost:8000/organizerevents", {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const getEvent = (id) => {
    return fetch(`http://localhost:8000/events/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const getAthleteEvent = (id) => {
    return fetch(`http://localhost:8000/athleteevents/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const signUp = (id) => {
    return fetch(`http://localhost:8000/events/${id}/signup`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        },
        method: "POST"
    })
        .then(res => res.json())
}

export const leaveEvent = (id) => {
    return fetch(`http://localhost:8000/events/${id}/signup`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        },
        method: "DELETE"
    })
        .then(res => res.json())
}

export const getSports = () => {
    return fetch(`http://localhost:8000/sports`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())

}

export const createEvent = (event) => {
    return fetch(`http://localhost:8000/events`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "POST",
        body: JSON.stringify(event)
    })
}

export const createEventSport = (es) => {
    return fetch(`http://localhost:8000/eventsports`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "POST",
        body: JSON.stringify(es)
    })
}