using SANELSOLAR.Common;
using SANELSOLAR.DTOs;
using SANELSOLAR.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Interfaces
{
    public interface IOfferTemplateService : IService<CreateOfferTemplateDto, UpdateOfferTemplateDto, ListOfferTemplateDto, OfferTemplate>
    {
        Task<IResponse<ListOfferTemplateDto>> GetDefaultTemplateAsync();
        Task<IResponse> SetAsDefaultAsync(int templateId);
    }
} 