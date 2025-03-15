using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SANELSOLAR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OffersController : ControllerBase
    {
        private readonly IOfferService _offerService;

        public OffersController(IOfferService offerService)
        {
            _offerService = offerService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] OfferFilterDto filter)
        {
            var response = await _offerService.GetAllOffersAsync(filter);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            // Create a filter to get a specific offer by ID
            var response = await _offerService.GetOfferWithItemsAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateOfferDto offerDto)
        {
            var response = await _offerService.CreateAsync(offerDto);
            return response.ResponseType switch
            {
                ResponseType.Success => Created("", response.Data),
                ResponseType.ValidationError => BadRequest(response.ValidationErrors),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update([FromBody] UpdateOfferDto offerDto)
        {
            var response = await _offerService.UpdateAsync(offerDto);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.ValidationError => BadRequest(response.ValidationErrors),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPut("status/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var response = await _offerService.UpdateOfferStatusAsync(id, status);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _offerService.RemoveAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => NoContent(),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("calculate-total/{id}")]
        [Authorize]
        public async Task<IActionResult> CalculateTotal(int id)
        {
            var response = await _offerService.CalculateTotalAmountAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }
    }
} 