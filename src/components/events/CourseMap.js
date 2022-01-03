import React from "react";

export const CourseMap = ({ event }) => {
    let url = event.course_url

    const handleCourseUrl = () => {
        try {
            const newUrl = new URL(url)
            const hostname = newUrl.hostname
            if (hostname === "ridewithgps.com") {
                if (!url.includes("embeds")) {
                    const [, routeId] = newUrl.pathname.split("/routes/")
                    url = `https://ridewithgps.com/embeds?type=route&id=${routeId}&title=${event.name}&sampleGraph=true`
                }
                const style = {
                    width: '1px',
                    minWidth: '100%',
                    height: '700px',
                    border: 'none',
                    scrolling: 'no'
                }
                return <>
                    <a href={url} target="_blank">{url}</a>
                    <iframe src={url} style={style}></iframe> </>
            }
            else if (hostname === "www.strava.com") {
                if (!url.includes('embed') && url.slice(-1) !== "/") { url = url.concat('/embed') }
                else if (!url.includes('embed') && url.slice(-1) === "/") { url = url.concat('embed') }
                const style = {
                    height: '30em',
                    width: '100%',
                    borderWidth: '0px',
                    allowtransparency: "true",
                    scrolling: 'no'
                }
                return <>
                    <a href={url} target="_blank">{url}</a>
                    <iframe src={url} style={style} title="Strava"></iframe>

                </>
            }
            else if (hostname === "www.ironman.com") {
                const [, split] = newUrl.pathname.split("/")
                const [, event] = split.split("im")
                const [, state] = event.split("-")
                if (url.includes("703")) {
                    url = `https://app.rtrt.me/IRM-${state}703-2019?oe=1&embed=1&module=staticmap&purl=${url}&rf=${url}&loadpage=%2Ftracker&event=IRM-${state}703-2019`
                } else { url = `https://app.rtrt.me/IRM-${state}-2019?oe=1&embed=1&module=staticmap&purl=${url}&rf=${url}&loadpage=%2Ftracker&event=IRM-${state}-2019` }
                const style = {
                    height: '30em',
                    width: '100%',
                    borderWidth: '0px',
                    allowtransparency: "true",
                    scrolling: 'no'
                }
                return <><iframe src={url} style={style} title="Iron Man"></iframe><a href={url} target="_blank">{url}</a></>
            }
            else { return <><a href={url} target="_blank">{url}</a></> }
        }
        catch (_) {
            return <a href={url} target="_blank">{url}</a>
        }
    }

    const courseWidget = handleCourseUrl()

    return (
        <>
            {courseWidget}
        </>
    )
}