import api from './api.js';
import AccountManager from './classes/AccountManager.js';
import InnerLoader from './classes/InnerLoader.js';
import ProductList from './classes/ProductList.js';
import Toast from './classes/Toast.js';
import UserManager from './classes/UserManager.js';
import Avatar from './templates/Avatar.js';

function UserInfo(user) {
    return `${Avatar(`assets/images/${user.avatar || 'avatar_0.svg'}`, user.username)}
            <div>
                <div class="fw-bold">${user.username}</div>
                <span class="text-muted" style="font-size: 14px">
                    ${user.email}
                </span>
            </div>`;
}

function SearchItem(item) {
    const oldPrice = item.isSale
        ? `<div class="text-decoration-line-through fw-bold opacity-50">$${item.price}</div>`
        : '';

    return `<li>
                <a class="dropdown-item" href="detail.html?id=${item.id}">
                    <div class="search-item">
                        <div class="search-item-img" style="background-image: url('${item.mainGlowPictureUrl}');"></div>
                        <div class="w-100">
                            <div class="truncate-2 text-wrap">${item.name}</div>
                            <div class="d-flex align-items-center gap-2">
                                ${oldPrice}
                                <div class="fw-bold fs-5 ${item.isSale ? 'text-danger' : ''}">
                                    $${item.isSale ? item.salePrice : item.price}
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </li>`;
}

$(document).ready(() => {
    const user = new UserManager();
    const products = new ProductList();
    const accounts = new AccountManager();

    const $header = $('header');
    const $footer = $('footer');

    function renderUserUI() {
        const us = user.getUser();

        $header.addClass('logged-in');
        $header
            .find('#user')
            .empty()
            .append(Avatar(`assets/images/${us.avatar || 'avatar_0.svg'}`, us.username));
        $header.find('#user-info').empty().append(UserInfo(us));

        const cartList = us.cart || [];
        const $cartBadge = $('#cart-badge').empty();
        $cartBadge.text(cartList.length);
        $cartBadge.toggle(!!cartList.length);
    }

    function handleHeaderUser() {
        if (!user.isLoggedIn()) return;

        renderUserUI();

        const $userBtn = $('#user');
        const $dropdown = $('#header-user .dropdown-menu');

        function handleShowDropdown(e) {
            e.stopPropagation();
            $dropdown.toggleClass('show');
        }

        function handleHideDropdown(e) {
            if (!$(e.target).closest($dropdown).length) {
                $dropdown.removeClass('show');
            }
        }

        $userBtn.click(handleShowDropdown);
        $(document).click(handleHideDropdown);

        const $logoutBtn = $('.logout-btn');

        function handleUserLogout(e) {
            e.preventDefault();

            const innerLoader = new InnerLoader($logoutBtn);
            innerLoader.show();

            setTimeout(() => {
                Toast.show("You've been signed out. See you soon!", {
                    type: 'info',
                    icon: '<i class="bi bi-door-closed-fill"></i>',
                });

                accounts.updateAccount(user.getUser());
                user.logout();

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }, 2000);
        }

        $logoutBtn.click(handleUserLogout);
    }

    function handleSearch() {
        const $searchBox = $('.search-box');
        const $searchInput = $searchBox.find('input[type="search"]');
        const $dropdown = $searchBox.find('.dropdown-menu');

        let debounceTimer = null;
        const DEBOUNCE_DELAY = 500;

        function showDropdown() {
            $dropdown.addClass('show');
        }

        function hideDropdown() {
            $dropdown.removeClass('show');
        }

        function searchAndRender() {
            const keyword = $searchInput.val().trim();

            if (!keyword) {
                hideDropdown();
                return;
            }

            const list = products.findProductsByKeyword(keyword).slice(0, 10);

            if (list.length === 0) {
                hideDropdown();
                return;
            }

            $dropdown.empty();
            list.forEach((item) => $dropdown.append(SearchItem(item)));
            showDropdown();
        }

        $searchInput.on('focus', searchAndRender);
        $(document).on('click', function (e) {
            if (!$(e.target).closest('.search-box').length) {
                hideDropdown();
            }
        });

        function handleClearSearch(e) {
            e.preventDefault();
            e.stopPropagation();

            $searchInput.val('');
            $searchBox.removeClass('searching');
            hideDropdown();
        }

        $searchBox.find('#clear-btn').on('mousedown', handleClearSearch);
        $searchBox.find('#search-icon').on('mousedown', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $searchInput.focus();
        });

        function handleSubmitSearch(e) {
            e.preventDefault();
            e.stopPropagation();

            const keyword = $searchInput.val().trim();
            if (!keyword) return;

            window.location.href = `catalog.html?search=${keyword}`;
        }

        $('#search-form').submit(handleSubmitSearch);

        $searchInput.on('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                $searchBox.addClass('searching');
                setTimeout(() => {
                    searchAndRender();
                    $searchBox.removeClass('searching');
                }, DEBOUNCE_DELAY);
            }, DEBOUNCE_DELAY);
        });
    }

    function handleNavBrands() {
        const $navBrands = $('#nav-brands');
        const $dropdown = $navBrands.find('.dropdown-menu');

        function showDropdown() {
            $dropdown.addClass('show');
        }

        function hideDropdown() {
            $dropdown.removeClass('show');
        }

        $navBrands.on('mouseenter', showDropdown);
        $navBrands.on('mouseleave', hideDropdown);
    }

    function handleHeader() {
        handleHeaderUser();
        handleSearch();
        handleNavBrands();
    }

    async function fetchData() {
        try {
            const loadHeader = $header.load('partials/header.html').promise();
            const loadFooter = $footer.load('partials/footer.html').promise();

            const productsRes = await api.getProducts();
            products.setListofProducts(productsRes);

            await Promise.all([loadHeader, loadFooter]);

            handleHeader();
        } catch (error) {
            console.error(error);
        }
    }

    function init() {
        fetchData();
    }

    init();
});
