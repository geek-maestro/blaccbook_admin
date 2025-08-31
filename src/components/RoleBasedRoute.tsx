import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserProfile } from '@/services/profile.service';
import { hasPermission } from '@/services/admin.service';
import { UserRole } from '@/Types/auth';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = '/home'
}) => {
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  const userRole = profile.role as UserRole;
  


  // Check role requirement
  if (requiredRole && userRole !== requiredRole) {
    // Check if user has a higher privilege role
    const roleHierarchy: UserRole[] = [
      'consumer',
      'business_owner', 
      'support_staff',
      'content_moderator',
      'finance_manager',
      'admin',
      'super_admin'
    ];

    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    if (userRoleIndex < requiredRoleIndex) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(userRole, requiredPermission as any)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
