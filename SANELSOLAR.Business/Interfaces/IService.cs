using SANELSOLAR.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace SANELSOLAR.Business.Interfaces
{
    public interface IService<CreateDto, UpdateDto, ListDto, T>
        where CreateDto : class
        where UpdateDto : class
        where ListDto : class
        where T : class
    {
        Task<IResponse<CreateDto>> CreateAsync(CreateDto dto);
        Task<IResponse<UpdateDto>> UpdateAsync(UpdateDto dto);
        Task<IResponse<ListDto>> GetByIdAsync(int id);
        Task<IResponse> RemoveAsync(int id);
        Task<IResponse<List<ListDto>>> GetAllAsync();
        Task<IResponse<List<ListDto>>> GetAllAsync(Expression<Func<T, bool>> filter);
        Task<IResponse<IDto>> GetFilteredFirstOrDefaultAsync<IDto>(Expression<Func<T, bool>> filter);
    }
}