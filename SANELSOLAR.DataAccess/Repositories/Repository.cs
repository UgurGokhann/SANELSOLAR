﻿using Microsoft.EntityFrameworkCore;
using SANELSOLAR.Common.Enums;
using SANELSOLAR.DataAccess.Context;
using SANELSOLAR.DataAccess.Interfaces;
using SANELSOLAR.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace SANELSOLAR.DataAccess.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly SanelSolarContext _context;

        public Repository(SanelSolarContext context)
        {
            _context = context;
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await _context.Set<T>().AsNoTracking().ToListAsync();
        }

        public async Task<List<T>> GetAllAsync(Expression<Func<T, bool>> filter)
        {
            return await _context.Set<T>().Where(filter).AsNoTracking().ToListAsync();
        }

        public async Task<List<T>> GetAllAsync<TKey>(Expression<Func<T, TKey>> selector, OrderByType orderByType = OrderByType.DESC)
        {
            return orderByType == OrderByType.ASC ? await _context.Set<T>().AsNoTracking().OrderBy(selector).ToListAsync() : await _context.Set<T>().AsNoTracking().OrderByDescending(selector).ToListAsync();
        }

        public async Task<List<T>> GetAllAsync<TKey>(Expression<Func<T, bool>> filter, Expression<Func<T, TKey>> selector, OrderByType orderByType = OrderByType.DESC)
        {
            return orderByType == OrderByType.ASC ? await _context.Set<T>().Where(filter).AsNoTracking().OrderBy(selector).ToListAsync() : await _context.Set<T>().Where(filter).AsNoTracking().OrderByDescending(selector).ToListAsync();
        }

        public async Task<T> FindAsync(object id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<T> GetByFilterAsync(Expression<Func<T, bool>> filter, bool asNoTracking = false)
        {
            return !asNoTracking ? await _context.Set<T>().AsNoTracking().SingleOrDefaultAsync(filter) : await _context.Set<T>().SingleOrDefaultAsync(filter);
        }

        public IQueryable<T> GetQuery()
        {
            return _context.Set<T>().AsQueryable();
        }

        public void Remove(T entity)
        {
            if (entity is BaseEntity baseEntity)
            {
                baseEntity.IsActive = false;
                baseEntity.UpdatedDate = DateTime.UtcNow;
                _context.Update(entity);
            }
            else
                _context.Set<T>().Remove(entity);
        }

        public async Task CreateAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
        }

        public void Update(T entity, T unchanged)
        {
            _context.Entry(unchanged).CurrentValues.SetValues(entity);
        }
    }
}
