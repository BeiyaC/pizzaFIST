const generateTokenButton = document.getElementById('generateToken');
const returnButton = document.getElementById('return');
const containerTOTP = document.getElementById('container');
let qrcode;

generateTokenButton.addEventListener('click', async() => {
    containerTOTP.classList.add("right-panel-active");
    await activate_totp()
});

returnButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

function getCookies() {
    let decodedCookie = decodeURIComponent(document.cookie);

    decodedCookie =decodedCookie.split(';');

    const jsonObject = decodedCookie.reduce((obj, item) => {
        const [key, value] = item.trim().split('=');
        obj[key] = value;
        return obj;
    }, {});

    return jsonObject
}

async function verify_token() {
    const tokenInput = document.forms["activateTotpForm"]["tokenInput"].value

    const cookie = getCookies();

    await verify_totp_mutation(cookie.user, tokenInput )
        .then(value => {
            if (value === "UNAUTHORIZED") {
                console.log("oupsi")
                window.location.replace("/pizzaFIST/totp.html")
            }
            if (value.verifyTotp.otp_verified === true) {

                window.location.replace("/pizzaFIST/index.html")
            }
        })
}

async function validate_token() {
    const tokenInput = document.forms["validateTotpForm"]["tokenInput"].value

    const cookie = getCookies();

    await validate_totp_mutation(cookie.user, tokenInput )
        .then(value => {
            if (value === "UNAUTHORIZED") {
                console.log("oupsi")
                window.location.replace("/pizzaFIST/totp.html")
            }
            if (value.validateTotp.status === "ok") {

                window.location.replace("/pizzaFIST/index.html")
            }
        })
}

async function activate_totp() {

    const cookie = getCookies();

    await enable_totp_mutation(cookie.user)
        .then(value => {
            if (value === "UNAUTHORIZED") {
                console.log("oupsi")
                window.location.replace("/pizzaFIST/totp.html")
            }
            const otpUrl = value.enableTotp.otp_url
            const otpBase = value.enableTotp.otp_base

            qrcode = new QRCode("qrcode", otpUrl)

            document.getElementById("otpBase").innerHTML = otpBase;
        })
}

async function validate_totp_mutation(email, token) {
    let results = await fetch('https://pizzafist-api.onrender.com/v2/authentication/graphql/', {
        method: 'POST',

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            query:
                `mutation validateTotp($email: String!, $token: String!) {
                    validateTotp(email: $email, token: $token) {
                       status
                    }
                }`,
            operationName: "validateTotp",
            variables: {
                "email": email,
                "token": token
            }
        })
    })
    let result = await results.json();

    if(result.data !== null) {
        return result.data
    } else {
        return "ERROR"
    }
}

async function enable_totp_mutation(email) {
    let results = await fetch('https://pizzafist-api.onrender.com/v2/authentication/graphql/', {
        method: 'POST',

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            query:
                `mutation enableTotp($email: String!) {
                    enableTotp(email: $email) {
                       otp_base
                       otp_url
                    }
                }`,
            operationName: "enableTotp",
            variables: {
                "email": email
            }
        })
    })
    let result = await results.json();
    if(result.data !== null) {
        return result.data
    } else {
        return "ERROR"
    }
}

async function verify_totp_mutation(email, token) {
    let results = await fetch('https://pizzafist-api.onrender.com/v2/authentication/graphql/', {
        method: 'POST',

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            query:
                `mutation verifyTotp($email: String!, $token: String!) {
                    verifyTotp(email: $email, token: $token) {
                       otp_verified
                       user
                    }
                }`,
            operationName: "verifyTotp",
            variables: {
                "email": email,
                "token": token
            }
        })
    })
    let result = await results.json();

    if(result.data !== null) {
        return result.data
    } else {
        return "ERROR"
    }
}
