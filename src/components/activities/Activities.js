import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { getActivities } from "./ActivityProvider";

export const Activities = () => {
    const [activities, setActivities] = useState([])
    const history = useHistory()

    useEffect(
        () => {
            getActivities().then(a => setActivities(a))
        }, []
    )

    return (
        <>
            <h1>Activities</h1>

            <button onClick={() => history.push("/createactivity")}>Log Activity</button>

            {activities?.map(a => {
                return <div>
                    <Link to={`/activities/${a.id}`}>{a.name}</Link>
                </div>
            })}
        </>
    )
}