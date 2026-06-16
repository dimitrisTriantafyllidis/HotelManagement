using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddCheckInPersonalInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "CheckInSessions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CountryOfOrigin",
                table: "CheckInSessions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "CheckInSessions",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FatherName",
                table: "CheckInSessions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdentityNo",
                table: "CheckInSessions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MotherName",
                table: "CheckInSessions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nationality",
                table: "CheckInSessions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "PdfBlob",
                table: "CheckInSessions",
                type: "varbinary(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "CheckInSessions");

            migrationBuilder.DropColumn(
                name: "CountryOfOrigin",
                table: "CheckInSessions");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "CheckInSessions");

            migrationBuilder.DropColumn(
                name: "FatherName",
                table: "CheckInSessions");

            migrationBuilder.DropColumn(
                name: "IdentityNo",
                table: "CheckInSessions");

            migrationBuilder.DropColumn(
                name: "MotherName",
                table: "CheckInSessions");

            migrationBuilder.DropColumn(
                name: "Nationality",
                table: "CheckInSessions");

            migrationBuilder.DropColumn(
                name: "PdfBlob",
                table: "CheckInSessions");
        }
    }
}
