import React, { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";

function DisplayData(props) {
    
    const auth = useAuth();
    const [foo, setFoo] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const token = auth.user?.access_token;
                const response = await fetch(props.apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFoo(await response.json());
            } catch (e) {
                console.error(e);
            }
        })()
    }, [auth]);

    if (foo == null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>{props.labels["is-verified-cell-phone-number"]}</th>
                        <td>{foo.IsVerifiedCellPhoneNumber}</td>
                    </tr>
                    <tr>
                        <th>{props.labels["mobile-phone-no"]}</th>
                        <td>{foo.MobilePhoneNo}</td>
                    </tr>
                    <tr>
                        <th>{props.labels["work-phone-no"]}</th>
                        <td>{foo.WorkPhoneNo}</td>
                    </tr>
                    <tr>
                        <th>{props.labels["home-phone-no"]}</th>
                        <td>{foo.HomePhoneNo}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

}

export default DisplayData;