export type UserRole = 'ADMIN' | 'BRANCH_LEADER';

export interface User {
  id: string;
  unitId?: string; // For Branch Leaders to know which unit they belong to
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  branchId?: string; // For Branch Leaders
  avatarUrl?: string;
  unitName?: string;
  villageName?: string;
  password?: string;
}

export interface Branch {
  id: string;
  unitId: string; // The ID of the unit (Admin user) this branch belongs to
  name: string;
  managerName?: string;
  phone?: string;
  memberCount: number;
}

export interface Member {
  id: string;
  unitId: string; // The ID of the unit (Admin user) this member belongs to
  fullName: string;
  dob: string;
  gender: 'Nam' | 'Nữ';
  ethnicity: string;
  religion: string;
  citizenId: string;
  memberCode: string;
  phone: string;
  hometown: string;
  address: string;
  enlistDate: string;
  enlistUnit: string;
  dischargeDate: string;
  dischargeInfo: string;
  joinDate: string;
  partyJoinDate: string;
  position: string;
  education: string;
  professionalQualification: 'Sơ cấp' | 'Trung cấp' | 'Cao đẳng' | 'Đại học' | 'Khác';
  academicTitle: string;
  politicalTheory: 'Sơ cấp' | 'Trung cấp' | 'Cao cấp' | 'Khác';
  category: 'Cựu chiến binh' | 'Cựu quân nhân';
  rewards: string;
  disciplines: string;
  medalDate: string;
  occupation: string;
  status: 'Đang sinh hoạt' | 'Miễn sinh hoạt' | 'Đã chuyển đi' | 'Chết' | 'Ra khỏi Hội';
  leaveDateAndReason: string;
  policyCategory: string;
  notes: string;
  branchId: string;
  imageUrl?: string;
}
