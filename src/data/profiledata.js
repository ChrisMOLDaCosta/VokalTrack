// src/data/profileData.js - VokalTrack Profile Data (Clean Version)
export const ProfileData = {
  // Data Diri
  id: 'user_001',
  fullName: 'Chris M.O.L. Da Costa',
  username: '@chrisvocal',
  email: 'chris.dacosta@vokaltrack.com',
  profilePict: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&auto=format',
  bio: 'Vocalis | Latihan vokal setiap hari | Target: Jadi penyanyi pro',
  
  // Statistik Latihan
  totalLatihan: 47,
  totalMenit: 890,
  streakHariIni: 7, // Latihan 7 hari berturut-turut
  
  // Level User
  level: {
    name: 'Silver Vocalist',
    levelNumber: 3,
    totalLevels: 10,
    expCurrent: 1250,
    expRequired: 2000,
  },
  
  // Target Mingguan
  weeklyGoal: 5,
  weeklyProgress: 4,
  
  // Statistik Sosial
  following: 234,
  followers: 1890,
  
  // Metadata
  memberSince: '18 Mar 2025',
  createdAt: '2025-03-18T00:00:00.000Z',
  
  // Kategori Favorit
  favoriteCategories: ['Pernapasan', 'Teknik Vokal', 'Pitch Control'],
  
  // Skill yang dikuasai
  skillBadges: ['Pitch Control', 'Artikulasi', 'Pernapasan Dasar'],
};

// Helper Functions
export const getExpPercentage = () => {
  return (ProfileData.level.expCurrent / ProfileData.level.expRequired) * 100;
};

export const getWeeklyGoalPercentage = () => {
  return (ProfileData.weeklyProgress / ProfileData.weeklyGoal) * 100;
};