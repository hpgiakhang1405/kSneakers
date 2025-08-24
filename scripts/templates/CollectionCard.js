function GenderCollectionContent(item) {
    return `<div class="overlay-content">
                <h4 class="fw-bold">${item.title}</h4>
                <p class="fw-semibold">${item.slogan}</p>
                <button class="btn btn-outline-light">Shop Now</button>
            </div>`;
}

function BrandCollectionContent(item) {
    return `<div class="overlay-content h-100 d-flex flex-column justify-content-between">
                <div class="d-flex align-items-center gap-2 mb-2">
                    <div class="bg-white rounded-circle p-1">
                        <img
                            src="${item.logo}"
                            alt="${item.slug}"
                            class="rounded-circle object-fit-contain"
                            style="width: 50px; height: 50px"
                        />
                    </div>
                    <span class="fw-bold fs-5">${item.name}</span>
                </div>
                <div>
                    <p class="fw-bold fs-4">${item.slogan}</p>
                    <button class="btn btn-outline-light">Shop Now</button>
                </div>
            </div>`;
}

const sizeMapping = {
    gender: '52.25',
    brand: '35',
};

function CollectionCard(type, item, href) {
    const size = sizeMapping[type] || '35';

    return `<a href="${href}">
                <div class="collection-card" style="background-image: url('${item.thumbnail}'); padding-top: ${size}%;">
                    <div class="overlay">
                        ${type === 'gender' ? GenderCollectionContent(item) : BrandCollectionContent(item)}
                    </div>
                </div>
            </a>`;
}

export default CollectionCard;
