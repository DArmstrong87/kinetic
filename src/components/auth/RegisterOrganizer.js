import React, { useState } from "react";

export const RegisterOrganizer = ({ handleUser }) => {

    return (
        <>
            <fieldset>
                <label htmlFor="firstName"> First Name </label>
                <input type="text" name="firstName" className="form-control" placeholder="First name" required autoFocus onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="lastName"> Last Name </label>
                <input type="text" name="lastName" className="form-control" placeholder="Last name" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="organization"> Organization </label>
                <input type="text" name="organization" className="form-control" placeholder="Last name" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="inputUsername">Username</label>
                <input type="text" name="username" className="form-control" placeholder="Username" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="inputEmail">Email </label>
                <input type="text" name="email" className="form-control" placeholder="email@email.com" required onChange={handleUser}/>
            </fieldset>
            <fieldset>
                <label htmlFor="inputPassword">Password </label>
                <input type="password" name="password" className="form-control" placeholder="Password" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="verifyPassword">Verify Password </label>
                <input type="password" name="verifyPassword" className="form-control" placeholder="Verify password" required onChange={handleUser} />
            </fieldset>
            <fieldset style={{
                textAlign: "center"
            }}>
                <button className="btn btn-1 btn-sep icon-send" type="submit">Register</button>
            </fieldset>
        </>
    )
}