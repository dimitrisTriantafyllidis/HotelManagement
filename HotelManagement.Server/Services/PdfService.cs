using HotelManagement.Models.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace HotelManagement.Server.Services
{
    public interface IPdfService
    {
        byte[] GenerateCheckInPdf(Booking booking, CheckInSession session, string language = "en");
    }

    public class PdfService : IPdfService
    {
        private const string BrandColor = "#C4704B";
        private const string BrandName = "PulseOS";

        public byte[] GenerateCheckInPdf(Booking booking, CheckInSession session, string language = "en")
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var t = (string key) => PdfTranslations.Get(key, language);
            var guestName = $"{booking.GuestFirstName} {booking.GuestLastName}".Trim();
            var apartmentName = booking.Apartment?.Name ?? t("na");
            var na = t("na");

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(36);
                    page.DefaultTextStyle(x => x.FontSize(9));

                    // Header
                    page.Header().Column(col =>
                    {
                        col.Item().Background(BrandColor).Padding(16).Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().Text(BrandName)
                                    .FontSize(18).Bold().FontColor(Colors.White);
                                c.Item().Text(t("title"))
                                    .FontSize(12).FontColor("#FFFFFFCC");
                            });
                            row.ConstantItem(160).AlignRight().AlignMiddle()
                                .Text($"{t("generated")}: {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC")
                                .FontSize(8).FontColor("#FFFFFFAA");
                        });
                    });

                    // Content
                    page.Content().PaddingVertical(12).Column(col =>
                    {
                        // ── Booking Summary ──
                        SectionHeader(col, t("bookingDetails"));
                        col.Item().PaddingTop(6).Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(1);
                                c.RelativeColumn(2);
                                c.RelativeColumn(1);
                                c.RelativeColumn(2);
                            });

                            AddCell(table, t("apartment"), apartmentName);
                            AddCell(table, t("status"), booking.Status ?? na);
                            AddCell(table, t("checkIn"), booking.CheckInDate.ToString("yyyy-MM-dd"));
                            AddCell(table, t("checkOut"), booking.CheckOutDate.ToString("yyyy-MM-dd"));
                            AddCell(table, t("nights"), booking.NumberOfNights.ToString());
                            AddCell(table, t("guests"), booking.NumberOfGuests.ToString());
                            AddCell(table, t("totalPrice"), $"{booking.TotalPrice:N2} {booking.Currency ?? "EUR"}");
                            AddCell(table, t("platform"), booking.PlatformSource ?? na);
                        });

                        // ── Guest Information ──
                        SectionHeader(col, t("guestInformation"));
                        col.Item().PaddingTop(6).Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(1);
                                c.RelativeColumn(2);
                                c.RelativeColumn(1);
                                c.RelativeColumn(2);
                            });

                            AddCell(table, t("name"), string.IsNullOrEmpty(guestName) ? na : guestName);
                            AddCell(table, t("email"), booking.GuestEmail ?? na);
                            AddCell(table, t("phone"), booking.GuestPhone ?? na);
                            AddCell(table, t("identityNo"), session.IdentityNo ?? na);
                            AddCell(table, t("fatherName"), session.FatherName ?? na);
                            AddCell(table, t("motherName"), session.MotherName ?? na);
                            AddCell(table, t("dateOfBirth"), session.DateOfBirth?.ToString("yyyy-MM-dd") ?? na);
                            AddCell(table, t("nationality"), session.Nationality ?? na);
                            AddCell(table, t("countryOfOrigin"), session.CountryOfOrigin ?? na);
                            AddCell(table, t("address"), session.Address ?? na);
                        });

                        // ── ID Verification (embedded images) ──
                        var hasIdBlob = session.IdDocumentBlob != null && session.IdDocumentBlob.Length > 0;
                        var hasSelfieBlob = session.SelfieBlob != null && session.SelfieBlob.Length > 0;

                        if (hasIdBlob || hasSelfieBlob)
                        {
                            SectionHeader(col, t("idVerification"));
                            col.Item().PaddingTop(6).Row(row =>
                            {
                                if (hasIdBlob)
                                {
                                    row.RelativeItem().Column(c =>
                                    {
                                        c.Item().Text(t("idDocument")).FontSize(8).Bold().FontColor(Colors.Grey.Darken1);
                                        c.Item().PaddingTop(4).MaxHeight(160).Image(session.IdDocumentBlob!);
                                    });
                                }
                                if (hasIdBlob && hasSelfieBlob)
                                    row.ConstantItem(16);
                                if (hasSelfieBlob)
                                {
                                    row.RelativeItem().Column(c =>
                                    {
                                        c.Item().Text(t("selfie")).FontSize(8).Bold().FontColor(Colors.Grey.Darken1);
                                        c.Item().PaddingTop(4).MaxHeight(160).Image(session.SelfieBlob!);
                                    });
                                }
                            });
                        }
                        else
                        {
                            SectionHeader(col, t("idVerification"));
                            col.Item().PaddingTop(6).Table(table =>
                            {
                                table.ColumnsDefinition(c =>
                                {
                                    c.RelativeColumn(1);
                                    c.RelativeColumn(2);
                                });
                                AddRow(table, t("idDocument"), !string.IsNullOrEmpty(session.IdDocumentUrl) ? t("uploaded") : t("notUploaded"));
                                AddRow(table, t("selfie"), !string.IsNullOrEmpty(session.SelfieUrl) ? t("uploaded") : t("notUploaded"));
                            });
                        }

                        // ── Terms & Signature ──
                        SectionHeader(col, t("termsSignature"));
                        col.Item().PaddingTop(6).Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(1);
                                c.RelativeColumn(2);
                            });
                            AddRow(table, t("termsSigned"), session.HasSignedTerms ? t("yes") : t("no"));
                            AddRow(table, t("signedAt"), session.VerifiedAt?.ToString("yyyy-MM-dd HH:mm UTC") ?? na);
                        });

                        if (session.SignatureBlob != null && session.SignatureBlob.Length > 0)
                        {
                            col.Item().PaddingTop(8).Text(t("signature")).FontSize(9).Bold().FontColor(Colors.Grey.Darken1);
                            col.Item().PaddingTop(4).MaxHeight(80).Image(session.SignatureBlob);
                        }

                        // ── Admin Approval ──
                        SectionHeader(col, t("approval"));
                        col.Item().PaddingTop(6).Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(1);
                                c.RelativeColumn(2);
                            });
                            AddRow(table, t("approved"), session.IsAdminApproved ? t("yes") : t("pending"));
                            AddRow(table, t("approvedAt"), session.AdminApprovedAt?.ToString("yyyy-MM-dd HH:mm UTC") ?? na);
                            if (!string.IsNullOrEmpty(session.AdminNotes))
                                AddRow(table, t("adminNotes"), session.AdminNotes);
                        });
                    });

                    // Footer
                    page.Footer().Row(row =>
                    {
                        row.RelativeItem().AlignLeft()
                            .Text(t("footer")).FontSize(7).FontColor(Colors.Grey.Medium);
                        row.RelativeItem().AlignCenter().Text(text =>
                        {
                            text.CurrentPageNumber().FontSize(7).FontColor(Colors.Grey.Medium);
                            text.Span(" / ").FontSize(7).FontColor(Colors.Grey.Medium);
                            text.TotalPages().FontSize(7).FontColor(Colors.Grey.Medium);
                        });
                        row.RelativeItem().AlignRight()
                            .Text($"{DateTime.UtcNow:yyyy-MM-dd}").FontSize(7).FontColor(Colors.Grey.Medium);
                    });
                });
            });

            return document.GeneratePdf();
        }

        private static void SectionHeader(ColumnDescriptor col, string title)
        {
            col.Item().PaddingTop(14).Column(c =>
            {
                c.Item().Text(title).FontSize(12).Bold().FontColor(BrandColor);
                c.Item().PaddingTop(2).LineHorizontal(1).LineColor(BrandColor + "40");
            });
        }

        private static void AddRow(TableDescriptor table, string label, string value)
        {
            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten3)
                .Padding(5).Text(label).Bold().FontSize(9).FontColor(Colors.Grey.Darken1);
            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten3)
                .Padding(5).Text(value).FontSize(9);
        }

        private static void AddCell(TableDescriptor table, string label, string value)
        {
            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten3)
                .Padding(5).Text(label).Bold().FontSize(8).FontColor(Colors.Grey.Darken1);
            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten3)
                .Padding(5).Text(value).FontSize(9);
        }
    }
}
