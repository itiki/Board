using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using System.Text.RegularExpressions;

namespace Board.Web.ViewModels.Validation {

	//国外卡号验证
	//jquery.validate.min.js和jquery.validate.unobtrusive.min.js本身就实现了creditcard验证模块，这里只是实现其后台验证
	//creditcard: function (value, element) {
	//    if (this.optional(element))
	//        return "dependency-mismatch";
	//    // accept only digits and dashes
	//    if (/[^0-9-]+/.test(value))
	//        return false;
	//    var nCheck = 0,
	//    nDigit = 0,
	//    bEven = false;
	//    value = value.replace(/\D/g, "");
	//    for (var n = value.length - 1; n >= 0; n--) {
	//        var cDigit = value.charAt(n);
	//        var nDigit = parseInt(cDigit, 10);
	//        if (bEven) {
	//            if ((nDigit *= 2) > 9)
	//                nDigit -= 9;
	//        }
	//        nCheck += nDigit;
	//        bEven = !bEven;
	//    }
	//    return (nCheck % 10) == 0;
	//}
	public class CreditCardAttribute : ValidationAttribute, IClientValidatable {
		public enum CardType {
			Unknown = 1,
			Visa = 2,
			MasterCard = 4,
			Amex = 8,
			Diners = 16,

			All = CardType.Visa | CardType.MasterCard | CardType.Amex | CardType.Diners,
			AllOrUnknown = CardType.Unknown | CardType.Visa | CardType.MasterCard | CardType.Amex | CardType.Diners
		}
		public CardType AcceptedCardTypes { get; set; }
		public CreditCardAttribute() {
			AcceptedCardTypes = CardType.All;
		}
		public CreditCardAttribute(CardType acceptedCardTypes) {
			AcceptedCardTypes = acceptedCardTypes;
		}

		public override bool IsValid(object value) {
			var number = Convert.ToString(value);
			if (String.IsNullOrEmpty(number))
				return true;
			return IsValidType(number, AcceptedCardTypes) && IsValidNumber(number);
		}

		private bool IsValidType(string cardNumber, CardType cardType) {
			// Visa
			if (Regex.IsMatch(cardNumber, "^(4)") && ((cardType & CardType.Visa) != 0))
				return cardNumber.Length == 13 || cardNumber.Length == 16;

			// MasterCard
			if (Regex.IsMatch(cardNumber, "^(51|52|53|54|55)") && ((cardType & CardType.MasterCard) != 0))
				return cardNumber.Length == 16;

			// Amex
			if (Regex.IsMatch(cardNumber, "^(34|37)") && ((cardType & CardType.Amex) != 0))
				return cardNumber.Length == 15;

			// Diners
			if (Regex.IsMatch(cardNumber, "^(300|301|302|303|304|305|36|38)") && ((cardType & CardType.Diners) != 0))
				return cardNumber.Length == 14;

			//Unknown
			if ((cardType & CardType.Unknown) != 0)
				return true;

			return false;
		}

		private bool IsValidNumber(string number) {
			int[] DELTAS = new int[] { 0, 1, 2, 3, 4, -4, -3, -2, -1, 0 };
			int checksum = 0;
			char[] chars = number.ToCharArray();
			for (int i = chars.Length - 1; i > -1; i--) {
				int j = ((int)chars[i]) - 48;
				checksum += j;
				if (((i - chars.Length) % 2) == 0)
					checksum += DELTAS[j];
			}

			return ((checksum % 10) == 0);
		}

		public override string FormatErrorMessage(string name) {
			return "The " + name + " field contains an invalid credit card number.";
		}

		public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context) {
			yield return new ModelClientValidationRule {
				ErrorMessage = this.ErrorMessage,
				ValidationType = "creditcard"
			};
		}
	}
}