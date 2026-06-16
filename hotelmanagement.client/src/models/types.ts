export interface ApartmentDto {
  id: string;
  name: string;
  location?: string;
  description?: string;
  maxGuests: number;

  pricePerNight: number;
  cleaningFee?: number;
  currency?: string;

  bedrooms: number;
  bathrooms: number;
  areaSqMeters?: number;
  propertyType?: string;
  amenities?: string;
  photoUrls?: string;

  doorCode?: string;
  wifiSsid?: string;
  wifiPassword?: string;
  checkInHour: number;
  checkOutHour: number;

  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;

  isActive: boolean;
  houseRules?: string;
  checkInInstructions?: string;
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
  apartmentId: string;
  apartmentName?: string;

  checkInDate: string;
  checkOutDate: string;

  guestFirstName?: string;
  guestLastName?: string;
  guestEmail?: string;
  guestPhone?: string;
  numberOfGuests: number;
  guestCountry?: string;

  pricePerNight: number;
  numberOfNights: number;
  cleaningFee: number;
  totalPrice: number;
  currency?: string;
  isPaid: boolean;
  paymentMethod?: string;

  platformSource?: string;
  platformReservationId?: string;
  status?: string;
  notes?: string;

  createdAt: string;
  checkedInAt?: string;
  checkedOutAt?: string;

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

export interface CheckInSessionDto {
  id: string;
  bookingId: string;
  isVerified: boolean;
  idDocumentUrl?: string;
  selfieUrl?: string;
  hasSignedTerms: boolean;
  signatureData?: string;
  fatherName?: string;
  motherName?: string;
  identityNo?: string;
  dateOfBirth?: string;
  nationality?: string;
  countryOfOrigin?: string;
  address?: string;
  isAdminApproved: boolean;
  adminApprovedAt?: string;
  adminNotes?: string;
  createdAt: string;
  verifiedAt?: string;
  completedAt?: string;
}

export interface CreateCheckInSessionDto {
  bookingId: string;
  idDocumentUrl?: string;
  selfieUrl?: string;
  hasSignedTerms: boolean;
  signatureData?: string;
  fatherName?: string;
  motherName?: string;
  identityNo?: string;
  dateOfBirth?: string;
  nationality?: string;
  countryOfOrigin?: string;
  address?: string;
}

export interface ApartmentPhotoDto {
  id: string;
  apartmentId: string;
  fileName?: string;
  contentType: string;
  sortOrder: number;
  uploadedAt: string;
}

export interface MaintenanceTaskDto {
  id: string;
  apartmentId: string;
  apartmentName?: string;
  bookingId?: string;
  title?: string;
  description?: string;
  taskType: string;
  status: string;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  photoProofUrl?: string;
  completionNotes?: string;
}

export interface DoorCodeResponseDto {
  doorCode?: string;
  wifiSsid?: string;
  wifiPassword?: string;
  apartmentName?: string;
}

export interface SyncResultDto {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
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
  fullName: string;
  email: string;
}
