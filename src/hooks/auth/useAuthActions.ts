
import { useLoginActions } from './actions/useLoginActions';
import { useRegisterActions } from './actions/useRegisterActions';
import { useProfileActions } from './actions/useProfileActions';
import { UserProfile } from './types';

export function useAuthActions(
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) {
  const { login, socialLogin, logout, isLoading: loginLoading } = useLoginActions(setUser);
  const { register, isLoading: registerLoading } = useRegisterActions();
  const { updateProfile, resetPassword, isLoading: profileLoading } = useProfileActions(setUser);
  
  // Combine loading states
  const isLoading = loginLoading || registerLoading || profileLoading;

  return {
    login,
    register,
    socialLogin,
    logout,
    updateProfile,
    resetPassword,
    isLoading,
  };
}
