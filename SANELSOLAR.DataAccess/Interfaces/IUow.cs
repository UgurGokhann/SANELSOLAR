using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SANELSOLAR.DataAccess.Interfaces
{
    public interface IUow
    {
        IRepository<T> GetRepository<T>() where T : class;
        Task SaveChangesAsync();
    }
}
