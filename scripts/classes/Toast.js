class Toast {
    static show(message, options = {}) {
        const { type = 'info', delay = 4000, icon = '' } = options;

        const id = `toast-${Date.now()}`;
        const toastHTML = `
            <div id="${id}" class="toast toast-modern ${type}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="${delay}">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="toast-body">
                        ${icon ? `<span class="toast-icon">${icon}</span>` : ''}
                        <span>${message}</span>
                    </div>
                    <button type="button" class="btn-close ms-3" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        $('#toast-container').append(toastHTML);
        const $toast = $(`#${id}`);
        const toast = new bootstrap.Toast($toast[0]);
        toast.show();

        $toast.on('hidden.bs.toast', () => $toast.remove());
    }
}

export default Toast;
