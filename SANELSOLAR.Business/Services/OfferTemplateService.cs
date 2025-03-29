using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.Common.Enums;
using SANELSOLAR.DataAccess.Interfaces;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Services
{
    public class OfferTemplateService : Service<CreateOfferTemplateDto, UpdateOfferTemplateDto, ListOfferTemplateDto, OfferTemplate>, IOfferTemplateService
    {
        private readonly IUow _uow;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateOfferTemplateDto> _createOfferTemplateDtoValidator;
        private readonly IValidator<UpdateOfferTemplateDto> _updateOfferTemplateDtoValidator;

        public OfferTemplateService(IMapper mapper, IUow uow, IValidator<CreateOfferTemplateDto> createOfferTemplateDtoValidator, IValidator<UpdateOfferTemplateDto> updateOfferTemplateDtoValidator) : base(mapper, createOfferTemplateDtoValidator, updateOfferTemplateDtoValidator, uow)
        {
            _uow = uow;
            _mapper = mapper;
            _createOfferTemplateDtoValidator = createOfferTemplateDtoValidator;
            _updateOfferTemplateDtoValidator = updateOfferTemplateDtoValidator;
        }

        public async Task<IResponse<ListOfferTemplateDto>> GetDefaultTemplateAsync()
        {
            try
            {
                var defaultTemplate = await _uow.GetRepository<OfferTemplate>().GetByFilterAsync(x => x.IsDefault && x.IsActive);
                
                if (defaultTemplate == null)
                {
                    // Varsayılan şablon yoksa, varsayılan şablonu oluştur
                    var newDefaultTemplate = CreateDefaultTemplate();
                    
                    await _uow.GetRepository<OfferTemplate>().CreateAsync(newDefaultTemplate);
                    await _uow.SaveChangesAsync();
                    
                    var dto = _mapper.Map<ListOfferTemplateDto>(newDefaultTemplate);
                    return new Response<ListOfferTemplateDto>(ResponseType.Success, dto);
                }
                
                var defaultTemplateDto = _mapper.Map<ListOfferTemplateDto>(defaultTemplate);
                return new Response<ListOfferTemplateDto>(ResponseType.Success, defaultTemplateDto);
            }
            catch (Exception ex)
            {
                return new Response<ListOfferTemplateDto>(ResponseType.Error, $"Varsayılan şablon alınırken bir hata oluştu: {ex.Message}");
            }
        }

        public async Task<IResponse> SetAsDefaultAsync(int templateId)
        {
            try
            {
                // Önce mevcut varsayılan şablonu bul
                var currentDefault = await _uow.GetRepository<OfferTemplate>().GetByFilterAsync(x => x.IsDefault && x.IsActive);
                
                // Yeni varsayılan olacak şablonu bul
                var newDefault = await _uow.GetRepository<OfferTemplate>().FindAsync(templateId);
                
                if (newDefault == null)
                {
                    return new Response(ResponseType.NotFound, $"Şablon bulunamadı. ID: {templateId}");
                }
                
                // Eğer mevcut varsayılan şablon varsa, varsayılan özelliğini kaldır
                if (currentDefault != null)
                {
                    var updatedCurrentDefault = new OfferTemplate
                    {
                        TemplateId = currentDefault.TemplateId,
                        Name = currentDefault.Name,
                        Description = currentDefault.Description,
                        IsDefault = false,
                        CompanyName = currentDefault.CompanyName,
                        CompanyTagline = currentDefault.CompanyTagline,
                        OfferTitle = currentDefault.OfferTitle,
                        OfferSubtitle = currentDefault.OfferSubtitle,
                        CustomerTitle = currentDefault.CustomerTitle,
                        ShowCustomerPhone = currentDefault.ShowCustomerPhone,
                        ShowCustomerAddress = currentDefault.ShowCustomerAddress,
                        DeliveryTimeText = currentDefault.DeliveryTimeText,
                        OfferInfoTitle = currentDefault.OfferInfoTitle,
                        OfferNoteText = currentDefault.OfferNoteText,
                        ShowUnitPrices = currentDefault.ShowUnitPrices,
                        ShowTotalPrices = currentDefault.ShowTotalPrices,
                        FooterCompanyName = currentDefault.FooterCompanyName,
                        FooterCompanyTagline = currentDefault.FooterCompanyTagline,
                        FooterAddress = currentDefault.FooterAddress,
                        FooterCity = currentDefault.FooterCity,
                        FooterPhone = currentDefault.FooterPhone,
                        FooterTaxInfo = currentDefault.FooterTaxInfo,
                        FooterWebsite = currentDefault.FooterWebsite,
                        FooterEmail = currentDefault.FooterEmail,
                        TermsAndConditions = currentDefault.TermsAndConditions,
                        Partners = currentDefault.Partners,
                        PrimaryColor = currentDefault.PrimaryColor,
                        SecondaryColor = currentDefault.SecondaryColor,
                        HeaderBgColor = currentDefault.HeaderBgColor,
                        FooterBgColor = currentDefault.FooterBgColor,
                        CreatedDate = currentDefault.CreatedDate,
                        CreatedUserId = currentDefault.CreatedUserId,
                        IsActive = currentDefault.IsActive
                    };
                    
                    _uow.GetRepository<OfferTemplate>().Update(updatedCurrentDefault, currentDefault);
                }
                
                // Yeni şablonu varsayılan olarak ayarla
                var updatedNewDefault = new OfferTemplate
                {
                    TemplateId = newDefault.TemplateId,
                    Name = newDefault.Name,
                    Description = newDefault.Description,
                    IsDefault = true,
                    CompanyName = newDefault.CompanyName,
                    CompanyTagline = newDefault.CompanyTagline,
                    OfferTitle = newDefault.OfferTitle,
                    OfferSubtitle = newDefault.OfferSubtitle,
                    CustomerTitle = newDefault.CustomerTitle,
                    ShowCustomerPhone = newDefault.ShowCustomerPhone,
                    ShowCustomerAddress = newDefault.ShowCustomerAddress,
                    DeliveryTimeText = newDefault.DeliveryTimeText,
                    OfferInfoTitle = newDefault.OfferInfoTitle,
                    OfferNoteText = newDefault.OfferNoteText,
                    ShowUnitPrices = newDefault.ShowUnitPrices,
                    ShowTotalPrices = newDefault.ShowTotalPrices,
                    FooterCompanyName = newDefault.FooterCompanyName,
                    FooterCompanyTagline = newDefault.FooterCompanyTagline,
                    FooterAddress = newDefault.FooterAddress,
                    FooterCity = newDefault.FooterCity,
                    FooterPhone = newDefault.FooterPhone,
                    FooterTaxInfo = newDefault.FooterTaxInfo,
                    FooterWebsite = newDefault.FooterWebsite,
                    FooterEmail = newDefault.FooterEmail,
                    TermsAndConditions = newDefault.TermsAndConditions,
                    Partners = newDefault.Partners,
                    PrimaryColor = newDefault.PrimaryColor,
                    SecondaryColor = newDefault.SecondaryColor,
                    HeaderBgColor = newDefault.HeaderBgColor,
                    FooterBgColor = newDefault.FooterBgColor,
                    CreatedDate = newDefault.CreatedDate,
                    CreatedUserId = newDefault.CreatedUserId,
                    IsActive = newDefault.IsActive
                };
                
                _uow.GetRepository<OfferTemplate>().Update(updatedNewDefault, newDefault);
                await _uow.SaveChangesAsync();
                
                return new Response(ResponseType.Success, "Şablon varsayılan olarak ayarlandı.");
            }
            catch (Exception ex)
            {
                return new Response(ResponseType.Error, $"Şablon varsayılan olarak ayarlanırken bir hata oluştu: {ex.Message}");
            }
        }
        
        private OfferTemplate CreateDefaultTemplate()
        {
            var defaultTerms = new List<string>
            {
                "ÖDEME İLE BİRLİKTE SİPARİŞ İŞLEME ALINACAKTIR.",
                "KREDİ KARTI İLE ÖDEMELERDE 12 AYA VARAN TAKSİT İMKANIMIZ BULUNMAKTADIR.",
                "KREDİ KARTI İLE OLAN ÖDEMELERDE KOMİSYON FARKI UYGULANMAKTADIR.",
                "OPSİYON SÜRESİ İÇERİSİNDE DÖNÜŞÜ OLMAYAN TEKLİFLERİMİZ İÇİN FİYAT REVİZE HAKKIMIZ SAKLIDIR"
            };
            
            var defaultPartners = new List<PartnerInfo>
            {
                new PartnerInfo { PartnerName = "LEXRON", PartnerLogo = "" },
                new PartnerInfo { PartnerName = "solinv", PartnerLogo = "" },
                new PartnerInfo { PartnerName = "MOTECH", PartnerLogo = "" }
            };
            
            return new OfferTemplate
            {
                Name = "Varsayılan Şablon",
                Description = "Sistem tarafından oluşturulan varsayılan şablon",
                IsDefault = true,
                
                // Header settings
                CompanyName = "SANEL",
                CompanyTagline = "ENERJİ TEKNOLOJİLERİ",
                OfferTitle = "Ticari Teklif",
                OfferSubtitle = "LiFePO₄ Batarya",
                
                // Customer section settings
                CustomerTitle = "Müşteri Bilgileri",
                ShowCustomerPhone = true,
                ShowCustomerAddress = true,
                DeliveryTimeText = "Ürünlerin teslim süresi siparişten itibaren 7-10 iş günüdür.",
                
                // Offer info section settings
                OfferInfoTitle = "Teklif Bilgileri",
                
                // Offer note
                OfferNoteText = "Teklifimize işçilik, montaj, devreye alma dahildir.",
                
                // Items table settings
                ShowUnitPrices = true,
                ShowTotalPrices = true,
                
                // Footer section settings
                FooterCompanyName = "SANEL",
                FooterCompanyTagline = "ENERJİ TEKNOLOJİLERİ",
                FooterAddress = "YAVUZ SULTAN MAHALLESİ HÜRRİYET CADDESİ NO:349",
                FooterCity = "DERİNCE / KOCAELİ",
                FooterPhone = "0 532 420 91 21",
                FooterTaxInfo = "DERİNCE V.D. / 336 056 4577",
                FooterWebsite = "www.sanelsolar.com.tr",
                FooterEmail = "info@sanelsolar.com.tr",
                
                // Terms and conditions
                TermsAndConditions = defaultTerms,
                
                // Partners section
                Partners = defaultPartners,
                
                // Colors and styling
                PrimaryColor = "#0099cc",
                SecondaryColor = "#ffa500",
                HeaderBgColor = "#ffffff",
                FooterBgColor = "#ffffff"
            };
        }
    }
} 