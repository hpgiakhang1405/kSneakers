function Avatar(src, alt, size = 45) {
    return `<img
                src="${src}"
                alt="${alt}"
                class="rounded-circle object-fit-cover"
                style="width: ${size}px; height: ${size}px"
            />`;
}

export default Avatar;
