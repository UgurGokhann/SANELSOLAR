using Microsoft.AspNetCore.Http;
using SANELSOLAR.DataAccess.Context;
using SANELSOLAR.DataAccess.Interfaces;
using SANELSOLAR.DataAccess.Repositories;
using SANELSOLAR.Entities;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SANELSOLAR.DataAccess.UnitOfWork
{
    public class Uow : IUow
    {
        private readonly SanelSolarContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public Uow(SanelSolarContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public IRepository<T> GetRepository<T>() where T : class
        {
            return new Repository<T>(_context);
        }

        public async Task SaveChangesAsync()
        {
            SetAuditFields();
            await _context.SaveChangesAsync();
        }

        private void SetAuditFields()
        {
            var userId = GetCurrentUserId();

            foreach (var entry in _context.ChangeTracker.Entries<BaseEntity>())
            {
                if (entry.State == Microsoft.EntityFrameworkCore.EntityState.Added)
                {
                    entry.Entity.CreatedUserId = userId;
                    entry.Entity.CreatedDate = DateTime.UtcNow;
                    entry.Entity.IsActive = true;
                }

                if (entry.State == Microsoft.EntityFrameworkCore.EntityState.Modified)
                {
                    entry.Entity.UpdatedUserId = userId;
                    entry.Entity.UpdatedDate = DateTime.UtcNow;
                }
            }
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == "userId");

            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }

            return null;
        }
    }
}
