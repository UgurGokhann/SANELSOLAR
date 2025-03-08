using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Business.Mappings.AutoMapper;
using SANELSOLAR.Business.Services;
using SANELSOLAR.Business.ValidationRules;
using SANELSOLAR.Business.ValidationRules.FluentValidation;
using SANELSOLAR.DataAccess.Context;
using SANELSOLAR.DataAccess.Interfaces;
using SANELSOLAR.DataAccess.UnitOfWork;
using SANELSOLAR.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.DependencyResolvers
{
    public static class DependencyExtension
    {
        public static void AddDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            // DbContext
            services.AddDbContext<SanelSolarContext>(opt =>
            {
                opt.UseNpgsql(configuration.GetConnectionString("Local"));
            });
            
            // Unit of Work
            services.AddScoped<IUow, Uow>();

            // JWT Configuration
            services.Configure<JwtConfig>(options => {
                var section = configuration.GetSection("JwtConfig");
                options.Secret = section["Secret"];
                options.ExpirationInMinutes = int.Parse(section["ExpirationInMinutes"] ?? "60");
                options.Issuer = section["Issuer"];
                options.Audience = section["Audience"];
            });
            services.AddScoped<IJwtService, JwtService>();

            // Services
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IExchangeRateService, ExchangeRateService>();
            services.AddScoped<IOfferService, OfferService>();


            services.AddTransient<IValidator<CreateOfferDto>, CreateOfferDtoValidator>();
            services.AddTransient<IValidator<UpdateOfferDto>, UpdateOfferDtoValidator>();
            services.AddTransient<IValidator<CreateOfferItemDto>, CreateOfferItemDtoValidator>();
            services.AddTransient<IValidator<UpdateOfferItemDto>, UpdateOfferItemDtoValidator>();

            // AutoMapper
            services.AddAutoMapper(opt =>
            {
                opt.AddProfiles(new List<Profile>
                {
                    new UserProfile(),
                    new ProductProfile(),
                    new CategoryProfile(),
                    new CustomerProfile(),
                    new ExchangeRateProfile(),
                    new OfferProfile()
                });
            });

            // FluentValidation - Validators
            // Category
            services.AddTransient<IValidator<CategoryCreateDto>, CategoryCreateDtoValidator>();
            services.AddTransient<IValidator<CategoryUpdateDto>, CategoryUpdateDtoValidator>();
            
            // Product
            services.AddTransient<IValidator<ProductCreateDto>, ProductCreateDtoValidator>();
            services.AddTransient<IValidator<ProductUpdateDto>, ProductUpdateDtoValidator>();
            
            // User
            services.AddTransient<IValidator<UserLoginDto>, UserLoginDtoValidator>();
            services.AddTransient<IValidator<UserCreateDto>, UserCreateDtoValidator>();
            services.AddTransient<IValidator<UserUpdateDto>, UserUpdateDtoValidator>();
            services.AddTransient<IValidator<UserPasswordUpdateDto>, UserPasswordUpdateDtoValidator>();
            
            // Customer
            services.AddTransient<IValidator<CustomerCreateDto>, CustomerCreateDtoValidator>();
            services.AddTransient<IValidator<CustomerUpdateDto>, CustomerUpdateDtoValidator>();
            
        }
    }
}
