const generateTokenButton = document.getElementById('generateToken');
const returnButton = document.getElementById('return');
const containerTOTP = document.getElementById('container');
let qrcode;

////////////////////////////////// TRIGGER ON CLICK ANIMATION ////////////////////////////////////////////////////////

generateTokenButton.addEventListener('click', () => {
    containerTOTP.classList.add("right-panel-active");
});

returnButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

////////////////////////////////// MANAGE COOKIES ////////////////////////////////////////////////////////

function getCookies() {
    let decodedCookie = decodeURIComponent(document.cookie);

    decodedCookie = decodedCookie.split(';');

    const jsonObject = decodedCookie.reduce((obj, item) => {
        const [key, value] = item.trim().split('=');
        obj[key] = value;
        return obj;
    }, {});

    return jsonObject
}

//////////////////////////////////// ALERT BOX LIBRARY //////////////////////////////////////////////////////

function errorAlert(message) {
    return Swal.fire({
        title: 'Petit problème',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK'
    });
}

function loadingAlert(message) {
    return Swal.fire({
        title: message,
        html: 'Please wait',
        backdrop: `
    rgba(0,0,123,0.4)
    url("https://sweetalert2.github.io/images/nyan-cat.gif")
    left top
    no-repeat
  `,
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        },
    });
}

function successAlert(message) {
    return Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        timer: 4500,
        showConfirmButton: false
    })
}


///////////////////////////////////// MANAGE REQUESTS RESPONSES /////////////////////////////////////////////////////

async function verify_token() {
    const tokenInput = document.forms["activateTotpForm"]["tokenInput"].value

    const cookie = getCookies();

    try {

        const loading = loadingAlert('Bouge pas on vérifie ton token')

        const value = await verify_totp_mutation(cookie.user, tokenInput)

        loading.close()

        if (value === "ERROR") {
            errorAlert('Ton token semble faux...')
        }
        if (value.verifyTotp.otp_verified === true) {
            successAlert('Bravo tu as le TOTP activé !')
                .then(() => {
                    window.location.replace("/pizzaFIST/user.html")
                })
        }
    } catch {

    }
}

async function validate_token() {
    const tokenInput = document.forms["validateTotpForm"]["tokenInput"].value

    const cookie = getCookies();

    try {

        const loading = loadingAlert('Vérification de ton token en cours...')

        const value = await validate_totp_mutation(cookie.user, tokenInput)

        loading.close()

        if (value === "ERROR") {
            errorAlert('Désolé le token est faux')
                .then(() => {
                    window.location.replace("/pizzaFIST/totp.html")
                })
        }
        if (value.validateTotp.status === "ok") {
            successAlert('Token validé, tu peux entrer !')
                .then(() => {
                    window.location.replace("/pizzaFIST/user.html")
                })
        }
    } catch {

    }
}

async function activate_totp() {

    const cookie = getCookies();

    try {

        const value = await enable_totp_mutation(cookie.user)

        if (value === "UNAUTHORIZED") {
            errorAlert('Oupsi')
            window.location.replace("/pizzaFIST/totp.html")
        }
        const otpUrl = value.enableTotp.otp_url
        const otpBase = value.enableTotp.otp_base

        if (!(qrcode instanceof QRCode)) {
            qrcode = new QRCode("qrcode", {
                text: otpUrl,
                width: 220,
                height: 220,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            })
        } else {
            qrcode.makeCode(otpUrl)
        }

        document.getElementById("otpBase").innerHTML = otpBase;


    } catch {

    }
}

//////////////////////////////////////// REQUESTS GRAPHQL //////////////////////////////////////////////////

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

    if (result.data !== null) {
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
    if (result.data !== null) {
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

    if (result.data !== null) {
        return result.data
    } else {
        return "ERROR"
    }
}
