using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Mvc;
using cgsjgpt.userclass.method;
namespace cgsjgpt.Controllers.Filters
{
    public class ExceptionFilter : FilterAttribute, IExceptionFilter
    {
        void IExceptionFilter.OnException(ExceptionContext filterContext)
        {
            //filterContext.Controller.ViewData["ErrorMessage"] = filterContext.Exception.Message;
            PubMethod.wrlog("OnException", filterContext.Exception.Message);
        }
    }
}