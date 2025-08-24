class InnerLoader {
    constructor($target) {
        this.$loader = $target.find('.inner-loader-wrapper');
    }

    show() {
        this.$loader.fadeIn(500);
    }

    hide() {
        this.$loader.fadeOut(500);
    }
}

export default InnerLoader;
