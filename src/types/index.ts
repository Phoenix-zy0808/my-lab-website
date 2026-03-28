// 实验室官网数据类型定义

export interface SiteConfig {
  labName: string
  labNameEn: string
  description: string
  university: string
  department: string
  address: string
  email: string
  phone: string
  logo?: string
  heroImage?: string
  socialLinks: SocialLink[]
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

// 团队成员相关
export type TeamRole =
  | 'pi'
  | 'research_assistant'
  | 'master_student'
  | 'undergraduate'
  | 'graduated_master'
  | 'graduated_undergraduate'

export interface TeamMember {
  id: string
  name: string
  title: string
  role: TeamRole
  photo?: string
  email?: string
  phone?: string
  office?: string
  bio?: string
  education?: EducationItem[]
  workExperience?: WorkExperienceItem[]
  researchProjects?: ResearchProject[]
  researchInterests?: string[]
  publications?: string[]
  joinDate?: string
}

export interface EducationItem {
  time: string
  school: string
  degree?: string
  major?: string
}

export interface WorkExperienceItem {
  time: string
  organization: string
  position: string
}

export interface ResearchProject {
  name: string
  type: string
  role: string
  grantNumber?: string
  funding?: string
  period: string
}

// 论文发表相关
export type PublicationType = 'journal' | 'conference' | 'book' | 'patent'

export interface Publication {
  id: string
  title: string
  authors: string[]
  journal: string
  year: number
  volume?: string
  issue?: string
  pages?: string
  doi?: string
  pdf?: string
  abstract?: string
  keywords?: string[]
  type: PublicationType
  correspondingAuthor?: string[]
  coFirstAuthor?: string[]
}

// 研究方向相关
export interface ResearchDirection {
  id: string
  title: string
  description: string
  image?: string
  keywords: string[]
  progress?: ResearchProgress[]
}

export interface ResearchProgress {
  id: string
  title: string
  description: string
  images?: ProgressImage[]
  date?: string
}

export interface ProgressImage {
  src: string
  caption: string
}

// 新闻相关
export interface NewsItem {
  id: string
  title: string
  summary?: string
  content?: string
  date: string
  image?: string
  link?: string
  category?: string
}

// 成就相关
export interface Achievement {
  id: string
  type: 'paper' | 'competition' | 'copyright' | 'patent' | 'project' | 'honor'
  title: string
  description: string
  date: string
  // 论文特有字段
  authors?: string[]
  journal?: string
  year?: number
  volume?: string
  issue?: string
  pages?: string
  doi?: string
  // 通用字段
  image?: string
  pdf?: string
  link?: string
  patentNumber?: string
}

// 招聘信息
export interface Recruitment {
  id: string
  title: string
  position: string
  description: string
  requirements: string[]
  benefits: string[]
  contact: string
  deadline?: string
  publishDate: string
}

// 图片画廊
export interface GalleryImage {
  id: string
  src: string
  title: string
  description?: string
  date?: string
  category: string
}

// 仪器设备相关
export interface EquipmentItem {
  id: string
  name: string
  model?: string
  description: string
  image?: string
  specifications?: string[]
  location?: string
  status?: '可用' | '使用中' | '维修中' | '其他'
  purchaseDate?: string
  manufacturer?: string
}
