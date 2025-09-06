const translations = {
    vi: {
        title: 'ZEUS',
        labels: {
            fullname: 'Tên đầy đủ',
            email: 'Email',
            password: 'Mật khẩu',
            password_confirmation: 'Nhập lại mật khẩu',
            submit: 'Đăng ký',
            forgot: 'Quên mật khẩu',
            login: 'Đăng nhập'
        },
        errors: {
            fullname_required: 'Vui lòng nhập tên đầy đủ của bạn',
            email_required: 'Vui lòng nhập email',
            email_invalid: 'Vui lòng nhập email hợp lệ',
            password_required: 'Vui lòng nhập mật khẩu',
            password_min: 'Mật khẩu phải có ít nhất 8 ký tự',
            password_confirm_required: 'Vui lòng nhập lại mật khẩu',
            password_confirm_mismatch: 'Mật khẩu nhập lại không chính xác'
        }
    },
    en: {
        title: 'ZEUS',
        labels: {
            fullname: 'Full name',
            email: 'Email',
            password: 'Password',
            password_confirmation: 'Confirm password',
            submit: 'Sign up',
            forgot: 'Forgot password',
            login: 'Sign in'
        },
        errors: {
            fullname_required: 'Please enter your full name',
            email_required: 'Please enter your email',
            email_invalid: 'Please enter a valid email address',
            password_required: 'Please enter a password',
            password_min: 'Password must be at least 8 characters',
            password_confirm_required: 'Please confirm your password',
            password_confirm_mismatch: 'Password confirmation does not match'
        }
    }
};

(function annotateDom() {
    const map = [
        { selector: 'form#form-1 h2', key: 'title' },
        { selector: '.inputBox:nth-of-type(1) span', key: 'labels.fullname' },
        { selector: '.inputBox:nth-of-type(2) span', key: 'labels.email' },
        { selector: '.inputBox:nth-of-type(3) span', key: 'labels.password' },
        { selector: '.inputBox:nth-of-type(4) span', key: 'labels.password_confirmation' },
        { selector: 'form#form-1 button[type="submit"]', key: 'labels.submit' },
        { selector: '.links a:nth-of-type(1)', key: 'labels.forgot' },
        { selector: '.links a:nth-of-type(2)', key: 'labels.login' }
    ];
    map.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el && !el.hasAttribute('data-i18n')) el.setAttribute('data-i18n', item.key);
    });
})();

function applyTranslations(lang) {
    const t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n'); 
        const parts = key.split('.');
        let value = t;
        for (const p of parts) {
            value = value?.[p];
            if (value === undefined) break;
        }
        if (value !== undefined) el.innerText = value;
    });

    document.querySelectorAll('input').forEach(inp => inp.removeAttribute('placeholder'));

    localStorage.setItem('site_lang', lang);
}

function clearValidationMessages() {
    document.querySelectorAll('.form-message').forEach(msg => msg.innerText = '');
    document.querySelectorAll('.inputBox').forEach(box => {
        box.classList.remove('invalid', 'error');
        const input = box.querySelector('input, textarea, select');
        if (input) {
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
            input.removeAttribute('data-error');
        }
    });
}

let validatorInstance = null;
function initValidator(lang) {
    if (validatorInstance && typeof validatorInstance.destroy === 'function') {
        try { validatorInstance.destroy(); } catch (e) { }
        validatorInstance = null;
    }

    const rules = [
        Validator.isRequired('#fullname', translations[lang].errors.fullname_required),
        Validator.isRequired('#email', translations[lang].errors.email_required),
        Validator.isEmail('#email', translations[lang].errors.email_invalid),
        Validator.isRequired('#password', translations[lang].errors.password_required),
        Validator.minLength('#password', 8, translations[lang].errors.password_min),
        Validator.isRequired('#password_confirmation', translations[lang].errors.password_confirm_required),
        Validator.isConfirmed('#password_confirmation', function () {
            return document.querySelector('#form-1 #password').value;
        }, translations[lang].errors.password_confirm_mismatch)
    ];

    const maybeInstance = Validator({
        form: '#form-1',
        formGroupSelector: '.inputBox',
        errorSelector: '.form-message',
        rules: rules,
        onSubmit: function (data) {
            console.log('Form data:', data);
            alert(lang === 'vi' ? 'Gửi form thành công' : 'Form submitted successfully');
        }
    });

    if (maybeInstance) validatorInstance = maybeInstance;
}

function changeLang(lang) {
    applyTranslations(lang);
    clearValidationMessages();
    initValidator(lang);
}

document.getElementById('btn-vi').addEventListener('click', () => changeLang('vi'));
document.getElementById('btn-en').addEventListener('click', () => changeLang('en'));

const initialLang = localStorage.getItem('site_lang') || 'vi';
applyTranslations(initialLang);
initValidator(initialLang);