import React from 'react';
import ReactDOM from 'react-dom';
import Sample from './Sample';
import { AuthProvider } from "react-oidc-context";

class WebComponent extends HTMLElement {

    connectedCallback() {
        // Observe changes in the <labels> element
        this.observeLabels();

        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    observeLabels() {
        const labelsElement = this.querySelector('labels');
        if (labelsElement) {
            // Create a MutationObserver to watch for changes
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'attributes') {
                        // Re-render when an attribute changes in the <labels> element
                        this.render();
                    }
                }
            });

            // Start observing the <labels> element for attribute changes
            observer.observe(labelsElement, {
                attributes: true, // Observe attribute changes
                childList: false, // Do not observe child list changes
                subtree: false    // Do not observe the entire subtree
            });

            // Store the observer so it can be disconnected later if needed
            this.labelsObserver = observer;
        }
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
                    key={JSON.stringify(labels)}
                    apiUrl={this.getAttribute("api-url")}
                    labels={labelsMap}
                />
            </AuthProvider>,
            this.shadowRoot.querySelector('.react-root') // Render inside Shadow DOM
        );
    }

    disconnectedCallback() {
        // Disconnect the observer when the component is disconnected
        if (this.labelsObserver) {
            this.labelsObserver.disconnect();
        }
        ReactDOM.unmountComponentAtNode(this.shadowRoot.querySelector('.react-root'));
    }
}

const ELEMENT_ID = 'sample-microfrontend';

if (!customElements.get(ELEMENT_ID)) {
	customElements.define(ELEMENT_ID, WebComponent);
}