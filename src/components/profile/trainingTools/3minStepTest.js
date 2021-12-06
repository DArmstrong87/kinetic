import React from "react"

export const QC3minStep = ({ a, setVo2max, setResults, results }) => {

    const setResult = (e) => {
        const result = { ...results }
        result[e.target.name] = parseInt(e.target.value)
        setResults(result)
    }

    const getVO2 = () => {
        // VO2max 132.853 - (0.0769 * weight(lbs)) - (0.3877 * age) + (6.315 * gender factor) - (3.2649 * time to complete 1min walk) - (0.1565 * 10s hr)
        const hr = results.hr * 4
        let vo2max = 0
        if (a.sex === "M") { vo2max = 111.33 - (0.42 * hr) }
        else { vo2max = 65.81 - (0.1847 * hr) }

        setVo2max(Math.ceil(vo2max))
    }

    return (
        <>
            <h3>Queen's College Step Test</h3>
            <div>
                Time to complete: 3 minutes
            </div>
            <div>
                Equipment: Stopwatch, 16.25in / 41.3cm step, Metronome
            </div>
            <div>
                Validation: <a href="https://pubmed.ncbi.nlm.nih.gov/4648576/">Reliability and interrelationships between maximal oxygen intake, physical work capacity and step-test scores in college women</a>
            </div>

            <h4>Directions</h4>
            <ol>
                <li>Set metronome to 
                    {a.sex === "M" ? " 96bpm" : " 88bpm"}</li>
                <li>Set timer for 3 minutes</li>
                <li>Start timer and start stepping!</li>
                <li>Step up onto box matching the beat of the metronome:
                    <ol>
                        <li>Left leg up</li>
                        <li>Right leg up</li>
                        <li>Left leg down</li>
                        <li>Right leg down</li>
                    </ol>
                </li>
                <li>When timer ends, stop for 5 seconds</li>
                <li>Count heart rate for 15 seconds and record</li>
            </ol>

            <fieldset>
                <label htmlFor="hr">15s Heart Rate </label>
                <input name="hr" value={results.hr} type="number" onChange={setResult} />
            </fieldset>

            <div>
                <button onClick={getVO2}>
                    Calculate
                </button>
                <button onClick={() => {
                    setResults({ hr: "", min: "", sec: "" });
                    setVo2max("")
                }}>
                    Reset</button>
            </div>

        </>
    )
}