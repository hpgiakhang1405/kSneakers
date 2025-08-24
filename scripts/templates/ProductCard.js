function ProductCard(item) {
    let badge = '';
    if (item.isSale) {
        badge = `<span class="badge rounded-pill bg-danger">-${item.saleRate}%</span>`;
    } else if (item.isNew) {
        badge = `<span class="badge rounded-pill bg-warning">New</span>`;
    }

    const oldPrice = item.isSale
        ? `<div class="text-decoration-line-through fw-bold opacity-50">$${item.price}</div>`
        : '';

    return `<a href="detail.html?id=${item.id}">
                <div class="section-item product-card position-relative">
                    <div class="product-card-img-wrapper">
                        <div class="product-card-brand">${item.brand}</div>
                        <div class="product-card-img" style="background-image: url('${item.pictureUrl}');"></div>
                    </div>
                    <div class="product-card-text">
                        <div class="truncate-2">${item.name}</div>
                        <div class="d-flex align-items-center gap-3">
                            ${oldPrice}
                            <div class="fw-bold fs-5 ${item.isSale ? 'text-danger' : ''}">
                                $${item.isSale ? item.salePrice : item.price}
                            </div>
                        </div>
                    </div>
                    ${badge}
                </div>
            </a>`;
}

export default ProductCard;
