using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Data;
using ReactApp1.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HoldsController : ControllerBase
    {
        private readonly DataContext _context;

        public HoldsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Hold>>> GetAll() =>
            Ok(await _context.Hold.ToListAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<Hold>> GetById(int id)
        {
            var hold = await _context.Hold.FindAsync(id);
            return hold is null ? NotFound() : Ok(hold);
        }

        [HttpPost]
        public async Task<ActionResult<Hold>> Create(Hold hold)
        {
            _context.Hold.Add(hold);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = hold.Id }, hold);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var hold = await _context.Hold.FindAsync(id);
            if (hold is null) return NotFound();
            _context.Hold.Remove(hold);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Hold hold)
        {
            if (id != hold.Id) return BadRequest();
            _context.Entry(hold).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}