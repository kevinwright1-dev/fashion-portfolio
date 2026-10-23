/* Authentication page logic. Passwords and CAPTCHA tokens stay in memory only. */
const authMessageError = document.getElementById('error-container');
const authMessageSuccess = document.getElementById('success-container');
const authPanels = {
    signup: document.getElementById('signup-panel'),
    login: document.getElementById('login-panel'),
    recovery: document.getElementById('recovery-panel'),
    account: document.getElementById('account-panel'),
    mfa: document.getElementById('mfa-challenge-panel')
};
const allowedDestinations = new Set([
    'index.html', 'profile.html', 'closet.html', 'outfits.html', 'inspo.html', 'forum.html'
]);
const query = new URLSearchParams(window.location.search);
const requestedRedirect = query.get('redirect');
const postAuthRedirect = allowedDestinations.has(requestedRedirect) ? requestedRedirect : 'profile.html';
const isRecoveryLink = query.get('flow') === 'recovery';
const turnstileWidgets = new Map();
let activeChallenge = null;
let mfaEnrollmentFactorId = null;
let turnstileConfigured = false;

function displayMessage(container, message) {
    container.textContent = message;
    container.hidden = !message;
}

function clearMessages() {
    displayMessage(authMessageError, '');
    displayMessage(authMessageSuccess, '');
}

function showError(message) {
    displayMessage(authMessageSuccess, '');
    displayMessage(authMessageError, message);
}

function showSuccess(message) {
    displayMessage(authMessageError, '');
    displayMessage(authMessageSuccess, message);
}

function normalizedEmail(input) {
    return input.value.trim().toLowerCase();
}

function setPanel(panelName) {
    Object.entries(authPanels).forEach(([name, panel]) => {
        panel.hidden = name !== panelName;
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach((tab) => {
        const active = tab.dataset.tab === tabName;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
    });
    authPanels.signup.hidden = tabName !== 'signup';
    authPanels.login.hidden = tabName !== 'login';
    document.getElementById('login-form').hidden = false;
    document.getElementById('reset-form').hidden = true;
    renderTurnstileWithin(authPanels[tabName]);
    clearMessages();
}

function humanAuthError(error, fallback) {
    if (error?.status === 429 || error?.code === 'over_request_rate_limit' || error?.name === 'RateLimitError') {
        return 'Too many requests. Please wait a moment before trying again.';
    }
    return fallback;
}

function setPending(form, pending) {
    const submit = form.querySelector('[type="submit"]');
    if (!submit) return () => {};
    const originalText = submit.textContent;
    submit.disabled = pending;
    if (pending) submit.textContent = 'please wait…';
    return () => {
        submit.disabled = false;
        submit.textContent = originalText;
    };
}

function captchaTokenFor(form) {
    const slot = form.querySelector('[data-turnstile]');
    const widgetId = slot && turnstileWidgets.get(slot);
    return widgetId ? window.turnstile.getResponse(widgetId) : '';
}

function resetCaptcha(form) {
    const slot = form.querySelector('[data-turnstile]');
    const widgetId = slot && turnstileWidgets.get(slot);
    if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
}

function requireCaptcha(form) {
    const token = captchaTokenFor(form);
    if (!token) {
        showError('Complete the CAPTCHA challenge before continuing.');
        return null;
    }
    return token;
}

function initializeTurnstile() {
    const siteKey = window.turnstileSiteKey;
    turnstileConfigured = typeof siteKey === 'string' && siteKey.length > 0 && !siteKey.includes('REPLACE_WITH') && Boolean(window.turnstile);
    if (!turnstileConfigured) {
        document.querySelectorAll('#signup-form [data-turnstile], #login-form [data-turnstile], #reset-form [data-turnstile]').forEach((slot) => {
            const message = document.createElement('p');
            message.className = 'field-hint';
            message.textContent = 'CAPTCHA is not configured. Contact the site administrator.';
            slot.replaceChildren(message);
        });
        document.querySelectorAll('#signup-form .submit-button, #login-form .submit-button, #reset-form .submit-button').forEach((button) => { button.disabled = true; });
        return;
    }

    renderTurnstileWithin(document);
}

function renderTurnstileWithin(root) {
    if (!turnstileConfigured || !window.turnstile) return;
    document.querySelectorAll('[data-turnstile]').forEach((slot) => {
        if (root !== document && !root.contains(slot)) return;
        if (slot.closest('[hidden]') || turnstileWidgets.has(slot)) return;
        const id = window.turnstile.render(slot, {
            sitekey: window.turnstileSiteKey,
            callback: () => {},
            'expired-callback': () => {},
            'error-callback': () => showError('CAPTCHA is temporarily unavailable. Please try again.')
        });
        turnstileWidgets.set(slot, id);
    });
}

function clearSensitiveForms() {
    document.querySelectorAll('form').forEach((form) => form.reset());
    document.querySelectorAll('.visibility-toggle').forEach((toggle) => {
        const input = document.getElementById(toggle.dataset.togglePassword);
        if (input) input.type = 'password';
        toggle.textContent = 'show';
        toggle.setAttribute('aria-label', 'Show password');
        toggle.setAttribute('aria-pressed', 'false');
    });
    activeChallenge = null;
    mfaEnrollmentFactorId = null;
    document.getElementById('mfa-enrollment').hidden = true;
    document.getElementById('mfa-qr').removeAttribute('src');
    document.getElementById('mfa-secret').textContent = '';
}

function safeRedirectTarget() {
    // Keep navigation same-origin and limit it to known application pages.
    const destination = new URL(postAuthRedirect, window.location.origin + '/');
    if (destination.origin !== window.location.origin || !allowedDestinations.has(destination.pathname.split('/').pop())) {
        return 'profile.html';
    }
    return destination.href;
}

function goAfterAuth() {
    window.location.replace(safeRedirectTarget());
}

function stripAuthSecretsFromUrl() {
    const current = new URL(window.location.href);
    const safeQuery = new URLSearchParams();
    if (isRecoveryLink) safeQuery.set('flow', 'recovery');
    else if (query.get('flow') === 'confirmed') safeQuery.set('flow', 'confirmed');
    if (requestedRedirect && allowedDestinations.has(requestedRedirect)) safeQuery.set('redirect', requestedRedirect);
    const cleanUrl = current.pathname + (safeQuery.size ? `?${safeQuery.toString()}` : '');
    if (current.search || current.hash) window.history.replaceState(null, document.title, cleanUrl);
}

async function showAccountForSession() {
    const { data: levelData, error: levelError } = await supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel();
    if (levelError) {
        setPanel('account');
        showError('Your session is active, but account security details could not be loaded.');
        return;
    }

    if (levelData.nextLevel === 'aal2' && levelData.currentLevel !== 'aal2') {
        const { data: factorsData, error: factorsError } = await supabaseClient.auth.mfa.listFactors();
        const factor = factorsData?.totp?.find((item) => item.status === 'verified');
        if (factorsError || !factor) {
            setPanel('account');
            showError('A second factor is required, but could not be loaded. Sign out and try again.');
            return;
        }
        const { data: challengeData, error: challengeError } = await supabaseClient.auth.mfa.challenge({ factorId: factor.id });
        if (challengeError) {
            setPanel('account');
            showError('Unable to start the authenticator check. Please try again.');
            return;
        }
        activeChallenge = { factorId: factor.id, challengeId: challengeData.id };
        setPanel('mfa');
        document.getElementById('mfa-challenge-code').focus();
        return;
    }

    setPanel('account');
    const { data: userData } = await supabaseClient.auth.getUser();
    document.getElementById('account-status').textContent = userData?.user?.email
        ? `Signed in as ${userData.user.email}.`
        : 'You are signed in.';
}

function startSessionUiUpdate() {
    // Run outside the auth callback: Supabase warns against awaiting other auth calls there.
    window.setTimeout(() => { void showAccountForSession(); }, 0);
}

document.querySelectorAll('.auth-tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
        event.preventDefault();
        const tabs = [...document.querySelectorAll('.auth-tab')];
        const currentIndex = tabs.indexOf(tab);
        const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
            : (currentIndex + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
        tabs[nextIndex].focus();
        switchTab(tabs[nextIndex].dataset.tab);
    });
});

document.querySelectorAll('.visibility-toggle').forEach((button) => {
    button.addEventListener('click', () => {
        const input = document.getElementById(button.dataset.togglePassword);
        const isVisible = input.type === 'text';
        input.type = isVisible ? 'password' : 'text';
        button.textContent = isVisible ? 'show' : 'hide';
        button.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
        button.setAttribute('aria-pressed', String(!isVisible));
    });
});

document.getElementById('forgot-password-link').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('login-form').hidden = true;
    document.getElementById('reset-form').hidden = false;
    renderTurnstileWithin(authPanels.login);
    document.getElementById('reset-email').value = normalizedEmail(document.getElementById('login-email'));
    clearMessages();
    document.getElementById('reset-email').focus();
});

document.getElementById('back-to-login-link').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('reset-form').hidden = true;
    document.getElementById('login-form').hidden = false;
    clearMessages();
});

document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();
    const form = event.currentTarget;
    const token = requireCaptcha(form);
    if (!token) return;

    const emailInput = document.getElementById('signup-email');
    const usernameInput = document.getElementById('signup-username');
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const username = usernameInput.value.trim();
    if (!form.reportValidity()) return;
    if (password.length < 15) return showError('Use a password with at least 15 characters.');
    if (password !== confirmPassword) return showError('The passwords do not match.');
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) return showError('Username must be 3–30 letters, numbers, or underscores.');

    const restore = setPending(form, true);
    try {
        const { error } = await supabaseClient.auth.signUp({
            email: normalizedEmail(emailInput),
            password,
            options: {
                captchaToken: token,
                emailRedirectTo: new URL('auth.html?flow=confirmed', window.location.href).href,
                data: { username }
            }
        });
        if (error) throw error;
        form.reset();
        showSuccess('If registration can be completed, check your email for confirmation instructions.');
    } catch (error) {
        showError(humanAuthError(error, 'Unable to complete sign-up. Check your details and try again.'));
    } finally {
        restore();
        resetCaptcha(form);
    }
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();
    const form = event.currentTarget;
    const token = requireCaptcha(form);
    if (!token || !form.reportValidity()) return;
    const email = normalizedEmail(document.getElementById('login-email'));
    const password = document.getElementById('login-password').value;
    const restore = setPending(form, true);
    try {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password, options: { captchaToken: token } });
        if (error) throw error;
        await showAccountForSession();
        if (document.getElementById('account-panel').hidden) return;
        if (document.getElementById('mfa-challenge-panel').hidden) goAfterAuth();
    } catch (error) {
        showError(humanAuthError(error, 'Invalid email or password.'));
    } finally {
        restore();
        resetCaptcha(form);
        document.getElementById('login-password').value = '';
    }
});

document.getElementById('reset-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();
    const form = event.currentTarget;
    const token = requireCaptcha(form);
    if (!token || !form.reportValidity()) return;
    const email = normalizedEmail(document.getElementById('reset-email'));
    const restore = setPending(form, true);
    try {
        const redirectTo = new URL('auth.html?flow=recovery', window.location.href).href;
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo, captchaToken: token });
        if (error) throw error;
        showSuccess('If an account exists for that email, we sent password reset instructions.');
        form.reset();
    } catch (error) {
        showError(humanAuthError(error, 'Unable to send reset instructions. Please try again later.'));
    } finally {
        restore();
        resetCaptcha(form);
    }
});

document.getElementById('recovery-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();
    const form = event.currentTarget;
    const password = document.getElementById('recovery-password').value;
    if (!form.reportValidity()) return;
    if (password.length < 15) return showError('Use a password with at least 15 characters.');
    const restore = setPending(form, true);
    try {
        const { error } = await supabaseClient.auth.updateUser({ password });
        if (error) throw error;
        form.reset();
        await supabaseClient.auth.signOut({ scope: 'global' });
        switchTab('login');
        showSuccess('Password updated. Please sign in again.');
    } catch {
        showError('Unable to update the password. The reset link may have expired; request a new one.');
    } finally {
        restore();
    }
});

document.getElementById('email-change-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const restore = setPending(form, true);
    try {
        const { error } = await supabaseClient.auth.updateUser({ email: normalizedEmail(document.getElementById('change-email')) });
        if (error) throw error;
        form.reset();
        showSuccess('Follow the confirmation instructions sent by email to finish changing your address.');
    } catch {
        showError('Unable to request an email change. Please try again.');
    } finally {
        restore();
    }
});

document.getElementById('logout-button').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
        const { error } = await supabaseClient.auth.signOut({ scope: 'global' });
        if (error) throw error;
        clearSensitiveForms();
        clearMessages();
        setPanel('signup');
        switchTab('login');
        showSuccess('You have been signed out everywhere.');
    } catch {
        showError('Unable to sign out. Please try again.');
    } finally {
        button.disabled = false;
    }
});

document.getElementById('enroll-mfa-button').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    clearMessages();
    try {
        const { data, error } = await supabaseClient.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Fashion Closet authenticator' });
        if (error) throw error;
        mfaEnrollmentFactorId = data.id;
        document.getElementById('mfa-qr').src = `data:image/svg+xml,${encodeURIComponent(data.totp.qr_code)}`;
        document.getElementById('mfa-secret').textContent = `Setup secret: ${data.totp.secret}`;
        document.getElementById('mfa-enrollment').hidden = false;
        document.getElementById('mfa-code').focus();
    } catch {
        showError('Unable to start authenticator setup. Please try again.');
    } finally {
        button.disabled = false;
    }
});

document.getElementById('mfa-verify-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();
    const form = event.currentTarget;
    const code = document.getElementById('mfa-code').value.trim();
    if (!form.reportValidity() || !mfaEnrollmentFactorId) return;
    const restore = setPending(form, true);
    try {
        const { data: challenge, error: challengeError } = await supabaseClient.auth.mfa.challenge({ factorId: mfaEnrollmentFactorId });
        if (challengeError) throw challengeError;
        const { error } = await supabaseClient.auth.mfa.verify({
            factorId: mfaEnrollmentFactorId,
            challengeId: challenge.id,
            code
        });
        if (error) throw error;
        document.getElementById('mfa-enrollment').hidden = true;
        document.getElementById('mfa-qr').removeAttribute('src');
        document.getElementById('mfa-secret').textContent = '';
        document.getElementById('mfa-code').value = '';
        mfaEnrollmentFactorId = null;
        showSuccess('Authenticator MFA is enabled.');
    } catch {
        showError('That code could not be verified. Check the code and try again.');
    } finally {
        restore();
    }
});

document.getElementById('mfa-challenge-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();
    const form = event.currentTarget;
    const code = document.getElementById('mfa-challenge-code').value.trim();
    if (!form.reportValidity() || !activeChallenge) return;
    const restore = setPending(form, true);
    try {
        const { error } = await supabaseClient.auth.mfa.verify({ ...activeChallenge, code });
        if (error) throw error;
        activeChallenge = null;
        goAfterAuth();
    } catch {
        showError('That code could not be verified. Check the code and try again.');
    } finally {
        restore();
        document.getElementById('mfa-challenge-code').value = '';
    }
});

supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        clearSensitiveForms();
        setPanel('signup');
        switchTab('login');
        return;
    }
    if (event === 'PASSWORD_RECOVERY') {
        setPanel('recovery');
        document.getElementById('recovery-password').focus();
        return;
    }
    if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'MFA_CHALLENGE_VERIFIED')) {
        startSessionUiUpdate();
    }
});

async function initializeAuthPage() {
    initializeTurnstile();
    if (isRecoveryLink) {
        // A recovery URL is only allowed to reveal the recovery UI after Supabase has accepted it.
        setPanel('recovery');
    }
    try {
        const { data, error } = await supabaseClient.auth.getSession();
        stripAuthSecretsFromUrl();
        if (error) throw error;
        if (isRecoveryLink && !data.session) {
            setPanel('login');
            switchTab('login');
            showError('This password reset link is invalid or expired. Request a new one.');
        } else if (data.session && !isRecoveryLink) {
            await showAccountForSession();
        } else if (!isRecoveryLink) {
            switchTab('signup');
            if (query.get('flow') === 'confirmed') showSuccess('Email confirmation complete. You can now sign in.');
        }
    } catch {
        showError('Unable to check your sign-in status. Refresh the page and try again.');
    }
}

void initializeAuthPage();
