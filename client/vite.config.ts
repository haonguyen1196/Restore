import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
    build: {
        outDir: "../API/wwwroot", // cấu hình khi deploy client và api chung source
        chunkSizeWarningLimit: 1024, // đặt giới hạn dung lượng file tính theo kb
        emptyOutDir: true, //xóa toàn bộ nôi dung thư mục trước khi build
    },
    server: {
        port: 3000,
    },
    plugins: [react(), mkcert()],
});
