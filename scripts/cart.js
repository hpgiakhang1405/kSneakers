import InnerLoader from './classes/InnerLoader.js';
import Loader from './classes/Loader.js';
import UserManager from './classes/UserManager.js';

function CartItem(item, index) {
    return `<div class="cart-item row g-5 p-4 mb-4">
                <a 
                    href="detail.html?id=${item.id}"
                    class="col-3 d-flex justify-content-center rounded-3 p-2 cart-item-img shadow-sm"
                >
                    <div style="background-image: url('${item.pictureUrl}');"></div>
                </a>
                <div class="col-9 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start gap-3">
                        <div>
                            <a href="detail.html?id=${item.id}" class="fw-bold fs-5 d-block mb-1">${item.name}</a>
                            <div class="text-muted fw-medium">
                                <div>${item.colorway}</div>
                                <div>
                                    Size: ${item.size} 
                                    (EU ${item.gender.charAt(0).toUpperCase() + item.gender.slice(1)})
                                </div>
                            </div>
                        </div>
                        <div class="text-end">
                            <div class="sale-price fs-5 fw-bold" data-index="${index}"></div>
                            <div class="price text-decoration-line-through opacity-50" data-index="${index}"></div>
                        </div>
                    </div>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <div
                            style="max-width: 120px"
                            class="input-group rounded shadow-sm overflow-hidden"
                        >
                            <button
                                class="decreaseQty btn btn-outline-dark border-0"
                                type="button"
                                data-index="${index}"
                            >
                                <i class="bi bi-dash"></i>
                            </button>
                            <input
                                type="text"
                                class="quantityInput form-control text-center bg-white border-0"
                                value="${item.qty}"
                                data-index="${index}"
                                disabled
                            />
                            <button
                                class="increaseQty btn btn-outline-dark border-0"
                                type="button"
                                data-index="${index}"
                            >
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                        <button
                            type="button"
                            class="remove-btn btn btn-outline-danger border-danger-subtle rounded-3"
                            data-index="${index}"
                        >
                            <i class="bi bi-trash me-1"></i>
                            <span>Remove</span>
                        </button>
                    </div>
                </div>
            </div>`;
}

$(document).ready(() => {
    const loader = new Loader();
    const user = new UserManager();
    const innerLoader = new InnerLoader($('#cart-wrapper'));

    function checkLogged() {
        if (!user.isLoggedIn()) window.location.href = 'auth.html?mode=login';
    }

    function handleCartEvents() {
        const $quantityInput = $('.quantityInput');
        const $increaseQty = $('.increaseQty');
        const $decreaseQty = $('.decreaseQty');

        const Qty_MAX = 10;
        const Qty_MIN = 1;

        function handleQuantityInputChange() {
            $quantityInput.each((_, input) => {
                const currentIndex = $(input).data('index');
                const $targetInc = $increaseQty.filter(`[data-index="${currentIndex}"]`);
                const $targetDec = $decreaseQty.filter(`[data-index="${currentIndex}"]`);
                const currentQty = Number($(input).val());

                const $salePrice = $(`.sale-price[data-index="${currentIndex}"]`);
                const $price = $(`.price[data-index="${currentIndex}"]`);

                const item = user.getCartItemByIndex(currentIndex);
                const salePrice = item.salePrice * currentQty;
                const price = item.price * currentQty;
                $salePrice.text(`$${salePrice}`);
                $price.text(`$${price}`);
                if (!item.isSale) $price.hide();

                user.updateCartItemQty(currentIndex, currentQty);
                renderOrderSummary();

                $targetInc.prop('disabled', currentQty >= Qty_MAX);
                $targetDec.prop('disabled', currentQty <= Qty_MIN);
            });
        }

        const handleIncreaseQty = (e) => {
            const targetIndex = $(e.currentTarget).data('index');
            const $targetInput = $quantityInput.filter(`[data-index="${targetIndex}"]`);

            const currentQty = Number($targetInput.val());
            const newQty = Math.min(Qty_MAX, currentQty + 1);
            $targetInput.val(newQty);
            handleQuantityInputChange();
        };

        const handleDecreaseQty = (e) => {
            const targetIndex = $(e.currentTarget).data('index');
            const $targetInput = $quantityInput.filter(`[data-index="${targetIndex}"]`);

            const currentQty = Number($targetInput.val());
            const newQty = Math.max(Qty_MIN, currentQty - 1);
            $targetInput.val(newQty);
            handleQuantityInputChange();
        };

        handleQuantityInputChange();
        $increaseQty.click(handleIncreaseQty);
        $decreaseQty.click(handleDecreaseQty);

        const $removeBtn = $('.remove-btn');

        function handleRemoveItem(e) {
            const targetIndex = $(e.currentTarget).data('index');
            user.removeCartItem(targetIndex);
            renderCart();
        }

        $removeBtn.click(handleRemoveItem);
    }

    function renderOrderSummary() {
        const $orderSummary = $('.order-summary-card');
        const $subtotalOld = $orderSummary.find('.subtotal-value-old');
        const $subtotalNew = $orderSummary.find('.subtotal-value-new');
        const $shippingOld = $orderSummary.find('.shipping-value-old');
        const $shippingNew = $orderSummary.find('.shipping-value-new');
        const $tax = $orderSummary.find('.tax-value');
        const $totalOld = $orderSummary.find('.total-value-old');
        const $totalNew = $orderSummary.find('.total-value-new');
        const $checkoutBtn = $orderSummary.find('#checkout-btn');

        const list = user.getUser().cart || [];
        const haveItemSale = list.some((item) => item.isSale);

        const subtotalOld = list.reduce((acc, item) => acc + item.price * item.qty, 0);
        const subtotalNew = list.reduce((acc, item) => acc + item.salePrice * item.qty, 0);
        const shippingOld = subtotalOld > 0 ? 30 : 0;
        const shippingNew = subtotalNew > 100 ? 0 : shippingOld;
        const tax = (subtotalNew + shippingNew) * 0.1;
        const totalOld = subtotalOld + shippingOld + tax;
        const totalNew = subtotalNew + shippingNew + tax;

        $subtotalOld.text(`$${subtotalOld}`);
        $subtotalNew.text(`$${subtotalNew}`);
        $shippingOld.text(`$${shippingOld}`);
        $shippingNew.text(`$${shippingNew}`);
        $tax.text(`$${tax.toFixed(2)}`);
        $totalOld.text(`$${totalOld.toFixed(2)}`);
        $totalNew.text(`$${totalNew.toFixed(2)}`);

        $checkoutBtn.prop('disabled', !list.length);

        $subtotalOld.show();
        $shippingOld.show();
        $totalOld.show();

        if (!haveItemSale) $subtotalOld.hide();
        if (shippingNew === shippingOld) $shippingOld.hide();
        if (!haveItemSale && shippingNew === shippingOld) $totalOld.hide();
    }

    function renderCart() {
        innerLoader.show();

        const list = user.getUser().cart || [];

        setTimeout(() => {
            const $cartBadge = $('#cart-badge').empty();
            $cartBadge.text(list.length);
            $cartBadge.toggle(!!list.length);

            const $cartList = $('#cart-list').empty();
            $('.cart-qty').text(`(${list.length} item${list.length > 1 ? 's' : ''})`);
            if (!list.length) {
                $cartList.html('<h5 class="text-center mt-5">Your cart is empty.</h5>');
            } else {
                list.forEach((item, index) => $cartList.append(CartItem(item, index)));
                handleCartEvents();
            }
            renderOrderSummary();

            innerLoader.hide();
        }, 1000);
    }

    function init() {
        loader.show();

        checkLogged();
        renderCart();

        setTimeout(() => {
            loader.hide();
        }, 500);
    }

    init();
});
