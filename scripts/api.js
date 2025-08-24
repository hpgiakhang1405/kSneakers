const api = {
    getSlideShow: function () {
        return $.ajax({
            method: 'GET',
            dataType: 'json',
            url: 'data/slideshow.json',
        });
    },

    getBrands: function () {
        return $.ajax({
            method: 'GET',
            dataType: 'json',
            url: 'data/brands.json',
        });
    },

    getProducts: function () {
        return $.ajax({
            method: 'GET',
            dataType: 'json',
            url: 'data/products.json',
        });
    },

    getGender: function () {
        return $.ajax({
            method: 'GET',
            dataType: 'json',
            url: 'data/gender.json',
        });
    },
};

export default api;
