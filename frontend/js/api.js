const API_BASE = "https://projeto-wayne-security-system-7.onrender.com";


function getStoredTokens() {
    const access = (localStorage.getItem("token") || "").replace(/\s+/g, "").replace(/^<|>$/g, "") || null;
    const refresh = (localStorage.getItem("refresh_token") || "").replace(/\s+/g, "").replace(/^<|>$/g, "") || null;
    return { access, refresh };
}

function storeTokens({ access_token, refresh_token }) {
    if (access_token) localStorage.setItem("token", access_token);
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
}

function clearTokens() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
}

async function doRefresh() {
    const { refresh } = getStoredTokens();
    if (!refresh) throw new Error("No refresh token available");

    const res = await fetch(API_BASE + "/auth/refresh", {
        method: "POST",
        headers: { "Authorization": "Bearer " + refresh }
    });

    if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw { status: res.status, bodyText: txt };
    }

    const payload = await res.json().catch(() => null);
    const newAccess = payload?.tokens?.access_token || payload?.access_token || payload?.access;
    const newRefresh = payload?.tokens?.refresh_token || payload?.refresh_token;
    if (!newAccess) throw new Error("Refresh did not return new access token");

    storeTokens({ access_token: newAccess, refresh_token: newRefresh });
    return newAccess;
}

async function apiFetch(path, options = {}) {
    const url = API_BASE + path;
    options = { ...options };
    options.headers = options.headers ? { ...options.headers } : {};

    if (!options.headers["Content-Type"] && !(options.body instanceof FormData)) {
        options.headers["Content-Type"] = "application/json";
    }

    const { access } = getStoredTokens();
    if (access) options.headers["Authorization"] = "Bearer " + access;

    let res = await fetch(url, options);

    if (res.ok) {
        return res.json().catch(() => null);
    }

    if (res.status === 401) {
        let txt = await res.text().catch(() => null);
        try { 
        const parsed = JSON.parse(txt);
        const msg = parsed?.msg || parsed?.message || "";
        if (!msg.toLowerCase().includes("token") && !msg.toLowerCase().includes("expired")) {
        }
    } catch(e){ /* ignore parse error */ }

    try {
        const newAccess = await doRefresh();

        options.headers["Authorization"] = "Bearer " + newAccess;
        const retry = await fetch(url, options);
        if (retry.ok) return retry.json().catch(() => null);
        const bodyText = await retry.text().catch(() => null);
        throw { status: retry.status, bodyText };
    } catch (refreshError) {

        clearTokens();
        console.warn("Refresh failed:", refreshError);

        window.location.href = "login.html";
        throw refreshError;
    }
    }

    const bodyText = await res.text().catch(() => null);
    let parsed = null;
    try { parsed = JSON.parse(bodyText); } catch(e) {}
    throw { status: res.status, statusText: res.statusText, bodyText, body: parsed };
}
