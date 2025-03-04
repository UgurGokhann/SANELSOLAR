using SANELSOLAR.DataAccess.Context;
using SANELSOLAR.DataAccess.Interfaces;
using SANELSOLAR.DataAccess.Repositories;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SANELSOLAR.DataAccess.UnitOfWork
{
    public class Uow : IUow
    {
        private readonly SanelSolarContext _context;

        public Uow(SanelSolarContext context)
        {
            _context = context;
        }

        public IRepository<T> GetRepository<T>() where T : class
        {
            return new Repository<T>(_context);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
