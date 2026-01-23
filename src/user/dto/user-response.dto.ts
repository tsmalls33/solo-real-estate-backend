import { UserResponseDto as SharedUserResponseDto } from "@RealEstate/types";

export class UserResponseDto implements SharedUserResponseDto {
  id_user!: string;
  email!: string;
  fullName?: string;
  role!: SharedUserResponseDto["role"];
  id_tenant?: string;
}


