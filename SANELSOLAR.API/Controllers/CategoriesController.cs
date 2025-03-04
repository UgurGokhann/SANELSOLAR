using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SANELSOLAR.Business.Interfaces;
using SANELSOLAR.Common;
using SANELSOLAR.DTOs;
using System.Threading.Tasks;

namespace SANELSOLAR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var response = await _categoryService.GetAllAsync();
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
            var response = await _categoryService.GetByIdAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpGet("with-products")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategoriesWithProducts()
        {
            var response = await _categoryService.GetCategoriesWithProductsAsync();
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
            var response = await _categoryService.SearchCategoriesAsync(term);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CategoryCreateDto categoryCreateDto)
        {
            var response = await _categoryService.CreateCategoryAsync(categoryCreateDto);
            return response.ResponseType switch
            {
                ResponseType.Success => Created("", response.Data),
                ResponseType.ValidationError => BadRequest((response as Response<CategoryCreateDto>)?.ValidationErrors),
                _ => BadRequest(response.Message)
            };
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryUpdateDto categoryUpdateDto)
        {
            if (id != categoryUpdateDto.CategoryId)
                return BadRequest("Route id and category id do not match");

            var response = await _categoryService.UpdateCategoryAsync(categoryUpdateDto);
            return response.ResponseType switch
            {
                ResponseType.Success => Ok(response.Data),
                ResponseType.ValidationError => BadRequest((response as Response<CategoryUpdateDto>)?.ValidationErrors),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _categoryService.RemoveAsync(id);
            return response.ResponseType switch
            {
                ResponseType.Success => NoContent(),
                ResponseType.NotFound => NotFound(response.Message),
                _ => BadRequest(response.Message)
            };
        }
    }
} 