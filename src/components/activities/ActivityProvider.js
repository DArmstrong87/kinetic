export const createActivity = (activity) => {
    return fetch(`https://kinetic--server.herokuapp.com/activities`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "POST",
        body: JSON.stringify(activity)
    })

}
export const updateActivity = (activity) => {
    return fetch(`https://kinetic--server.herokuapp.com/activities/${activity.id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(activity)
    })
}

export const deleteActivity = (id) => {
    return fetch(`https://kinetic--server.herokuapp.com/activities/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
        },
        method: "DELETE"
    })
}
export const deleteActivitySport = (id) => {
    return fetch(`https://kinetic--server.herokuapp.com/activitysports/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
        },
        method: "DELETE"
    })
}

export const createActivitySport = (as) => {
    return fetch(`https://kinetic--server.herokuapp.com/activitysports`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "POST",
        body: JSON.stringify(as)
    })
        .then(res => res.json())
}

export const updateActivitySport = (as) => {
    return fetch(`https://kinetic--server.herokuapp.com/activitysports/${as.id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(as)
    })
        .then(res => res.json())
}

export const getActivity = (id) => {
    return fetch(`https://kinetic--server.herokuapp.com/activities/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
        }
    })
        .then(res => res.json())
}

export const getActivities = () => {
    return fetch(`https://kinetic--server.herokuapp.com/activities`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
        }
    })
        .then(res => res.json())
}

