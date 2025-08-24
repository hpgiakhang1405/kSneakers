class ProductList {
    constructor(products = []) {
        this.list = products;
    }

    setListofProducts(products) {
        this.list = products;
    }

    getAllProducts() {
        return this.list;
    }

    getProductById(id) {
        return this.list.find((item) => item.id === id);
    }

    getBestSeller() {
        return [...this.list].sort((a, b) => b.sold - a.sold);
    }

    getSaleProducts() {
        return this.list.filter((item) => item.isSale);
    }

    getNewProducts() {
        return this.list.filter((item) => item.isNew);
    }

    getProductsByGender(gender) {
        return this.list.filter((item) => item.gender === gender);
    }

    getProductByGenders(genderList) {
        if (genderList.length === 0) return this.list;
        return this.list.filter((item) => genderList.includes(item.gender));
    }

    getProductsByBrand(brand) {
        return this.list.filter((item) => item.brand === brand);
    }

    getProductsByBrands(brandList) {
        if (brandList.length === 0) return this.list;
        return this.list.filter((item) => brandList.includes(item.brand.toLowerCase()));
    }

    getProductBySort(sortBy) {
        switch (sortBy) {
            case 'price-asc':
                return [...this.list].sort((a, b) => a.salePrice - b.salePrice);
            case 'price-desc':
                return [...this.list].sort((a, b) => b.salePrice - a.salePrice);
            case 'name-asc':
                return [...this.list].sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return [...this.list].sort((a, b) => b.name.localeCompare(a.name));
            case 'newest':
                return [...this.list].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            case 'best-selling':
                return this.getBestSeller();
            case 'best-discount':
                return [...this.list].sort((a, b) => b.saleRate - a.saleRate);
            default:
                return this.list;
        }
    }

    findProductsByKeyword(keyword) {
        const lowerKeyword = keyword.toLowerCase().trim();
        if (!lowerKeyword) return this.list;

        return this.list.filter((item) => {
            const name = item.name.toLowerCase();
            const colorway = item.colorway.toLowerCase();
            const desc = item.description.toLowerCase();
            const gender = item.gender.toLowerCase();
            return (
                name.includes(lowerKeyword) ||
                colorway.includes(lowerKeyword) ||
                desc.includes(lowerKeyword) ||
                gender.includes(lowerKeyword)
            );
        });
    }

    getRelatedProductById(id) {
        const product = this.getProductById(id);
        const make = product.make;

        const list = this.list.filter((item) => item.make === make && item.id !== id);
        if (list.length > 0) return list;

        const brand = product.brand;
        const gender = product.gender;
        return this.list.filter((item) => item.brand === brand && item.gender === gender && item.id !== id);
    }
}

export default ProductList;
