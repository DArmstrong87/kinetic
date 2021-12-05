import React from "react";

export const CourseMap = ({ event }) => {
    // const url = event.course_url
    const url = "https://www.strava.com/activities/6064408236/embed/1061e2a9f10fa3f505997d7cb495d372bd07a9c5"

    const handleCourseUrl = () => {
        const [, path] = url.split("//")
        const [domain,] = path.split("/")
        if (domain === "ridewithgps.com") {
            const style = {
                height: '30em',
                width: '50%',
                borderWidth: '0px'
            }
            return <iframe src={url} style={style}></iframe>
        }
        else if (domain === "www.strava.com") {
            const style = {
                height: '30em',
                width: '30em',
                borderWidth: '0px',
                allowtransparency: "true",
                scrolling: "no"
            }
            return <iframe src={url} style={style}></iframe>
        }
    }

    const courseWidget = handleCourseUrl()

    return (
        <>
            {courseWidget}
        </>
    )
}