class GenderList {
    constructor(gender = []) {
        this.list = gender;
    }

    setListOfGender(gender) {
        this.list = gender;
    }

    getAllGender() {
        return this.list;
    }

    getGenderBySlug(slug) {
        return this.list.find((item) => item.slug === slug);
    }
}

export default GenderList;
