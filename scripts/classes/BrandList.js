class BrandList {
    constructor(brands = []) {
        this.list = brands;
    }

    setListOfBrands(brands) {
        this.list = brands;
    }

    getAllBrands() {
        return this.list;
    }

    getBrandBySlug(slug) {
        return this.list.find((item) => item.slug === slug);
    }
}

export default BrandList;
