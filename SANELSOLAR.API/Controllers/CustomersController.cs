using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SANELSOLAR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomersController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var response = await _customerService.GetAllAsync();
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
            var response = await _customerService.GetByIdAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("search")]
        [Authorize]
        public async Task<IActionResult> Search([FromQuery] string term)
        {
            var response = await _customerService.SearchCustomersAsync(term);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CustomerCreateDto customerDto)
        {
            var response = await _customerService.CreateAsync(customerDto);
            return response.ResponseType switch
            {
                ResponseType.Success => CreatedAtAction(nameof(GetById), new { id = 0 }, response.Data),
                ResponseType.ValidationError => BadRequest(response.ValidationErrors),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update([FromBody] CustomerUpdateDto customerDto)
        {
            var response = await _customerService.UpdateAsync(customerDto);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                ResponseType.ValidationError => BadRequest(response.ValidationErrors),
                _ => BadRequest(response.Message)
            };
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _customerService.RemoveAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }
    }
} 