using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.Common.Enums;
using SANELSOLAR.DTOs;
using System.Threading.Tasks;

namespace SANELSOLAR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OfferTemplatesController : ControllerBase
    {
        private readonly IOfferTemplateService _offerTemplateService;

        public OfferTemplatesController(IOfferTemplateService offerTemplateService)
        {
            _offerTemplateService = offerTemplateService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _offerTemplateService.GetAllAsync();
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _offerTemplateService.GetByIdAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("default")]
        public async Task<IActionResult> GetDefault()
        {
            var response = await _offerTemplateService.GetDefaultTemplateAsync();
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateOfferTemplateDto dto)
        {
            var response = await _offerTemplateService.CreateAsync(dto);
            return response.ResponseType switch
            {
                ResponseType.Success => Created("", response.Data),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateOfferTemplateDto dto)
        {
            if (id != dto.TemplateId)
                return BadRequest("ID mismatch");

            var response = await _offerTemplateService.UpdateAsync(dto);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _offerTemplateService.RemoveAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => NoContent(),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPut("{id}/set-default")]
        public async Task<IActionResult> SetAsDefault(int id)
        {
            var response = await _offerTemplateService.SetAsDefaultAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }
    }
} 