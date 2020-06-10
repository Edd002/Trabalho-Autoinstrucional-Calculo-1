document.addEventListener('DOMContentLoaded', function() {
	// Listener to run when the page loads
}, false);

// ----------------------------------------------------------- VALIDAÇÕES ------------------------------------------------------------- //
function numbersOnly(Sender, evt, isFloat, isNegative) {
	if(Sender.readOnly) return false;       

	var key   = evt.which || !window.event ? evt.which : event.keyCode;
	var value = Sender.value;

	if((key == 46 || key == 44) && isFloat){                
		var selected = document.selection ? document.selection.createRange().text : "";
		if(selected.length == 0 && value.indexOf(".") == -1 && value.length > 0) Sender.value += ".";
		return false;
	}

	if(key == 45) {
		if(!isNegative) return false;
		if(value.indexOf('-')== -1) Sender.value = '-'+value; else Sender.value = value.substring(1);
		if(Sender.onchange != null) {
			if(Sender.fireEvent){
				Sender.fireEvent('onchange');
			} else {
				var e = document.createEvent('HTMLEvents');
					e.initEvent('change', false, false);
				Sender.dispatchEvent(e);
			}
		}

		var begin = Sender.value.indexOf('-') > -1 ? 1 : 0;
		if(Sender.setSelectionRange){
			Sender.setSelectionRange(begin,Sender.value.length);
		} else {
			var range = Sender.createTextRange();
			range.moveStart('character',begin);
			range.select();                 
		}

		return false;
	}

	if(key > 31 && (key < 48 || key > 57)) return false;
}

function numbersCorrectFormatOnBlur(component) {
	if (component.value.slice(-1) == ".")
		component.value = component.value.slice(0, -1);

	if(component.value == "-")
		component.value = "0";

	if(component.value.includes("-."))
		component.value = component.value.substring(2);
}

function numbersCorrectFormatZeroOnBlur(component) {
	if (component.value == "")
		component.value = "0";

	if (parseFloat(component.value) == 0)
		component.value = "0";
}

function numbersCorrectFormatZeroOnFocus(component) {
	if (component.value == "0")
		component.value = "";
}
// ------------------------------------------------------------------------------------------------------------------------------------ //


// ------------------------------------------------------ FORMADOR DE FUNÇÕES --------------------------------------------------------- //
function formArrayFunction() {
	var coefficients = new Array();
	var contCoefficients = 0;
	var contAscTable = 65;

	while (true) {
		try {
			coefficients[contCoefficients] = document.getElementById("campo" + String.fromCharCode(contAscTable)).value;
			contAscTable++;
			contCoefficients++;
		} catch (exception) {
			break;
		}
	}

	return coefficients;
}

function formTextFunction() {
	var coefficients = formArrayFunction();
	var textFunction = "";
	var contCoefficients = 0;
	var contExponent = coefficients.length - 1;

	while (true) {
		if (parseFloat(coefficients[contCoefficients]) < 0) {
			if (parseFloat(coefficients[contCoefficients]) == -1) {
				if (contExponent == 0)
					textFunction += " - " + coefficients[contCoefficients].substring(1);
				else if (contExponent == 1)
					textFunction += " - X";
				else
					textFunction += " - X" + "<sup>" + contExponent + "</sup>";
			} else {
				if (contExponent == 0)
					textFunction += " - " + coefficients[contCoefficients].substring(1);
				else if (contExponent == 1)
					textFunction += " - " + coefficients[contCoefficients].substring(1) + "X";
				else
					textFunction += " - " + coefficients[contCoefficients].substring(1) + "X" + "<sup>" + contExponent + "</sup>";
			}
		}  else if (parseFloat(coefficients[contCoefficients]) > 0) {
			if (parseFloat(coefficients[contCoefficients]) == 1) {
				if (contExponent == 0)
					textFunction += " + " + coefficients[contCoefficients];
				else if (contExponent == 1)
					textFunction += " + X";
				else
					textFunction += " + X" + "<sup>" + contExponent + "</sup>";
			} else {
				if (contExponent == 0)
					textFunction += " + " + coefficients[contCoefficients];
				else if (contExponent == 1)
					textFunction += " + " + coefficients[contCoefficients] + "X";
				else
					textFunction += " + " + coefficients[contCoefficients] + "X" + "<sup>" + contExponent + "</sup>";
			}
		}

		contCoefficients++;
		contExponent--;

		if (contCoefficients == coefficients.length) {
			if (textFunction.substring(1, 2) == "-")
				textFunction = textFunction.substring(1);
			else
				textFunction = textFunction.substring(3);
			break;
		}
	}

	if (textFunction == "")
		return "0";
	else
		return textFunction;
}
// ------------------------------------------------------------------------------------------------------------------------------------ //


// ------------------------------------------------------ DERIVADA POLINOMIAL --------------------------------------------------------- //
function polynomialDerivative(componentPreviewArea, componentResultArea) {
	componentPreviewArea.innerHTML = "Visualização da Função:<br>f(x) = " + formTextFunction();
	componentResultArea.innerHTML = "Resultado da Derivada:<br>f'(x) = " + calculatePolynomialDerivative();
}

function calculatePolynomialDerivative() {
	var coefficients = formArrayFunction();
	var derivativeTextFunction = "";
	var exponent;
	var aux = 0;

	for (var exponent = coefficients.length - 1; exponent > -1; exponent--) {
		if (coefficients[aux] > 0) {
			if (parseFloat(exponent) - 1 == 0) {
				derivativeTextFunction += " + " + ((coefficients[aux] * parseFloat(exponent)).toPrecision(15).replace(/0+$/, ''));
			} else if (parseFloat(exponent) - 1 == 1) {
				derivativeTextFunction += " + " + ((coefficients[aux] * parseFloat(exponent)).toPrecision(15).replace(/0+$/, '')) + "X";
			} else if (parseFloat(exponent) - 1 > 0) {
				derivativeTextFunction += " + " + ((coefficients[aux] * parseFloat(exponent)).toPrecision(15).replace(/0+$/, '')) + "X<sup>" + (parseFloat(exponent) - 1) + "</sup>";
			}
		} else if (coefficients[aux] < 0) {
			if (parseFloat(exponent) - 1 == 0) {
				derivativeTextFunction += ((coefficients[aux] * parseFloat(exponent)).toPrecision(15).replace(/0+$/, ''));
			} else if (parseFloat(exponent) - 1 == 1) {
				derivativeTextFunction += ((coefficients[aux] * parseFloat(exponent)).toPrecision(15).replace(/0+$/, '')) + "X";
			} else if (parseFloat(exponent) - 1 > 0) {
				derivativeTextFunction += ((coefficients[aux] * parseFloat(exponent)).toPrecision(15).replace(/0+$/, '')) + "X<sup>" + (parseFloat(exponent) - 1) + "</sup>";
			}
		}

		aux++;
	}

	if (derivativeTextFunction.substring(1, 2) == "+")
		derivativeTextFunction = derivativeTextFunction.substring(3);

	derivativeTextFunction = derivativeTextFunction.replace(/-/g, " - ");
	derivativeTextFunction = derivativeTextFunction.replace(/1.X/g, "X");
	derivativeTextFunction = derivativeTextFunction.replace(/\.X/g, "X");

	if(derivativeTextFunction.slice(-1) == ".")
		derivativeTextFunction = derivativeTextFunction.slice(0, -1);

	if (derivativeTextFunction == "")
		return "0";
	else
		return derivativeTextFunction;
}
// ------------------------------------------------------------------------------------------------------------------------------------ //


// -------------------------------------------------------- DERIVADA DE SENO ---------------------------------------------------------- //

function sineDerivative(componentPreviewArea, componentResultArea) {
	componentPreviewArea.innerHTML = "Visualização da Função:<br>f(x) = sen(" + formTextFunction() + ")";
	componentResultArea.innerHTML = "Resultado da Derivada:<br>f'(x) = " + calculateSineDerivative();
}

function calculateSineDerivative() {
	var polynomialDerivative = calculatePolynomialDerivative();
	var textFunction = formTextFunction();

	if (polynomialDerivative == "0")
		return "0";
	else if (polynomialDerivative == "1")
		return "cos(" + textFunction + ")";
	else if (polynomialDerivative == " - 1")
		return "- cos(" + textFunction + ")";
	else if (polynomialDerivative.replace(/[^-]/g, "").length % 2 != 0)
		return "- " + polynomialDerivative.replace(" - ", "") + " &times; " + "cos(" + textFunction + ")";
	else
		return polynomialDerivative + " &times; " + "cos(" + textFunction + ")";
}
// ------------------------------------------------------------------------------------------------------------------------------------ //


// ------------------------------------------------------ DERIVADA DE COSSENO --------------------------------------------------------- //
function cosineDerivative(componentPreviewArea, componentResultArea) {
	componentPreviewArea.innerHTML = "Visualização da Função:<br>f(x) = cos(" + formTextFunction() + ")";
	componentResultArea.innerHTML = "Resultado da Derivada:<br>f'(x) = " + calculateCosineDerivative();
}

function calculateCosineDerivative() {
	var polynomialDerivative = calculatePolynomialDerivative();
	var textFunction = formTextFunction();

	if (polynomialDerivative == "0")
		return "0";
	else if (polynomialDerivative == "1")
		return "- sen(" + textFunction + ")";
	else if (polynomialDerivative == " - 1")
		return "sen(" + textFunction + ")";
	else if (polynomialDerivative.replace(/[^-]/g, "").length % 2 != 0)
		return polynomialDerivative.replace(" - ", "") + " &times; sen(" + textFunction + ")";
	else
		return "- " + polynomialDerivative + " &times; sen(" + textFunction + ")";
}
// ------------------------------------------------------------------------------------------------------------------------------------ //


// ----------------------------------------------------- DERIVADA DE LOGARITMO -------------------------------------------------------- //
function logarithmDerivative(componentPreviewArea, componentResultArea) {
	var validate = validateLogarithmBase();

	if (validate == null) {
		componentPreviewArea.innerHTML = "Visualização da Função:<br>f(x) = log<sub>" + getLogarithmBase()  + "</sub> (" + formTextFunction() + ")";
		componentResultArea.innerHTML = "Resultado da Derivada:<br>f'(x) = " + calculateLogarithmDerivative();
	} else {
		componentPreviewArea.innerHTML = "Visualização da Função:<br>" + validate;
		componentResultArea.innerHTML = "Resultado da Derivada:";
	}
}

function getLogarithmBase() {
	return document.getElementById("campoLogaritmoBase").value;
}

function validateLogarithmBase() {
	a = getLogarithmBase();

	if (parseFloat(a) < 0)
		return "A base não pode ser negativa."

	if (parseFloat(a) == 0)
		return "A base não pode ser igual a 0.";

	if (parseFloat(a) == 1)
		return "A base não pode ser igual a 1.";

	return null;
}

function calculateLogarithmDerivative() {
	var polynomialDerivative = calculatePolynomialDerivative();
	var textFunction = formTextFunction();

	if (polynomialDerivative == "0")
		return "0";
	else if ((polynomialDerivative == " - 1" && textFunction == "- X") || (polynomialDerivative == (" " + textFunction.replace("X", ""))) || (polynomialDerivative == (textFunction.replace("X", ""))) || (polynomialDerivative == "1" && textFunction == "X"))
		return "<math><mrow><mfrac><mi>1</mi><mi>X &times; ln(" + getLogarithmBase() + ")" + "</mi></mfrac></mrow></math>";
	else
		return "<math><mrow><mfrac><mi>" + polynomialDerivative + "</mi><mi>(" + textFunction + ") &times; ln(" + getLogarithmBase() + ")" + "</mi></mfrac></mrow></math>";
}
// ------------------------------------------------------------------------------------------------------------------------------------ //