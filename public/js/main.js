async function register(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });

    const result = await response.json();
    if (result.status === "success") {
        window.location.href = '/dashboard';
    }
    
    document.getElementById('register-result').innerText = result.msg;
}

async function login(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (result.status === "success") {
        window.location.href = '/dashboard';
    }
    document.getElementById('login-result').innerText = result.msg;
}

async function shortenUrl() {
    const longUrl = document.getElementById('longUrl').value;

    const response = await fetch('/url/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ longUrl })
    });

    const result = await response.json();
    document.getElementById('result').innerText = result.shortUrl || result.msg;

    fetchUserUrls();
}


async function logout() {
    const response = await fetch('/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.json();
    if (result.msg === 'Logged out successfully!') {
        window.location.href = '/';
    }
}
// Fetch all URLs created by the user
async function fetchUserUrls() {
    const urlsContainer = document.getElementById('urls');
    urlsContainer.innerHTML = `Loading...`;
    const response = await fetch('/url/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    urlsContainer.innerHTML = '';
    const urls = await response.json();

    urls.forEach(url => {
        const urlElement = document.createElement('div');
        
        urlElement.setAttribute("id", "url-container-"+url._id);
        urlElement.classList.add("url-container");

        urlElement.innerHTML = `
            <div class="flex"><div class="label">Code: </div><input class="flex-1 url-code stylish-inline-input" value="${url.urlCode}"></div>
            <div class="flex"><div class="label">Long URL: </div><input class="flex-1 url-long stylish-inline-input" value="${url.longUrl}"></div>
            <div >Generated URL: <a href="${ window.location.origin + "/r/" + url.urlCode }">${ window.location.origin + "/r/" + url.urlCode }</a></div>
            <div class="flex">
                <div class="stylish-inline-button" onclick="updateURL('${url._id}')">Update</div>
                <div class="stylish-inline-button" onclick="deleteURL('${url._id}')">Delete</div>
            </div>
        `;
        urlsContainer.appendChild(urlElement);
    });
}
async function deleteURL(id) {

    const response = await fetch('/url/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ longUrl })
    });
    const result = await response.json();
    document.getElementById('result').innerText = result.msg;
    fetchUserUrls();
}
async function updateURL(id) {
    const codeContainer = document.querySelector(`#url-container-${id} .url-code`);
    const urlContainer = document.querySelector(`#url-container-${id} .url-long`);
    
    const response = await fetch('/url/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ urlCode: codeContainer.value, longUrl: urlContainer.value })
    });
    const result = await response.json();
    document.getElementById('result').innerText = result.msg;
    fetchUserUrls();
}

document.getElementById('dashboard')?.addEventListener('load', fetchUserUrls);
document.getElementById('register-form')?.addEventListener('submit', register);
document.getElementById('login-form')?.addEventListener('submit', login);

