import api from './api.js';
import BrandList from './classes/BrandList.js';
import GenderList from './classes/GenderList.js';
import InnerLoader from './classes/InnerLoader.js';
import Loader from './classes/Loader.js';
import ProductList from './classes/ProductList.js';
import ProductCard from './templates/ProductCard.js';

function FilterItem(item, type) {
    return `<div class="form-check">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value="${item.slug}"
                    id="${type}${item.name}"
                />
                <label class="form-check-label" for="${type}${item.name}">${item.name}</label>
            </div>`;
}

function FilterBadgeItem(item) {
    return `<div class="filter-badge">
                <span>${item.label}</span>
                <i class="bi bi-x" data-type="${item.type}" data-value="${item.value}"></i>
            </div>`;
}

$(document).ready(() => {
    const loader = new Loader();
    const innerLoader = new InnerLoader($('#catalog-wrapper'));
    const brands = new BrandList();
    const gender = new GenderList();
    const products = new ProductList();

    const $genderFilter = $('#genderFilter');
    const $brandsFilter = $('#brandsFilter');
    const $dropdown = $('#sortby .dropdown-menu');
    const $dropdownItems = $('#sortby .dropdown-item');
    const $sortbyBtn = $('#sortby-btn');

    const url = new URL(window.location.href);

    function showDropdown() {
        $dropdown.toggleClass('show');
        $sortbyBtn.toggleClass('active');
    }

    function hideDropdown() {
        $dropdown.removeClass('show');
        $sortbyBtn.removeClass('active');
    }

    function handleSortDropdown() {
        function handleShowDropdown(e) {
            e.stopPropagation();
            showDropdown();
        }

        function handleHideDropdown(e) {
            if (!$(e.target).closest($dropdown).length) {
                hideDropdown();
            }
        }

        $sortbyBtn.click(handleShowDropdown);
        $(document).click(handleHideDropdown);
    }

    function renderFilterList() {
        const $genderList = $genderFilter.find('.accordion-body').empty();
        const genderList = gender.getAllGender();
        $genderList.append(genderList.map((item) => FilterItem(item, 'gender')));
        $genderFilter.find('.form-check-input').change(handleFilter);

        const $brandList = $brandsFilter.find('.accordion-body').empty();
        const brandList = brands.getAllBrands();
        $brandList.append(brandList.map((item) => FilterItem(item, 'brand')));
        $brandsFilter.find('.form-check-input').change(handleFilter);
    }

    function handleSetParams() {
        const search = url.searchParams.get('search');

        url.search = '';

        const selectedGender = $genderFilter.find('.form-check-input:checked');
        selectedGender.each((_, item) => url.searchParams.append('gender', item.value));

        const selectedBrands = $brandsFilter.find('.form-check-input:checked');
        selectedBrands.each((_, item) => url.searchParams.append('brand', item.value));

        const selectedSort = $dropdown.find('.active').data('sort');
        url.searchParams.set('sort', selectedSort);

        if (search) url.searchParams.set('search', search);

        history.pushState({}, '', url);
    }

    function renderSelectedFilter() {
        const $filterBadgeList = $('.filter-badge-list').empty();

        const genderParams = url.searchParams.getAll('gender');
        const $genderCheckboxes = $genderFilter.find('.form-check-input');
        $genderCheckboxes.each((_, item) => {
            const value = item.value;
            const isChecked = genderParams.includes(value);

            $(item).prop('checked', isChecked);
            if (!isChecked) return;

            const label = $(item).next('label').text();
            const badge = {
                type: 'gender',
                label: label,
                value: value,
            };
            $filterBadgeList.append(FilterBadgeItem(badge));
        });

        const brandParams = url.searchParams.getAll('brand');
        const $brandCheckboxes = $brandsFilter.find('.form-check-input');
        $brandCheckboxes.each((_, item) => {
            const value = item.value;
            const isChecked = brandParams.includes(value);

            $(item).prop('checked', isChecked);
            if (!isChecked) return;

            const label = $(item).next('label').text();
            const badge = {
                type: 'brand',
                label: label,
                value: value,
            };
            $filterBadgeList.append(FilterBadgeItem(badge));
        });

        $('#clear-all-btn').toggle(!!$filterBadgeList.children().length);

        const sortParams = url.searchParams.get('sort') || 'default';
        $dropdownItems.each((_, item) => {
            const value = $(item).data('sort');
            const isActive = sortParams === value;
            $(item).toggleClass('active', isActive);
            if (!isActive) return;
            $sortbyBtn.find('> span').html($(item).html());
        });
    }

    function handleRemoveFilter(e) {
        const value = e.currentTarget.dataset.value;

        $genderFilter.find(`.form-check-input[value="${value}"]`).prop('checked', false);
        $brandsFilter.find(`.form-check-input[value="${value}"]`).prop('checked', false);

        handleFilter();
    }

    $('.filter-badge-list').on('click', 'i', handleRemoveFilter);

    function handleClearAllFilters() {
        $genderFilter.find('.form-check-input').prop('checked', false);
        $brandsFilter.find('.form-check-input').prop('checked', false);

        handleFilter();
    }

    $('#clear-all-btn').click(handleClearAllFilters);

    function renderProductList() {
        const $productList = $('#product-list');

        innerLoader.show();

        const search = url.searchParams.get('search') || '';
        const genderList = url.searchParams.getAll('gender');
        const brandList = url.searchParams.getAll('brand');
        const sortBy = url.searchParams.get('sort');

        const listOfSearch = products.findProductsByKeyword(search);
        const listOfGender = new ProductList(listOfSearch).getProductByGenders(genderList);
        const listOfBrand = new ProductList(listOfGender).getProductsByBrands(brandList);
        const list = new ProductList(listOfBrand).getProductBySort(sortBy);

        setTimeout(() => {
            $productList.html(list.map((item) => `<div class="col-4">${ProductCard(item)}</div>`));
            if (!list.length) $productList.html('<h5 class="text-center mt-5">No products found.</h5>');
            $('#number-of-prods').text(list.length);
            if (search) {
                $('#search-query').text(`for "${search}"`);
            }
            innerLoader.hide();
        }, 1500);
    }

    function handleSortDropdownChange(e) {
        const $target = $(e.currentTarget);
        if ($target.hasClass('active')) {
            hideDropdown();
            return;
        }

        $dropdownItems.removeClass('active');
        $target.addClass('active');

        handleFilter();
        hideDropdown();
    }

    $dropdownItems.click(handleSortDropdownChange);

    function handleFilter() {
        handleSetParams();
        renderSelectedFilter();
        renderProductList();
    }

    async function fetchData() {
        try {
            loader.show();

            const [brandsRes, genderRes, productsRes] = await Promise.all([
                api.getBrands(),
                api.getGender(),
                api.getProducts(),
            ]);

            brands.setListOfBrands(brandsRes);
            gender.setListOfGender(genderRes);
            products.setListofProducts(productsRes);

            renderFilterList();

            renderSelectedFilter();
            renderProductList();
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                loader.hide();
            }, 500);
        }
    }

    function init() {
        fetchData();
        handleSortDropdown();
    }

    init();
});
