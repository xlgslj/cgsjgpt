﻿//------------------------------------------------------------------------------
// <auto-generated>
//     此代码已从模板生成。
//
//     手动更改此文件可能导致应用程序出现意外的行为。
//     如果重新生成代码，将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace cgsjgpt.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class EntitiesXfyw : DbContext
    {
        public EntitiesXfyw()
            : base("name=EntitiesXfyw")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<BUSINESSBM> BUSINESSBM { get; set; }
        public virtual DbSet<BUSINESS_FLOW> BUSINESS_FLOW { get; set; }
        public virtual DbSet<BUSINESSBASE> BUSINESSBASE { get; set; }
    }
}