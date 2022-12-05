const url = "/wsdl";

const sendSoap_pay = (body) => {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", url, true);

	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				const parser = new DOMParser();
				const response = parser.parseFromString(
					xmlhttp.responseText,
					"text/html"
				);

				const token = response.getElementsByTagName("token");
				const transaction_token = token[0].outerText;

				$("#token_label").val(transaction_token);
				localStorage.setItem("transaction_token", transaction_token);
				$("#copy_token_btn").prop("disabled", false);

				getBalance();
			}
		}
	};

	xmlhttp.setRequestHeader("Content-Type", "text/xml");
	xmlhttp.send(body);
};

const sendSoap_balance = (body) => {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", url, true);

	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				const parser = new DOMParser();
				const response = parser.parseFromString(
					xmlhttp.responseText,
					"text/html"
				);

				const message = response.getElementsByTagName("balance");
				const balance = message[0].outerText;

				$("#balance_label").text(balance);
			}
		}
	};

	xmlhttp.setRequestHeader("Content-Type", "text/xml");
	xmlhttp.send(body);
};

const sendGetBalanceRequest = (sid) => {
	const body = `
    <?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <getBalance xmlns="acme.bank.com.xsd">
          <sid>${sid}</sid>
        </getBalance>
      </soap:Body>
    </soap:Envelope>
    `;

	sendSoap_balance(body);
};

const sendPaymentRequest = (sid, amount, to_user) => {
	const body = `
    <?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <newTransaction xmlns="acme.bank.com.xsd">
                <sid>${sid}</sid>
                <amount>${amount}</amount>
                <to_user>${to_user}</to_user>
            </newTransaction>
        </soap:Body>
    </soap:Envelope>
    `;

	sendSoap_pay(body);
};

function getBalance() {
	const sid = localStorage.getItem("sid");
	sendGetBalanceRequest(sid);
}

function payment() {
	const amount = $("#amount").val();
	const to_user = $("#to_user").val();
	const sid = localStorage.getItem("sid");

	sendPaymentRequest(sid, amount, to_user);
}

function copyToClipboard() {
	const transaction_token = localStorage.getItem("transaction_token");
	navigator.clipboard.writeText(transaction_token);
}

$(document).ready(() => {
	getBalance();

	$("#to_user").val("acmeat");
	$("#pay_btn").on("click", payment);
	$("#copy_token_btn").prop("disabled", true);
	$("#pay_btn").prop("disabled", true);
	$("#amount").on("keyup", (e) => {
		if (e.key == "Enter") {
			payment();
		}
	});
	$("#amount").on("change keydown paste input", function () {
		const amount = $("#amount").val();
		if (amount == "") {
			$("#pay_btn").prop("disabled", true);
		} else {
			$("#pay_btn").prop("disabled", false);
		}
	});
});
