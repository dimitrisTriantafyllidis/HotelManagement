using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminApprovalToCheckIn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AdminApprovedAt",
                table: "CheckInSessions",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AdminNotes",
                table: "CheckInSessions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAdminApproved",
                table: "CheckInSessions",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminApprovedAt",
                table: "CheckInSessions");

            migrationBuilder.DropColumn(
                name: "AdminNotes",
                table: "CheckInSessions");

            migrationBuilder.DropColumn(
                name: "IsAdminApproved",
                table: "CheckInSessions");
        }
    }
}
