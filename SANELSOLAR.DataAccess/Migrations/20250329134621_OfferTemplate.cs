using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SANELSOLAR.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class OfferTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OfferTemplates",
                columns: table => new
                {
                    TemplateId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CompanyName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CompanyTagline = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    OfferTitle = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    OfferSubtitle = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CustomerTitle = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ShowCustomerPhone = table.Column<bool>(type: "boolean", nullable: false),
                    ShowCustomerAddress = table.Column<bool>(type: "boolean", nullable: false),
                    DeliveryTimeText = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    OfferInfoTitle = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    OfferNoteText = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ShowUnitPrices = table.Column<bool>(type: "boolean", nullable: false),
                    ShowTotalPrices = table.Column<bool>(type: "boolean", nullable: false),
                    FooterCompanyName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FooterCompanyTagline = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FooterAddress = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    FooterCity = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FooterPhone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    FooterTaxInfo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FooterWebsite = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FooterEmail = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    TermsAndConditions = table.Column<string>(type: "text", nullable: false),
                    Partners = table.Column<string>(type: "text", nullable: false),
                    PrimaryColor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    SecondaryColor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    HeaderBgColor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    FooterBgColor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedUserId = table.Column<int>(type: "integer", nullable: true),
                    UpdatedUserId = table.Column<int>(type: "integer", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OfferTemplates", x => x.TemplateId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OfferTemplates");
        }
    }
}
