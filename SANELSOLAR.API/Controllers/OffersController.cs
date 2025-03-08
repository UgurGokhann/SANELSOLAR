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
        public async Task<IActionResult> GetAll()
        {
            var response = await _offerService.GetAllAsync();
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
            var response = await _offerService.GetOfferWithItemsAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("customer/{customerId}")]
        [Authorize]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            var response = await _offerService.GetOffersByCustomerAsync(customerId);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var response = await _offerService.GetOffersByUserAsync(userId);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("daterange")]
        [Authorize]
        public async Task<IActionResult> GetByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var response = await _offerService.GetOffersByDateRangeAsync(startDate, endDate);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("status/{status}")]
        [Authorize]
        public async Task<IActionResult> GetByStatus(string status)
        {
            var response = await _offerService.GetOffersByStatusAsync(status);
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
                ResponseType.Success => CreatedAtAction(nameof(GetById), new { id = 0 }, response.Data),
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
                ResponseType.NotFound => NotFound(response.Message),
                ResponseType.ValidationError => BadRequest(response.ValidationErrors),
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
                ResponseType.Success => Ok(),
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