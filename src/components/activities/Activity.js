import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getActivity } from "./ActivityProvider";

export const Activity = () => {
    const [activity, setActivity] = useState({})
    const { activityId } = useParams()
    const history = useHistory()

    useEffect(
        () => {
            getActivity(activityId).then(a => setActivity(a))
        }, []
    )

    return (
        <>
            <h1>{activity.name}</h1>
            <p>{activity.created_on}</p>

            {activity.activity_sports?.map(as => {
                return <div>
                    {as.sport.name} | {as.distance} | {as.elev_gain}
                </div>
            })}
            <button onClick={()=>history.push(`/editactivity/${activityId}`)}>Edit</button>
        </>
    )
}