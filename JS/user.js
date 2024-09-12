
export async function check_account(email) {

}

async function get_account_resolver() {
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
                       otp_enabled
                    }
                }`,
        })
    })

    let result = await results.json();

    if(result.data !== null) {
        return result.data
    } else {
        return "ERROR"
    }
}

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

export const user = check_account()