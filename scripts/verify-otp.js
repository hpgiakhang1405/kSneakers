import AccountManager from './classes/AccountManager.js';
import InnerLoader from './classes/InnerLoader.js';
import Loader from './classes/Loader.js';
import Toast from './classes/Toast.js';
import UserManager from './classes/UserManager.js';

$(document).ready(() => {
    const loader = new Loader();
    const innerLoader = new InnerLoader($('.otp-card'));
    const verifyingUser = UserManager.getVerifyingUser();
    const accounts = new AccountManager();

    const $otpForm = $('#otp-form');
    const $otpInputs = $('.otp-input');
    const $resendBtn = $('#resendBtn');
    const $countdown = $('#countdown');

    let timer = null;
    const COUNTDOWN_TIME = 300;
    let timeRemaining = COUNTDOWN_TIME;

    function checkVerifyingUser() {
        if (!verifyingUser) window.location.href = 'auth.html';
    }

    function renderUI() {
        $('#email-verify').text(verifyingUser.email);
    }

    function clearError() {
        $('form.error').removeClass('error');
    }

    function startCountdown() {
        clearInterval(timer);
        timeRemaining = COUNTDOWN_TIME;
        updateCountdownDisplay();

        timer = setInterval(() => {
            timeRemaining--;
            updateCountdownDisplay();

            if (timeRemaining < 0) {
                clearInterval(timer);
                $countdown.text('00:00');
            }
        }, 1000);
    }

    function updateCountdownDisplay() {
        const min = Math.floor(timeRemaining / 60);
        const sec = timeRemaining % 60;
        $countdown.text(`${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`);
    }

    function handleKeypress(e) {
        if (e.which < 48 || e.which > 57) e.preventDefault();
    }

    function handleKeyup(e) {
        const $input = $(e.target);
        const key = e.key;
        const value = $input.val();

        if (key === 'Backspace' && !value) {
            $input.prev('.otp-input').focus();
            return;
        }

        if (key === 'ArrowLeft') {
            $input.prev('.otp-input').focus();
            return;
        }

        if (key === 'ArrowRight') {
            $input.next('.otp-input').focus();
            return;
        }

        if (key === 'Enter') {
            $otpForm.submit();
            return;
        }

        const regex = /^\d$/;
        if (regex.test(value)) $input.next('.otp-input').focus();
    }

    function handleFocus(e) {
        $(e.target).select();
    }

    function setupInputEvents() {
        $otpInputs.on('keypress', handleKeypress).on('keyup', handleKeyup).on('focus', handleFocus);
    }

    function resetInputs() {
        $otpInputs.val('');
        $otpInputs.first().focus();
    }

    function handleResend(e) {
        e.preventDefault();

        innerLoader.show();

        setTimeout(() => {
            Toast.show("We've just sent you a new OTP!", {
                type: 'info',
                icon: '<i class="bi bi-envelope-arrow-up-fill"></i>',
            });

            setTimeout(() => {
                resetInputs();
                clearError();
                startCountdown();
                innerLoader.hide();
            }, 1000);
        }, 1000);
    }

    function getOtpValue() {
        return $otpInputs
            .map((_, input) => $(input).val())
            .get()
            .join('');
    }

    function validateOtp() {
        const otpRegex = /^\d{6}$/;
        const otp = getOtpValue();
        const isValid = otpRegex.test(otp);
        return isValid;
    }

    function verifyOtp() {
        const targetOTP = '123456';
        const otp = getOtpValue();
        const isValid = otp === targetOTP;
        return isValid;
    }

    function handleSubmit(e) {
        e.preventDefault();
        clearError();

        innerLoader.show();

        const isValid = validateOtp() && verifyOtp();

        setTimeout(() => {
            if (!isValid) {
                $otpForm.addClass('error');
                innerLoader.hide();
            } else {
                accounts.addAccount(verifyingUser);
                UserManager.clearVerifyingUser();
                Toast.show('Your account has been created successfully!', {
                    type: 'success',
                    icon: '<i class="bi bi-check-circle-fill"></i>',
                });
                setTimeout(() => {
                    window.location.href = 'auth.html';
                }, 2000);
            }
        }, 2000);
    }

    function setupFormEvents() {
        $otpForm.on('submit', handleSubmit);
        $resendBtn.on('click', handleResend);
    }

    function init() {
        loader.show();

        checkVerifyingUser();
        renderUI();
        setupInputEvents();
        setupFormEvents();
        startCountdown();

        setTimeout(() => {
            loader.hide();
        }, 500);
    }

    init();
});
