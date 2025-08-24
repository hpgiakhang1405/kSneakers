class UserManager {
    KEY = 'user';
    static VERIFYING_USER_KEY = 'verifyingUser';

    constructor() {
        const data = localStorage.getItem(this.KEY);
        this.user = JSON.parse(data) || null;
    }

    getUser() {
        return this.user;
    }

    setUser(user) {
        this.user = user;
        this.save();
    }

    save() {
        localStorage.setItem(this.KEY, JSON.stringify(this.user));
    }

    isLoggedIn() {
        return !!this.user;
    }

    login(user) {
        UserManager.clearVerifyingUser();
        this.user = user;
        this.save();
    }

    logout() {
        this.user = null;
        localStorage.removeItem(this.KEY);
    }

    addToCart(item) {
        if (!this.user) return;
        this.user.cart = this.user.cart || [];
        const existingItem = this.user.cart.find((cartItem) => cartItem.id === item.id && cartItem.size === item.size);
        if (existingItem) {
            existingItem.qty += item.qty;
            existingItem.qty = Math.min(existingItem.qty, 10);
        } else {
            this.user.cart.push(item);
        }
        this.save();
    }

    getCartItemByIndex(index) {
        if (!this.user) return null;
        return this.user.cart[index] || {};
    }

    updateCartItemQty(index, qty) {
        if (!this.user) return;
        this.user.cart[index].qty = qty;
        this.save();
    }

    removeCartItem(index) {
        if (!this.user) return;
        this.user.cart.splice(index, 1);
        this.save();
    }

    clearCart() {
        if (!this.user) return;
        this.user.cart = [];
        this.save();
    }

    static setVerifyingUser(user) {
        localStorage.setItem(UserManager.VERIFYING_USER_KEY, JSON.stringify(user));
    }

    static getVerifyingUser() {
        const data = localStorage.getItem(UserManager.VERIFYING_USER_KEY);
        return JSON.parse(data) || null;
    }

    static clearVerifyingUser() {
        localStorage.removeItem(UserManager.VERIFYING_USER_KEY);
    }
}

export default UserManager;
