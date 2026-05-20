using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp1.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddHoldCoordinates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "PositionX",
                table: "Hold",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "PositionY",
                table: "Hold",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PositionX",
                table: "Hold");

            migrationBuilder.DropColumn(
                name: "PositionY",
                table: "Hold");
        }
    }
}
