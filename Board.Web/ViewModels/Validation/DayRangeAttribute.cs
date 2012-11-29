using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using System.Text.RegularExpressions;

namespace Board.Web.ViewModels.Validation {

    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public class DayRangeAttribute : RangeAttribute, IClientValidatable {
        private int _minimumDays;
        private int _maximumDays;

        public DayRangeAttribute(int minimumDays, int maximumDays)
            : base(minimumDays, maximumDays) {
            _minimumDays = minimumDays;
            _maximumDays = maximumDays;
        }

        public override bool IsValid(object value) {
            var dateToBeTested = value as DateTime?;
            return dateToBeTested.HasValue 
                && dateToBeTested.Value >= DateTime.Today.AddDays(_minimumDays) 
                && dateToBeTested.Value <= DateTime.Today.AddDays(_maximumDays);
        }

        public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context) {
            var rule = new ModelClientValidationRule {
                ErrorMessage = this.ErrorMessage,
                ValidationType = "dayrange"
            };
            rule.ValidationParameters.Add("min", _minimumDays);
            rule.ValidationParameters.Add("max", _maximumDays);
            yield return rule;
        }
    }

}