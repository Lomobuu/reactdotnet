using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Model;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProblemsController : ControllerBase
    {
        private readonly DataContext _context;

        public ProblemsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Problem>>> GetAll() =>
            Ok(await _context.Problem.ToListAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<Problem>> GetById(int id)
        {
            var problem = await _context.Problem.FindAsync(id);
            return problem is null ? NotFound() : Ok(problem);
        }

        [HttpPost]
        public async Task<ActionResult<Problem>> Create(Problem problem)
        {
            _context.Problem.Add(problem);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = problem.Id }, problem);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var problem = await _context.Problem.FindAsync(id);
            if (problem is null) return NotFound();
            _context.Problem.Remove(problem);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}