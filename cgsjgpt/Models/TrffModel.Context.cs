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
    
    public partial class EntitiesTrff : DbContext
    {
        public EntitiesTrff()
            : base("name=EntitiesTrff")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<DRIVINGLICENSE> DRIVINGLICENSE { get; set; }
        public virtual DbSet<VEHICLE> VEHICLE { get; set; }
        public virtual DbSet<DRV_FLOW> DRV_FLOW { get; set; }
        public virtual DbSet<VEH_FLOW> VEH_FLOW { get; set; }
    }
}
