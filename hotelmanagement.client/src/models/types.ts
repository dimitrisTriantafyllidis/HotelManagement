export interface ApartmentDto {
  id: string;
  name: string;
  location?: string;
  description?: string;
}

export interface GuestDto {
  id: string;
  fullName: string;
  identityNo: string;
  nationality?: string;
  bookingId: string;
}

export interface BookingDto {
  id: string;
  firstName :string;
  lastName :string;
  email : string;
  phoneNumber : string;
  apartmentId: string;
  apartment?: ApartmentDto;
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
  guests?: GuestDto[];
  checkIn?: OnlineCheckInDto;
}

export interface OnlineCheckInDto {
  id: string;
  firstName: string;
  lastName: string;
  fatherName?: string;
  motherName?: string;
  identityNo: string;
  dateOfBirth?: string;
  nationality?: string;
  countryOfOrigin?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  appartment?: string;
  dateOfArrival?: Date;
  dateOfDeparture?: Date;
  agree: boolean;
  signatureData?: string;
  pdfData?: string;
  submittedAt?: string;
  bookingId?: string;
}

export interface ApplicationUserDto {
  id: string;
  fullName: string;
  email: string;
  organizationName?: string;
  tenantId?: string;
  registeredAt: string;
}

export interface RegisterUserDto {
  fullName: string;
  email: string;
  password: string;
  organizationName?: string;
}

export interface UpdateUserDto {
  id: string;
  fullName: string;
  email: string;
  organizationName?: string;
}

export interface RoleDto {
  name: string;
}

export interface AssignRoleDto {
  userId: string;
  role: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  expiresIn: number;
  roles: string[];
}
