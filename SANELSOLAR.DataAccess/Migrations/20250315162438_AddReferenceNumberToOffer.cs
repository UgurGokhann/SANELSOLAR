using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SANELSOLAR.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddReferenceNumberToOffer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReferenceNumber",
                table: "Offers",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReferenceNumber",
                table: "Offers");
        }
    }
}
