import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "../../features/account/accountApi";

export default function RequireAuth() {
    const { data: user, isLoading } = useUserInfoQuery();
    const location = useLocation();

    if (isLoading) return <div>Đang tải...</div>;

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
        //state={{ from: location }} giúp lưu lại vị trí hiện tại (location), để sau khi đăng nhập xong có thể chuyển người dùng quay lại trang trước đó
    }

    const adminRoutes = ["/inventory", "/admin-dashboard"];

    if (
        adminRoutes.includes(location.pathname) &&
        !user.roles.includes("Admin")
    ) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}
