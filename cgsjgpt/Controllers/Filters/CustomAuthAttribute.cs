using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Net;
using System.Web.Http;
using cgsjgpt.userclass.method;

namespace cgsjgpt.Controllers.Filters
{
    public class CustomAuthAttribute : AuthorizationFilterAttribute
    {
        private bool isAuth;
        public CustomAuthAttribute(bool Auth)
        {
            isAuth = Auth;
        }
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            //如果用户方位的Action带有AllowAnonymousAttribute，则不进行授权验证
            if (actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any()||(!isAuth))
            {
                return;
            }
            string ret = string.Empty;
            Boolean verifyResult = false;
            if (actionContext.Request.Headers.Authorization != null)
            {
                
                string Authorization = actionContext.Request.Headers.Authorization.ToString();
                if (!HttpRuntimeCache.Exists(Authorization))
                {
                    verifyResult = false;
                    ret = "Token 不存在或过期";
                }
                else
                {
                    verifyResult = true;
                    object value = HttpRuntimeCache.Get(Authorization);
                    HttpRuntimeCache.Set(Authorization, value);
                }

            }
            else
            {
                verifyResult = false;
            }
    

            if (!verifyResult)
            {
                //如果验证不通过，则返回401错误，并且Body中写入错误原因
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, new HttpError(ret));
            }
        }

    }
}