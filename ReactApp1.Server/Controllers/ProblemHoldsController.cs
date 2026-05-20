using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Model;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProblemHoldsController : ControllerBase
    {
        private readonly DataContext _context;

        public ProblemHoldsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProblemHold>>> GetAll() =>
            Ok(await _context.ProblemHolds.Include(ph => ph.Hold).Include(ph => ph.Problem).ToListAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<ProblemHold>> GetById(int id)
        {
            var ph = await _context.ProblemHolds
                .Include(ph => ph.Hold)
                .Include(ph => ph.Problem)
                .FirstOrDefaultAsync(ph => ph.Id == id);
            return ph is null ? NotFound() : Ok(ph);
        }

        [HttpGet("byproblem/{problemId}")]
        public async Task<ActionResult<List<ProblemHold>>> GetByProblem(int problemId) =>
            Ok(await _context.ProblemHolds
                .Where(ph => ph.ProblemId == problemId)
                .Include(ph => ph.Hold)
                .OrderBy(ph => ph.HoldOrder)
                .ToListAsync());

        [HttpPost]
        public async Task<ActionResult<ProblemHold>> Create(ProblemHold problemHold)
        {
            _context.ProblemHolds.Add(problemHold);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = problemHold.Id }, problemHold);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ph = await _context.ProblemHolds.FindAsync(id);
            if (ph is null) return NotFound();
            _context.ProblemHolds.Remove(ph);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}