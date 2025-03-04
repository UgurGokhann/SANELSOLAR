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
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var response = await _productService.GetAllAsync();
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _productService.GetByIdAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("by-category/{categoryId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var response = await _productService.GetProductsByCategoryAsync(categoryId);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> Search([FromQuery] string term)
        {
            var response = await _productService.SearchProductsAsync(term);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ProductCreateDto productCreateDto)
        {
            var response = await _productService.CreateProductAsync(productCreateDto);
            return response.ResponseType switch
            {
                ResponseType.Success => Created("", response.Data),
                ResponseType.ValidationError => BadRequest((response as Response<ProductCreateDto>)?.ValidationErrors),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateDto productUpdateDto)
        {
            if (id != productUpdateDto.ProductId)
                return BadRequest("Route id and product id do not match");

            var response = await _productService.UpdateProductAsync(productUpdateDto);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.ValidationError => BadRequest((response as Response<ProductUpdateDto>)?.ValidationErrors),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPut("{id}/categories")]
        [Authorize]
        public async Task<IActionResult> UpdateCategories(int id, [FromBody] List<int> categoryIds)
        {
            var response = await _productService.UpdateProductCategoriesAsync(id, categoryIds);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _productService.RemoveAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => NoContent(),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }
    }
} 