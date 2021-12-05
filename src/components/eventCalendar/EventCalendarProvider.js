export const getAthleteEvents = () => {
    return fetch("http://localhost:8000/athleteevents", {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}