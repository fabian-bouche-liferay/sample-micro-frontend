import React from 'react';
import ReactDOM from 'react-dom';
import Sample from './Sample';
import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
    authority: "https://dev-fabian-bouche-liferay.eu.auth0.com",
    client_id: "hYJr5F1BT8z8phgPQj63AXkW5Tq2IykV",
    redirect_uri: window.location.href,
    scope: "samplescope",
    extraQueryParams: {
        audience: "https://restapi-lctilink-prd.lfr.cloud"
    }
};

class WebComponent extends HTMLElement {

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {

        ReactDOM.render(
            <AuthProvider {...oidcConfig}>
                <Sample />
            </AuthProvider>,
            this
        );

    }

    disconnectedCallback() {
        ReactDOM.unmountComponentAtNode(this);
    }
}

const ELEMENT_ID = 'sample-microfrontend';

if (!customElements.get(ELEMENT_ID)) {
	customElements.define(ELEMENT_ID, WebComponent);
}