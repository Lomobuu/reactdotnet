using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Model;

namespace ReactApp1.Server.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Hold> Hold { get; set; }
        public DbSet<Problem> Problem { get; set; }
        public DbSet<ProblemHold> ProblemHolds { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProblemHold>()
                .HasOne(ph => ph.Problem)
                .WithMany()
                .HasForeignKey(ph => ph.ProblemId);

            modelBuilder.Entity<ProblemHold>()
                .HasOne(ph => ph.Hold)
                .WithMany()
                .HasForeignKey(ph => ph.HoldId);
        }

    }
}
