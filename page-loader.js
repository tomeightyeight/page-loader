'use strict';

class PageLoader
{
    constructor({ from = 'body', to = '.js-page-content' }) {
        this.from = from;
        this.to = to;

        // Register event handlers
        [...document.querySelectorAll('.js-navigate')].forEach((el, i) => {
            el.addEventListener('click', e => {
                e.preventDefault();

                const href = e.target.getAttribute('href');

                this.fetchPage(href);

                this.updateAddressBar(href);

                this.closeNav();
            });
        });
    }

    fetchPage(url) {
        const to = document.querySelector(this.to);

        // Use cached page if available
        const cached = sessionStorage[url];

        if (cached) {
            this.displayContent(to, cached);
            return;
        }

        fetch(url)
            .then(response => response.text())
            .then(response => {
                const parser = new DOMParser();
                return parser.parseFromString(response, 'text/html');
            })
            .then(response => {
                sessionStorage[url] = response.querySelector(this.from).innerHTML;
                this.displayContent(to, sessionStorage[url]);
            });
    }

    displayContent(el, html) {
        el.classList.add('is-hidden');

        el.dispatchEvent(new CustomEvent('ajax-load'));

        setTimeout(() => {
            el.innerHTML = html;
            el.classList.remove('is-hidden');
        }, 1000);
    }

    closeNav() {
        document.getElementsByTagName('body')[0].classList.remove('nav-open');
        document.querySelector('.js-menu-btn').classList.remove('nav-open');
        document.querySelector('.js-nav').classList.remove('is-open');
    }

    updateAddressBar(uri) {
        window.history.pushState({}, '', uri);
    }
}

export default PageLoader;

