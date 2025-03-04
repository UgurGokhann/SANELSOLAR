using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Business.Mappings.AutoMapper;
using SANELSOLAR.Business.Services;
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
                opt.UseSqlServer(configuration.GetConnectionString("Local"));
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

            // AutoMapper
            services.AddAutoMapper(config =>
            {
                config.AddProfile(new CategoryProfile());
                config.AddProfile(new ProductProfile());
                config.AddProfile(new UserProfile());
                config.AddProfile(new CustomerProfile());
                config.AddProfile(new OfferProfile());
                config.AddProfile(new ExchangeRateProfile());
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
            
            // Offer
            services.AddTransient<IValidator<OfferItemCreateDto>, OfferItemCreateDtoValidator>();
            services.AddTransient<IValidator<OfferItemUpdateDto>, OfferItemUpdateDtoValidator>();
            services.AddTransient<IValidator<OfferCreateDto>, OfferCreateDtoValidator>();
            services.AddTransient<IValidator<OfferUpdateDto>, OfferUpdateDtoValidator>();
            services.AddTransient<IValidator<OfferStatusUpdateDto>, OfferStatusUpdateDtoValidator>();
            
            // ExchangeRate
            services.AddTransient<IValidator<ExchangeRateCreateDto>, ExchangeRateCreateDtoValidator>();
            services.AddTransient<IValidator<ExchangeRateUpdateDto>, ExchangeRateUpdateDtoValidator>();
            services.AddTransient<IValidator<LatestExchangeRateRequestDto>, LatestExchangeRateRequestDtoValidator>();
        }
    }
}
