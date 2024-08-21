import React from 'react';
import ReactDOM from 'react-dom';
import Sample from './Sample';
import { AuthProvider } from "react-oidc-context";

class WebComponent extends HTMLElement {

    connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        // Create a container for React to render into within the Shadow DOM
        if (!this.shadowRoot.querySelector('.react-root')) {
            const reactRoot = document.createElement('div');
            reactRoot.className = 'react-root';
            this.shadowRoot.appendChild(reactRoot);
        }

        const labelsMap = {};
        const labels = this.querySelector('labels');
        labels.getAttributeNames().forEach(attributeName => {
            labelsMap[attributeName] = labels.getAttribute(attributeName);
        });

        const oidcConfig = {
            authority: this.querySelector('oidc-config').getAttribute("authority"),
            client_id: this.querySelector('oidc-config').getAttribute("client-id"),
            redirect_uri: window.location.href,
            scope: this.querySelector('oidc-config').getAttribute("scope"),
            extraQueryParams: {
                audience: this.querySelector('oidc-config').getAttribute("audience")
            }
        };

        ReactDOM.render(
            <AuthProvider {...oidcConfig}>
                <Sample
                    apiUrl={this.getAttribute("api-url")}
                    labels={labelsMap}
                />
            </AuthProvider>,
            this.shadowRoot.querySelector('.react-root') // Render inside Shadow DOM
        );
    }

    disconnectedCallback() {
        ReactDOM.unmountComponentAtNode(this.shadowRoot.querySelector('.react-root'));
    }
}

const ELEMENT_ID = 'sample-microfrontend';

if (!customElements.get(ELEMENT_ID)) {
	customElements.define(ELEMENT_ID, WebComponent);
}