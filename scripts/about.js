import Loader from './classes/Loader.js';

$(document).ready(() => {
    const loader = new Loader();

    function init() {
        loader.show();

        setTimeout(() => {
            loader.hide();
        }, 500);
    }

    init();
});
