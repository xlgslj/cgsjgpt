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
    
    public partial class EntitiesHmd : DbContext
    {
        public EntitiesHmd()
            : base("name=EntitiesHmd")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<TRFFLOG> TRFFLOG { get; set; }
        public virtual DbSet<AGENT> AGENT { get; set; }
        public virtual DbSet<RBLIST> RBLIST { get; set; }
        public virtual DbSet<DWBADB> DWBADB { get; set; }
    }
}
