using AutoMapper;
using HotelManagement.Models.DTOs.Create;
using HotelManagement.Models.DTOs.Update;
using HotelManagement.Models.DTOs.View;
using HotelManagement.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagement.Models.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Apartment, ApartmentDto>().ReverseMap();
            CreateMap<Apartment, CreateApartmentDto>().ReverseMap();
            CreateMap<Apartment, UpdateApartmentDto>().ReverseMap();

            CreateMap<Guest, GuestDto>().ReverseMap();
            CreateMap<Guest, CreateGuestDto>().ReverseMap();
            CreateMap<Guest, UpdateGuestDto>().ReverseMap();

            CreateMap<Booking, BookingDto>()
                .ForMember(dest => dest.ApartmentName, opt => opt.MapFrom(src =>
                    src.Apartment != null ? src.Apartment.Name : null));
            CreateMap<BookingDto, Booking>();
            CreateMap<Booking, CreateBookingDto>().ReverseMap();
            CreateMap<Booking, UpdateBookingDto>().ReverseMap();

            CreateMap<OnlineCheckIn, OnlineCheckInDto>()
            .ForMember(dest => dest.SignatureData, opt => opt.MapFrom(src =>
                src.SignatureBlob != null ? Convert.ToBase64String(src.SignatureBlob) : null))
            .ForMember(dest => dest.PdfData, opt => opt.MapFrom(src =>
                src.PdfFileBlob != null ? Convert.ToBase64String(src.PdfFileBlob) : null));

            CreateMap<OnlineCheckInDto, OnlineCheckIn>()
                .ForMember(dest => dest.SignatureBlob, opt => opt.MapFrom(src =>
                    !string.IsNullOrEmpty(src.SignatureData) ? Convert.FromBase64String(src.SignatureData.Replace("data:image/png;base64,", "")) : null))
                .ForMember(dest => dest.PdfFileBlob, opt => opt.MapFrom(src =>
                    !string.IsNullOrEmpty(src.PdfData) ? Convert.FromBase64String(src.PdfData.Replace("data:application/pdf;base64,", "")) : null));

            CreateMap<CreateOnlineCheckInDto, OnlineCheckIn>()
                .ForMember(dest => dest.SignatureBlob, opt => opt.MapFrom(src =>
                    !string.IsNullOrEmpty(src.SignatureData) ? Convert.FromBase64String(src.SignatureData.Replace("data:image/png;base64,", "")) : null))
                .ForMember(dest => dest.PdfFileBlob, opt => opt.MapFrom(src =>
                    !string.IsNullOrEmpty(src.PdfData) ? Convert.FromBase64String(src.PdfData.Replace("data:application/pdf;base64,", "")) : null));

            // ApartmentPhoto mappings
            CreateMap<ApartmentPhoto, ApartmentPhotoDto>();

            // CheckInSession mappings
            CreateMap<CheckInSession, CheckInSessionDto>()
                .ForMember(dest => dest.SignatureData, opt => opt.MapFrom(src =>
                    src.SignatureBlob != null ? Convert.ToBase64String(src.SignatureBlob) : null));

            CreateMap<CreateCheckInSessionDto, CheckInSession>()
                .ForMember(dest => dest.SignatureBlob, opt => opt.MapFrom(src =>
                    !string.IsNullOrEmpty(src.SignatureData) ? Convert.FromBase64String(src.SignatureData.Replace("data:image/png;base64,", "")) : null));

            // MaintenanceTask mappings
            CreateMap<MaintenanceTask, MaintenanceTaskDto>()
                .ForMember(dest => dest.ApartmentName, opt => opt.MapFrom(src =>
                    src.Apartment != null ? src.Apartment.Name : null));

            CreateMap<CreateMaintenanceTaskDto, MaintenanceTask>();
            CreateMap<UpdateMaintenanceTaskDto, MaintenanceTask>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ApplicationUser, ApplicationUserDto>();
            CreateMap<ApplicationUser, CreateUserDto>();

            CreateMap<CreateUserDto, ApplicationUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
            CreateMap<UpdateUserDto, ApplicationUser>();
        }
    }
}
