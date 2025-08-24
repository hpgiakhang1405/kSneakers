import api from './api.js';
import Loader from './classes/Loader.js';
import BrandList from './classes/BrandList.js';
import ProductList from './classes/ProductList.js';
import CollectionCard from './templates/CollectionCard.js';
import ProductCard from './templates/ProductCard.js';

function HeroCarousel(carouselList, limit = 5) {
    function HeroCarouselItem(item, index) {
        return `<div class="hero-item ${index === 0 ? 'active' : ''}">
                    <div class="hero-text-top">${item.brand}</div>
                    <div class="hero-text-middle">${item.make}</div>
                    <div class="hero-text-bottom">${item.model}</div>
                    <div class="hero-dot-img-1">
                        <img src="assets/images/dot_element.png" alt="" class="img-fluid" />
                    </div>
                    <div class="hero-dot-img-2">
                        <img src="assets/images/dot_element.png" alt="" class="img-fluid" />
                    </div>
                    <div class="hero-desc truncate-5">${item.description}</div>
                    <div class="hero-img-container">
                        <div style="background-image: url('${item.mainGlowPictureUrl}')"></div>
                        <a href="detail.html?id=${item.id}" class="hero-card">
                            <div class="d-flex align-items-start justify-content-between gap-5 mb-3">
                                <div>
                                    <div class="fw-bold">${item.make}</div>
                                    <div class="opacity-50">${item.model}</div>
                                </div>
                                <span class="fw-bold text-danger fs-5">
                                    $${item.isSale ? item.salePrice : item.price}
                                </span>
                            </div>
                            <button type="button" class="btn btn-outline-dark border-dark-subtle">Shop Now</button>
                        </a>
                    </div>
                </div>`;
    }

    carouselList.sort(() => Math.random() - 0.5);
    carouselList = carouselList.slice(0, limit);

    return `<div class="hero-slider-wrapper">
                ${carouselList.map((item, index) => HeroCarouselItem(item, index)).join('')}
                <button type="button" class="btn-prev btn-hero-prev">
                    <i class="bi bi-chevron-left"></i>
                </button>
                <button type="button" class="btn-next btn-hero-next">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>`;
}

function GenderCollectionSection() {
    const list = [
        {
            title: "Men's Collection",
            slogan: 'Made to move. Built for men.',
            thumbnail: 'assets/images/men_collection_thumbnail.jpg',
            slug: 'men',
        },
        {
            title: "Women's Collection",
            slogan: 'Strong. Stylish. Unstoppable.',
            thumbnail: 'assets/images/women_collection_thumbnail.jpg',
            slug: 'women',
        },
        {
            title: "Kids's Collection",
            slogan: 'Play big. Move free.',
            thumbnail: 'assets/images/kids_collection_thumbnail.jpg',
            slug: 'kids',
        },
    ];

    return `<section class="gender-collection-section mb-5">
                <div class="row">
                    ${list
                        .map(
                            (item) =>
                                `<div class="col-4">
                                    ${CollectionCard('gender', item, `catalog.html?gender=${item.slug}`)}
                                </div>`,
                        )
                        .join('')}
                </div>
            </section>`;
}

function BestSellerSection(products, limit = 3) {
    function BestSellerCard(item) {
        return `<a href="detail.html?id=${item.id}">
                    <div class="section-item bg-body-tertiary rounded-4 p-3 best-seller-card">
                        <img src="${item.mainGlowPictureUrl}" alt="${item.slug}" />
                        <div class="w-100 d-flex align-content-center justify-content-between">
                            <div>
                                <div class="fw-bold truncate-1">${item.make}</div>
                                <div class="opacity-50 truncate-1">${item.model}</div>
                            </div>
                            <span class="fw-bold text-danger fs-5">
                                $${item.isSale ? item.salePrice : item.price}
                            </span>
                        </div>
                    </div>
                </a>`;
    }

    products = products.slice(0, limit);

    return `<section class="best-seller-section mb-5">
                <h2 class="section-title text-danger" style="margin-bottom: 160px">Best Seller</h2>
                <div class="row g-4 best-seller-section-list">
                    ${products.map((item) => `<div class="col-4">${BestSellerCard(item)}</div>`).join('')}
                </div>
            </section>`;
}

function BrandSection(brands) {
    function BrandItem(item) {
        return `<a href="catalog.html?brand=${item.slug}" class="brand-section-item">
                    <div style="background-image: url('${item.logo}')"></div>
                </a>`;
    }

    return `<section class="brand-section mb-5">
                <h2 class="section-title">Popular Brands</h2>
                <div class="row align-items-center g-5 brand-section-list">
                    ${brands.map((item) => `<div class="col">${BrandItem(item)}</div>`).join('')}
                </div>
            </section>`;
}

function ProductSection(type, products, limit = 12) {
    const typeMapping = {
        sale: {
            title: 'Up to 70% Off',
            textColor: 'text-danger',
            link: 'catalog.html?sort=best-discount',
        },
        new: {
            title: 'New Arrivals',
            textColor: 'text-warning',
            link: 'catalog.html?sort=newest',
        },
    };

    const { title, textColor, link } = typeMapping[type];
    products.sort(() => Math.random() - 0.5);
    products = products.slice(0, limit);

    return `<section class="${type}-section mb-5">
                <div class="row">
                    <div class="col-4"></div>
                    <div class="col-4"><h2 class="section-title ${textColor}">${title}</h2></div>
                    <div class="col-4">
                        <div class="text-end">
                            <a href="${link}" class="btn btn-outline-dark border-dark-subtle">
                                <span>See All</span>
                                <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="row g-4 ${type}-section-list">
                    ${products.map((item) => `<div class="col-3">${ProductCard(item)}</div>`).join('')}
                </div>
            </section>`;
}

function BrandCollectionSection() {
    const list = [
        {
            name: 'adidas',
            slug: 'adidas',
            slogan: 'Three stripes. One spirit.',
            thumbnail: 'assets/images/adidas_collection_thumbnail.jpg',
            logo: 'assets/images/adidas_logo.png',
        },
        {
            name: 'Nike',
            slug: 'nike',
            slogan: 'Push limits. Break rules. Just do it.',
            thumbnail: 'assets/images/nike_collection_thumbnail.jpg',
            logo: 'assets/images/nike_logo.png',
        },
    ];

    return `<div class="brand-collection-section mb-5">
                <div class="row">
                    ${list
                        .map(
                            (item) =>
                                `<div class="col-6">
                                    ${CollectionCard('brand', item, `catalog.html?brand=${item.slug}`)}
                                </div>`,
                        )
                        .join('')}
                </div>
            </div>`;
}

$(document).ready(() => {
    const loader = new Loader();
    const brands = new BrandList();
    const products = new ProductList();

    function renderSlideshowSection() {
        const $slideshowSection = $('#hero-section').empty();
        $slideshowSection.append(HeroCarousel(products.getAllProducts(), 10));

        let currentIndex = 0;
        const $items = $('.hero-item');
        const total = $items.length;

        const goToSlide = (newIndex) => {
            if (newIndex === currentIndex) return;

            const $current = $items.eq(currentIndex);
            const $next = $items.eq(newIndex);

            $current.removeClass('active');
            $next.addClass('active');

            currentIndex = newIndex;
        };

        const handleClickPrev = () => {
            const prevIndex = (currentIndex - 1 + total) % total;
            goToSlide(prevIndex);
            stopAutoSlide();
            startAutoSlide();
        };

        const handleClickNext = () => {
            const nextIndex = (currentIndex + 1) % total;
            goToSlide(nextIndex);
            stopAutoSlide();
            startAutoSlide();
        };

        $('.btn-hero-prev').click(handleClickPrev);
        $('.btn-hero-next').click(handleClickNext);

        let autoSlideInterval;

        const startAutoSlide = () => (autoSlideInterval = setInterval(handleClickNext, 6000));
        const stopAutoSlide = () => clearInterval(autoSlideInterval);

        startAutoSlide();

        $items.hover(stopAutoSlide, startAutoSlide);
    }

    function renderMainSections() {
        const $sections = $('#sections-wrapper').empty();

        const sectionList = [
            GenderCollectionSection(),
            BestSellerSection(products.getBestSeller()),
            BrandSection(brands.getAllBrands()),
            ProductSection('sale', products.getSaleProducts()),
            ProductSection('new', products.getNewProducts()),
            BrandCollectionSection(),
        ];

        sectionList.forEach((sectionItem) => $sections.append(sectionItem));
    }

    function renderAllSections() {
        renderSlideshowSection();
        renderMainSections();
    }

    async function fetchData() {
        try {
            loader.show();

            const [brandsRes, productsRes] = await Promise.all([api.getBrands(), api.getProducts()]);

            brands.setListOfBrands(brandsRes);
            products.setListofProducts(productsRes);

            renderAllSections();
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                loader.hide();
            }, 500);
        }
    }

    function handleHeaderScroll() {
        const $header = $('header');

        $header.css('position', 'fixed');
        $header.css('background', 'rgba(255, 255, 255, 0.4)');
        $header.css('backdrop-filter', 'blur(0px)');
        $header.css('box-shadow', 'none');

        $(window).scroll(() => {
            const scrollTop = $(window).scrollTop();
            if (scrollTop > 0) {
                $header.css('position', 'fixed');
                $header.css('background', 'rgba(255, 255, 255, 0.95)');
                $header.css('backdrop-filter', 'blur(16px)');
                $header.css('box-shadow', 'var(--bs-box-shadow-sm)');
            } else {
                $header.css('position', 'fixed');
                $header.css('background', 'rgba(255, 255, 255, 0.4)');
                $header.css('backdrop-filter', 'blur(0px)');
                $header.css('box-shadow', 'none');
            }
        });
    }

    function init() {
        fetchData();
        handleHeaderScroll();
    }

    init();
});
