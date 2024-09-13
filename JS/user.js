let userFirstName = document.getElementById('user-firstName');
let userLastName = document.getElementById('user-lastName');
let userEmail = document.getElementById('user-email');


document.addEventListener(`DOMContentLoaded`, get_account);

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

///////////////////////////////////// MANAGE REQUESTS RESPONSES /////////////////////////////////////////////////////

async function get_account() {
    const cookie = getCookies();

    try {

        const loading = loadingAlert('Chargement du profil')
        console.log(cookie.user)
        const value = await get_account_resolver(cookie.user)

        loading.close()

        if (value === "ERROR") {
            errorAlert('On trouve plus ton profil...')
        }
        else {
            successAlert('Profil chargé !')
                .then(() => {
                    userFirstName.innerHTML = value.getAccount.firstName
                    userLastName.innerHTML = value.getAccount.lastName
                    userEmail.innerHTML = value.getAccount.email


                })
        }
    } catch {

    }
}

//////////////////////////////////////// REQUESTS GRAPHQL //////////////////////////////////////////////////

async function get_account_resolver(email) {
    let results = await fetch('https://pizzafist-api.onrender.com/v2/authentication/graphql/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query:
                `query getAccount($email: String!) {
                    getAccount(email: $email) {
                       email
                       firstName
                       lastName
                       otp_enabled
                    }
                }`,
            operationName: "getAccount",
            variables: {
                "email": email
            }
        }),

    })

    let result = await results.json();
    console.log(result)
    if (result.data !== null) {
        return result.data
    } else {
        return "ERROR"
    }
}