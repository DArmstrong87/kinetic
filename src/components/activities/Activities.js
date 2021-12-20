import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { deleteActivity, getActivities } from "./ActivityProvider";
import "./Activities.css"
import icon from "../../Infinity.gif"

export const Activities = () => {
    const [activities, setActivities] = useState([])
    const history = useHistory()
    const [deleting, setDelete] = useState(false)
    const [delId, setDelId] = useState(0)

    useEffect(
        () => {
            getActivities().then(a => setActivities(a))
        }, []
    )

    const delAct = (id) => {
        setDelete(true)
        setDelId(id)
        deleteActivity(id).then(
            setTimeout(() => getActivities().then(a => setActivities(a)), 1000)
        )
    }

    return (
        <>
            <h1 className="activities-h1">Activities</h1>
            <div className="act-stats">
                <span>Activities: {activities.length}</span>
                <span>Total Distance: {activities.reduce((accumulator, a) => { return accumulator + a.total_distance }, 0)}mi</span>
                <span>Total Elevation Gain: {activities.reduce((accumulator, a) => { return accumulator + a.total_elev_gain }, 0)}ft</span>
                <button className="log-act" onClick={() => history.push("/createactivity")}>Log Activity</button>
            </div>
            <article className="activities">

                {activities?.map(a => {
                    a.activity_sports?.sort((a, b) => {
                        if (a.sport.name > b.sport.name) { return 1 }
                        else if (a.sport.name < b.sport.name) { return -1 }
                        else return 0
                    })
                    const date = new Date(a.created_on).toDateString()
                    return <>

                        <section className="activity">
                            {deleting && delId === a.id ?
                                <div className="loading-icon">
                                    <img src={icon} /><br />
                                    <span>Deleting</span>
                                </div>
                                :
                                <div className="act-details">
                                    <h1 className="act-title">
                                        <Link to={`/activities/${a.id}`}>{a.name}</Link>
                                    </h1>
                                    <div className="act-date">{date}</div>
                                    <div className="act-dist-gain">
                                        <span>Total distance: {a.total_distance}mi</span>
                                        <span>Total elevation gain: {a.total_elev_gain}ft</span>
                                    </div>
                                    <div className="sports-table-div">
                                        {a.activity_sports.map(as => {
                                            return <>
                                                <table className="sports-table">
                                                    <tr>
                                                        <td className="td-sport" rowSpan={2}>{as.sport.name}</td>
                                                        <td>Distance</td>
                                                        <td>Elevation gain</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{as.distance}mi</td>
                                                        <td>{as.elev_gain}ft</td>
                                                    </tr>
                                                </table>
                                            </>
                                        })}
                                    </div>
                                    <div className="act-buttons">
                                        <button onClick={() => history.push(`/editactivity/${a.id}`)}>⚙️</button>
                                        <button onClick={() => delAct(a.id)}>🗑️</button>
                                    </div>
                                </div>
                            }
                        </section>
                    </>
                })}
            </article>
        </>
    )
}