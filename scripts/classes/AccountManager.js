class AccountManager {
    KEY = 'accounts';

    constructor() {
        const data = localStorage.getItem(this.KEY);
        this.list = JSON.parse(data) || [];
    }

    getAccounts() {
        return this.list;
    }

    getAccount(account) {
        return this.list.find((acc) => acc.username === account.username && acc.password === account.password);
    }

    save() {
        localStorage.setItem(this.KEY, JSON.stringify(this.list));
    }

    isExistsUsername(username) {
        return this.list.some((account) => account.username === username);
    }

    isExistsEmail(email) {
        return this.list.some((account) => account.email === email);
    }

    isExists(account) {
        return this.isExistsUsername(account.username) || this.isExistsEmail(account.email);
    }

    addAccount(account) {
        if (this.isExists(account)) return false;
        this.list.push(account);
        this.save();
        return true;
    }

    updateAccount(account) {
        const index = this.list.findIndex((acc) => acc.username === account.username);
        if (index === -1) return false;
        this.list[index] = account;
        this.save();
        return true;
    }

    removeAccount(account) {
        const index = this.list.findIndex((acc) => acc.username === account.username);
        if (index === -1) return false;
        this.list.splice(index, 1);
        this.save();
        return true;
    }
}

export default AccountManager;
