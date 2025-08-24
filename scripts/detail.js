import api from './api.js';
import Loader from './classes/Loader.js';
import ProductList from './classes/ProductList.js';
import ProductCard from './templates/ProductCard.js';
import Toast from './classes/Toast.js';
import UserManager from './classes/UserManager.js';

function ProductImages(imageList) {
    function ImageItem(url, index) {
        return `<div class="shadow-sm rounded overflow-hidden w-100 h-100 p-1 image-item">
                    <div style="aspect-ratio: 3/2" class="position-relative w-100">
                        <img
                            src="${url}"
                            alt="image_${index}"
                            class="img-fluid object-fit-contain"
                        />
                    </div>
                </div>`;
    }

    const moreBox =
        imageList.length > 6
            ? `<div class="col-2">
                    <div class="shadow-sm rounded overflow-hidden w-100 h-100 image-more-box cursor-pointer">
                        <div class="d-flex align-items-center justify-content-center h-100 bg-body-tertiary">
                            +${imageList.length - 5} more
                        </div>
                    </div>
                </div>`
            : '';

    return `<div class="shadow-sm rounded overflow-hidden mb-3 p-4 main-image-item cursor-pointer">
                <div style="aspect-ratio: 3/2" class="position-relative w-100">
                    <img
                        src=""
                        alt=""
                        class="img-fluid object-fit-contain"
                    />
                </div>
            </div>
            <div class="row g-2">
                ${imageList
                    .slice(0, imageList.length > 6 ? 5 : 6)
                    .map((url, index) => `<div class="col-2">${ImageItem(url, index)}</div>`)
                    .join('')}
                ${moreBox}
            </div>`;
}

function ProductInfo(product) {
    function SizeBtn(size) {
        return `<button 
                    type="button" 
                    class="btn btn-outline-dark border-dark-subtle btn-size-option" 
                    style="width: 68px"
                    data-size="${size}">
                        ${size}
                </button>`;
    }

    const oldPrice = product.isSale
        ? `<div class="fs-3 text-decoration-line-through opacity-50">$${product.price}</div>`
        : '';

    return `<div class="d-flex align-items-center justify-content-between gap-3 mb-3">
                <a href="catalog.html?brand=${product.brand.toLowerCase()}">
                    <div class="d-flex align-items-center gap-2">
                        <div class="bg-white rounded-circle p-1 shadow-sm">
                            <img
                                src="assets/images/${product.brand.toLowerCase()}_logo.png"
                                alt="${product.brand}"
                                class="rounded-circle object-fit-contain"
                                style="width: 30px; height: 30px"
                            />
                        </div>
                        <span class="fw-semibold">${product.brand}</span>
                    </div>
                </a>
                <div class="opacity-25 fw-semibold">${product.styleID}</div>
            </div>
            <div class="fs-3 fw-bold mb-3">${product.name}</div>
            ${product.isSale ? `<span class="badge bg-danger fs-6 mb-1">-${product.saleRate}%</span>` : ''}
            <div class="d-flex align-items-center gap-3 fw-bold mb-4">
                ${oldPrice}
                <div class="fs-1 ${product.isSale ? 'text-danger' : ''}">
                    $${product.isSale ? product.salePrice : product.price}
                </div>
            </div>
            <div class="d-flex align-items-center gap-3 mb-3">
                <label for="quantityInput" class="form-label fw-bold">Quantity</label>
                <div style="max-width: 120px;" class="input-group rounded shadow-sm overflow-hidden">
                    <button class="btn btn-outline-dark border-0" type="button" id="decreaseQty">
                        <i class="bi bi-dash"></i>
                    </button>
                    <input type="text" id="quantityInput" class="form-control text-center bg-white border-0" value="1" disabled />
                    <button class="btn btn-outline-dark border-0" type="button" id="increaseQty">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
            </div>
            <div class="mb-5">
                <div class="d-flex align-items-center gap-2 fw-bold mb-2">
                    <span>Size</span>
                    <span class="opacity-50">·</span>
                    <span class="opacity-50">
                        EU ${product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
                    </span>
                </div>
                <div class="d-flex align-items-center flex-wrap gap-2">
                    ${product.size.map((size) => SizeBtn(size)).join('')}
                </div>
            </div>
            <div class="d-flex align-items-center gap-2 mb-3">
                <button id="add-to-cart-btn" type="button" class="btn btn-dark flex-grow-1 btn-lg lh-1 p-3 fw-semibold">
                    <i class="bi bi-bag"></i>
                    <span class="ms-1">Add to cart</span>
                </button>
                <button type="button" class="btn btn-outline-dark border-dark-subtle btn-lg lh-1 p-3">
                    <i class="bi bi-heart"></i>
                </button>
            </div>
            <div class="opacity-75">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-truck"></i>
                    <div>Free delivery on orders over $100</div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    <div>30 day returns and exchanges</div>
                </div>
            </div>`;
}

function ProductMoreInfo(product) {
    return `<div class="col-6">
                <div>Make</div>
            </div>
            <div class="col-6">
                <div class="fw-semibold">${product.make}</div>
            </div>
            <div class="col-6">
                <div>Model</div>
            </div>
            <div class="col-6">
                <div class="fw-semibold">${product.model}</div>
            </div>
            <div class="col-6">
                <div>Style</div>
            </div>
            <div class="col-6">
                <div class="fw-semibold">${product.styleID}</div>
            </div>
            <div class="col-6">
                <div>Colorway</div>
            </div>
            <div class="col-6">
                <div class="fw-semibold">${product.colorway}</div>
            </div>
            <div class="col-6">
                <div>Retail Price</div>
            </div>
            <div class="col-6">
                <div class="fw-semibold">$${product.price}</div>
            </div>
            <div class="col-6">
                <div>Release Date</div>
            </div>
            <div class="col-6">
                <div class="fw-semibold">${product.releaseDate}</div>
            </div>`;
}

function RelatedList(list) {
    function RelatedItem(item) {
        return `<div class="col-3 related-item">
                    ${ProductCard(item)}
                </div>`;
    }

    return `${list.map((item) => RelatedItem(item)).join('')}`;
}

function ImageModalList(list, currentIndex = 0) {
    function ImageModalItem(url, index) {
        return `<div class="carousel-item ${index === currentIndex ? 'active' : ''}">
                    <div class="d-flex align-items-center justify-content-center h-100">
                        <img src="${url}" class="d-block h-100" alt="image_${index}" />
                    </div>
                </div>`;
    }

    return `${list.map((url, index) => ImageModalItem(url, index)).join('')}`;
}

function ImageModalIndicator(list, currentIndex = 0) {
    function IndicatorItem(url, index) {
        return `<div
                    data-bs-target="#imageCarousel"
                    data-bs-slide-to="${index}"
                    class="${index === currentIndex ? 'active' : ''}"
                    style="width: 160px; height: auto; aspect-ratio: 3/2;"
                >
                    <img
                        src="${url}"
                        alt="image_${index}"
                        class="d-block w-100 h-100 object-fit-cover"
                    />
                </div>`;
    }

    return `${list.map((url, index) => IndicatorItem(url, index)).join('')}`;
}

$(document).ready(() => {
    const loader = new Loader();
    const products = new ProductList();
    const user = new UserManager();

    const productId = Number(new URLSearchParams(window.location.search).get('id'));
    let product = null;

    function renderImageModal(currentIndex = 0) {
        const $carouselInner = $('#carouselSlides').empty();
        const $carouselIndicators = $('#carouselIndicators').empty();
        $carouselInner.append(ImageModalList(product.productTemplateExternalPictures, currentIndex));
        $carouselIndicators.append(ImageModalIndicator(product.productTemplateExternalPictures, currentIndex));

        const $modal = $('#imageModal');
        $modal.modal('show');

        const $carousel = $('#imageCarousel');
        $carousel.carousel(currentIndex);
    }

    function renderProductImages() {
        const $productImages = $('.product-image-wrapper').empty();
        $productImages.append(ProductImages(product.productTemplateExternalPictures));

        const $mainImage = $('.main-image-item img');

        const handleImageClick = (event) => {
            const $imageClicked = $(event.currentTarget);
            const $target = $imageClicked.find('img');
            const src = $target.attr('src');
            const alt = $target.attr('alt');

            $('.image-item').removeClass('active');
            $imageClicked.addClass('active');

            $mainImage.fadeOut(150, () => $mainImage.attr('src', src).fadeIn(150));
            $mainImage.attr('alt', alt);
        };

        const $imageItems = $('.image-item');
        $imageItems.click(handleImageClick);

        handleImageClick({ currentTarget: $imageItems.first() });

        const handleOpenModal = () => {
            const currentSrc = $mainImage.attr('src');
            const clickedIndex = product.productTemplateExternalPictures.findIndex((src) => currentSrc.includes(src));

            renderImageModal(clickedIndex);
        };

        $mainImage.click(handleOpenModal);
        $('.image-more-box').click(handleOpenModal);
    }

    function renderProductInfo() {
        const $productInfo = $('.product-info-wrapper').empty();
        $productInfo.append(ProductInfo(product));

        const handleSizeClick = (event) => {
            const $sizeClicked = $(event.currentTarget);

            $sizeClicked.siblings().removeClass('active');
            $sizeClicked.addClass('active');
        };

        const $sizeOptions = $('.btn-size-option');
        $sizeOptions.click(handleSizeClick);

        const $quantityInput = $('#quantityInput');
        const $increaseQty = $('#increaseQty');
        const $decreaseQty = $('#decreaseQty');

        const Qty_MAX = 10;
        const Qty_MIN = 1;

        function handleQuantityInputChange() {
            const currentQty = Number($quantityInput.val());
            $increaseQty.prop('disabled', currentQty >= Qty_MAX);
            $decreaseQty.prop('disabled', currentQty <= Qty_MIN);
        }

        const handleIncreaseQty = () => {
            const currentQty = Number($quantityInput.val());
            const newQty = Math.min(Qty_MAX, currentQty + 1);
            $quantityInput.val(newQty);
            handleQuantityInputChange();
        };

        const handleDecreaseQty = () => {
            const currentQty = Number($quantityInput.val());
            const newQty = Math.max(Qty_MIN, currentQty - 1);
            $quantityInput.val(newQty);
            handleQuantityInputChange();
        };

        handleQuantityInputChange();
        $increaseQty.click(handleIncreaseQty);
        $decreaseQty.click(handleDecreaseQty);

        const $addToCartBtn = $('#add-to-cart-btn');

        function handleAddToCart() {
            if (!user.isLoggedIn()) {
                Toast.show('Please log in to add items to your cart.', {
                    type: 'warning',
                    icon: '<i class="bi bi-person-fill-exclamation"></i>',
                });
                return;
            }

            const selectedSize = $sizeOptions.filter('.active').data('size');
            const selectedQty = Number($quantityInput.val());

            if (!selectedSize) {
                Toast.show('Please choose a size before adding to your cart.', {
                    type: 'warning',
                    icon: '<i class="bi bi-exclamation-triangle-fill"></i>',
                });
                return;
            }

            const cartItem = {
                id: product.id,
                name: product.name,
                pictureUrl: product.pictureUrl,
                qty: selectedQty,
                size: selectedSize,
                colorway: product.colorway,
                gender: product.gender,
                price: product.price,
                salePrice: product.salePrice,
                isSale: product.isSale,
            };

            user.addToCart(cartItem);

            const cartList = user.getUser().cart || [];
            const $cartBadge = $('#cart-badge').empty();
            $cartBadge.text(cartList.length);
            $cartBadge.toggle(!!cartList.length);

            Toast.show('Added to cart successfully!', {
                type: 'success',
                icon: '<i class="bi bi-check-circle-fill"></i>',
            });
        }

        $addToCartBtn.click(handleAddToCart);
    }

    function renderRelatedList() {
        const $relatedList = $('#related-list').empty();
        $relatedList.append(RelatedList(products.getRelatedProductById(productId).slice(0, 10)));

        const scrollAmount = $('.related-item').outerWidth(true) * 2;

        const handleClickPrev = () => {
            $relatedList.animate({ scrollLeft: `-=${scrollAmount}` }, 0);
        };

        const handleClickNext = () => {
            $relatedList.animate({ scrollLeft: `+=${scrollAmount}` }, 0);
        };

        const $relatedBtnPrev = $('#related-btn-prev');
        const $relatedBtnNext = $('#related-btn-next');

        $relatedBtnPrev.click(handleClickPrev);
        $relatedBtnNext.click(handleClickNext);
    }

    function renderProductDetail() {
        $(document).attr('title', `${product.name}`);
        renderProductImages();
        renderProductInfo();
        $('.product-more-info-wrapper').empty().append(ProductMoreInfo(product));
        $('.product-desc-wrapper > p').empty().append(product.description);
        renderRelatedList();
    }

    async function fetchData() {
        try {
            loader.show();

            const productsRes = await api.getProducts();

            products.setListofProducts(productsRes);

            product = products.getProductById(productId);

            renderProductDetail();
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
    }

    init();
});
