namespace HotelManagement.Server.Services
{
    public static class PdfTranslations
    {
        private static readonly Dictionary<string, Dictionary<string, string>> Translations = new()
        {
            ["title"] = new() { ["en"] = "Guest Check-In Report", ["el"] = "Αναφορά Check-In Επισκέπτη" },
            ["generated"] = new() { ["en"] = "Generated", ["el"] = "Δημιουργήθηκε" },
            ["bookingDetails"] = new() { ["en"] = "Booking Details", ["el"] = "Στοιχεία Κράτησης" },
            ["bookingId"] = new() { ["en"] = "Booking ID", ["el"] = "Κωδικός Κράτησης" },
            ["apartment"] = new() { ["en"] = "Apartment", ["el"] = "Κατάλυμα" },
            ["checkIn"] = new() { ["en"] = "Check-In", ["el"] = "Άφιξη" },
            ["checkOut"] = new() { ["en"] = "Check-Out", ["el"] = "Αναχώρηση" },
            ["nights"] = new() { ["en"] = "Nights", ["el"] = "Διανυκτερεύσεις" },
            ["guests"] = new() { ["en"] = "Guests", ["el"] = "Επισκέπτες" },
            ["totalPrice"] = new() { ["en"] = "Total Price", ["el"] = "Συνολικό Κόστος" },
            ["platform"] = new() { ["en"] = "Platform", ["el"] = "Πλατφόρμα" },
            ["status"] = new() { ["en"] = "Status", ["el"] = "Κατάσταση" },
            ["guestInformation"] = new() { ["en"] = "Guest Information", ["el"] = "Στοιχεία Επισκέπτη" },
            ["name"] = new() { ["en"] = "Name", ["el"] = "Όνομα" },
            ["email"] = new() { ["en"] = "Email", ["el"] = "Email" },
            ["phone"] = new() { ["en"] = "Phone", ["el"] = "Τηλέφωνο" },
            ["fatherName"] = new() { ["en"] = "Father's Name", ["el"] = "Όνομα Πατρός" },
            ["motherName"] = new() { ["en"] = "Mother's Name", ["el"] = "Όνομα Μητρός" },
            ["identityNo"] = new() { ["en"] = "Identity No", ["el"] = "Αρ. Ταυτότητας" },
            ["dateOfBirth"] = new() { ["en"] = "Date of Birth", ["el"] = "Ημερομηνία Γέννησης" },
            ["nationality"] = new() { ["en"] = "Nationality", ["el"] = "Εθνικότητα" },
            ["countryOfOrigin"] = new() { ["en"] = "Country of Origin", ["el"] = "Χώρα Καταγωγής" },
            ["address"] = new() { ["en"] = "Address", ["el"] = "Διεύθυνση" },
            ["idVerification"] = new() { ["en"] = "ID Verification", ["el"] = "Επαλήθευση Ταυτότητας" },
            ["idDocument"] = new() { ["en"] = "ID Document", ["el"] = "Έγγραφο Ταυτότητας" },
            ["selfie"] = new() { ["en"] = "Selfie", ["el"] = "Σέλφι" },
            ["termsSignature"] = new() { ["en"] = "Terms & Signature", ["el"] = "Όροι & Υπογραφή" },
            ["termsSigned"] = new() { ["en"] = "Terms Signed", ["el"] = "Υπογραφή Όρων" },
            ["yes"] = new() { ["en"] = "Yes", ["el"] = "Ναι" },
            ["no"] = new() { ["en"] = "No", ["el"] = "Όχι" },
            ["signedAt"] = new() { ["en"] = "Signed At", ["el"] = "Υπογράφηκε" },
            ["signature"] = new() { ["en"] = "Signature", ["el"] = "Υπογραφή" },
            ["approval"] = new() { ["en"] = "Admin Approval", ["el"] = "Έγκριση Διαχειριστή" },
            ["approved"] = new() { ["en"] = "Approved", ["el"] = "Εγκρίθηκε" },
            ["approvedAt"] = new() { ["en"] = "Approved At", ["el"] = "Εγκρίθηκε στις" },
            ["adminNotes"] = new() { ["en"] = "Admin Notes", ["el"] = "Σημειώσεις Διαχειριστή" },
            ["footer"] = new() { ["en"] = "PulseOS - Guest Check-In Report", ["el"] = "PulseOS - Αναφορά Check-In Επισκέπτη" },
            ["notUploaded"] = new() { ["en"] = "Not uploaded", ["el"] = "Δεν μεταφορτώθηκε" },
            ["uploaded"] = new() { ["en"] = "Uploaded", ["el"] = "Μεταφορτώθηκε" },
            ["pending"] = new() { ["en"] = "Pending", ["el"] = "Εκκρεμεί" },
            ["na"] = new() { ["en"] = "N/A", ["el"] = "Δ/Υ" },
        };

        public static string Get(string key, string language = "en")
        {
            if (Translations.TryGetValue(key, out var langs) &&
                langs.TryGetValue(language, out var value))
                return value;

            // Fallback to English
            if (Translations.TryGetValue(key, out var fallback) &&
                fallback.TryGetValue("en", out var enValue))
                return enValue;

            return key;
        }
    }
}
