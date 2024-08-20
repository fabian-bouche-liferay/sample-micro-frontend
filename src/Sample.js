import React from 'react';
import { useAuth, hasAuthParams } from "react-oidc-context";
import DisplayData from './DisplayData';

function Sample(props) {

    const auth = useAuth();
    const [hasTriedSignin, setHasTriedSignin] = React.useState(false);

    // automatically sign-in
    React.useEffect(() => {
        if (!hasAuthParams() &&
            !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading &&
            !hasTriedSignin
        ) {
            auth.signinRedirect();
            setHasTriedSignin(true);
        }
    }, [auth, hasTriedSignin]);

    // Trigger a page reload 0.5 seconds after failing to log in
    React.useEffect(() => {
        if (!auth.isAuthenticated && !auth.isLoading && hasTriedSignin) {
            const timer = setTimeout(() => {
                window.location.reload(); // Force a full page reload
            }, 500);
            return () => clearTimeout(timer); // Cleanup on unmount
        }
    }, [auth.isAuthenticated, auth.isLoading, hasTriedSignin]);

    if (auth.isLoading) {
        return <div>Signing you in/out...</div>;
    }

    if (!auth.isAuthenticated) {
        return <div>Unable to log in</div>;
    }

    if (auth.isAuthenticated) {
        return (
        <div>
            <DisplayData />
        </div>
        );
    }

}

export default Sample;
