using cgsjgpt.userclass.method;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;
using System.Data.Entity.Validation;
using System.Net;
using System.Web.Http;

namespace cgsjgpt.Controllers.Filters
{
    public class WebApiExceptionFilterAttribute:ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            string errmsg = "";
            try
            {
                errmsg = actionExecutedContext.Exception.Message;
            }
            catch
            {

            }
            try
            {
                errmsg = actionExecutedContext.Exception.InnerException.Message;
            }
            catch
            {

            }
            try
            {
                errmsg = actionExecutedContext.Exception.InnerException.InnerException.Message;
            }
            catch
            {

            }
            try
            {
                errmsg = actionExecutedContext.Exception.InnerException.InnerException.InnerException.Message;
            }
            catch
            {

            }
            /*if(actionExecutedContext.Exception is NotImplementedException)
            {
                errmsg = "字段数据为空!";
            }*/
            if(actionExecutedContext.Exception is DbEntityValidationException)
            {
                errmsg = "";
                foreach (var validationErrors in ((DbEntityValidationException)actionExecutedContext.Exception).EntityValidationErrors)

                {

                    foreach (var validationError in validationErrors.ValidationErrors)

                    {
                        errmsg += string.Format("Class: {0}, Property: {1}, Error: {2}", validationErrors.Entry.Entity.GetType().FullName,

                                                    validationError.PropertyName,

                                                    validationError.ErrorMessage);
                    }

                }
            }
            PubMethod.wrlog("WebApiException", errmsg);
            /*  var oResonse = new HttpResponseMessage(System.Net.HttpStatusCode.InternalServerError);
              oResonse.Content =new StringContent( errmsg);
              oResonse.ReasonPhrase = "server error by lj";
              actionExecutedContext.Response = oResonse;*/
            actionExecutedContext.Response = actionExecutedContext.Request.CreateErrorResponse(HttpStatusCode.ServiceUnavailable, new HttpError(errmsg));
            base.OnException(actionExecutedContext);
        }
    }
}