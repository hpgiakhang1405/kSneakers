import Loader from './classes/Loader.js';
import UserManager from './classes/UserManager.js';
import AccountManager from './classes/AccountManager.js';
import InnerLoader from './classes/InnerLoader.js';
import Toast from './classes/Toast.js';

$(document).ready(() => {
    const loader = new Loader();
    const innerLoader = new InnerLoader($('.auth-wrapper'));
    const user = new UserManager();
    const accounts = new AccountManager();

    const url = new URL(window.location.href);

    function checkLogged() {
        if (user.isLoggedIn()) window.location.href = 'index.html';
    }

    function setImageAuth() {
        const randomIndex = Math.floor(Math.random() * 4);
        $('.auth-image').css('background-image', `url(assets/images/auth_image_${randomIndex}.jpg)`);
    }

    function scrollToTop() {
        $('html, body').animate({ scrollTop: 0 }, 0);
    }

    function handleTriggerClick(e) {
        const targetMode = e.currentTarget.dataset.mode;
        url.searchParams.set('mode', targetMode);
        history.pushState({}, '', url);

        activeForm();
    }

    $('.trigger').click(handleTriggerClick);

    const patterns = {
        username: /^\w{3,20}$/,
        email: /^\S+@\w+(?:\.\w+)+$/,
        password: /^.{8,}$/,
    };

    function validateField($elem, regex) {
        const value = $elem.val().trim();
        const isValid = regex.test(value);
        $elem.toggleClass('is-invalid', !isValid);
        return isValid;
    }

    function handleTogglePassword(e) {
        const target = e.currentTarget.dataset.target;
        const type = $(target).attr('type') === 'text' ? 'password' : 'text';
        $(target).attr('type', type);
        $(this).find('i').toggleClass('bi-eye bi-eye-slash');
    }

    $('.toggle-password').click(handleTogglePassword);

    function clearError() {
        $('form.error').removeClass('error');
        $('form .is-invalid').removeClass('is-invalid');
    }

    const $loginForm = $('.login.needs-validation');
    const $loginUsername = $('#login-username');
    const $loginPassword = $('#login-password');

    function handleLoginFormChange() {
        $loginUsername.on('input', () => validateField($loginUsername, patterns.username));
        $loginPassword.on('input', () => validateField($loginPassword, patterns.password));
    }

    function removeLoginFormEvents() {
        $loginUsername.off('input');
        $loginPassword.off('input');
    }

    function handleLoginSubmit(e) {
        e.preventDefault();
        clearError();

        const valid = [
            validateField($loginUsername, patterns.username),
            validateField($loginPassword, patterns.password),
        ];

        if (valid.includes(false)) {
            e.stopPropagation();
            handleLoginFormChange();
            return;
        }

        innerLoader.show();

        const account = {
            username: $loginUsername.val().trim(),
            password: $loginPassword.val().trim(),
        };

        const targetAccount = accounts.getAccount(account);

        setTimeout(() => {
            if (targetAccount) {
                Toast.show("Welcome back! You're now logged in.", {
                    type: 'success',
                    icon: '<i class="bi bi-check-circle-fill"></i>',
                });
                user.login(targetAccount);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                $loginForm.addClass('error');
                innerLoader.hide();
            }
        }, 2000);
    }

    $loginForm.submit(handleLoginSubmit);

    const $registerForm = $('.register.needs-validation');
    const $registerUsername = $('#register-username');
    const $registerEmail = $('#register-email');
    const $registerPassword = $('#register-password');
    const $registerConfirmPassword = $('#register-confirm-password');
    const $registerAgreeCheck = $('#register-agree-check');

    function validateAgreeCheck() {
        const isChecked = $registerAgreeCheck.is(':checked');
        $registerAgreeCheck.toggleClass('is-invalid', !isChecked);
        return isChecked;
    }

    function validateConfirmPassword() {
        const password = $registerPassword.val().trim();
        const confirmPassword = $registerConfirmPassword.val().trim();
        const isValid = password === confirmPassword;
        $registerConfirmPassword.toggleClass('is-invalid', !isValid);
        return isValid;
    }

    function handleRegisterFormChange() {
        $registerUsername.on('input', () => validateField($registerUsername, patterns.username));
        $registerEmail.on('input', () => validateField($registerEmail, patterns.email));
        $registerPassword.on('input', () => validateField($registerPassword, patterns.password));
        $registerConfirmPassword.on('input', validateConfirmPassword);
        $registerAgreeCheck.on('change', validateAgreeCheck);
    }

    function removeRegisterFormEvents() {
        $registerUsername.off('input');
        $registerEmail.off('input');
        $registerPassword.off('input');
        $registerConfirmPassword.off('input');
        $registerAgreeCheck.off('change');
    }

    function handleRegisterSubmit(e) {
        e.preventDefault();
        clearError();

        const valid = [
            validateField($registerUsername, patterns.username),
            validateField($registerEmail, patterns.email),
            validateField($registerPassword, patterns.password),
            validateConfirmPassword(),
            validateAgreeCheck(),
        ];

        if (valid.includes(false)) {
            e.stopPropagation();
            handleRegisterFormChange();
            return;
        }

        innerLoader.show();

        const account = {
            username: $registerUsername.val().trim(),
            email: $registerEmail.val().trim(),
            password: $registerPassword.val().trim(),
        };

        const isExists = accounts.isExists(account);

        setTimeout(() => {
            if (!isExists) {
                UserManager.setVerifyingUser(account);
                window.location.href = `verify-otp.html`;
            } else {
                $registerForm.addClass('error');
                innerLoader.hide();
            }
        }, 2000);
    }

    $registerForm.submit(handleRegisterSubmit);

    function resetAllForms() {
        $loginForm[0].reset();
        removeLoginFormEvents();
        $registerForm[0].reset();
        removeRegisterFormEvents();
        clearError();
    }

    function activeForm() {
        scrollToTop();

        const currentMode = url.searchParams.get('mode') || 'login';
        const prevMode = currentMode === 'login' ? 'register' : 'login';

        const title = currentMode === 'login' ? 'Sign In' : 'Sign Up';
        $(document).attr('title', `Welcome to K.SNEAK - ${title}`);

        setTimeout(() => {
            $(`.${currentMode}`).addClass('active');
            $(`.${prevMode}`).removeClass('active');
        }, 500);

        setTimeout(() => {
            resetAllForms();
        }, 1000);
    }

    function init() {
        loader.show();

        checkLogged();
        setImageAuth();
        activeForm();

        setTimeout(() => {
            loader.hide();
        }, 500);
    }

    init();
});
