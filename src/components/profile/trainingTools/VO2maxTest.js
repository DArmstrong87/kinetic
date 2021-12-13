import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getAthlete, patchAthlete } from "../AthleteProvider";
import { QC3minStep } from "./3minStepTest";
import { RFWT } from "./RFWT";
import "./VO2max.css"

export const VO2maxTest = () => {
    const [a, setA] = useState({})
    const [test, setTest] = useState("")
    const [results, setResults] = useState({sec: 0, min:0})
    const [vo2max, setVo2max] = useState("")
    const [faq, toggleFaq] = useState(false)
    const [standards, toggleStandards] = useState(false)
    const history = useHistory()

    useEffect(() => {
        getAthlete().then(a => setA(a))
    }, [])


    return (<>
        <article className="VO2-container">

            <h2>VO2 Max Tests</h2>
            <select name="vo2test" defaultValue={0} onChange={(e) => setTest(e.target.value)}>
                <option value={0} disabled>Select Test</option>
                <option value="rfwt" >Rockport Fitness Walking Test</option>
                <option value="qc" >Queen's College 3min Step Test</option>
            </select>

            {test === "rfwt" ? <RFWT a={a} setVo2max={setVo2max} setResults={setResults} results={results} />
                : test === "qc" ? <QC3minStep a={a} setVo2max={setVo2max} setResults={setResults} results={results} />
                    : ""
            }

            {vo2max !== "" ?
                <>
                    <div>
                        Results: {vo2max} ml/kg/min
                    </div>
                    <button onClick={() => {
                        patchAthlete(a.id, { VO2max: vo2max })
                            .then(response => {
                                if (response.ok) {
                                    history.push("/profile")
                                }
                            })
                    }}
                    >Save Result to Profile</button> </> : ""}

            {!faq ?
                <div onClick={() => { toggleFaq(true) }}>
                    FAQ 🔽
                </div>
                :
                <div onClick={() => { toggleFaq(false) }}>
                    FAQ 🔼
                </div>
            }

            {faq ?
                <>
                    <b>
                        What is Vo2 max?
                    </b>
                    <p>
                        Vo2 max is the maximum amount of oxygen an athlete can utilize during intense exercise, usually measured in milliliters of oxygen consumed per kg of body weight per minute.
                    </p>
                    <b>
                        Why train according to VO2 max?
                    </b>
                    <p>
                        VO2 max is a measurable value that is influenced by lifestyle and training. It is a means of quantifying exercise intensity to better optimize training. Improving VO2 max directly influences exercise performance, endurance and many health parameters such as reducing heart disease risk.
                    </p>
                    <b>
                        How accurate are the tests?
                    </b>
                    <p>
                        The gold standard is directly measuring VO2 max through lab testing. A fitness test is conducted, either running, cycling or rowing, and percentage of CO2, O2, volume of air expelled and often other values are measured. Any non-direct measure is an estimation using a formula with results from a specific timed fitness test and measure of HR. Accuracy of these tests vary.
                    </p>
                </>
                : ""}

            {!standards ?
                <div onClick={() => { toggleStandards(true) }}>
                    Standards 🔽
                </div>
                :
                <div onClick={() => { toggleStandards(false) }}>
                    Standards 🔼
                </div>
            }

            {standards ?
                <>
                    <table>
                        <th colSpan={7}>
                            VO2 Max Norms for Men
                        </th>
                        <tr>
                            <td>Age</td>
                            <td>Very Poor</td>
                            <td>Poor</td>
                            <td>Fair</td>
                            <td>Good</td>
                            <td>Excellent</td>
                            <td>Superior</td>
                        </tr>
                        <tbody>
                            <tr>
                                <td>13-19</td>
                                <td>{`<35.0`}</td>
                                <td>{`35.0 - 38.3`}</td>
                                <td>{`38.4 - 45.1`}</td>
                                <td>{`45.2 - 50.9`}</td>
                                <td>{`51.0 - 55.9`}</td>
                                <td>{`>55.9`}</td>
                            </tr>
                            <tr>
                                <td>20-29</td>
                                <td>{`<33.0`}</td>
                                <td>{`33.0 - 36.4`}</td>
                                <td>{`36.5 - 42.4`}</td>
                                <td>{`42.5 - 46.4`}</td>
                                <td>{`46.5 - 52.4`}</td>
                                <td>{`>52.4`}</td>
                            </tr>
                            <tr>
                                <td>30-39</td>
                                <td>{`<31.5`}</td>
                                <td>{`31.5 - 35.4`}</td>
                                <td>{`35.5 - 40.9`}</td>
                                <td>{`41.0 - 44.9`}</td>
                                <td>{`45.0 - 49.4`}</td>
                                <td>{`>49.4`}</td>
                            </tr>
                            <tr>
                                <td>40-49</td>
                                <td>{`<30.2`}</td>
                                <td>{`30.2 - 33.5`}</td>
                                <td>{`33.6 - 38.9`}</td>
                                <td>{`39.0 - 43.7`}</td>
                                <td>{`43.8 - 48.0`}</td>
                                <td>{`>48.0`}</td>
                            </tr>
                            <tr>
                                <td>50-59</td>
                                <td>{`<26.1`}</td>
                                <td>{`26.1 - 30.9`}</td>
                                <td>{`31.0 - 35.7`}</td>
                                <td>{`35.8 - 40.9`}</td>
                                <td>{`41.0 - 45.3`}</td>
                                <td>{`>45.3`}</td>
                            </tr>
                            <tr>
                                <td>60+</td>
                                <td>{`<20.5`}</td>
                                <td>{`20.5 - 26.0`}</td>
                                <td>{`26.1 - 32.2`}</td>
                                <td>{`32.3 - 36.4`}</td>
                                <td>{`36.5 - 44.2`}</td>
                                <td>{`>44.2`}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table>
                        <th colSpan={7}>
                            VO2 Max Norms for Women
                        </th>
                        <tr>
                            <td>Age</td>
                            <td>Very Poor</td>
                            <td>Poor</td>
                            <td>Fair</td>
                            <td>Good</td>
                            <td>Excellent</td>
                            <td>Superior</td>
                        </tr>
                        <tbody>
                            <tr>
                                <td>13-19</td>
                                <td>{`<25.0`}</td>
                                <td>{`25.0 - 30.9`}</td>
                                <td>{`31.0 - 34.9`}</td>
                                <td>{`35.0 - 38.9`}</td>
                                <td>{`39.0 - 41.9`}</td>
                                <td>{`>41.9`}</td>
                            </tr>
                            <tr>
                                <td>20-29</td>
                                <td>{`<23.6`}</td>
                                <td>{`23.6 - 28.9`}</td>
                                <td>{`29.0 - 32.9`}</td>
                                <td>{`33.0 - 36.9`}</td>
                                <td>{`37.0 - 41.0`}</td>
                                <td>{`>41.0`}</td>
                            </tr>
                            <tr>
                                <td>30-39</td>
                                <td>{`<22.8`}</td>
                                <td>{`22.8 - 26.9`}</td>
                                <td>{`27.0 - 31.4`}</td>
                                <td>{`31.5 - 35.6`}</td>
                                <td>{`35.7 - 40.0`}</td>
                                <td>{`>40.0`}</td>
                            </tr>
                            <tr>
                                <td>40-49</td>
                                <td>{`<21.0`}</td>
                                <td>{`21.0 - 24.4`}</td>
                                <td>{`24.5 - 28.9`}</td>
                                <td>{`29.0 - 32.8`}</td>
                                <td>{`32.9 - 36.9`}</td>
                                <td>{`>36.9`}</td>
                            </tr>
                            <tr>
                                <td>50-59</td>
                                <td>{`<20.2`}</td>
                                <td>{`20.2 - 22.7`}</td>
                                <td>{`22.8 - 26.9`}</td>
                                <td>{`27.0 - 31.4`}</td>
                                <td>{`31.5 - 35.7`}</td>
                                <td>{`>35.7`}</td>
                            </tr>
                            <tr>
                                <td>60+</td>
                                <td>{`<17.5`}</td>
                                <td>{`17.5 - 20.1`}</td>
                                <td>{`20.2 - 24.4`}</td>
                                <td>{`24.5 - 30.2`}</td>
                                <td>{`30.3 - 31.4`}</td>
                                <td>{`>31.4`}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
                : ""}
        </article>


    </>)
}