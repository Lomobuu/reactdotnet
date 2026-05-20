using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp1.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Hold",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hold", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Problem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Grade = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Problem", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProblemHolds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProblemId = table.Column<int>(type: "int", nullable: false),
                    HoldId = table.Column<int>(type: "int", nullable: false),
                    HoldOrder = table.Column<int>(type: "int", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProblemHolds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProblemHolds_Hold_HoldId",
                        column: x => x.HoldId,
                        principalTable: "Hold",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProblemHolds_Problem_ProblemId",
                        column: x => x.ProblemId,
                        principalTable: "Problem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProblemHolds_HoldId",
                table: "ProblemHolds",
                column: "HoldId");

            migrationBuilder.CreateIndex(
                name: "IX_ProblemHolds_ProblemId",
                table: "ProblemHolds",
                column: "ProblemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProblemHolds");

            migrationBuilder.DropTable(
                name: "Hold");

            migrationBuilder.DropTable(
                name: "Problem");
        }
    }
}
