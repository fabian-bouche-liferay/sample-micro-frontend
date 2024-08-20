import React, { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";

function DisplayData(props) {
    
    const auth = useAuth();
    const [foo, setFoo] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const token = auth.user?.access_token;
                const url = "https://restapi-lctilink-prd.lfr.cloud/Account/ContactInfo";
                //const url = "http://localhost:9090/Account/ContactInfo";
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFoo(await response.json());
                console.log("RESPONSE: " + JSON.stringify(foo));
            } catch (e) {
                console.error(e);
            }
        })()
    }, [auth, foo]);

    if (foo == null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <table>
                <tr>
                    <th>Is Verified Cell Phone</th>
                    <td>{foo.IsVerifiedCellPhoneNumber}</td>
                </tr>
                <tr>
                    <th>Mobile Phone</th>
                    <td>{foo.MobilePhoneNo}</td>
                </tr>
                <tr>
                    <th>Work Phone</th>
                    <td>{foo.WorkPhoneNo}</td>
                </tr>
                <tr>
                    <th>Home Phone</th>
                    <td>{foo.HomePhoneNo}</td>
                </tr>
            </table>
        </div>
    );

}

export default DisplayData;