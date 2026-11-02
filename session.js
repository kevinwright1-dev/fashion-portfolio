// Shared session helpers. Load after config.js.
async function getSignedInUser() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return null;
    // A session can exist before the MFA check is finished.
    const { data: level } = await supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel();
    if (level?.nextLevel === 'aal2' && level.currentLevel !== 'aal2') return null;
    return session.user;
}

async function requireUser() {
    const user = await getSignedInUser();
    if (!user) {
        const page = window.location.pathname.split('/').pop();
        window.location.replace(`auth.html?redirect=${encodeURIComponent(page)}`);
    }
    return user;
}

async function updateNav() {
    const authLink = document.getElementById('auth-link');
    if (!await getSignedInUser()) return;
    document.getElementById('profile-link').style.display = 'inline';
    authLink.textContent = 'LOGOUT';
    authLink.href = '#';
    authLink.addEventListener('click', async (event) => {
        event.preventDefault();
        await supabaseClient.auth.signOut();
        window.location.reload();
    });
}

document.addEventListener('DOMContentLoaded', updateNav);