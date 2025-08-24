class Loader {
    constructor() {
        this.$loader = $('#global-loader');
    }

    show() {
        this.$loader.show();
    }

    hide() {
        this.$loader.addClass('blur-out');
        this.$loader.hide(500);
    }
}

export default Loader;
