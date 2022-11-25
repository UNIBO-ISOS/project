const url = "/wsdl";

const sendSoap = (body) => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', url, true);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                //alert(xmlhttp.responseText);
                // alert('done. use firebug/console to see network response');
                console.log(xmlhttp.responseText)
                alert(typeof xmlhttp.responseText)
                //const response = JSON.parse(xmlhttp.responseText)
                const parser = new DOMParser()
                const response = parser.parseFromString(xmlhttp.responseText, 'text/html')
                const token = response.getElementsByTagName('sid')
                const text = token[0].outerText
                localStorage.setItem("token", token);
                window.location.href = "/pay.html";
                //const token = 
            }
        }
    }
    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(body);
    // send request
    // ...
}

const sendLoginRequest = (username, password) => {
    const body = `
        <?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <login xmlns="acme.bank.com.xsd">
                    <password>${password}</password>
                    <username>${username}</username>
                </login>
            </soap:Body>
        </soap:Envelope>
    `
    sendSoap(body)
}

function login() {
	const username = $("#username").val();
	const password = $("#password").val();

    sendLoginRequest(username, password)
}

$(document).ready(() => {
	$("#login_btn").on("click", login);
	$("#password").on("keyup", (e) => {
		if (e.key == "Enter") {
			login();
		}
	});
});
